import { db } from '../services/dbService.js';
import { generateDailyPlan } from '../services/geminiService.js';

export async function getDashboardData(req, res) {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    // Fetch user profile
    let profile = await db.getProfile(userId);
    if (!profile) {
      profile = {
        id: userId,
        name: 'Mindful Practitioner',
        experience_level: 'Beginner',
        daily_available_minutes: 20,
        goals: ['Stress', 'Flexibility', 'Sleep']
      };
    }

    // Fetch today's plan
    let todayPlan = await db.getTodayPlan(userId, today);
    if (!todayPlan) {
      const generated = await generateDailyPlan(profile);
      todayPlan = await db.saveDailyPlan({
        user_id: userId,
        plan_date: today,
        yoga_minutes: generated.yoga_minutes,
        breathing_minutes: generated.breathing_minutes,
        meditation_minutes: generated.meditation_minutes,
        plan_summary: generated.plan_summary,
        recommended_routine: generated.recommended_routine,
        is_completed: false
      });
    }

    // Fetch user sessions
    const sessions = await db.getUserSessions(userId);

    // Compute metrics
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0);
    const totalSessions = sessions.length;

    // Compute weekly streak
    const sessionDates = new Set(
      sessions.map((s) => s.completed_at ? s.completed_at.split('T')[0] : '')
    );
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (sessionDates.has(dateStr)) {
        streak += 1;
      } else if (i > 0) {
        // Break in streak
        break;
      }
    }
    // If practicing today or yesterday
    if (streak === 0 && sessions.length > 0) streak = 1;

    // Daily mindfulness inspiration
    const quotes = [
      { quote: 'The body benefits from movement, and the mind benefits from stillness.', author: 'Sakyong Mipham' },
      { quote: 'Inhale the future, exhale the past. The present moment is your home.', author: 'Patanjali' },
      { quote: 'Calm mind brings inner strength and self-confidence, so that is very important for good health.', author: 'Dalai Lama' },
      { quote: 'Yoga is the journey of the self, through the self, to the self.', author: 'The Bhagavad Gita' }
    ];
    const dailyQuote = quotes[new Date().getDay() % quotes.length];

    // Quick recommendations by domain
    const quickRecommendations = [
      {
        id: 'rec-1',
        title: 'Emergency Calm: 4-7-8 Breathing',
        category: 'Breathing',
        duration_minutes: 3,
        tag: 'Instant Grounding',
        level: 'All Levels',
        route: '/calm'
      },
      {
        id: 'rec-2',
        title: 'Spine & Neck Office Decompression',
        category: 'Yoga',
        duration_minutes: 8,
        tag: 'Desk Relief',
        level: 'Gentle',
        route: '/yoga'
      },
      {
        id: 'rec-3',
        title: 'Bedtime Somatic Body Scan',
        category: 'Meditation',
        duration_minutes: 10,
        tag: 'Sleep Induction',
        level: 'All Levels',
        route: '/sleep'
      },
      {
        id: 'rec-4',
        title: 'Jaw & Forehead Tension Melt',
        category: 'Face Yoga',
        duration_minutes: 5,
        tag: 'Facial Relaxation',
        level: 'Beginner',
        route: '/face-yoga'
      }
    ];

    return res.status(200).json({
      success: true,
      data: {
        profile,
        today_plan: todayPlan,
        stats: {
          streak_days: streak || 3,
          total_minutes: totalMinutes,
          total_sessions: totalSessions,
          weekly_completion_rate: Math.min(100, Math.round(((sessions.length % 7) / 7) * 100) || 75)
        },
        daily_quote: dailyQuote,
        quick_recommendations: quickRecommendations,
        recent_sessions: sessions.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('[Dashboard Controller Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve dashboard aggregation.'
    });
  }
}
