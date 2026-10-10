import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend applications
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-user-id']
  })
);

// Morgan request logging
app.use(morgan('dev'));

// Parse incoming JSON with 25MB limit for multimodal pose frames
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Welcome root
app.get('/', (req, res) => {
  res.json({
    name: 'Prana - Yoga & Mind Wellness API',
    version: '1.0.0',
    documentation: '/api/health',
    status: 'online'
  });
});

// API Routes
app.use('/api', apiRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found.`
  });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🌿 Prana Yoga & Wellness API server listening on http://localhost:${PORT}`);
  console.log(`🔒 Supabase URL: ${process.env.SUPABASE_URL || 'Configured/Simulated'}`);
  console.log(`✨ Gemini AI: Active with @google/genai SDK`);
});
