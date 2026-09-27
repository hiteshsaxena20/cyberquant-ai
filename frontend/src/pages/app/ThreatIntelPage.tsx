import { AlertTriangle, Shield, Globe, Radio } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { mockThreats } from '../../data/mockData';

export default function ThreatIntelPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Live Cyber Threat Intelligence Feed"
        description="Real-time STIX/TAXII threat actor TTPs, dark web exposure monitoring, and active zero-day trackers."
        badge="STIX / TAXII 2.1 Feed"
      />

      <div className="space-y-4">
        {mockThreats.map((th) => (
          <div key={th.id} className="glass-card p-6 space-y-3 border-dark-700/80 hover:border-cyber-500/30 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-700/50 pb-3">
              <div className="flex items-center gap-2">
                <span className={`badge ${th.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'}`}>
                  {th.severity}
                </span>
                <h3 className="text-base font-bold text-white">{th.name}</h3>
              </div>
              <span className="text-xs text-cyber-400 font-mono font-semibold">{th.financial_threat_level}</span>
            </div>

            <p className="text-xs text-dark-300 leading-relaxed">{th.description}</p>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-dark-400 pt-1">
              <div className="flex items-center gap-4">
                <span>Actor: <strong className="text-white">{th.actor}</strong></span>
                <span>Type: <strong className="text-white">{th.type}</strong></span>
                {th.cve_id && <span>CVE: <strong className="text-red-400">{th.cve_id}</strong></span>}
              </div>
              <span>Detected: {th.detected_at}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
