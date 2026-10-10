import { db } from '../services/dbService.js';

export async function completeSession(req, res) {
  try {
    const userId = req.user.id;
    const { session_type, duration_minutes, pose_feedback } = req.validatedBody;

    // Log the completed session
    const loggedSession = await db.logSession({
      user_id: userId,
      session_type,
      duration_minutes,
      pose_feedback: pose_feedback || null
    });

    // Check if daily plan should be marked complete
    await db.markPlanCompleted(userId);

    // Fetch updated totals
    const allSessions = await db.getUserSessions(userId);
    const totalMinutes = allSessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0);
    const totalSessions = allSessions.length;

    // Compute badges unlocked
    const badges = evaluateBadges(allSessions, totalMinutes);

    return res.status(200).json({
      success: true,
      message: 'Session recorded with mindful gratitude.',
      session: loggedSession,
      metrics: {
        total_sessions: totalSessions,
        total_minutes: totalMinutes,
        unlocked_badges: badges
      }
    });
  } catch (error) {
    console.error('[Session Completion Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to record completed session.'
    });
  }
}

export async function getSessionHistory(req, res) {
  try {
    const userId = req.user.id;
    const sessions = await db.getUserSessions(userId);

    const breakdown = {
      Yoga: 0,
      Meditation: 0,
      Breathing: 0,
      'Face Yoga': 0,
      Sleep: 0
    };

    let totalMinutes = 0;
    for (const s of sessions) {
      if (breakdown[s.session_type] !== undefined) {
        breakdown[s.session_type] += s.duration_minutes || 0;
      }
      totalMinutes += s.duration_minutes || 0;
    }

    const badges = evaluateBadges(sessions, totalMinutes);

    return res.status(200).json({
      success: true,
      sessions,
      breakdown,
      total_minutes: totalMinutes,
      total_sessions: sessions.length,
      badges
    });
  } catch (error) {
    console.error('[Session History Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve session logs.'
    });
  }
}

function evaluateBadges(sessions, totalMinutes) {
  const count = sessions.length;
  const types = new Set(sessions.map((s) => s.session_type));

  const badges = [
    {
      id: 'first_step',
      title: 'First Step',
      description: 'Completed your very first practice session',
      icon: '🌱',
      unlocked: count >= 1
    },
    {
      id: 'zen_consistency',
      title: 'Serenity Streak',
      description: 'Completed 3 or more wellness sessions',
      icon: '✨',
      unlocked: count >= 3
    },
    {
      id: 'hour_of_peace',
      title: 'Century of Calm',
      description: 'Invested over 60 mindful minutes in self-care',
      icon: '🧘',
      unlocked: totalMinutes >= 60
    },
    {
      id: 'holistic_seeker',
      title: 'Harmonic Balance',
      description: 'Explored at least 3 distinct wellness disciplines',
      icon: '🌸',
      unlocked: types.size >= 3
    },
    {
      id: 'breath_alchemist',
      title: 'Prana Master',
      description: 'Completed dedicated breathing or emergency calm protocols',
      icon: '💨',
      unlocked: types.has('Breathing')
    },
    {
      id: 'radiant_glow',
      title: 'Radiant Presence',
      description: 'Practiced facial neuromuscular release (Face Yoga)',
      icon: '🌟',
      unlocked: types.has('Face Yoga')
    }
  ];

  return badges;
}
