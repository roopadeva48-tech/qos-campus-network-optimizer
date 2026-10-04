import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

const benchmarkData = [
  {
    metric: 'Voice Latency',
    fifo: '310 – 380 ms (Unusable)',
    qos: '16 – 22 ms (Crystal clear)',
    gain: '94% Faster',
    gainColor: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
  },
  {
    metric: 'Voice Jitter',
    fifo: '85 – 110 ms (Distorted)',
    qos: '3 – 5 ms (Stable)',
    gain: '95% Reduction',
    gainColor: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
  },
  {
    metric: 'Video Packet Loss',
    fifo: '11.8% (Frequent freezes)',
    qos: '0.2% (Continuous HD)',
    gain: '98% Drop Cut',
    gainColor: 'text-cyan-300 bg-cyan-950/70 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]',
  },
  {
    metric: 'LMS Quiz Response',
    fifo: '4.2 s (Timeout risk)',
    qos: '0.6 s (Instant response)',
    gain: '85% Faster',
    gainColor: 'text-purple-300 bg-purple-950/70 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
  },
  {
    metric: 'Bulk Downloads',
    fifo: 'Uncontrolled link hog',
    qos: 'Graceful background transfer',
    gain: 'Protected (WRED)',
    gainColor: 'text-indigo-300 bg-indigo-950/70 border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.2)]',
  },
];

export default function ComparisonTable() {
  return (
    <section className="bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] border border-slate-800/90 rounded-2xl p-6 sm:p-7 shadow-theme-card">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Performance Benchmarks (Under Heavy Congestion)
          </h3>
        </div>
        <p className="text-sm text-slate-400 font-medium">
          Empirical evaluation over a throttled campus aggregation bottleneck link carrying multi-stream background traffic alongside live classes.
        </p>
      </div>

      <div className="overflow-x-auto border border-slate-800/90 rounded-xl bg-[#070B14]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#0B1120] border-b border-slate-800 text-xs font-extrabold uppercase tracking-wider text-slate-300">
              <th className="py-3.5 px-4 sm:px-5">Evaluation Metric</th>
              <th className="py-3.5 px-4 sm:px-5">Without QoS (Standard FIFO)</th>
              <th className="py-3.5 px-4 sm:px-5">With QoS Enabled</th>
              <th className="py-3.5 px-4 sm:px-5">Improvement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-medium text-slate-200">
            {benchmarkData.map((row) => (
              <tr key={row.metric} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-4 px-4 sm:px-5 font-bold text-white">{row.metric}</td>
                <td className="py-4 px-4 sm:px-5 text-slate-400 font-mono text-xs">{row.fifo}</td>
                <td className="py-4 px-4 sm:px-5 font-bold text-indigo-300 font-mono text-xs">{row.qos}</td>
                <td className="py-4 px-4 sm:px-5">
                  <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full border ${row.gainColor}`}>
                    <TrendingUp className="w-3 h-3" />
                    {row.gain}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
