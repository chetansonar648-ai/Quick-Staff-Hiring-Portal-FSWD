import { Router } from 'express';

import { query } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/profile', authenticate(['client']), async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, email, phone, address, profile_image, role
       FROM users
       WHERE id = $1`,
      [req.user.id],
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Client not found' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching client profile:', err);
    return res.status(500).json({ message: 'Error fetching client profile' });
  }
});

export default router;
