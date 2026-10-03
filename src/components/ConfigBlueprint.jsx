import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

const ciscoCode = `! ========================================================
! Cisco IOS Enterprise QoS Configuration (Modular QoS CLI)
! Campus Online Blended Education Network Model
! ========================================================

! 1. Define Class Maps
class-map match-any CM-VOICE
 match ip dscp ef
class-map match-any CM-VIDEO
 match ip dscp af41
class-map match-any CM-LMS
 match ip dscp af21

! 2. Define Policy Map (LLQ + CBWFQ + WRED)
policy-map PM-CAMPUS-QOS
 class CM-VOICE
  priority 128
 class CM-VIDEO
  bandwidth percent 50
 class CM-LMS
  bandwidth percent 20
 class class-default
  bandwidth percent 10
  random-detect

! 3. Apply Policy to WAN Bottleneck Egress Interface
interface GigabitEthernet0/1
 description Campus WAN Aggregation Bottleneck (10-100 Mbps)
 service-policy output PM-CAMPUS-QOS`;

export default function ConfigBlueprint() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ciscoCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="bg-white border border-theme-periwinkle rounded-xl p-6 shadow-theme-card">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="w-5 h-5 text-theme-muted" />
          <h3 className="text-xl font-extrabold text-theme-navy">Router Configuration Blueprint</h3>
        </div>
        <p className="text-sm text-theme-muted font-medium">
          Ready-to-deploy Modular QoS CLI (MQC) configuration for Cisco enterprise campus edge routers.
        </p>
      </div>

      <div className="bg-theme-sky border border-theme-periwinkle rounded-xl overflow-hidden">
        <div className="bg-white border-b border-theme-periwinkle px-4 py-2.5 flex justify-between items-center text-xs font-extrabold text-theme-navy">
          <span>Cisco IOS Modular QoS CLI (MQC)</span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 bg-theme-lavender hover:bg-theme-sky border border-theme-periwinkle px-3 py-1 rounded-md text-xs font-bold text-theme-navy transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Config'}</span>
          </button>
        </div>
        <pre className="p-4 font-mono text-xs text-theme-navy leading-relaxed overflow-x-auto">
          <code>{ciscoCode}</code>
        </pre>
      </div>
    </section>
  );
}
