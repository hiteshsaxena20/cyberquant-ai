import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { FlaskConical, Play, RotateCcw, TrendingDown, TrendingUp, Clock } from 'lucide-react';
import { runSimulation, getScenarios, formatINR } from '../api/client';

interface ControlToggle {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  value?: number;
  isPercentage?: boolean;
}

const CONTROLS: ControlToggle[] = [
  { key: 'mfa_coverage', label: 'Full MFA Coverage', description: 'Increase MFA from 67% to 100%', enabled: false, value: 100, isPercentage: true },
  { key: 'patch_critical_cves', label: 'Patch Critical CVEs', description: 'Remediate all critical vulnerabilities', enabled: false },
  { key: 'network_segmentation', label: 'Network Segmentation', description: 'Segment critical assets from general network', enabled: false },
  { key: 'edr_expansion', label: 'EDR Expansion', description: 'Extend EDR coverage from 72% to 95%', enabled: false, value: 95, isPercentage: true },
  { key: 'waf_deployment', label: 'WAF Deployment', description: 'Deploy WAF for internet-facing apps', enabled: false },
  { key: 'security_monitoring', label: 'Enhanced Monitoring', description: 'Upgrade SIEM + 24/7 SOC', enabled: false },
  { key: 'encryption_at_rest', label: 'Data Encryption', description: 'Encrypt all sensitive data at rest', enabled: false },
  { key: 'backup_improvement', label: 'Backup Hardening', description: 'Implement immutable 3-2-1 backups', enabled: false },
  { key: 'security_training', label: 'Security Training', description: 'Advanced phishing simulation program', enabled: false },
];

export default function ScenarioSimulator() {
  const [controls, setControls] = useState(CONTROLS);
  const [delayDays, setDelayDays] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'custom' | 'prebuilt' | 'delay'>('custom');

  useEffect(() => {
    getScenarios().then(data => setScenarios(data.scenarios || [])).catch(() => {});
  }, []);

  const toggleControl = (key: string) => {
    setControls(prev => prev.map(c => c.key === key ? { ...c, enabled: !c.enabled } : c));
  };

  const runSim = async () => {
    setLoading(true);
    try {
      const changes: Record<string, any> = {};
      controls.forEach(c => {
        if (c.enabled) changes[c.key] = c.isPercentage ? (c.value || 100) : true;
      });

      const delay = activeTab === 'delay' ? delayDays : 0;
      const res = await runSimulation(changes, delay);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setControls(CONTROLS);
    setResult(null);
    setDelayDays(0);
  };

  const enabledCount = controls.filter(c => c.enabled).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
          Scenario Simulator
        </h1>
        <p className="text-dark-400 mt-1">What-if analysis — simulate security changes and see projected risk impact</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'custom', label: 'Custom Scenario', icon: FlaskConical },
          { key: 'prebuilt', label: 'Pre-built Scenarios', icon: Play },
          { key: 'delay', label: 'Delay Impact', icon: Clock },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key as any); setResult(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-cyber-600/20 text-cyber-400 border border-cyber-500/30'
                : 'text-dark-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Custom Scenario */}
      {activeTab === 'custom' && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Toggle Security Controls</h3>
            <div className="flex gap-2">
              <button onClick={reset} className="btn-ghost flex items-center gap-1 text-sm">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <button onClick={runSim} disabled={loading || enabledCount === 0} className="btn-primary flex items-center gap-2">
                <Play className="w-4 h-4" />
                {loading ? 'Simulating...' : `Simulate (${enabledCount} changes)`}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {controls.map(ctrl => (
              <button
                key={ctrl.key}
                onClick={() => toggleControl(ctrl.key)}
                className={`p-4 rounded-xl text-left transition-all border ${
                  ctrl.enabled
                    ? 'bg-cyber-600/10 border-cyber-500/30 shadow-sm shadow-cyber-500/10'
                    : 'bg-dark-800/50 border-dark-700/50 hover:border-dark-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    ctrl.enabled ? 'border-cyber-400 bg-cyber-500' : 'border-dark-500'
                  }`}>
                    {ctrl.enabled && <span className="text-white text-[10px]">✓</span>}
                  </div>
                  <span className={`font-medium text-sm ${ctrl.enabled ? 'text-white' : 'text-dark-300'}`}>
                    {ctrl.label}
                  </span>
                </div>
                <p className="text-xs text-dark-500 ml-7">{ctrl.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pre-built Scenarios */}
      {activeTab === 'prebuilt' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.filter(s => !s.is_delay_scenario).map((scenario, i) => (
            <div key={i} className="glass-card-hover p-6 cursor-pointer" onClick={() => setResult(scenario)}>
              <h4 className="font-semibold mb-2">{scenario.name}</h4>
              <p className="text-sm text-dark-400 mb-4">{scenario.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-dark-500">Risk Reduction</span>
                <span className="font-mono font-bold text-green-400">{formatINR(scenario.risk_reduction)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-dark-500">Investment</span>
                <span className="font-mono text-dark-300">{formatINR(scenario.investment_required)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delay Tab */}
      {activeTab === 'delay' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-risk-high" />
            Remediation Delay Impact
          </h3>
          <p className="text-dark-400 text-sm mb-4">
            Simulate how risk grows if all remediation is delayed
          </p>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="range"
              min={7}
              max={90}
              value={delayDays}
              onChange={(e) => setDelayDays(Number(e.target.value))}
              className="flex-1 accent-risk-high"
            />
            <span className="text-lg font-bold text-risk-high w-24 text-right">{delayDays} days</span>
            <button onClick={runSim} disabled={loading || delayDays === 0} className="btn-primary">
              {loading ? 'Simulating...' : 'Project Impact'}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Summary */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">
              {result.is_delay_scenario ? '⚠️ Delay Impact Projection' : '✅ Simulation Result'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-dark-800/50 text-center">
                <p className="text-sm text-dark-400 mb-1">Current EAL</p>
                <p className="text-xl font-bold text-white">{formatINR(result.current_eal)}</p>
              </div>
              <div className="p-4 rounded-xl bg-dark-800/50 text-center">
                <p className="text-sm text-dark-400 mb-1">Projected EAL</p>
                <p className={`text-xl font-bold ${result.is_delay_scenario ? 'text-risk-critical' : 'text-green-400'}`}>
                  {formatINR(result.projected_eal)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-dark-800/50 text-center">
                <p className="text-sm text-dark-400 mb-1">
                  {result.is_delay_scenario ? 'Risk Increase' : 'Risk Reduction'}
                </p>
                <p className={`text-xl font-bold flex items-center justify-center gap-1 ${
                  result.is_delay_scenario ? 'text-risk-critical' : 'text-green-400'
                }`}>
                  {result.is_delay_scenario ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  {formatINR(Math.abs(result.risk_reduction))}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-dark-800/50 text-center">
                <p className="text-sm text-dark-400 mb-1">
                  {result.is_delay_scenario ? 'Cost of Delay' : 'Investment'}
                </p>
                <p className="text-xl font-bold text-cyber-400">
                  {formatINR(result.is_delay_scenario ? Math.abs(result.risk_reduction) : result.investment_required)}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Chart (for delay scenarios) */}
          {result.timeline && result.timeline.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Risk Growth Timeline</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={result.timeline}>
                  <defs>
                    <linearGradient id="delayGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} label={{ value: 'Days', position: 'insideBottom', fill: '#64748b' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v: number) => formatINR(v)} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
                    formatter={(v: number) => [formatINR(v), 'Projected EAL']}
                  />
                  <Area type="monotone" dataKey="projected_eal" stroke="#ef4444" strokeWidth={2} fill="url(#delayGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
