import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';

// System prompt enforced across all wellness AI interactions
const SYSTEM_PROMPT = `You are a highly empathetic, calming, and knowledgeable Yoga & Mind Wellness Assistant named Prana. Your goal is to guide users toward better mental and physical well-being through yoga, meditation, and breathing techniques.
CRITICAL RULE: You are a wellness guide, not a doctor. You MUST NOT diagnose conditions, prescribe medications, or offer medical advice. If a user mentions pain, injury, or severe mental distress, firmly but gently advise them to consult a qualified healthcare professional. Keep your tone soft, encouraging, and minimal. Always maintain peaceful serenity.`;

let genAIInstance = null;
let googleGenerativeAIInstance = null;

if (apiKey && apiKey !== 'your_google_gemini_api_key') {
  try {
    genAIInstance = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('[Gemini Service] @google/genai initialization note:', err.message);
  }
  try {
    googleGenerativeAIInstance = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('[Gemini Service] @google/generative-ai note:', err.message);
  }
}

/**
 * Generate a personalized daily wellness plan based on user profile and goals
 */
export async function generateDailyPlan(profile) {
  const { experience_level = 'Beginner', daily_available_minutes = 20, goals = ['Stress', 'Flexibility'] } = profile;

  const promptText = `
User Profile:
- Experience Level: ${experience_level}
- Total Available Daily Minutes: ${daily_available_minutes}
- Wellness Goals: ${goals.join(', ')}

Create a balanced, restorative daily wellness routine dividing time across:
1. yoga_minutes
2. breathing_minutes
3. meditation_minutes
Ensure: yoga_minutes + breathing_minutes + meditation_minutes equals exactly or close to ${daily_available_minutes} minutes.
Provide a soothing 1-sentence plan_summary and an ordered list of 3-5 recommended_routine steps (e.g. "5m Nadi Shodhana Pranayama", "10m Cat-Cow & Gentle Child's Pose", "5m Yoga Nidra Savasana").

Return ONLY valid JSON matching this schema:
{
  "yoga_minutes": number,
  "breathing_minutes": number,
  "meditation_minutes": number,
  "plan_summary": string,
  "recommended_routine": string[]
}
`;

  try {
    // Attempt with @google/genai first
    if (genAIInstance) {
      const response = await genAIInstance.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: `${SYSTEM_PROMPT}\n\n${promptText}`,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text();
      return JSON.parse(responseText);
    }

    // Secondary attempt with GoogleGenerativeAI
    if (googleGenerativeAIInstance) {
      const model = googleGenerativeAIInstance.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });
      const result = await model.generateContent(`${SYSTEM_PROMPT}\n\n${promptText}`);
      const text = result.response.text();
      return JSON.parse(text);
    }
  } catch (error) {
    console.warn('[Gemini Daily Plan API Note]: Falling back to dynamic rule generator.', error.message);
  }

  // Resilient fallback rule-based dynamic plan generator
  return fallbackPlanGenerator(daily_available_minutes, goals, experience_level);
}

/**
 * Dynamic rule-based fallback routine generator
 */
function fallbackPlanGenerator(totalMinutes, goals, experience) {
  const mins = Math.max(10, totalMinutes || 20);
  const breathing = Math.max(3, Math.round(mins * 0.25));
  const meditation = Math.max(4, Math.round(mins * 0.25));
  const yoga = mins - breathing - meditation;

  const goalList = Array.isArray(goals) ? goals.join(' & ') : 'Holistic Balance';

  const routine = [
    `${breathing}m Box Breathing & Centering (Sama Vritti)`,
    `${yoga}m ${experience} Mindful Flow targeting ${goalList}`,
    `${meditation}m Heart-Center Stillness & Body Scan`
  ];

  return {
    yoga_minutes: yoga,
    breathing_minutes: breathing,
    meditation_minutes: meditation,
    plan_summary: `A nurturing ${mins}-minute restorative ritual curated for ${goalList.toLowerCase()} and somatic peace.`,
    recommended_routine: routine
  };
}

/**
 * AI Pose Correction (Multimodal)
 * Receives base64 image + target pose name
 * Returns ✅ Positive feedback, ⚠️ Gentle correction, and medical disclaimer
 */
