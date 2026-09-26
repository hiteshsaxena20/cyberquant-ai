import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Shield, AlertTriangle, Server,
  Globe, DollarSign, Activity, Eye, Zap,
} from 'lucide-react';
import { getDashboard, formatINR } from '../api/client';

const RISK_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

export default function ExecutiveDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (!data) return <div className="text-center text-dark-400 py-20">Failed to load dashboard data</div>;

  const risk = data.enterprise_risk;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white to-dark-300 bg-clip-text text-transparent">
            Executive Dashboard
          </h1>
          <p className="text-dark-400 mt-1">ABC Bank — Enterprise Cyber Risk Overview</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass-card">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-dark-300">Live</span>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={DollarSign}
          label="Expected Annual Loss"
          value={formatINR(risk.total_eal)}
          sublabel="Modeled financial exposure"
          color="#ef4444"
          trend={risk.risk_trend_30d}
        />
        <MetricCard
          icon={Shield}
          label="95% Cyber VaR"
          value={formatINR(risk.var_95)}
          sublabel="Worst-case (95th percentile)"
          color="#f97316"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Critical Vulnerabilities"
          value={String(risk.critical_vulnerabilities)}
          sublabel={`of ${risk.total_vulnerabilities} total`}
          color="#eab308"
        />
        <MetricCard
          icon={Server}
          label="Critical Assets"
          value={String(risk.critical_assets)}
          sublabel={`of ${risk.total_assets} total | ${risk.internet_facing_assets} internet-facing`}
          color="#3b82f6"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniMetric label="MFA Coverage" value={`${risk.mfa_coverage}%`} icon={Shield} />
        <MiniMetric label="Open Vulns" value={String(risk.open_vulnerabilities)} icon={AlertTriangle} />
        <MiniMetric label="30-Day Trend" value={`↑ ${risk.risk_trend_30d}%`} icon={TrendingUp} accent />
        <MiniMetric label="Internet-Facing" value={String(risk.internet_facing_assets)} icon={Globe} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* EAL Trend */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyber-400" />
            Expected Annual Loss — 30-Day Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={risk.eal_trend}>
              <defs>
                <linearGradient id="ealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3383ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3383ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v: number) => formatINR(v)} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
                formatter={(v: number) => [formatINR(v), 'EAL']}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="eal" stroke="#3383ff" strokeWidth={2} fill="url(#ealGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Drivers */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyber-400" />
            Risk Drivers
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={risk.risk_drivers}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {risk.risk_drivers.map((_: any, i: number) => (
                  <Cell key={i} fill={RISK_COLORS[i % RISK_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {risk.risk_drivers.map((d: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS[i] }} />
                  <span className="text-dark-300">{d.name}</span>
                </div>
                <span className="font-mono text-dark-400">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Financial Risks */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-risk-critical" />
            Top Financial Risks
          </h3>
          <div className="space-y-3">
            {data.top_assets.slice(0, 6).map((asset: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-dark-700 text-sm font-bold text-dark-300">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{asset.name}</p>
                    <p className="text-xs text-dark-500">Criticality: {asset.criticality?.toFixed(0)}/100</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold text-risk-critical">{formatINR(asset.eal)}</p>
                  <p className="text-xs text-dark-500">EAL</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Control Effectiveness + Compliance */}
        <div className="space-y-6">
          {/* Controls */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyber-400" />
              Control Effectiveness
            </h3>
            <div className="space-y-3">
              {data.control_effectiveness.slice(0, 5).map((ctrl: any, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-300">{ctrl.name}</span>
                    <span className={`font-mono font-semibold ${
                      ctrl.effectiveness >= 80 ? 'text-green-400' :
                      ctrl.effectiveness >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {ctrl.effectiveness.toFixed(0)}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${ctrl.effectiveness}%`,
                        background: ctrl.effectiveness >= 80 ? '#22c55e' :
                                   ctrl.effectiveness >= 60 ? '#eab308' : '#ef4444',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Compliance Posture</h3>
            <div className="grid grid-cols-2 gap-3">
              {data.compliance_summary.map((fw: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-dark-800/50 text-center">
                  <p className="text-2xl font-bold text-cyber-400">{fw.score}%</p>
                  <p className="text-xs text-dark-400 mt-1">{fw.framework.replace('Framework', '').trim()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function MetricCard({ icon: Icon, label, value, sublabel, color, trend }: {
  icon: any; label: string; value: string; sublabel: string; color: string; trend?: number;
}) {
  return (
    <div className="metric-card" style={{ '--accent-color': color } as any}>
      <div className="flex items-start justify-between">
        <div>
          <p className="metric-label">{label}</p>
          <p className="metric-value mt-2">{value}</p>
          <p className="text-xs text-dark-500 mt-2">{sublabel}</p>
        </div>
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          {trend > 0 ? (
            <TrendingUp className="w-4 h-4 text-red-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-green-400" />
          )}
          <span className={`text-sm font-semibold ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-dark-500">30d</span>
        </div>
      )}
    </div>
  );
}

function MiniMetric({ label, value, icon: Icon, accent }: {
  label: string; value: string; icon: any; accent?: boolean;
}) {
  return (
    <div className="glass-card p-4 flex items-center gap-3">
      <Icon className={`w-4 h-4 ${accent ? 'text-risk-critical' : 'text-dark-500'}`} />
      <div>
        <p className="text-xs text-dark-500">{label}</p>
        <p className={`text-lg font-bold ${accent ? 'text-risk-critical' : 'text-white'}`}>{value}</p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-dark-800 rounded-xl w-64" />
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-dark-800/50 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-80 bg-dark-800/50 rounded-2xl" />
        <div className="h-80 bg-dark-800/50 rounded-2xl" />
      </div>
    </div>
  );
}
