import { db } from '../services/dbService.js';
import { generateDailyPlan } from '../services/geminiService.js';

export async function handleOnboarding(req, res) {
  try {
    const userId = req.user.id;
    const profilePayload = {
      id: userId,
      ...req.validatedBody
    };

    // 1. Upsert user profile
    const profile = await db.upsertProfile(profilePayload);

    // 2. Generate personalized initial daily routine via Gemini AI
    const generatedPlan = await generateDailyPlan(profile);

    // 3. Persist the generated daily plan
    const today = new Date().toISOString().split('T')[0];
    const plan = await db.saveDailyPlan({
      user_id: userId,
      plan_date: today,
      yoga_minutes: generatedPlan.yoga_minutes,
      breathing_minutes: generatedPlan.breathing_minutes,
      meditation_minutes: generatedPlan.meditation_minutes,
      plan_summary: generatedPlan.plan_summary,
      recommended_routine: generatedPlan.recommended_routine,
      is_completed: false
    });

    return res.status(200).json({
      success: true,
      message: 'Profile created and personalized AI wellness plan generated successfully.',
      profile,
      daily_plan: plan
    });
  } catch (error) {
    console.error('[Onboarding Controller Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to complete onboarding intake.'
    });
  }
}
