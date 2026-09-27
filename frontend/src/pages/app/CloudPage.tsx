import { Cloud, Server, Shield, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

export default function CloudPage() {
  const misconfigs = [
    { provider: 'AWS ap-south-1', resource: 's3://cyberquant-kyc-vault-prod', severity: 'CRITICAL', issue: 'Public Read Access enabled on S3 Bucket storing customer KYC files.', status: 'OPEN' },
    { provider: 'Azure West Europe', resource: 'rg-prod-core-db-01', severity: 'HIGH', issue: 'Unencrypted EBS Disk Volume attached to SQL Database VM.', status: 'OPEN' },
    { provider: 'GCP asia-south1', resource: 'k8s-cluster-prod-master', severity: 'MEDIUM', issue: 'Wildcard IAM Role permissions bound to Service Account.', status: 'IN_REVIEW' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Multi-Cloud Security Posture (CSPM)"
        description="Continuous risk monitoring across AWS, Microsoft Azure, and Google Cloud Platform."
        badge="AWS / Azure / GCP"
      />

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Active Cloud Security Misconfigurations</h3>
        <div className="space-y-3">
          {misconfigs.map((m, i) => (
            <div key={i} className="p-4 rounded-xl bg-dark-900 border border-dark-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`badge ${m.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'}`}>{m.severity}</span>
                  <span className="text-xs font-bold text-white">{m.provider}</span>
                  <span className="text-[11px] text-cyber-400 font-mono">({m.resource})</span>
                </div>
                <p className="text-xs text-dark-300">{m.issue}</p>
              </div>
              <button className="btn-secondary text-[11px] py-1.5 px-3">Remediate in AWS</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
