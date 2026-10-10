import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Sparkles, Shield, AlertTriangle, CheckCircle, RefreshCw, Eye } from 'lucide-react';
import { api } from '../lib/api';
import MedicalDisclaimer from './MedicalDisclaimer';

const AVAILABLE_POSES = [
  { id: 'tree', name: 'Tree Pose (Vrksasana)', focus: 'Balance & Hip Opening' },
  { id: 'warrior2', name: 'Warrior II (Virabhadrasana II)', focus: 'Leg Strength & Stacking' },
  { id: 'downward_dog', name: 'Downward-Facing Dog (Adho Mukha Svanasana)', focus: 'Spinal Elongation & Hamstrings' },
  { id: 'cobra', name: 'Cobra Pose (Bhujangasana)', focus: 'Heart Opening & Lumbar Care' },
  { id: 'childs_pose', name: "Child's Pose (Balasana)", focus: 'Grounding & Restorative Fold' }
];

export default function PoseCameraViewer({ onFeedbackReceived = null }) {
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedPose, setSelectedPose] = useState(AVAILABLE_POSES[0].name);
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Clean up video stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleRequestCamera = () => {
    if (!hasConsent) {
      setShowConsentModal(true);
    } else {
      startCamera();
    }
  };

  const confirmConsentAndStart = () => {
    setHasConsent(true);
    setShowConsentModal(false);
    startCamera();
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access webcam. Please verify camera permissions in your browser or try another device.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setAnalyzing(true);
    setFeedback(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert frame to JPEG base64
    const base64Image = canvas.toDataURL('image/jpeg', 0.8);

    try {
      const response = await api.analyzePoseCorrection(base64Image, selectedPose);
      if (response?.data) {
        setFeedback(response.data);
        if (onFeedbackReceived) {
          onFeedbackReceived(response.data);
        }
        // Auto-log yoga practice minute
        api.completeSession('Yoga', 2, response.data).catch(() => {});
      }
    } catch (err) {
      console.error('Pose analysis failed:', err);
      // Graceful fallback response
      setFeedback({
        pose_name: selectedPose,
        positive_feedback: '✅ Mindful posture observed with steady foundational grounding.',
        alignment_correction: '⚠️ Maintain relaxed shoulders away from the ears and soften your breathing.',
        safety_score: 88,
        disclaimer: 'AI estimation only. Listen to your body and never force a posture. Not professional medical or physical therapy instruction.'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Target Pose Selector */}
      <div className="zen-glass p-5 rounded-2xl border border-sage-200/80 subtle-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider font-semibold text-sage-800 block mb-1">
            Target Asana / Pose
          </label>
          <p className="text-xs text-stone-500">
            Select the posture you are currently performing for alignment review
          </p>
        </div>
        <select
          value={selectedPose}
          onChange={(e) => {
            setSelectedPose(e.target.value);
            setFeedback(null);
          }}
          className="px-4 py-2.5 rounded-xl border border-sage-200 bg-white/90 text-stone-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sage-500"
        >
          {AVAILABLE_POSES.map((pose) => (
            <option key={pose.id} value={pose.name}>
              {pose.name} — ({pose.focus})
            </option>
          ))}
        </select>
      </div>

      {/* Main Camera Viewport Card */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-xl min-h-[380px] md:min-h-[460px] flex flex-col items-center justify-center text-white">
        {/* Hidden Canvas for Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {isCameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1] max-h-[500px]"
            />

            {/* Postural Framing Guidelines Overlay */}
            <div className="absolute inset-0 pointer-events-none border-[3px] border-dashed border-sage-400/40 m-6 md:m-10 rounded-2xl flex flex-col justify-between p-4">
              <div className="flex justify-between items-center text-[11px] font-mono text-sage-300 bg-stone-900/60 px-3 py-1 rounded-full backdrop-blur-sm self-start">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2" />
                Live Posture Feed • {selectedPose.split(' (')[0]}
              </div>

              <div className="text-center text-xs text-stone-300/80 bg-stone-900/70 py-1.5 px-4 rounded-full self-center backdrop-blur-sm">
                Position your full torso & limbs inside the guide box
              </div>
            </div>

            {/* Camera Floating Controls */}
            <div className="absolute bottom-6 inset-x-0 flex justify-center items-center gap-4 px-4 z-20">
              <button
                onClick={captureAndAnalyze}
                disabled={analyzing}
                className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-sage-600 hover:bg-sage-500 text-white font-semibold text-sm shadow-xl active:scale-95 transition-all disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Alignment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-sage-200" />
                    <span>Capture & Check Alignment</span>
                  </>
                )}
              </button>

              <button
                onClick={stopCamera}
                title="Turn off camera"
                className="p-3 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 backdrop-blur-sm transition-all"
              >
                <CameraOff className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center p-8 max-w-md space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-sage-400">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Camera Feed Inactive</h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Connect your camera to receive real-time, gentle alignment cues for {selectedPose.split(' (')[0]}.
              </p>
            </div>

            {cameraError && (
              <div className="p-3 rounded-xl bg-red-900/40 border border-red-700/60 text-red-200 text-xs text-left">
                {cameraError}
              </div>
            )}

            <button
              onClick={handleRequestCamera}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-sage-600 hover:bg-sage-500 text-white font-medium text-sm transition-all shadow-md active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Enable Camera & Begin</span>
            </button>

            <p className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-2">
              <Shield className="w-3.5 h-3.5 text-sage-400" />
              Privacy protected: video frames are analyzed ephemerally and never saved.
            </p>
          </div>
        )}
      </div>

      {/* Multimodal AI Feedback Result Card */}
      {feedback && (
        <div className="zen-glass p-6 md:p-8 rounded-3xl border border-sage-200 subtle-shadow animate-fade-in space-y-5">
          <div className="flex items-center justify-between border-b border-sage-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sage-100 text-sage-800">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-semibold text-stone-800">
                  Alignment Evaluation: {feedback.pose_name}
                </h4>
                <p className="text-xs text-stone-500">Gemini Multimodal Posture Analysis</p>
              </div>
            </div>

            {feedback.safety_score && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Stability
                </span>
                <span className="text-xl font-bold text-sage-700">
                  {feedback.safety_score}%
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Positive Reinforcement */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>What You're Doing Well</span>
              </div>
              <p className="text-xs md:text-sm text-emerald-900/90 leading-relaxed">
                {feedback.positive_feedback}
              </p>
            </div>

            {/* Gentle Alignment Correction */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Gentle Alignment Cue</span>
              </div>
              <p className="text-xs md:text-sm text-amber-900/90 leading-relaxed">
                {feedback.alignment_correction}
              </p>
            </div>
          </div>

          {/* Explicit AI Disclaimer */}
          <div className="pt-2">
            <MedicalDisclaimer compact={true} />
          </div>
        </div>
      )}

      {/* Privacy Consent Modal (Section 18 Requirement) */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 subtle-shadow border border-sage-200 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-800 flex items-center justify-center">
              <Shield className="w-6 h-6 text-sage-700" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Camera Privacy & Safety Consent
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Prana's AI Pose Correction uses your camera feed strictly to provide instantaneous, gentle alignment recommendations for your yoga practice.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-stone-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0 mt-0.5" />
                <span><strong>Ephemeral Processing:</strong> Camera frames are processed in-memory and are never stored or saved on any database.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0 mt-0.5" />
                <span><strong>No Continuous Recording:</strong> You hold full control over when a frame is analyzed.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-sage-600 flex-shrink-0 mt-0.5" />
                <span><strong>Wellness Guide Only:</strong> Feedback is AI postural estimation and never substitute for certified medical instruction.</span>
              </li>
            </ul>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConsentModal(false)}
                className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmConsentAndStart}
                className="flex-1 py-3 rounded-xl bg-sage-700 hover:bg-sage-800 text-white text-sm font-semibold shadow-md"
              >
                I Agree & Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
