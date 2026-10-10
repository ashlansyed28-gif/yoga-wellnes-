import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Heart, 
  Activity, 
  Moon, 
  Coffee, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { api } from '../lib/api';
import { soundscapes } from '../lib/audioSynth';

const PROTOCOLS = [
  {
    id: 'back_pain',
    title: 'Spinal Decompression & Chronic Back Care',
    target: 'Lumbar, Sacroiliac & Thoracic Spine',
    duration: 15,
    tag: 'Spine Protocol',
    contraindications: 'Acute disc herniation or sharp shooting sciatica. Avoid deep forward twists without props.',
    steps: [
      { name: 'Pelvic Tilts in Supine Position (3 mins)', desc: 'Gently flattening the lumbar spine against the mat, activating the transverse abdominis without straining.' },
      { name: 'Supported Supta Padangusthasana with Strap (4 mins)', desc: 'Opening the hamstrings with a soft knee bend to relieve downward pull on the sacrum.' },
      { name: 'Sphinx Pose on Forearms (3 mins)', desc: 'Passive lumbar extension restoring the natural lordotic curve while keeping glutes relaxed.' },
      { name: 'Reclined Constructive Rest with Knees Knocked (5 mins)', desc: 'Psoas muscle release allowing the hip flexors to fully soften and realign.' }
    ]
  },
  {
    id: 'stress_recovery',
    title: 'Sympathetic Downregulation & Stress Protocol',
    target: 'Central Nervous System & Vagus Nerve',
    duration: 18,
    tag: 'Nervous System',
    contraindications: 'Do not practice intense breath retention if you experience dizziness or cardiovascular arrhythmias.',
    steps: [
      { name: 'Extended Exhalation Pranayama (4 mins)', desc: 'Inhaling for 4 counts and exhaling smoothly for 6-8 counts through pursed lips.' },
      { name: 'Supported Child’s Pose with Bolster (5 mins)', desc: 'Resting torso on a cushioned bolster to encourage sensory withdrawal (Pratyahara).' },
      { name: 'Gentle Cat-Cow with Sighing Exhale (4 mins)', desc: 'Unwinding somatic spinal tension stored during fight-or-flight sympathetic arousal.' },
      { name: 'Guided Body Scan in Savasana (5 mins)', desc: 'Progressive muscle softening from the soles of the feet to the crown of the head.' }
    ]
  },
  {
    id: 'joint_mobility',
    title: 'Joint Ease & Gentle Arthritis-Friendly Flow',
    target: 'Wrists, Knees, Ankles & Hips',
    duration: 14,
    tag: 'Gentle Mobility',
    contraindications: 'Avoid high-impact transitions, kneeling on hard floors, or hyper-extending tender joints.',
    steps: [
      { name: 'Seated Ankle & Wrist Rotations (3 mins)', desc: 'Hydrating synovial fluid in the peripheral joints with smooth, circular mobility.' },
      { name: 'Chair Supported Butterfly (Baddha Konasana) (4 mins)', desc: 'Gentle inner-thigh and hip adductor opening without knee torque.' },
      { name: 'Standing Micro-Knee Bends with Wall Support (3 mins)', desc: 'Strengthening quadriceps safely without loading excessive compressive forces.' },
      { name: 'Shoulder Rolls & Gentle Neck Carousels (4 mins)', desc: 'Releasing traps and levator scapulae tension without tipping the head abruptly backwards.' }
    ]
  },
  {
    id: 'digestive_wellness',
    title: 'Digestive Reset & Abdominal Decompression',
    target: 'Enteric Nervous System & Digestive Tract',
    duration: 12,
    tag: 'Gut-Brain Harmony',
    contraindications: 'Avoid right after heavy meals. Wait at least 90 minutes after eating before practicing twists.',
    steps: [
      { name: 'Gentle Wind-Relieving Pose (Pawanmuktasana) (4 mins)', desc: 'Hugging right knee in, then left, massaging ascending and descending colon.' },
      { name: 'Supine Belly Breathing with Hands on Navel (3 mins)', desc: 'Diaphragmatic excursion creating gentle rhythmic visceral mobilization.' },
      { name: 'Reclined Gentle Spinal Twist (3 mins)', desc: 'Twisting gently to each side with knees together and shoulders grounded.' },
      { name: 'Quiet Rest in Supta Baddha Konasana (2 mins)', desc: 'Encouraging blood flow to the pelvic bowl and visceral organs.' }
    ]
  }
];

export default function ProtocolsPage() {
  const [expandedId, setExpandedId] = useState(PROTOCOLS[0].id);
  const [completedProtocol, setCompletedProtocol] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStartProtocol = (protocol) => {
    soundscapes.playSingingBowl(216);
    api.completeSession('Yoga', protocol.duration).catch(() => {});
    setCompletedProtocol(protocol.id);
  };

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-sage-600 block">
          Specialized Health Protocols
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Targeted Wellness Sequences
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          Carefully sequenced restorative routines tailored for specific physiological goals, accompanied by anatomical precautions.
        </p>
      </div>

      {/* Prominent Mandatory Medical Notice (Section 18 Requirement) */}
      <MedicalDisclaimer />

      {/* Protocols List */}
      <div className="space-y-4">
        {PROTOCOLS.map((protocol) => {
          const isExpanded = expandedId === protocol.id;
          const isDone = completedProtocol === protocol.id;

          return (
            <div
              key={protocol.id}
              className="zen-glass rounded-3xl border border-sage-200/90 subtle-shadow overflow-hidden transition-all duration-300"
            >
              <div
                onClick={() => toggleExpand(protocol.id)}
                className="p-6 cursor-pointer flex items-center justify-between gap-4 hover:bg-sage-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sage-200/80 text-sage-900">
                      {protocol.tag}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {protocol.duration} Minutes
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {protocol.title}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Target Area: <strong className="text-stone-700">{protocol.target}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartProtocol(protocol);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-sage-700 hover:bg-sage-800 text-white'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Practice</span>
                      </>
                    )}
                  </button>

                  <div className="p-2 text-stone-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-sage-100 space-y-4 animate-fade-in bg-white/40">
                  {/* Precautions Box */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block text-amber-900">Precautions & Contraindications:</strong>
                      <span className="text-amber-800/90">{protocol.contraindications}</span>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Guided Protocol Steps
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {protocol.steps.map((st, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-2xl bg-white border border-sage-200/70 text-xs text-stone-800 space-y-1"
                        >
                          <div className="flex items-center gap-2 font-bold text-sage-900">
                            <span className="w-5 h-5 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center text-[10px]">
                              {i + 1}
                            </span>
                            <span>{st.name}</span>
                          </div>
                          <p className="text-stone-600 pl-7 leading-relaxed">{st.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
