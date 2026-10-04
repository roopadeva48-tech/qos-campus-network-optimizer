import React from 'react';
import { useQoSStore } from '../store/useQoSStore';
import { Phone, Video, Globe, Download, Activity, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function QoSDashboard() {
  const { isQoSEnabled, networkLoad, setQoSEnabled, setNetworkLoad, getMetrics } = useQoSStore();
  const metrics = getMetrics();

  const getLoadText = () => {
    if (networkLoad < 60) return `${networkLoad}% (Light Traffic)`;
    if (networkLoad <= 100) return `${networkLoad}% (Normal Peak)`;
    return `${networkLoad}% (Overload Congestion)`;
  };

  return (
    <section className="bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] border border-slate-800/90 rounded-2xl p-6 sm:p-7 shadow-theme-card">
      {/* Section Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-extrabold text-white tracking-tight">Interactive QoS Demonstrator</h3>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            Toggle QoS policy and adjust network bottleneck load to observe real-time telemetry.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-indigo-950/70 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{isQoSEnabled ? 'LLQ + CBWFQ Active' : 'Standard FIFO (No QoS)'}</span>
        </div>
      </div>

      {/* Control Card */}
      <div className="bg-[#070B14] border border-slate-800/90 rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center shadow-inner">
        {/* Toggle Mode */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
            Network Queuing Mode:
          </label>
          <div className="flex bg-[#0F172A] border border-slate-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setQoSEnabled(true)}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-md transition-all ${
                isQoSEnabled
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              QoS Enabled (LLQ + CBWFQ)
            </button>
            <button
              type="button"
              onClick={() => setQoSEnabled(false)}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-md transition-all ${
                !isQoSEnabled
                  ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              No QoS (Standard FIFO)
            </button>
          </div>
        </div>

        {/* Load Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="network-load-slider" className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Campus Link Saturation:
            </label>
            <span className={`text-xs font-extrabold border px-2.5 py-0.5 rounded-md ${
              networkLoad > 100 
                ? 'bg-rose-950/70 border-rose-500/40 text-rose-300' 
                : 'bg-indigo-950/70 border-indigo-500/40 text-indigo-300'
            }`}>
              {getLoadText()}
            </span>
          </div>
          <input
            id="network-load-slider"
            type="range"
            min="20"
            max="150"
            step="10"
            value={networkLoad}
            onChange={(e) => setNetworkLoad(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-1.5">
            <span>20% (Light)</span>
            <span>80%</span>
            <span>100% (Saturation)</span>
            <span>150% (Severe)</span>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Voice Card */}
        <div className="bg-[#0B1120] border border-slate-800/90 rounded-xl p-4 transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] group">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5 bg-indigo-950/70 border border-indigo-500/40 px-2.5 py-1 rounded-md text-xs font-extrabold text-indigo-300">
              <Phone className="w-3.5 h-3.5 text-indigo-400" />
              <span>P1 Voice</span>
            </div>
            <span className={`text-[11px] font-bold ${metrics.voice.status.includes('Lag') ? 'text-rose-400' : 'text-emerald-400'}`}>
              {metrics.voice.status}
            </span>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-extrabold text-white group-hover:text-indigo-300 transition-colors">{metrics.voice.latency}</span>
            <span className="text-xs font-bold text-slate-400 ml-1">ms delay</span>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">{metrics.voice.desc}</p>
        </div>

        {/* Video Card */}
        <div className="bg-[#0B1120] border border-slate-800/90 rounded-xl p-4 transition-all hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] group">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5 bg-cyan-950/70 border border-cyan-500/40 px-2.5 py-1 rounded-md text-xs font-extrabold text-cyan-300">
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span>P2 Video</span>
            </div>
            <span className={`text-[11px] font-bold ${metrics.video.status.includes('Freeze') ? 'text-rose-400' : 'text-cyan-400'}`}>
              {metrics.video.status}
            </span>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">{metrics.video.loss}</span>
            <span className="text-xs font-bold text-slate-400 ml-1">% loss</span>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">{metrics.video.desc}</p>
        </div>

        {/* LMS Card */}
        <div className="bg-[#0B1120] border border-slate-800/90 rounded-xl p-4 transition-all hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] group">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5 bg-purple-950/70 border border-purple-500/40 px-2.5 py-1 rounded-md text-xs font-extrabold text-purple-300">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>P3 LMS/Web</span>
            </div>
            <span className={`text-[11px] font-bold ${metrics.lms.status.includes('Timeout') ? 'text-rose-400' : 'text-purple-400'}`}>
              {metrics.lms.status}
            </span>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-extrabold text-white group-hover:text-purple-300 transition-colors">{metrics.lms.responseTime}</span>
            <span className="text-xs font-bold text-slate-400 ml-1">sec load</span>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">{metrics.lms.desc}</p>
        </div>

        {/* Bulk Card */}
        <div className="bg-[#0B1120] border border-slate-800/90 rounded-xl p-4 transition-all hover:-translate-y-1 hover:border-slate-600/50 group">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-md text-xs font-extrabold text-slate-300">
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>P4 Bulk</span>
            </div>
            <span className="text-[11px] font-bold text-slate-400">{metrics.bulk.status}</span>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-extrabold text-white group-hover:text-slate-300 transition-colors">{metrics.bulk.throughput}</span>
            <span className="text-xs font-bold text-slate-400 ml-1">Mbps</span>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">{metrics.bulk.desc}</p>
        </div>
      </div>

      {/* Recharts Link Utilization & Bandwidth Distribution */}
      <div className="bg-[#070B14] border border-slate-800/90 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            Bandwidth Slice Distribution (10 Mbps Aggregation Link)
          </h4>
          <span className="text-[11px] font-bold text-indigo-300 bg-indigo-950/70 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
            Live Recharts Telemetry
          </span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#F8FAFC',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                }}
                itemStyle={{ color: '#F8FAFC' }}
              />
              <Bar dataKey="allocated" name="Bandwidth (Mbps)" radius={[6, 6, 0, 0]}>
                {metrics.chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? '#6366F1'
                        : index === 1
                        ? '#06B6D4'
                        : index === 2
                        ? '#A855F7'
                        : '#475569'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
