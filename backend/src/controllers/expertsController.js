import { db } from '../services/dbService.js';

export async function getExpertsList(req, res) {
  try {
    const experts = await db.getExperts();
    return res.status(200).json({
      success: true,
      data: experts
    });
  } catch (error) {
    console.error('[Get Experts Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve expert directory.'
    });
  }
}

export async function bookConsultation(req, res) {
  try {
    const userId = req.user.id;
    const { expert_id, scheduled_at, notes, disclaimer_acknowledged } = req.validatedBody;

    if (!disclaimer_acknowledged) {
      return res.status(400).json({
        success: false,
        error: 'You must acknowledge that this consultation provides general wellness guidance, not medical care.'
      });
    }

    const expert = await db.getExpertById(expert_id);
    if (!expert) {
      return res.status(404).json({
        success: false,
        error: 'The requested wellness practitioner was not found.'
      });
    }

    const booking = await db.bookConsultation({
      user_id: userId,
      expert_id,
      scheduled_at,
      notes: notes || '',
      disclaimer_acknowledged
    });

    return res.status(201).json({
      success: true,
      message: `Appointment confirmed with ${expert.name}. A calm confirmation summary has been reserved for your schedule.`,
      consultation: booking,
      expert: {
        name: expert.name,
        specialization: expert.specialization,
        avatar_url: expert.avatar_url
      }
    });
  } catch (error) {
    console.error('[Book Consultation Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to confirm consultation booking.'
    });
  }
}

export async function getMyConsultations(req, res) {
  try {
    const userId = req.user.id;
    const consultations = await db.getUserConsultations(userId);
    return res.status(200).json({
      success: true,
      consultations
    });
  } catch (error) {
    console.error('[Get My Consultations Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve consultation history.'
    });
  }
}
