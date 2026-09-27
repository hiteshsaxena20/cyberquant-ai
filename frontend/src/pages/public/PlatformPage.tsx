import { Shield, Server, Lock, Layers, Zap, Database } from 'lucide-react';

export default function PlatformPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 animate-fade-in">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="badge badge-low text-xs">Architecture & Security</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          CyberTwinX Platform Architecture
        </h1>
        <p className="text-sm text-dark-300">
          Built on zero-trust event-driven architecture, processing real-time telemetry from AWS, Azure, CrowdStrike, and Palo Alto Networks.
        </p>
      </div>

      <div className="glass-card p-8 space-y-6">
        <h3 className="text-xl font-bold text-white border-b border-dark-700/50 pb-4">
          Platform Pipeline Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 space-y-2">
            <Server className="w-8 h-8 text-cyber-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">1. Ingestion Engine</h4>
            <p className="text-[11px] text-dark-400">SIEM, Cloud APIs, Vulnerability Scanners</p>
          </div>
          <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 space-y-2">
            <Layers className="w-8 h-8 text-indigo-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">2. Graph Digital Twin</h4>
            <p className="text-[11px] text-dark-400">Dependency mapping & asset topology</p>
          </div>
          <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 space-y-2">
            <Zap className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">3. FAIR Risk Calculator</h4>
            <p className="text-[11px] text-dark-400">100,000 Monte Carlo loss simulations</p>
          </div>
          <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 space-y-2">
            <Shield className="w-8 h-8 text-green-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">4. Financial Advisory</h4>
            <p className="text-[11px] text-dark-400">EAL, 95% Cyber VaR & ROI optimization</p>
          </div>
        </div>
      </div>
    </div>
  );
}
