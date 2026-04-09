import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import workerProfileRoutes from './routes/workerProfiles.js';
import serviceRoutes from './routes/services.js';
import workerServiceRoutes from './routes/workerServices.js';
import bookingRoutes from './routes/bookings.js';
import savedWorkerRoutes from './routes/savedWorkers.js';
import savedClientRoutes from './routes/savedClients.js';
import workerRoutes from './routes/workers.js';
import reviewRoutes from './routes/reviews.js';
import profileRoutes from './routes/profile.js';
import usersRoutes from './routes/users.js';
import adminApiRoutes from './routes/adminApi.js';

import { errorHandler } from './middleware/errorHandler.js';
import { ensureAuxTables, checkDbConnection } from './config/db.js';

const app = express();

// ✅ DEFINE PORT (IMPORTANT)
const PORT = process.env.PORT || 5000;

// ================= MIDDLEWARE =================
app.use(helmet());

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:4200'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors()); // ⭐ THIS LINE FIXES YOUR ISSUE

app.use(express.json());
app.use(morgan('dev'));

// ================= ROUTES =================

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Admin routes
app.use('/', adminApiRoutes);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/worker-profiles', workerProfileRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/worker-services', workerServiceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/saved-workers', savedWorkerRoutes);
app.use('/api/saved-clients', savedClientRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', usersRoutes);

// Error handler (must be last)
app.use(errorHandler);

// ================= SERVER START =================

async function startServer() {
  try {
    await checkDbConnection();
    await ensureAuxTables();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to init DB', err);
    process.exit(1);
  }
}

startServer();
