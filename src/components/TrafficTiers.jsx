import React from 'react';
import { Layers, Phone, Video, Globe, Download } from 'lucide-react';

const tiers = [
  {
    priority: 'Priority 1',
    name: 'Voice Communication (VoIP / SIP)',
    desc: 'Real-time conversational audio. Handled via Strict Priority (LLQ) to keep delay strictly under 150ms.',
    dscp: 'DSCP EF (46)',
    icon: Phone,
    badgeBg: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]',
    iconColor: 'text-indigo-400',
    borderColor: 'hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]',
  },
  {
    priority: 'Priority 2',
    name: 'Live Video Lectures (Zoom / Teams)',
    desc: 'Interactive webinars and lectures. Guaranteed 50% minimum bandwidth to eliminate frame freezing.',
    dscp: 'DSCP AF41 (34)',
    icon: Video,
    badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    iconColor: 'text-cyan-400',
    borderColor: 'hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
  },
  {
    priority: 'Priority 3',
    name: 'LMS Portals & Web (Canvas / Moodle)',
    desc: 'Online quiz submissions and portal browsing. Guaranteed 20% bandwidth to prevent session timeouts.',
    dscp: 'DSCP AF21 (18)',
    icon: Globe,
    badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    iconColor: 'text-purple-400',
    borderColor: 'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
  },
  {
    priority: 'Priority 4',
    name: 'Bulk Downloads & Updates (ISOs / FTP)',
    desc: 'Background file transfers. Managed dynamically via WRED to use leftover link capacity without congesting live traffic.',
    dscp: 'DSCP Best Effort (0)',
    icon: Download,
    badgeBg: 'bg-slate-900 text-slate-300 border-slate-700',
    iconColor: 'text-slate-400',
    borderColor: 'hover:border-slate-600/50',
  },
];

export default function TrafficTiers() {
  return (
    <section className="bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] border border-slate-800/90 rounded-2xl p-6 sm:p-7 shadow-theme-card">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xl font-extrabold text-white tracking-tight">Campus Traffic Priority Tiers</h3>
        </div>
        <p className="text-sm text-slate-400 font-medium">
          Traffic is classified into 4 standardized tiers compliant with RFC 4594 DiffServ architecture.
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div
              key={tier.priority}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0B1120] border border-slate-800/90 rounded-xl p-4 sm:p-5 transition-all duration-200 ${tier.borderColor} group`}
            >
              <div className="flex items-center gap-3.5">
                <span className={`text-xs font-extrabold px-3 py-1.5 rounded-lg border whitespace-nowrap ${tier.badgeBg}`}>
                  {tier.priority}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Icon className={`w-4 h-4 ${tier.iconColor}`} />
                    <h4 className="text-sm font-extrabold text-white group-hover:text-slate-100 transition-colors">
                      {tier.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{tier.desc}</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold bg-[#070B14] border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 whitespace-nowrap self-end sm:self-center shadow-inner">
                {tier.dscp}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