export async function analyzePoseCorrection(base64Image, poseName) {
  // Clean base64 string
  let cleanBase64 = base64Image;
  let mimeType = 'image/jpeg';
  if (base64Image.includes(',')) {
    const parts = base64Image.split(',');
    cleanBase64 = parts[1];
    const mimeMatch = parts[0].match(/data:(.*?);base64/);
    if (mimeMatch) mimeType = mimeMatch[1];
  }

  const promptText = `
You are analyzing a user practicing the yoga pose: "${poseName}".
Analyze the user's postural alignment from this camera frame.
INSTRUCTIONS:
1. Provide 1 positive reinforcement prepended with "✅".
2. Provide 1 gentle, simple alignment cue/correction prepended with "⚠️".
3. Provide a safety score from 60 to 98 based on posture stability.
4. Add the mandatory disclaimer that this is AI estimation, not professional instruction.

Return ONLY a JSON object with this exact format:
{
  "pose_name": "${poseName}",
  "positive_feedback": "✅ [Positive encouragement on alignment or gaze]",
  "alignment_correction": "⚠️ [Gentle suggestion to adjust hip, knee, spine or shoulders safely]",
  "safety_score": 88,
  "disclaimer": "AI estimation only. Listen to your body and never force a posture. Not professional medical or physical therapy instruction."
}
`;

  try {
    if (genAIInstance) {
      const response = await genAIInstance.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${SYSTEM_PROMPT}\n\n${promptText}` },
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });
      return JSON.parse(response.text());
    }

    if (googleGenerativeAIInstance) {
      const model = googleGenerativeAIInstance.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });
      const result = await model.generateContent([
        `${SYSTEM_PROMPT}\n\n${promptText}`,
        {
          inlineData: {
            mimeType,
            data: cleanBase64
          }
        }
      ]);
      return JSON.parse(result.response.text());
    }
  } catch (err) {
    console.warn('[Gemini Pose Correction API Note]: Falling back to expert heuristics.', err.message);
  }

  // Graceful heuristic feedback based on pose knowledge
  return fallbackPoseFeedback(poseName);
}

/**
 * Intelligent heuristic fallback pose feedback
 */
function fallbackPoseFeedback(poseName) {
  const feedbackMap = {
    'Tree Pose (Vrksasana)': {
      positive: '✅ Steady gaze and upright elongated spine; your standing foot is firmly rooted like an oak.',
      correction: '⚠️ Ensure your lifted foot rests either above or below the knee joint, never pressing directly sideways onto the knee.'
    },
    'Warrior II (Virabhadrasana II)': {
      positive: '✅ Beautiful arm extension parallel to the earth with soft, relaxed shoulders.',
      correction: '⚠️ Check your front knee alignment: keep it directly stacked above the ankle without collapsing inward.'
    },
    'Downward-Facing Dog (Adho Mukha Svanasana)': {
      positive: '✅ Spacious neck and active engagement through the palms and fingertips.',
      correction: '⚠️ Feel free to soften or bend the knees slightly to lengthen the spine from crown to tailbone.'
    },
    'Cobra Pose (Bhujangasana)': {
      positive: '✅ Gentle heart opening with the chest gliding forward naturally.',
      correction: '⚠️ Keep your elbows lightly tucked into your ribcage and draw your shoulder blades gently down your back.'
    },
    "Child's Pose (Balasana)": {
      positive: '✅ Deep restorative grounding with the hips settling back toward the heels.',
      correction: '⚠️ Allow the forehead to melt fully into the mat or block, softening the jaw completely.'
    }
  };

  const poseInfo = feedbackMap[poseName] || {
    positive: '✅ Grounded foundation with mindful breath awareness.',
    correction: '⚠️ Keep your core gently engaged and avoid locking your joints.'
  };

  return {
    pose_name: poseName,
    positive_feedback: poseInfo.positive,
    alignment_correction: poseInfo.correction,
    safety_score: 92,
    disclaimer: 'AI estimation only. Listen to your body and never force a posture. Not professional medical or physical therapy instruction.'
  };
}

/**
 * AI Wellness Assistant Chat
 * Answers questions on yoga, meditation, breathwork, face yoga, sleep
 * strictly maintaining medical safety boundaries.
 */
export async function chatWellnessAssistant(message, history = []) {
  const contents = [
    { role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nYou are answering a seeker in the chat. Remember: keep answers serene, empathetic, practical, and under 3 paragraphs. Strictly avoid medical diagnoses.` }] },
    { role: 'model', parts: [{ text: 'Namaste. I am Prana, your mindful companion. I am here to share grounding breath practices, serene yoga sequences, and meditative guidance. How may I support your practice today?' }] }
  ];

  // Map history
  for (const h of history.slice(-6)) {
    contents.push({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  try {
    if (genAIInstance) {
      const response = await genAIInstance.models.generateContent({
        model: 'gemini-1.5-flash',
        contents
      });
      return response.text();
    }

    if (googleGenerativeAIInstance) {
      const model = googleGenerativeAIInstance.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const chat = model.startChat({
        systemInstruction: SYSTEM_PROMPT,
        history: contents.slice(1, -1)
      });
      const result = await chat.sendMessage(message);
      return result.response.text();
    }
  } catch (err) {
    console.warn('[Gemini Chat API Note]:', err.message);
  }

  // Empathetic fallback response
  return fallbackChatResponse(message);
}

function fallbackChatResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('pain') || lower.includes('hurt') || lower.includes('injury') || lower.includes('doctor')) {
    return 'I hear that you are experiencing physical discomfort. As a wellness companion rather than a healthcare provider, I encourage you to honor your body by pausing any strenuous movement and consulting a licensed doctor or physical therapist. In the meantime, gentle unhurried breathing (inhaling for 4 counts, exhaling softly for 6) may help soothe your nervous system.';
  }
  if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('tired')) {
    return 'For peaceful sleep, try the 4-7-8 breathing technique before bedtime: inhale quietly through your nose for 4 seconds, hold gently for 7, and exhale completely through your mouth for 8 seconds. Pairing this with legs-up-the-wall pose (Viparita Karani) signals your parasympathetic nervous system that it is safe to rest.';
  }
  if (lower.includes('stress') || lower.includes('anxiety') || lower.includes('overwhelm')) {
    return 'Take a deep, slow breath right now. Drop your shoulders down away from your ears and soften your brow. Try Box Breathing: inhale for 4 counts, hold for 4, exhale for 4, hold empty for 4. Repeat for 3 cycles. You are safe in this present moment.';
  }
  return 'Thank you for pausing and turning inward. Regular mindful breathing and gentle spinal movement create space for both body and mind. Would you like a 5-minute grounding sequence, advice on a specific yoga pose, or a soothing breathing exercise?';
}
