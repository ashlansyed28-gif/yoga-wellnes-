import { z } from 'zod';

export const OnboardingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(13).max(120).optional().nullable(),
  experience_level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  daily_available_minutes: z.number().min(5, 'Minimum 5 minutes required'),
  goals: z.array(z.string()).min(1, 'Please select at least 1 goal'),
  gender: z.string().optional().nullable(),
  preferred_language: z.string().optional().default('English')
});

export const SessionLogSchema = z.object({
  session_type: z.enum(['Yoga', 'Meditation', 'Breathing', 'Face Yoga', 'Sleep']),
  duration_minutes: z.number().min(1, 'Duration must be at least 1 minute'),
  pose_feedback: z.any().optional()
});

export const ConsultationBookingSchema = z.object({
  expert_id: z.string().min(1, 'Expert ID required'),
  scheduled_at: z.string().min(5, 'Valid schedule date/time required'),
  notes: z.string().optional(),
  disclaimer_acknowledged: z.boolean().refine((val) => val === true, {
    message: 'You must acknowledge the non-medical nature of the consultation'
  })
});

export const AIChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'model']),
      content: z.string()
    })
  ).optional().default([])
});

export const PoseCorrectionSchema = z.object({
  image: z.string().min(20, 'Valid base64 image frame required'),
  pose_name: z.string().min(1, 'Target pose name required')
});

export const CommunityPostSchema = z.object({
  content: z.string().min(3, 'Post content must be at least 3 characters'),
  group_category: z.string().optional().default('General Wellness'),
  author_name: z.string().optional()
});

/**
 * Higher-order middleware function to validate request body with Zod schema
 */
export function validateBody(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedBody = validated;
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          issues: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      return res.status(400).json({ success: false, error: 'Malformed payload' });
    }
  };
}
