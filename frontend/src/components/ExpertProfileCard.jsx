import React from 'react';
import { Star, Globe, Award, Calendar, Clock } from 'lucide-react';

export default function ExpertProfileCard({ expert, onBookClick }) {
  return (
    <div className="flex flex-col justify-between p-6 rounded-3xl zen-glass border border-sage-200/80 subtle-shadow hover:subtle-glow hover:border-sage-300 transition-all duration-300">
      <div>
        {/* Header with Avatar & Rating */}
        <div className="flex items-start gap-4">
          <img
            src={expert.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'}
            alt={expert.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-sage-200 shadow-sm flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-stone-900 truncate">
                {expert.name}
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{expert.rating || 4.9}</span>
              </div>
            </div>

            <p className="text-xs font-medium text-sage-700 mt-0.5 line-clamp-1">
              {expert.specialization}
            </p>

            <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-1">
              <Award className="w-3 h-3 text-sage-600 flex-shrink-0" />
              <span className="truncate">{expert.qualifications}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {expert.bio && (
          <p className="text-xs text-stone-600 mt-4 leading-relaxed line-clamp-3">
            {expert.bio}
          </p>
        )}

        {/* Languages & Hourly Rate */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-sage-100 text-xs">
          <div className="flex items-center gap-1 text-stone-500">
            <Globe className="w-3.5 h-3.5 text-sage-600" />
            <span className="text-[11px]">
              {Array.isArray(expert.languages) ? expert.languages.join(', ') : 'English'}
            </span>
          </div>

          <div className="text-stone-900 font-semibold text-xs">
            ${expert.hourly_rate || 75}
            <span className="text-[10px] text-stone-500 font-normal"> / 45m session</span>
          </div>
        </div>
      </div>

      {/* Booking CTA */}
      <div className="mt-5 pt-3">
        <button
          onClick={() => onBookClick(expert)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-semibold text-xs transition-all shadow-sm active:scale-95"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Consultation</span>
        </button>
      </div>
    </div>
  );
}
