import { Users, Mail, AlertTriangle, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

export default function EmployeesPage() {
  const watchlist = [
    { name: 'Vikramaditya Rao', dept: 'Corporate Treasury', role: 'Treasury Admin', score: 88, riskReason: 'Failed Q3 Spear Phishing Simulation & Unenforced MFA' },
    { name: 'Karan Kapoor', dept: 'Wealth Management', role: 'Relationship Lead', score: 74, riskReason: 'Accessed Customer PII from Unrecognized Public IP' },
    { name: 'Neha Gupta', dept: 'HR & Payroll', role: 'CHRO Administrator', score: 68, riskReason: 'Stale Administrative Credentials (> 120 Days)' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Employee Security & Insider Threat Watchlist"
        description="Monitor phishing simulation pass rates, human error susceptibility, and high-risk user watchlists."
        badge="Human Risk Intelligence"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 space-y-2">
          <span className="text-xs text-dark-400 uppercase font-semibold">Phishing Pass Rate</span>
          <p className="text-3xl font-extrabold text-green-400">92.4%</p>
          <span className="text-xs text-dark-400">7.6% Click-Through Rate</span>
        </div>
        <div className="glass-card p-6 space-y-2">
          <span className="text-xs text-dark-400 uppercase font-semibold">Trained Staff</span>
          <p className="text-3xl font-extrabold text-white">12,450</p>
          <span className="text-xs text-dark-400">Annual Security Certification</span>
        </div>
        <div className="glass-card p-6 space-y-2">
          <span className="text-xs text-dark-400 uppercase font-semibold">High-Risk Users</span>
          <p className="text-3xl font-extrabold text-red-400">14</p>
          <span className="text-xs text-dark-400">Active Watchlist Monitoring</span>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-base font-bold text-white">High-Risk User Watchlist</h3>
        <div className="space-y-3">
          {watchlist.map((w, i) => (
            <div key={i} className="p-4 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{w.name}</h4>
                  <span className="text-xs text-cyber-400 font-medium">({w.role} • {w.dept})</span>
                </div>
                <p className="text-xs text-red-400 font-medium">{w.riskReason}</p>
              </div>
              <span className="text-lg font-bold text-amber-400">{w.score} / 100</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
