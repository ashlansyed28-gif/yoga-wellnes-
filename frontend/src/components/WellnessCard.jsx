import React from 'react';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WellnessCard({
  title,
  subtitle,
  category,
  duration,
  image,
  tag,
  route,
  onClick,
  actionText = 'Begin Practice',
  badgeColor = 'bg-sage-100 text-sage-800',
  className = ''
}) {
  const CardContent = (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-between p-5 rounded-3xl zen-glass border border-sage-200/80 subtle-shadow hover:subtle-glow hover:border-sage-300 transition-all duration-300 overflow-hidden cursor-pointer ${className}`}
    >
      {/* Background image preview if provided */}
      {image && (
        <div className="relative w-full h-40 -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-3xl">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
          {tag && (
            <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-white/90 text-stone-900 backdrop-blur-sm shadow-sm">
              {tag}
            </span>
          )}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          {category && (
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badgeColor}`}>
              {category}
            </span>
          )}
          {duration && (
            <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-sage-600" />
              <span>{duration} min</span>
            </div>
          )}
        </div>

        <h3 className="font-serif text-lg font-semibold text-stone-800 group-hover:text-sage-800 transition-colors tracking-tight line-clamp-2">
          {title}
        </h3>

        {subtitle && (
          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>

      <div className="pt-4 mt-2 border-t border-sage-100 flex items-center justify-between text-xs font-semibold text-sage-700 group-hover:text-sage-900 transition-colors">
        <span>{actionText}</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );

  if (route) {
    return <Link to={route}>{CardContent}</Link>;
  }

  return CardContent;
}
