import { useState } from 'react';
import { Server, Search, Filter, ShieldAlert, Download, Eye, X } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { mockAssets, Asset } from '../../data/mockData';
import { formatINR } from '../../api/client';

export default function AssetsPage() {
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = mockAssets.filter((a) => {
    const matchSearch =
      !search ||
      a.asset_id.toLowerCase().includes(search.toLowerCase()) ||
      a.hostname.toLowerCase().includes(search.toLowerCase()) ||
      a.business_unit.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || a.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Asset Inventory & Criticality Scoring"
        description="Comprehensive directory of enterprise servers, databases, cloud instances, and network devices."
        badge={`${mockAssets.length} Critical Assets`}
        actions={[
          { label: 'Export Inventory CSV', icon: Download, onClick: () => {}, variant: 'secondary' },
        ]}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            className="input-field pl-10 text-xs py-2.5"
            placeholder="Search by Asset ID, Hostname, IP, or Business Unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field w-full sm:w-52 text-xs py-2.5"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Asset Types</option>
          <option value="database">Database</option>
          <option value="cloud_service">Cloud Service</option>
          <option value="server">Server</option>
          <option value="application">Application</option>
          <option value="network_device">Network Device</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Matching Assets"
          description="Try modifying your search or filter options to locate assets."
          onAction={() => { setSearch(''); setTypeFilter('all'); }}
        />
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-900/80 border-b border-dark-700/50 text-dark-400 font-semibold uppercase">
              <tr>
                <th className="p-4">Asset ID & Hostname</th>
                <th className="p-4">Type</th>
                <th className="p-4">Business Unit</th>
                <th className="p-4 text-center">Criticality</th>
                <th className="p-4 text-center">Open Vulns</th>
                <th className="p-4 text-right">Financial Exposure</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/60">
              {filtered.map((ast) => (
                <tr key={ast.id} className="hover:bg-dark-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{ast.asset_id}</div>
                    <div className="text-[11px] text-dark-400 font-mono">{ast.hostname} ({ast.ip_address})</div>
                  </td>
                  <td className="p-4">
                    <span className="badge badge-low capitalize text-[10px]">{ast.type.replace('_', ' ')}</span>
                  </td>
                  <td className="p-4 text-dark-200">{ast.business_unit}</td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${ast.criticality_score >= 90 ? 'text-red-400' : 'text-amber-400'}`}>
                      {ast.criticality_score} / 100
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-amber-400">{ast.open_vulns} CVEs</td>
                  <td className="p-4 text-right font-mono font-bold text-red-400">
                    {formatINR(ast.revenue_per_hour * 24)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedAsset(ast)}
                      className="p-1.5 rounded-lg bg-dark-800 text-cyber-400 hover:bg-cyber-600/20 transition-colors"
                      title="View Asset Telemetry"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Asset Modal Drawer */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card w-full max-w-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-dark-700/50 pb-4">
              <div>
                <span className="badge badge-low text-[10px] uppercase">{selectedAsset.type}</span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedAsset.asset_id}</h3>
                <p className="text-xs text-cyber-400 font-mono">{selectedAsset.hostname}</p>
              </div>
              <button onClick={() => setSelectedAsset(null)} className="text-dark-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-dark-900 border border-dark-800">
                <span className="text-dark-400 block text-[10px] uppercase font-semibold">IP Address</span>
                <span className="font-mono text-white font-bold">{selectedAsset.ip_address}</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-900 border border-dark-800">
                <span className="text-dark-400 block text-[10px] uppercase font-semibold">Owner</span>
                <span className="text-white font-medium">{selectedAsset.owner}</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-900 border border-dark-800">
                <span className="text-dark-400 block text-[10px] uppercase font-semibold">Max CVSS</span>
                <span className="font-bold text-red-400">{selectedAsset.cvss_max} / 10.0</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-900 border border-dark-800">
                <span className="text-dark-400 block text-[10px] uppercase font-semibold">Location</span>
                <span className="text-white font-medium">{selectedAsset.location}</span>
              </div>
            </div>

            <div className="pt-2">
              <button onClick={() => setSelectedAsset(null)} className="btn-secondary w-full text-xs py-2.5">
                Close Telemetry View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
