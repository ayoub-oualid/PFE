import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import loggingMiddleware from './middleware/loggingMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import collaboratorRoutes from './routes/collaboratorRoutes.js';
import lineRoutes from './routes/lineRoutes.js';
import inspectionRoutes from './routes/inspectionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import cors from 'cors';
dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Apply logging middleware to all routes
app.use(loggingMiddleware);

// Apply routes
app.use('/api/users', userRoutes);
app.use('/api/collaborators', collaboratorRoutes);
app.use('/api/lines', lineRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/reports', reportRoutes);

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: 'https://pfe-front-hnq0.onrender.com' // Replace with your frontend URL
  }));
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));