import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Shield,
  MessageSquare
} from 'lucide-react';
import { api } from '../lib/api';
import ExpertProfileCard from '../components/ExpertProfileCard';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function ConsultPage() {
  const [experts, setExperts] = useState([]);
  const [myConsultations, setMyConsultations] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [bookingNotes, setBookingNotes] = useState('');
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    fetchDirectory();
    fetchMyConsultations();
  }, []);

  const fetchDirectory = async () => {
    try {
      const res = await api.getExperts();
      if (res?.data) {
        setExperts(res.data);
      }
    } catch (err) {
      console.error('Failed to load experts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyConsultations = async () => {
    try {
      const res = await api.getMyConsultations();
      if (res?.consultations) {
        setMyConsultations(res.consultations);
      }
    } catch (err) {}
  };

  const handleOpenBooking = (expert) => {
    setSelectedExpert(expert);
    setBookingTime(expert.available_slots?.[0] || '10:00 AM');
    setBookingError(null);
    setDisclaimerChecked(false);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!disclaimerChecked) {
      setBookingError('You must acknowledge that this consultation provides general wellness guidance, not medical treatment.');
      return;
    }

    setSubmitting(true);
    setBookingError(null);

    try {
      const payload = {
        expert_id: selectedExpert.id,
        scheduled_at: `${bookingDate}T${bookingTime.replace(' ', ':00')}`,
        notes: bookingNotes,
        disclaimer_acknowledged: true
      };

      const res = await api.bookConsultation(payload);
      setConfirmationNotice(res?.message || 'Consultation successfully scheduled!');
      setSelectedExpert(null);
      setBookingNotes('');
      fetchMyConsultations();
    } catch (err) {
      setBookingError(err.message || 'Failed to book appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold mb-2">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Accredited Human Practitioners</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Expert Wellness Consultations
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          Book personalized 1-on-1 virtual sessions with clinical yoga therapists, MBSR mindfulness guides, and holistic facial coaches.
        </p>
      </div>

      {/* Confirmation Banner */}
      {confirmationNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{confirmationNotice}</span>
          </div>
          <button
            onClick={() => setConfirmationNotice(null)}
            className="p-1 hover:bg-emerald-100 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* My Upcoming Appointments */}
      {myConsultations.length > 0 && (
        <div className="zen-glass p-6 rounded-3xl border border-sage-200/90 subtle-shadow space-y-4">
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Your Scheduled Consultations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myConsultations.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-white border border-sage-200 flex items-center justify-between text-xs text-stone-800"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{c.expert_name || 'Wellness Specialist'}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {c.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sage-600" />
                      {new Date(c.scheduled_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sage-600" />
                      {new Date(c.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {c.notes && <p className="text-stone-600 italic text-[11px]">"{c.notes}"</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experts Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experts.map((exp) => (
          <ExpertProfileCard
            key={exp.id}
            expert={exp}
            onBookClick={handleOpenBooking}
          />
        ))}
      </div>

      {/* Booking Form Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 subtle-shadow border border-sage-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sage-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600">
                  Appointment Reservation
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Book with {selectedExpert.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedExpert(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Pick Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-sage-200 text-xs font-medium text-stone-800 bg-sand-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-sage-200 text-xs font-medium text-stone-800 bg-sand-50"
                  >
                    {(selectedExpert.available_slots || ['09:00 AM', '11:30 AM', '03:00 PM', '05:30 PM']).map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Describe Your Current Goals or Focus Areas
                </label>
                <textarea
                  rows={3}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="e.g. Seeking gentle desk posture routines, relief from lower back fatigue, or bedtime breathwork..."
                  className="w-full px-4 py-2.5 rounded-xl border border-sage-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-sand-50/50"
                />
              </div>

              {/* Mandatory Non-Medical Disclaimer Checkbox (Section 9 Requirement) */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={disclaimerChecked}
                    onChange={(e) => setDisclaimerChecked(e.target.checked)}
                    className="mt-0.5 rounded border-amber-400 text-amber-700 focus:ring-amber-500"
                  />
                  <span className="leading-relaxed">
                    <strong>Mandatory Acknowledgment:</strong> I understand that this consultation is dedicated strictly to lifestyle yoga, meditation, and holistic well-being. It does not replace medical treatment, physical therapy, or psychiatric care.
                  </span>
                </label>
              </div>

              {bookingError && (
                <div className="p-3 rounded-xl bg-red-100 text-red-900 text-xs">
                  {bookingError}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-stone-600">
                  Rate: <strong>${selectedExpert.hourly_rate || 75}</strong> / 45 mins
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-semibold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Confirming...' : 'Confirm Consultation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prominent Medical Notice */}
      <div className="pt-4">
        <MedicalDisclaimer />
      </div>
    </div>
  );
}
