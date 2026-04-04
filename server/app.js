import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import recordRoutes from './routes/recordRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Zorvyn Finance API running' });
});

// Route Mounts will go here
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/records', recordRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
