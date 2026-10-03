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
    <div className="fixed inset-0 bg-gradient-to-b from-theme-sky via-theme-base to-theme-periwinkle z-50 flex items-center justify-center p-4 transition-opacity duration-500">
      <div className="text-center max-w-md w-full">
        {/* Animated Logo Container */}
        <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-dashed border-theme-lavender rounded-full animate-rotate-ring" />
          <img src="/logo.svg" alt="QoS Logo" className="w-16 h-16 animate-float-logo" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-extrabold tracking-wider text-theme-navy mb-1 uppercase">
          QOS-CAMPUS-NETWORK-OPTIMIZER
        </h1>
        <p className="text-xs font-bold text-theme-muted mb-6">
          Multi-Service Traffic Prioritization & DiffServ Architecture
        </p>

        {/* Loader Track */}
        <div className="w-56 h-1.5 bg-theme-sky border border-theme-periwinkle rounded-full mx-auto mb-6 overflow-hidden">
          <div
            className="h-full bg-theme-lavender transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Skip button */}
        <button
          type="button"
          onClick={() => setShowIntro(false)}
          className="inline-flex items-center gap-2 bg-theme-lavender hover:bg-theme-sky text-theme-navy font-extrabold text-xs px-5 py-2 rounded-full border border-theme-periwinkle shadow-sm transition-all hover:-translate-y-0.5"
        >
          <span>Enter Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
