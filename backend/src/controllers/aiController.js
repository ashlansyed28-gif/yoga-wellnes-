import { chatWellnessAssistant, analyzePoseCorrection, generateDailyPlan } from '../services/geminiService.js';
import { db } from '../services/dbService.js';

/**
 * AI Wellness Assistant Chat
 */
export async function handleAIChat(req, res) {
  try {
    const { message, history } = req.validatedBody;
    const aiResponse = await chatWellnessAssistant(message, history || []);

    return res.status(200).json({
      success: true,
      reply: aiResponse,
      disclaimer: 'Prana Wellness Assistant provides lifestyle & mindfulness guidance only. For medical conditions or chronic pain, please consult a licensed healthcare provider.'
    });
  } catch (error) {
    console.error('[AI Chat Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Wellness assistant temporarily unavailable. Please try again shortly.'
    });
  }
}

/**
 * AI Pose Correction (Multimodal)
 */
export async function handlePoseCorrection(req, res) {
  try {
    const { image, pose_name } = req.validatedBody;

    // Analyze posture alignment via Gemini Multimodal
    const feedback = await analyzePoseCorrection(image, pose_name);

    return res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('[AI Pose Correction Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze posture frame.'
    });
  }
}

/**
 * AI Regenerate Daily Plan on demand
 */
export async function handleRegeneratePlan(req, res) {
  try {
    const userId = req.user.id;
    const profile = await db.getProfile(userId) || {
      experience_level: 'Beginner',
      daily_available_minutes: 20,
      goals: ['Stress', 'Flexibility']
    };

    const newPlan = await generateDailyPlan(profile);
    const today = new Date().toISOString().split('T')[0];

    const saved = await db.saveDailyPlan({
      user_id: userId,
      plan_date: today,
      yoga_minutes: newPlan.yoga_minutes,
      breathing_minutes: newPlan.breathing_minutes,
      meditation_minutes: newPlan.meditation_minutes,
      plan_summary: newPlan.plan_summary,
      recommended_routine: newPlan.recommended_routine,
      is_completed: false
    });

    return res.status(200).json({
      success: true,
      plan: saved
    });
  } catch (error) {
    console.error('[AI Regenerate Plan Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to regenerate daily wellness plan.'
    });
  }
}
