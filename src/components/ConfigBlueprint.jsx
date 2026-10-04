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
    <section className="bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] border border-slate-800/90 rounded-2xl p-6 sm:p-7 shadow-theme-card">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xl font-extrabold text-white tracking-tight">Router Configuration Blueprint</h3>
        </div>
        <p className="text-sm text-slate-400 font-medium">
          Ready-to-deploy Modular QoS CLI (MQC) configuration for Cisco enterprise campus edge routers.
        </p>
      </div>

      <div className="bg-[#070B14] border border-slate-800/90 rounded-xl overflow-hidden shadow-inner">
        <div className="bg-[#0B1120] border-b border-slate-800 px-4 py-3 flex justify-between items-center text-xs font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 font-mono text-slate-400">cisco-ios-mqc.cfg</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 px-3.5 py-1.5 rounded-lg text-xs font-bold text-indigo-200 transition-all shadow-[0_0_12px_rgba(99,102,241,0.2)] hover:shadow-[0_0_18px_rgba(99,102,241,0.4)]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Config'}</span>
          </button>
        </div>
        <pre className="p-5 font-mono text-xs text-indigo-200/90 leading-relaxed overflow-x-auto selection:bg-indigo-600 selection:text-white">
          <code>{ciscoCode}</code>
        </pre>
      </div>
    </section>
  );
}
