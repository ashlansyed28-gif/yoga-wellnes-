import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Initial mock seeded experts
const defaultExperts = [
  {
    id: 'exp-1',
    name: 'Dr. Ananya Sharma',
    avatar_url: 'https://images.unsplash.com/photo-1594824813589-3221e6498877?auto=format&fit=crop&q=80&w=400',
    qualifications: 'MD Holistic Medicine, 500-hr E-RYT Yoga Therapist',
    specialization: 'Therapeutic Hatha, Spine Alignment & Stress Recovery',
    hourly_rate: 85,
    languages: ['English', 'Hindi', 'Sanskrit'],
    rating: 4.98,
    reviews_count: 128,
    bio: '14+ years integrating authentic Vedic yoga philosophies with biomechanics for restorative posture and chronic back care.',
    available_slots: ['09:00 AM', '11:00 AM', '02:30 PM', '04:30 PM', '06:30 PM']
  },
  {
    id: 'exp-2',
    name: 'Julian Vance',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    qualifications: 'MA in Mindfulness Studies, MBSR Certified Instructor',
    specialization: 'Vipassana, Box Breathing & Somatic Stress Release',
    hourly_rate: 75,
    languages: ['English', 'French'],
    rating: 4.95,
    reviews_count: 94,
    bio: 'Specialist in down-regulating the sympathetic nervous system through clinically-backed somatic grounding and sleep conditioning.',
    available_slots: ['08:30 AM', '10:30 AM', '01:00 PM', '03:30 PM', '07:00 PM']
  },
  {
    id: 'exp-3',
    name: 'Mei-Ling Chen',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    qualifications: 'Certified Face Yoga Method Coach, Acupressure Practitioner',
    specialization: 'Facial Rejuvenation, TMJ/Jaw Release & Lymphatic Flow',
    hourly_rate: 70,
    languages: ['English', 'Mandarin'],
    rating: 4.92,
    reviews_count: 76,
    bio: 'Pioneer of non-invasive facial neuromuscular toning, dedicated to easing tension headaches and boosting natural skin circulation.',
    available_slots: ['10:00 AM', '12:00 PM', '02:00 PM', '05:00 PM']
  },
  {
    id: 'exp-4',
    name: 'Aarav Patel',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    qualifications: 'Ashtanga Vinyasa Authorized Teacher, Sports Physiologist',
    specialization: 'Dynamic Flow, Joint Mobility & Office Ergonomics',
    hourly_rate: 80,
    languages: ['English', 'Gujarati'],
    rating: 4.96,
    reviews_count: 112,
    bio: 'Focuses on desk workers and athletes seeking pain-free hip opening, shoulder mobility, and active mindful recovery routines.',
    available_slots: ['07:30 AM', '09:30 AM', '12:30 PM', '04:00 PM', '06:00 PM']
  }
];

// In-Memory store for fast fallback & local development
const memoryStore = {
  profiles: new Map([
    [
      'demo-user-123',
      {
        id: 'demo-user-123',
        name: 'Aria Montgomery',
        age: 29,
        gender: 'Female',
        experience_level: 'Beginner',
        daily_available_minutes: 20,
        goals: ['Stress', 'Flexibility', 'Sleep'],
        preferred_language: 'English',
        created_at: new Date().toISOString()
      }
    ]
  ]),
  dailyPlans: new Map([
    [
      'demo-user-123',
      {
        id: 'plan-demo-1',
        user_id: 'demo-user-123',
        plan_date: new Date().toISOString().split('T')[0],
        yoga_minutes: 10,
        breathing_minutes: 5,
        meditation_minutes: 5,
        plan_summary: 'A 20-minute restorative evening flow to untangle mental tension and invite restful sleep.',
        recommended_routine: [
          '5m Box Breathing & Centering',
          '10m Gentle Spine & Hip Decompression',
          '5m Body Scan & Heart Stillness'
        ],
        is_completed: false,
        created_at: new Date().toISOString()
      }
    ]
  ]),
  completedSessions: [
    {
      id: 'sess-1',
      user_id: 'demo-user-123',
      session_type: 'Breathing',
      duration_minutes: 5,
      completed_at: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString()
    },
    {
      id: 'sess-2',
      user_id: 'demo-user-123',
      session_type: 'Yoga',
      duration_minutes: 15,
      completed_at: new Date(Date.now() - 24 * 3600 * 1000 * 1).toISOString()
    },
    {
      id: 'sess-3',
      user_id: 'demo-user-123',
      session_type: 'Meditation',
      duration_minutes: 10,
      completed_at: new Date().toISOString()
    }
  ],
  experts: [...defaultExperts],
  consultations: [
    {
      id: 'cons-1',
      user_id: 'demo-user-123',
      expert_id: 'exp-1',
      expert_name: 'Dr. Ananya Sharma',
      scheduled_at: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
      status: 'Confirmed',
      notes: 'Initial ergonomic consultation for lower back comfort during remote desk work.',
      disclaimer_acknowledged: true,
      created_at: new Date().toISOString()
    }
  ],
  communityPosts: [
    {
      id: 'post-1',
      user_id: 'user-88',
      author_name: 'Elena Rostova',
      group_category: 'Mindfulness & Serenity',
      content: 'Just completed 7 consecutive days of 5-minute morning box breathing. The mental clarity before opening work emails is truly transformative! 🌿',
      likes_count: 24,
      created_at: new Date(Date.now() - 3600 * 1000 * 4).toISOString()
    },
    {
      id: 'post-2',
      user_id: 'user-91',
      author_name: 'David Kim',
      group_category: 'Desk & Office Relief',
      content: 'The 8-minute Chair Yoga sequence helped relieve a tension headache I had been fighting all afternoon. Don’t sleep on shoulder rolls!',
      likes_count: 17,
      created_at: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
    },
    {
      id: 'post-3',
      user_id: 'user-72',
      author_name: 'Sophia Martin',
      group_category: 'Face Yoga Glow',
      content: 'The jaw decompression exercises before bed have stopped me from clenching my teeth at night. Waking up without jaw soreness feels like magic.',
      likes_count: 31,
      created_at: new Date(Date.now() - 3600 * 1000 * 22).toISOString()
    }
  ]
};

