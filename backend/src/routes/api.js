import express from 'express';
import rateLimit from 'express-rate-limit';

import { requireAuth } from '../middleware/auth.js';
import {
  validateBody,
  OnboardingSchema,
  SessionLogSchema,
  ConsultationBookingSchema,
  AIChatSchema,
  PoseCorrectionSchema,
  CommunityPostSchema
} from '../middleware/validate.js';

import { handleOnboarding } from '../controllers/onboardingController.js';
import { getDashboardData } from '../controllers/dashboardController.js';
import { completeSession, getSessionHistory } from '../controllers/sessionsController.js';
import { getExpertsList, bookConsultation, getMyConsultations } from '../controllers/expertsController.js';
import { handleAIChat, handlePoseCorrection, handleRegeneratePlan } from '../controllers/aiController.js';
import { getCommunityFeed, createCommunityPost, likeCommunityPost } from '../controllers/communityController.js';

const router = express.Router();

// Rate Limiter for AI endpoints to prevent abuse (Section 13 requirement)
const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 30, // max 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'AI request limit reached for this minute. Please pause and take a mindful breath before trying again.'
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Prana Yoga & Mind Wellness API',
    timestamp: new Date().toISOString()
  });
});

// 1. Onboarding
router.post('/onboarding', requireAuth, validateBody(OnboardingSchema), handleOnboarding);

// 2. Dashboard
router.get('/dashboard', requireAuth, getDashboardData);

// 3. Sessions & Progress Tracker
router.post('/sessions/complete', requireAuth, validateBody(SessionLogSchema), completeSession);
router.get('/sessions/history', requireAuth, getSessionHistory);

// 4. Experts & Consultations
router.get('/experts', requireAuth, getExpertsList);
router.post('/consultations/book', requireAuth, validateBody(ConsultationBookingSchema), bookConsultation);
router.get('/consultations/my', requireAuth, getMyConsultations);

// 5. AI Endpoints (Protected by Rate Limiter)
router.post('/ai/chat', requireAuth, aiRateLimiter, validateBody(AIChatSchema), handleAIChat);
router.post('/ai/pose-correction', requireAuth, aiRateLimiter, validateBody(PoseCorrectionSchema), handlePoseCorrection);
router.post('/ai/regenerate-plan', requireAuth, aiRateLimiter, handleRegeneratePlan);

// 6. Community Feed & Reflection
router.get('/community', requireAuth, getCommunityFeed);
router.post('/community/posts', requireAuth, validateBody(CommunityPostSchema), createCommunityPost);
router.post('/community/posts/:id/like', requireAuth, likeCommunityPost);

export default router;
