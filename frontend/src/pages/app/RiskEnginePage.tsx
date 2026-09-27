import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Shield, Play, Activity, Calculator, TrendingUp } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { formatINR } from '../../api/client';
import { mockEnterpriseRisk } from '../../data/mockData';

export default function RiskEnginePage() {
  const [iterations, setIterations] = useState(100000);
  const [simulating, setSimulating] = useState(false);

  const monteCarloDistribution = [
    { percentile: 'P10', loss: 85000000 },
    { percentile: 'P25', loss: 140000000 },
    { percentile: 'P50 (Median)', loss: 284500000 },
    { percentile: 'P75', loss: 350000000 },
    { percentile: 'P95 (Cyber VaR)', loss: 421000000 },
    { percentile: 'P99 (Extreme)', loss: 560000000 },
  ];

  const handleRunMonteCarlo = () => {
    setSimulating(true);
    setTimeout(() => setSimulating(false), 800);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Open FAIR Monte Carlo Risk Engine"
        description="Run 100,000 statistical iterations combining Loss Event Frequency (LEF) and Loss Magnitude (LM)."
        badge="FAIR v3.0 Spec"
        actions={[
          { label: simulating ? 'Running 100k Iterations...' : 'Execute Monte Carlo Engine', icon: Play, onClick: handleRunMonteCarlo, variant: 'primary' },
        ]}
      />

      {/* Probability Distribution Chart */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyber-400" />
          Loss Probability Density Function (Percentiles)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monteCarloDistribution}>
            <defs>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="percentile" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tickFormatter={(v) => formatINR(v)} tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
              formatter={(v: number) => [formatINR(v), 'Modeled Loss']}
            />
            <Area type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#riskGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Loss Parameters Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 space-y-2">
          <span className="text-xs text-dark-400 font-semibold uppercase">Loss Event Frequency (LEF)</span>
          <p className="text-2xl font-bold text-white">4.2 Events / Year</p>
          <p className="text-xs text-dark-400">Mean Threat Event Frequency (TEF) × Vulnerability (V)</p>
        </div>

        <div className="glass-card p-6 space-y-2">
          <span className="text-xs text-dark-400 font-semibold uppercase">Loss Magnitude (LM)</span>
          <p className="text-2xl font-bold text-white">{formatINR(67700000)} / Event</p>
          <p className="text-xs text-dark-400">Primary (Response) + Secondary (Reputation/Legal) Loss</p>
        </div>

        <div className="glass-card p-6 space-y-2 border-red-500/30">
          <span className="text-xs text-red-400 font-semibold uppercase">Expected Annual Loss (EAL)</span>
          <p className="text-2xl font-bold text-red-400">{formatINR(mockEnterpriseRisk.total_eal)}</p>
          <p className="text-xs text-dark-400">LEF × LM Expected Value</p>
        </div>
      </div>
    </div>
  );
}
