import React, { useEffect, useState } from 'react';
import { useQoSStore } from '../store/useQoSStore';
import { ArrowRight } from 'lucide-react';

export default function IntroAnimation() {
  const { showIntro, setShowIntro } = useQoSStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showIntro) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowIntro(false), 300);
          return 100;
        }
        return prev + 4;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [showIntro, setShowIntro]);

  if (!showIntro) return null;

  return (
    <div className="fixed inset-0 bg-[#07090E]/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4 transition-opacity duration-500">
      <div className="text-center max-w-md w-full relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Animated Logo Container */}
        <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-dashed border-indigo-500/40 rounded-full animate-rotate-ring shadow-[0_0_20px_rgba(99,102,241,0.2)]" />
          <img src="./logo.svg" alt="QoS Logo" className="w-16 h-16 animate-float-logo drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent mb-1 uppercase">
          QOS-CAMPUS-NETWORK-OPTIMIZER
        </h1>
        <p className="text-xs font-semibold text-slate-400 mb-6">
          Multi-Service Traffic Prioritization & DiffServ Architecture
        </p>

        {/* Loader Track */}
        <div className="w-56 h-1.5 bg-slate-900 border border-slate-800 rounded-full mx-auto mb-6 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.8)] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Skip button */}
        <button
          type="button"
          onClick={() => setShowIntro(false)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-2 rounded-full border border-indigo-400/30 shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]"
        >
          <span>Enter Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
