import { useState } from 'react';
import { History, Search, Filter, ShieldCheck, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { mockAuditLogs } from '../../data/mockData';

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');

  const filtered = mockAuditLogs.filter(
    (log) =>
      !search ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Immutable System Audit Trail"
        description="Cryptographically signed activity logs recording user authentication, risk simulations, and configuration edits."
        badge="FIPS 140-2 Compliant"
      />

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            className="input-field pl-10 text-xs py-2.5"
            placeholder="Search by Actor, Action, Target, or IP address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-dark-900/80 border-b border-dark-700/50 text-dark-400 font-semibold uppercase">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Actor / Role</th>
              <th className="p-4">Action</th>
              <th className="p-4">Target Resource</th>
              <th className="p-4">IP Address</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800/60">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-dark-800/40 transition-colors">
                <td className="p-4 text-dark-300 font-mono text-[11px]">{log.timestamp}</td>
                <td className="p-4">
                  <div className="font-bold text-white">{log.actor}</div>
                  <div className="text-[10px] text-cyber-400">{log.role}</div>
                </td>
                <td className="p-4 font-mono font-semibold text-white">{log.action}</td>
                <td className="p-4 text-dark-200">{log.target}</td>
                <td className="p-4 font-mono text-dark-400">{log.ip}</td>
                <td className="p-4 text-center">
                  <span
                    className={`badge text-[10px] ${
                      log.status === 'SUCCESS' ? 'badge-low' : 'badge-critical'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
