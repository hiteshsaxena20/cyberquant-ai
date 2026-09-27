import { Shield, Key, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

export default function IdentityPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Identity & Access Management (IAM) Risk"
        description="Monitor privileged accounts, MFA enforcement gaps, and stale credential escalation paths."
        badge="Zero-Trust Posture"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 space-y-1">
          <span className="text-xs text-dark-400 uppercase font-semibold">MFA Coverage</span>
          <p className="text-3xl font-extrabold text-cyber-400">84.5%</p>
          <span className="text-[10px] text-amber-400">15.5% Gaps on Legacy Admin</span>
        </div>
        <div className="glass-card p-6 space-y-1">
          <span className="text-xs text-dark-400 uppercase font-semibold">Privileged Admins</span>
          <p className="text-3xl font-extrabold text-white">142</p>
          <span className="text-[10px] text-dark-400">Active PAM Accounts</span>
        </div>
        <div className="glass-card p-6 space-y-1">
          <span className="text-xs text-dark-400 uppercase font-semibold">Stale Credentials</span>
          <p className="text-3xl font-extrabold text-orange-400">28</p>
          <span className="text-[10px] text-dark-400">Unused &gt; 90 Days</span>
        </div>
        <div className="glass-card p-6 space-y-1">
          <span className="text-xs text-dark-400 uppercase font-semibold">Identity Risk Score</span>
          <p className="text-3xl font-extrabold text-yellow-400">72 / 100</p>
          <span className="text-[10px] text-dark-400">Moderate Escalation Risk</span>
        </div>
      </div>
    </div>
  );
}
