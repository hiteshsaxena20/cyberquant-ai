import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Search, ChevronDown, ChevronRight, Server, Database, Monitor, Cloud, Globe } from 'lucide-react';
import { getAssets, getDashboard, formatINR } from '../api/client';

const TYPE_ICONS: Record<string, any> = {
  server: Server, database: Database, endpoint: Monitor,
  application: Monitor, cloud_service: Cloud, network_device: Globe,
};

export default function RiskExplorer() {
  const [assets, setAssets] = useState<any[]>([]);
  const [buData, setBuData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('criticality_score');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getAssets(`limit=50&sort_by=${sortBy}&order=desc&min_criticality=50`),
      getDashboard(),
    ]).then(([assetData, dashData]) => {
      setAssets(assetData.assets || []);
      setBuData(dashData.enterprise_risk?.risk_by_bu || []);
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, [sortBy]);

  const filtered = assets.filter(a =>
    !search || a.hostname?.toLowerCase().includes(search.toLowerCase()) ||
    a.application?.toLowerCase().includes(search.toLowerCase()) ||
    a.asset_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
          Risk Explorer
        </h1>
        <p className="text-dark-400 mt-1">Drill down: Business Unit → Application → Asset → Vulnerability → ₹ Exposure</p>
      </div>

      {/* BU Risk Distribution */}
      {buData.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Risk by Business Unit</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={buData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v: number) => formatINR(v)} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} width={150} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
                formatter={(v: number) => [formatINR(v), 'EAL']}
              />
              <Bar dataKey="eal" fill="#3383ff" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            className="input-field pl-10"
            placeholder="Search assets by name, hostname, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field w-56"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="criticality_score">Sort by Criticality</option>
          <option value="revenue_per_hour">Sort by Revenue Impact</option>
        </select>
      </div>

      {/* Asset Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700/50">
              <th className="text-left p-4 text-sm font-medium text-dark-400">Asset</th>
              <th className="text-left p-4 text-sm font-medium text-dark-400">Type</th>
              <th className="text-left p-4 text-sm font-medium text-dark-400">Business Unit</th>
              <th className="text-center p-4 text-sm font-medium text-dark-400">Criticality</th>
              <th className="text-center p-4 text-sm font-medium text-dark-400">Vulns</th>
              <th className="text-right p-4 text-sm font-medium text-dark-400">Financial Exposure</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-dark-800/50">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="p-4"><div className="h-4 bg-dark-800 rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : filtered.map((asset) => {
              const Icon = TYPE_ICONS[asset.asset_type] || Server;
              const isExpanded = expanded === asset.id;
              return (
                <tr
                  key={asset.id}
                  className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : asset.id)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-dark-800">
                        <Icon className="w-4 h-4 text-cyber-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{asset.application || asset.hostname}</p>
                        <p className="text-xs text-dark-500 font-mono">{asset.asset_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-dark-300 capitalize">{asset.asset_type?.replace('_', ' ')}</td>
                  <td className="p-4 text-sm text-dark-300">{asset.bu_name || '—'}</td>
                  <td className="p-4 text-center">
                    <CriticalityBadge score={asset.criticality_score} />
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-mono font-semibold ${asset.vulnerability_count > 0 ? 'text-risk-high' : 'text-dark-500'}`}>
                      {asset.vulnerability_count}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono font-semibold text-risk-critical">
                    {asset.financial_exposure > 0 ? formatINR(asset.financial_exposure) : '—'}
                  </td>
                  <td className="p-4">
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-dark-500" /> : <ChevronRight className="w-4 h-4 text-dark-500" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CriticalityBadge({ score }: { score: number }) {
  let cls = 'badge-low';
  let label = 'Low';
  if (score >= 90) { cls = 'badge-critical'; label = 'Critical'; }
  else if (score >= 70) { cls = 'badge-high'; label = 'High'; }
  else if (score >= 50) { cls = 'badge-medium'; label = 'Medium'; }

  return (
    <span className={`badge ${cls}`}>
      {score.toFixed(0)} — {label}
    </span>
  );
}
