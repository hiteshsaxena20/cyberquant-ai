import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Treemap, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { Eye, TrendingUp } from 'lucide-react';
import { getDashboard, formatINR } from '../api/client';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function RiskDrivers() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-6"><div className="h-10 bg-dark-800 rounded-xl w-48" /><div className="h-96 bg-dark-800/50 rounded-2xl" /></div>;

  const risk = data?.enterprise_risk;
  const drivers = risk?.risk_drivers || [];
  const buRisk = risk?.risk_by_bu || [];
  const controls = data?.control_effectiveness || [];

  // Treemap data for risk drivers
  const treemapData = drivers.map((d: any, i: number) => ({
    name: d.name,
    size: d.value,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
          Risk Drivers
        </h1>
        <p className="text-dark-400 mt-1">Understanding what contributes most to enterprise cyber exposure</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyber-400" />
            Risk Contribution by Driver
          </h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={280}>
              <PieChart>
                <Pie
                  data={drivers}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {drivers.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {drivers.map((d: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-md" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-dark-200">{d.name}</span>
                      <span className="text-sm font-mono font-bold text-white">{d.value}%</span>
                    </div>
                    <div className="progress-bar mt-1">
                      <div
                        className="progress-fill"
                        style={{ width: `${d.value}%`, backgroundColor: COLORS[i % COLORS.length] }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Business Unit Risk */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyber-400" />
            Risk by Business Unit
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={buRisk}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v: number) => formatINR(v)} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
                formatter={(v: number) => [formatINR(v), 'EAL']}
              />
              <Bar dataKey="eal" radius={[8, 8, 0, 0]}>
                {buRisk.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Control Gaps */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-6">Control Effectiveness Gap Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {controls.map((ctrl: any, i: number) => {
            const eff = ctrl.effectiveness;
            const color = eff >= 80 ? '#22c55e' : eff >= 60 ? '#eab308' : '#ef4444';
            return (
              <div key={i} className="p-4 rounded-xl bg-dark-800/50 text-center space-y-3 hover:bg-dark-800 transition-colors">
                <div className="relative mx-auto w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="#1e293b" strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke={color} strokeWidth="3"
                      strokeDasharray={`${eff}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold" style={{ color }}>
                    {eff.toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-dark-300 font-medium">{ctrl.name}</p>
                <p className="text-xs text-dark-500">Coverage: {ctrl.coverage}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
