import React from 'react';
import { Layers, Phone, Video, Globe, Download } from 'lucide-react';

const tiers = [
  {
    priority: 'Priority 1',
    name: 'Voice Communication (VoIP / SIP)',
    desc: 'Real-time conversational audio. Handled via Strict Priority (LLQ) to keep delay strictly under 150ms.',
    dscp: 'DSCP EF (46)',
    icon: Phone,
    color: 'bg-theme-lavender',
  },
  {
    priority: 'Priority 2',
    name: 'Live Video Lectures (Zoom / Teams)',
    desc: 'Interactive webinars and lectures. Guaranteed 50% minimum bandwidth to eliminate frame freezing.',
    dscp: 'DSCP AF41 (34)',
    icon: Video,
    color: 'bg-theme-periwinkle',
  },
  {
    priority: 'Priority 3',
    name: 'LMS Portals & Web (Canvas / Moodle)',
    desc: 'Online quiz submissions and portal browsing. Guaranteed 20% bandwidth to prevent session timeouts.',
    dscp: 'DSCP AF21 (18)',
    icon: Globe,
    color: 'bg-theme-sky',
  },
  {
    priority: 'Priority 4',
    name: 'Bulk Downloads & Updates (ISOs / FTP)',
    desc: 'Background file transfers. Managed dynamically via WRED to use leftover link capacity without congesting live traffic.',
    dscp: 'DSCP Best Effort (0)',
    icon: Download,
    color: 'bg-theme-periwinkle',
  },
];

export default function TrafficTiers() {
  return (
    <section className="bg-white border border-theme-periwinkle rounded-xl p-6 shadow-theme-card">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-theme-muted" />
          <h3 className="text-xl font-extrabold text-theme-navy">Campus Traffic Priority Tiers</h3>
        </div>
        <p className="text-sm text-theme-muted font-medium">
          Traffic is classified into 4 standardized tiers compliant with RFC 4594 DiffServ architecture.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div
              key={tier.priority}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-theme-base border border-theme-periwinkle rounded-xl p-4 transition-all hover:border-theme-lavender"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold bg-theme-lavender text-theme-navy px-3 py-1.5 rounded-lg border border-theme-periwinkle whitespace-nowrap">
                  {tier.priority}
                </span>
                <div>
                  <h4 className="text-sm font-extrabold text-theme-navy">{tier.name}</h4>
                  <p className="text-xs text-theme-muted font-medium">{tier.desc}</p>
                </div>
              </div>
              <span className="font-mono text-xs font-extrabold bg-theme-sky border border-theme-periwinkle px-3 py-1 rounded-md text-theme-navy whitespace-nowrap self-end sm:self-center">
                {tier.dscp}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
