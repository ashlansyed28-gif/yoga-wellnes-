import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function MedicalDisclaimer({ compact = false, className = '' }) {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 bg-amber-50/90 border border-amber-200/80 rounded-lg text-amber-900 text-xs ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
        <span>
          <strong>Wellness Notice:</strong> Non-medical guidance only. If you experience pain or illness, consult a healthcare provider.
        </span>
      </div>
    );
  }

  return (
    <aside aria-label="Medical Disclaimer" className={`p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-950 text-sm shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100/80 rounded-lg text-amber-800 flex-shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-amber-900 tracking-tight flex items-center gap-1.5">
            General Wellness & Holistic Health Disclaimer
          </h4>
          <p className="text-amber-800/90 text-xs leading-relaxed">
            The yoga routines, meditation practices, breathing exercises, and AI suggestions provided on this platform are for educational and stress-reduction purposes only. They do not constitute medical diagnosis, treatment, or physical therapy. If you have a preexisting injury, cardiovascular condition, spinal disorder, or are pregnant, consult your physician before beginning any movement practice.
          </p>
        </div>
      </div>
    </aside>
  );
}
