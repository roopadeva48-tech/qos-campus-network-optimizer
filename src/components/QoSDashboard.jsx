import React from 'react';
import { useQoSStore } from '../store/useQoSStore';
import { Phone, Video, Globe, Download, Activity, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
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
    <section className="bg-white border-1.5 border-theme-periwinkle rounded-xl p-6 shadow-theme-card">
      {/* Section Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-theme-muted" />
            <h3 className="text-xl font-extrabold text-theme-navy">Interactive QoS Demonstrator</h3>
          </div>
          <p className="text-sm text-theme-muted font-medium">
            Toggle QoS policy and adjust network bottleneck load to observe real-time telemetry.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-theme-sky border border-theme-periwinkle px-3 py-1.5 rounded-full text-xs font-bold text-theme-navy">
          <ShieldCheck className="w-4 h-4 text-theme-muted" />
          <span>{isQoSEnabled ? 'LLQ + CBWFQ Active' : 'Standard FIFO (No QoS)'}</span>
        </div>
      </div>

      {/* Control Card */}
      <div className="bg-theme-sky border border-theme-periwinkle rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Toggle Mode */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-theme-navy mb-2">
            Network Queuing Mode:
          </label>
          <div className="flex bg-white border border-theme-periwinkle rounded-lg p-1">
            <button
              type="button"
              onClick={() => setQoSEnabled(true)}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-md transition-all ${
                isQoSEnabled
                  ? 'bg-theme-lavender text-theme-navy shadow-sm'
                  : 'text-theme-muted hover:text-theme-navy'
              }`}
            >
              QoS Enabled (LLQ + CBWFQ)
            </button>
            <button
              type="button"
              onClick={() => setQoSEnabled(false)}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-md transition-all ${
                !isQoSEnabled
                  ? 'bg-theme-lavender text-theme-navy shadow-sm'
                  : 'text-theme-muted hover:text-theme-navy'
              }`}
            >
              No QoS (Standard FIFO)
            </button>
          </div>
        </div>

        {/* Load Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="network-load-slider" className="text-xs font-extrabold uppercase tracking-wider text-theme-navy">
              Campus Link Saturation:
            </label>
            <span className="text-xs font-extrabold bg-theme-lavender text-theme-navy border border-theme-periwinkle px-2 py-0.5 rounded-md">
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
            className="w-full h-2 bg-theme-periwinkle rounded-lg appearance-none cursor-pointer accent-theme-muted"
          />
          <div className="flex justify-between text-[10px] text-theme-muted font-bold mt-1">
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
        <div className="bg-theme-base border border-theme-periwinkle rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:border-theme-lavender">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5 bg-theme-sky border border-theme-periwinkle px-2 py-0.5 rounded-md text-xs font-extrabold text-theme-navy">
              <Phone className="w-3.5 h-3.5 text-theme-navy" />
              <span>P1 Voice</span>
            </div>
            <span className="text-[11px] font-bold text-theme-muted">{metrics.voice.status}</span>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-extrabold text-theme-navy">{metrics.voice.latency}</span>
            <span className="text-xs font-bold text-theme-muted ml-1">ms delay</span>
          </div>
          <p className="text-xs text-theme-muted font-medium leading-relaxed">{metrics.voice.desc}</p>
        </div>

        {/* Video Card */}
        <div className="bg-theme-base border border-theme-periwinkle rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:border-theme-lavender">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5 bg-theme-sky border border-theme-periwinkle px-2 py-0.5 rounded-md text-xs font-extrabold text-theme-navy">
              <Video className="w-3.5 h-3.5 text-theme-navy" />
              <span>P2 Video</span>
            </div>
            <span className="text-[11px] font-bold text-theme-muted">{metrics.video.status}</span>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-extrabold text-theme-navy">{metrics.video.loss}</span>
            <span className="text-xs font-bold text-theme-muted ml-1">% loss</span>
          </div>
          <p className="text-xs text-theme-muted font-medium leading-relaxed">{metrics.video.desc}</p>
        </div>

        {/* LMS Card */}
        <div className="bg-theme-base border border-theme-periwinkle rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:border-theme-lavender">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5 bg-theme-sky border border-theme-periwinkle px-2 py-0.5 rounded-md text-xs font-extrabold text-theme-navy">
              <Globe className="w-3.5 h-3.5 text-theme-navy" />
              <span>P3 LMS/Web</span>
            </div>
            <span className="text-[11px] font-bold text-theme-muted">{metrics.lms.status}</span>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-extrabold text-theme-navy">{metrics.lms.responseTime}</span>
            <span className="text-xs font-bold text-theme-muted ml-1">sec load</span>
          </div>
          <p className="text-xs text-theme-muted font-medium leading-relaxed">{metrics.lms.desc}</p>
        </div>

        {/* Bulk Card */}
        <div className="bg-theme-base border border-theme-periwinkle rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:border-theme-lavender">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5 bg-theme-sky border border-theme-periwinkle px-2 py-0.5 rounded-md text-xs font-extrabold text-theme-navy">
              <Download className="w-3.5 h-3.5 text-theme-navy" />
              <span>P4 Bulk</span>
            </div>
            <span className="text-[11px] font-bold text-theme-muted">{metrics.bulk.status}</span>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-extrabold text-theme-navy">{metrics.bulk.throughput}</span>
            <span className="text-xs font-bold text-theme-muted ml-1">Mbps</span>
          </div>
          <p className="text-xs text-theme-muted font-medium leading-relaxed">{metrics.bulk.desc}</p>
        </div>
      </div>

      {/* Recharts Link Utilization & Bandwidth Distribution */}
      <div className="bg-theme-sky border border-theme-periwinkle rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-theme-navy">
            Bandwidth Slice Distribution (10 Mbps Aggregation Link)
          </h4>
          <span className="text-[11px] font-bold text-theme-muted bg-white border border-theme-periwinkle px-2 py-0.5 rounded">
            Live Recharts Telemetry
          </span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#1e1b4b" tick={{ fontSize: 11, fontWeight: 700 }} />
              <YAxis stroke="#1e1b4b" tick={{ fontSize: 10, fontWeight: 600 }} domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #C4D9FF',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1e1b4b'
                }}
              />
              <Bar dataKey="allocated" name="Bandwidth (Mbps)" radius={[6, 6, 0, 0]}>
                {metrics.chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? '#C5BAFF'
                        : index === 1
                        ? '#C4D9FF'
                        : index === 2
                        ? '#E8F9FF'
                        : '#94a3b8'
                    }
                    stroke="#C4D9FF"
                    strokeWidth={1.5}
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
