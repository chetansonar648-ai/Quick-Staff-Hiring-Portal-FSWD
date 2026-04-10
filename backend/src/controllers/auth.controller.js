import pool, { query } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/token.js';

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const register = async (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Register attempt:', { email: req.body?.email, role: req.body?.role });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      bio,
      skills = [],
      hourly_rate,
      availability,
    } = req.body;

    if (!name || !email || !password || !role) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (!isValidEmail(email)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    if (password.length < 6) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existing = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const passwordHash = await hashPassword(password);
    const userResult = await client.query(
      `INSERT INTO users (name, email, password, role, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, email, passwordHash, role, phone, address]
    );
    const user = userResult.rows[0];
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      profile_image: user.profile_image,
      is_verified: user.is_verified,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    if (role === 'worker') {
      await client.query(
        `INSERT INTO worker_profiles (user_id, bio, skills, hourly_rate, availability)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, bio || '', skills, hourly_rate || null, availability || {}]
      );
    }

    await client.query('COMMIT');
    const token = signToken({ id: user.id, role: user.role, email: user.email });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    return res.status(201).json({
      success: true,
      message: 'User registered',
      data: { user: safeUser, token },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    if (process.env.NODE_ENV !== 'production') {
      console.error('Registration Error:', err);
    }
    const isDuplicate = err?.message?.includes('users_email_key');
    return res.status(isDuplicate ? 409 : 500).json({
      success: false,
      message: isDuplicate ? 'Email already exists' : 'Registration failed',
    });
  } finally {
    client.release();
  }
};

export const login = async (req, res) => {
  const { email, username, password } = req.body;
  const identifier = String(email || username || '').trim();
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Email (or username) and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  let existing;
  if (isValidEmail(identifier)) {
    existing = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [identifier]);
  } else {
    existing = await query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(name) = LOWER($1)`,
      [identifier],
    );
    if (existing.rows.length > 1) {
      return res.status(400).json({
        success: false,
        message: 'Multiple accounts matched this username. Please sign in with your email.',
      });
    }
  }
  const user = existing.rows[0];
  if (process.env.NODE_ENV !== 'production') {
    console.log('Login attempt:', { identifier, found: Boolean(user) });
  }

  if (!user) {
    return res.status(400).json({ success: false, message: 'User not found' });
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    return res.status(400).json({ success: false, message: 'Invalid password' });
  }

  const lastLoginResult = await query('UPDATE users SET last_login = NOW() WHERE id = $1 RETURNING last_login', [user.id]);
  const lastLogin = lastLoginResult.rows[0]?.last_login || null;

  const token = signToken({ id: user.id, role: user.role, email: user.email });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

  const userPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    profile_image: user.profile_image,
    full_name: user.name,
    user_type: user.role,
    profile_image_url: user.profile_image,
    last_login: lastLogin,
  };

  return res.json({
    success: true,
    message: 'Login successful',
    token,
    user: { id: user.id, role: user.role, email: user.email },
    data: {
      user: userPayload,
      token,
    },
  });
};

export const changePassword = async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ success: false, message: 'Current and new password are required' });
  }
  if (String(new_password).length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
  }

  const existing = await query('SELECT id, password FROM users WHERE id = $1', [req.user.id]);
  const row = existing.rows[0];
  if (!row) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const valid = await comparePassword(current_password, row.password);
  if (!valid) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  const passwordHash = await hashPassword(new_password);
  await query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2', [passwordHash, req.user.id]);
  return res.json({ success: true });
};

export const me = async (req, res) => {
  const userResult = await query(
    `SELECT u.id, u.name, u.email, u.role, u.phone, u.address, u.profile_image,
            wp.bio, wp.skills, wp.hourly_rate, wp.availability, wp.rating, wp.total_reviews
     FROM users u
     LEFT JOIN worker_profiles wp ON wp.user_id = u.id
     WHERE u.id = $1`,
    [req.user.id]
  );
  const user = userResult.rows[0];
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.json({
    success: true,
    message: 'Authenticated user',
    data: {
      user: {
        ...user,
        full_name: user.name,
        user_type: user.role,
        profile_image_url: user.profile_image,
      },
    },
  });
};

