import React, { useState } from 'react';
import { Camera, Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import PoseCameraViewer from '../components/PoseCameraViewer';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function PoseCorrectionPage() {
  const [latestFeedback, setLatestFeedback] = useState(null);

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Title & Explainer */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-sage-600 block">
          Multimodal Computer Vision & Alignment
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          AI Yoga Pose Alignment Studio
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          Position your camera to see your full mat. Prana's multimodal Gemini vision analyzes your joint angles and provides gentle, real-time encouragement and safe alignment cues.
        </p>
      </div>

      {/* Camera Viewer Component */}
      <PoseCameraViewer onFeedbackReceived={(data) => setLatestFeedback(data)} />

      {/* Privacy and Technical Assurance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-2xl zen-glass border border-sage-200 subtle-shadow space-y-2">
          <div className="w-9 h-9 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-serif text-sm font-bold text-stone-900">Zero Data Storage</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Your camera feed is never recorded or stored. Analysis frames are processed in memory and instantly wiped.
          </p>
        </div>

        <div className="p-5 rounded-2xl zen-glass border border-sage-200 subtle-shadow space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-serif text-sm font-bold text-stone-900">Gemini Multimodal</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Powered by advanced Google Gemini multimodal vision, evaluating posture stability and biomechanical ease.
          </p>
        </div>

        <div className="p-5 rounded-2xl zen-glass border border-sage-200 subtle-shadow space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <h4 className="font-serif text-sm font-bold text-stone-900">Gentle Safety First</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Always prioritize physical comfort over visual perfection. Never push into joint pain or hyperextension.
          </p>
        </div>
      </div>

      {/* Prominent Medical Notice */}
      <div className="pt-4">
        <MedicalDisclaimer />
      </div>
    </div>
  );
}
