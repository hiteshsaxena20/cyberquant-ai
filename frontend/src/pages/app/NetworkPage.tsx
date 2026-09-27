import { Network, Globe, Lock, Shield } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

export default function NetworkPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Network Topology & Zero-Trust Segmentation"
        description="Monitor edge firewalls, internal VLAN segmentation, open ports, and egress anomaly detection."
        badge="Palo Alto & Cloudflare Edge"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 space-y-2">
          <span className="text-xs text-dark-400 font-semibold uppercase">Micro-segmentation Score</span>
          <p className="text-3xl font-extrabold text-cyber-400">62.0%</p>
          <span className="text-xs text-dark-400">Target: 90% Zero Trust</span>
        </div>
        <div className="glass-card p-6 space-y-2">
          <span className="text-xs text-dark-400 font-semibold uppercase">Edge Firewalls</span>
          <p className="text-3xl font-extrabold text-white">12 Pairs</p>
          <span className="text-xs text-green-400">100% Operational</span>
        </div>
        <div className="glass-card p-6 space-y-2">
          <span className="text-xs text-dark-400 font-semibold uppercase">Open Internet Ports</span>
          <p className="text-3xl font-extrabold text-amber-400">18</p>
          <span className="text-xs text-dark-400">Port 443, 22, 8443</span>
        </div>
      </div>
    </div>
  );
}