export const db = {
  // Profiles
  async getProfile(userId) {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
        if (!error && data) return data;
      } catch (e) {
        // table might not exist yet
      }
    }
    return memoryStore.profiles.get(userId) || null;
  },

  async upsertProfile(profileData) {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('profiles').upsert(profileData).select().single();
        if (!error && data) {
          memoryStore.profiles.set(data.id, data);
          return data;
        }
      } catch (e) {
        // fallback
      }
    }
    memoryStore.profiles.set(profileData.id, {
      ...profileData,
      updated_at: new Date().toISOString()
    });
    return memoryStore.profiles.get(profileData.id);
  },

  // Daily Plans
  async getTodayPlan(userId, dateStr) {
    const today = dateStr || new Date().toISOString().split('T')[0];
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('daily_plans')
          .select('*')
          .eq('user_id', userId)
          .eq('plan_date', today)
          .maybeSingle();
        if (!error && data) return data;
      } catch (e) {}
    }
    return memoryStore.dailyPlans.get(userId) || null;
  },

  async saveDailyPlan(planData) {
    const enriched = {
      id: planData.id || uuidv4(),
      ...planData,
      created_at: new Date().toISOString()
    };
    if (supabase) {
      try {
        const { data, error } = await supabase.from('daily_plans').upsert(enriched).select().single();
        if (!error && data) {
          memoryStore.dailyPlans.set(data.user_id, data);
          return data;
        }
      } catch (e) {}
    }
    memoryStore.dailyPlans.set(enriched.user_id, enriched);
    return enriched;
  },

  async markPlanCompleted(userId) {
    const plan = memoryStore.dailyPlans.get(userId);
    if (plan) {
      plan.is_completed = true;
    }
    if (supabase) {
      try {
        const today = new Date().toISOString().split('T')[0];
        await supabase
          .from('daily_plans')
          .update({ is_completed: true })
          .eq('user_id', userId)
          .eq('plan_date', today);
      } catch (e) {}
    }
    return plan;
  },

  // Completed Sessions
  async logSession(sessionData) {
    const record = {
      id: uuidv4(),
      ...sessionData,
      completed_at: new Date().toISOString()
    };
    if (supabase) {
      try {
        const { data, error } = await supabase.from('completed_sessions').insert(record).select().single();
        if (!error && data) {
          memoryStore.completedSessions.push(data);
          return data;
        }
      } catch (e) {}
    }
    memoryStore.completedSessions.push(record);
    return record;
  },

  async getUserSessions(userId) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('completed_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('completed_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {}
    }
    return memoryStore.completedSessions.filter((s) => s.user_id === userId);
  },

  // Experts
  async getExperts() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('experts').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (e) {}
    }
    return memoryStore.experts;
  },

  async getExpertById(expertId) {
    const experts = await this.getExperts();
    return experts.find((e) => e.id === expertId) || null;
  },

  // Consultations
  async bookConsultation(bookingData) {
    const expert = await this.getExpertById(bookingData.expert_id);
    const record = {
      id: uuidv4(),
      ...bookingData,
      expert_name: expert ? expert.name : 'Wellness Specialist',
      status: 'Confirmed',
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('consultations').insert(record).select().single();
        if (!error && data) {
          memoryStore.consultations.push(data);
          return data;
        }
      } catch (e) {}
    }
    memoryStore.consultations.push(record);
    return record;
  },

  async getUserConsultations(userId) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('consultations')
          .select('*, experts(name, avatar_url, specialization)')
          .eq('user_id', userId)
          .order('scheduled_at', { ascending: true });
        if (!error && data) return data;
      } catch (e) {}
    }
    return memoryStore.consultations.filter((c) => c.user_id === userId);
  },

  // Community Posts
  async getCommunityPosts() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {}
    }
    return memoryStore.communityPosts;
  },

  async createCommunityPost(postData) {
    const record = {
      id: uuidv4(),
      ...postData,
      likes_count: 0,
      created_at: new Date().toISOString()
    };
    if (supabase) {
      try {
        const { data, error } = await supabase.from('community_posts').insert(record).select().single();
        if (!error && data) {
          memoryStore.communityPosts.unshift(data);
          return data;
        }
      } catch (e) {}
    }
    memoryStore.communityPosts.unshift(record);
    return record;
  },

  async likeCommunityPost(postId) {
    const post = memoryStore.communityPosts.find((p) => p.id === postId);
    if (post) {
      post.likes_count += 1;
      return post;
    }
    return null;
  }
};
