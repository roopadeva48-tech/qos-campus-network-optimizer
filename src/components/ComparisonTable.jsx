import React from 'react';
import { BarChart3 } from 'lucide-react';

const benchmarkData = [
  {
    metric: 'Voice Latency',
    fifo: '310 – 380 ms (Unusable)',
    qos: '16 – 22 ms (Crystal clear)',
    gain: '94% Faster',
  },
  {
    metric: 'Voice Jitter',
    fifo: '85 – 110 ms (Distorted)',
    qos: '3 – 5 ms (Stable)',
    gain: '95% Reduction',
  },
  {
    metric: 'Video Packet Loss',
    fifo: '11.8% (Frequent freezes)',
    qos: '0.2% (Continuous HD)',
    gain: '98% Drop Cut',
  },
  {
    metric: 'LMS Quiz Response',
    fifo: '4.2 s (Timeout risk)',
    qos: '0.6 s (Instant response)',
    gain: '85% Faster',
  },
  {
    metric: 'Bulk Downloads',
    fifo: 'Uncontrolled link hog',
    qos: 'Graceful background transfer',
    gain: 'Protected',
  },
];

export default function ComparisonTable() {
  return (
    <section className="bg-white border border-theme-periwinkle rounded-xl p-6 shadow-theme-card">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-theme-muted" />
          <h3 className="text-xl font-extrabold text-theme-navy">
            Performance Benchmarks (Under Heavy Congestion)
          </h3>
        </div>
        <p className="text-sm text-theme-muted font-medium">
          Empirical evaluation over a throttled campus aggregation bottleneck link carrying multi-stream background traffic alongside live classes.
        </p>
      </div>

      <div className="overflow-x-auto border border-theme-periwinkle rounded-xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-theme-sky border-b border-theme-periwinkle text-xs font-extrabold uppercase tracking-wider text-theme-navy">
              <th className="py-3 px-4">Evaluation Metric</th>
              <th className="py-3 px-4">Without QoS (Standard FIFO)</th>
              <th className="py-3 px-4">With QoS Enabled</th>
              <th className="py-3 px-4">Improvement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-sky font-semibold text-theme-navy">
            {benchmarkData.map((row) => (
              <tr key={row.metric} className="hover:bg-theme-sky/50 transition-colors">
                <td className="py-3.5 px-4 font-extrabold">{row.metric}</td>
                <td className="py-3.5 px-4 text-theme-muted">{row.fifo}</td>
                <td className="py-3.5 px-4 font-bold">{row.qos}</td>
                <td className="py-3.5 px-4">
                  <span className="inline-block bg-theme-lavender text-theme-navy border border-theme-periwinkle text-xs font-extrabold px-2.5 py-0.5 rounded-md">
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
