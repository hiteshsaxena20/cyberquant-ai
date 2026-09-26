import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, PieChart, Pie,
} from 'recharts';
import { Calculator, Zap, TrendingDown, IndianRupee, CheckCircle, XCircle } from 'lucide-react';
import { optimizeBudget, getSecurityActions, formatINR } from '../api/client';

const BUDGET_PRESETS = [
  { label: '₹25 Lakh', value: 2500000 },
  { label: '₹50 Lakh', value: 5000000 },
  { label: '₹75 Lakh', value: 7500000 },
  { label: '₹1 Crore', value: 10000000 },
  { label: '₹1.5 Crore', value: 15000000 },
  { label: '₹2 Crore', value: 20000000 },
];

const ACTION_COLORS = [
  '#3b82f6', '#8b5cf6', '#06b6d4', '#22c55e', '#eab308',
  '#f97316', '#ef4444', '#ec4899', '#14b8a6', '#6366f1',
  '#f43f5e', '#84cc16',
];

export default function InvestmentOptimizer() {
  const [budget, setBudget] = useState(10000000);
  const [budgetInput, setBudgetInput] = useState('100');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasOptimized, setHasOptimized] = useState(false);

  const runOptimization = async () => {
    setLoading(true);
    try {
      const res = await optimizeBudget(budget);
      setResult(res);
      setHasOptimized(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetInput = (val: string) => {
    setBudgetInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) setBudget(num * 100000); // Convert Lakh to INR
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
          Investment Optimizer
        </h1>
        <p className="text-dark-400 mt-1">
          AI-powered budget allocation for maximum risk reduction
        </p>
      </div>

      {/* Budget Input */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <IndianRupee className="w-5 h-5 text-cyber-400" />
          <h3 className="text-lg font-semibold">Security Budget</h3>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          {BUDGET_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => { setBudget(preset.value); setBudgetInput(String(preset.value / 100000)); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                budget === preset.value
                  ? 'bg-cyber-600 text-white shadow-lg shadow-cyber-500/20'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700 border border-dark-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center gap-2">
            <span className="text-dark-400 text-lg">₹</span>
            <input
              type="number"
              className="input-field text-2xl font-bold"
              value={budgetInput}
              onChange={(e) => handleBudgetInput(e.target.value)}
              placeholder="100"
            />
            <span className="text-dark-400 text-lg">Lakh</span>
          </div>
          <button onClick={runOptimization} disabled={loading} className="btn-primary flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {loading ? 'Optimizing...' : 'Optimize'}
          </button>
        </div>
      </div>

      {/* Results */}
      {hasOptimized && result && (
        <div className="space-y-6 animate-slide-up">
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SummaryCard label="Total Invested" value={formatINR(result.total_spent)} color="#3b82f6" />
            <SummaryCard label="Risk Reduction" value={formatINR(result.total_risk_reduction)} color="#22c55e" />
            <SummaryCard label="ROSI" value={`${result.overall_rosi.toFixed(0)}%`} color="#8b5cf6" />
            <SummaryCard label="Remaining Budget" value={formatINR(result.remaining_budget)} color="#eab308" />
          </div>

          {/* Before / After */}
          {result.current_eal > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-green-400" />
                Risk Impact
              </h3>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-dark-400 mb-1">Current EAL</p>
                  <p className="text-2xl font-bold text-risk-critical">{formatINR(result.current_eal)}</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20">
                    <p className="text-lg font-bold text-green-400">↓ {formatINR(result.total_risk_reduction)}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-dark-400 mb-1">Residual EAL</p>
                  <p className="text-2xl font-bold text-green-400">{formatINR(result.residual_eal)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Selected Actions */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Recommended Actions ({result.selected_actions.length})
              </h3>
              <div className="space-y-3">
                {result.selected_actions.map((action: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-dark-800/50 border border-green-500/10 hover:border-green-500/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ACTION_COLORS[i] }} />
                        <span className="font-semibold text-sm">{action.name}</span>
                      </div>
                      <span className="badge badge-low">{action.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-400">Cost: <span className="text-white font-mono">{formatINR(action.total_cost)}</span></span>
                      <span className="text-dark-400">Reduction: <span className="text-green-400 font-mono">{formatINR(action.risk_reduction)}</span></span>
                    </div>
                    {action.rosi > 0 && (
                      <p className="text-xs text-dark-500 mt-1">ROSI: {action.rosi.toFixed(0)}% • {action.affected_assets} assets • {action.implementation_days}d</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Allocation Chart */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Budget Allocation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={result.selected_actions.map((a: any, i: number) => ({
                      name: a.name,
                      value: a.total_cost,
                      fill: ACTION_COLORS[i],
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {result.selected_actions.map((_: any, i: number) => (
                      <Cell key={i} fill={ACTION_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
                    formatter={(v: number) => [formatINR(v), 'Cost']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {result.selected_actions.map((a: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACTION_COLORS[i] }} />
                    <span className="text-dark-400 truncate">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Initial State */}
      {!hasOptimized && (
        <div className="glass-card p-12 text-center">
          <Calculator className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-300 mb-2">Enter your security budget to begin</h3>
          <p className="text-dark-500 max-w-md mx-auto">
            The AI optimizer will evaluate all possible security actions and find the combination
            that maximizes risk reduction within your budget using integer linear programming.
          </p>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass-card p-5 text-center" style={{ borderTopColor: color, borderTopWidth: 2 }}>
      <p className="text-sm text-dark-400 mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}
