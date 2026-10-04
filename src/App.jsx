import React from 'react';
import { useQoSStore } from './store/useQoSStore';
import IntroAnimation from './components/IntroAnimation';
import QoSDashboard from './components/QoSDashboard';
import TrafficTiers from './components/TrafficTiers';
import ComparisonTable from './components/ComparisonTable';
import ConfigBlueprint from './components/ConfigBlueprint';

export default function App() {
  const { setShowIntro } = useQoSStore();

  return (
    <div className="min-h-screen bg-theme-base text-theme-navy flex flex-col">
      {/* Intro Splash Animation */}
      <IntroAnimation />

      {/* Main Navbar */}
      <header className="sticky top-0 bg-[#07090E]/85 backdrop-blur-xl border-b border-slate-800/80 z-40 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-lg bg-indigo-950/50 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <img
                src="./logo.svg"
                alt="Logo"
                onClick={() => setShowIntro(true)}
                className="w-8 h-8 cursor-pointer hover:rotate-12 transition-transform"
                title="Click to replay intro animation"
              />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Campus QoS Optimizer
            </span>
          </div>
          <div className="text-xs font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.15)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            DiffServ RFC 4594 Architecture
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 flex-1">
        {/* Hero Section */}
        <section className="w-full relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-[#0B1120] border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-center shadow-theme-card">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
          <span className="inline-block text-xs font-extrabold uppercase tracking-wider bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-3.5 py-1 rounded-full mb-3 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            Online Blended Learning QoS Model
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Smart Multi-Service Traffic Prioritization
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium max-w-4xl mx-auto leading-relaxed">
            Guarantees crystal-clear <strong className="text-indigo-300">VoIP communication</strong> and smooth <strong className="text-cyan-300">HD video lectures</strong> while maintaining responsive <strong className="text-purple-300">LMS exams</strong> over congested campus bottleneck links.
          </p>
        </section>

        {/* 1. Main Dashboard Component */}
        <QoSDashboard />

        {/* 2. Priority Tiers */}
        <TrafficTiers />

        {/* 3. Performance Benchmark Table */}
        <ComparisonTable />

        {/* 4. Cisco Router Config */}
        <ConfigBlueprint />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8 bg-[#05070B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2.5">
            <img src="./logo.svg" alt="Footer Logo" className="w-5 h-5 opacity-80" />
            <span className="font-bold text-slate-200">QoS-Campus-Network-Optimizer</span>
          </div>
          <span className="text-slate-500">&copy; 2026 University Enterprise Network Architecture</span>
        </div>
      </footer>
    </div>
  );
}
