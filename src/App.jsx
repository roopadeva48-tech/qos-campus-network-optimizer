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
      <header className="sticky top-0 bg-theme-base/95 backdrop-blur-md border-b border-theme-periwinkle z-40 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="./logo.svg"
              alt="Logo"
              onClick={() => setShowIntro(true)}
              className="w-10 h-10 cursor-pointer hover:rotate-12 transition-transform"
              title="Click to replay intro animation"
            />
            <span className="font-extrabold text-lg tracking-tight text-theme-navy">
              Campus QoS Optimizer
            </span>
          </div>
          <div className="text-xs font-bold text-theme-muted bg-theme-sky border border-theme-periwinkle px-3.5 py-1.5 rounded-full">
            DiffServ RFC 4594 Architecture
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 flex-1">
        {/* Hero Section */}
        <section className="w-full bg-theme-sky border border-theme-periwinkle rounded-xl p-6 sm:p-8 text-center shadow-theme-card">
          <span className="inline-block text-xs font-extrabold uppercase tracking-wider bg-theme-lavender text-theme-navy border border-theme-periwinkle px-3 py-1 rounded-full mb-3">
            Online Blended Learning QoS Model
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-theme-navy mb-3">
            Smart Multi-Service Traffic Prioritization
          </h2>
          <p className="text-sm sm:text-base text-theme-muted font-medium max-w-4xl mx-auto leading-relaxed">
            Guarantees crystal-clear <strong>VoIP communication</strong> and smooth <strong>HD video lectures</strong> while maintaining responsive <strong>LMS exams</strong> over congested campus bottleneck links.
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
      <footer className="border-t border-theme-periwinkle py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-theme-muted font-medium">
          <div className="flex items-center gap-2">
            <img src="./logo.svg" alt="Footer Logo" className="w-5 h-5" />
            <span className="font-bold text-theme-navy">QoS-Campus-Network-Optimizer</span>
          </div>
          <span>&copy; 2026 University Enterprise Network Architecture</span>
        </div>
      </footer>
    </div>
  );
}
