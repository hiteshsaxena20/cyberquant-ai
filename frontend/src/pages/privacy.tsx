import { Shield, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <span className="badge badge-low text-xs">Legal Documentation</span>
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy & Data Sovereignty</h1>
        <p className="text-xs text-dark-400">Effective Date: September 27, 2026 | Compliant with DPDP Act 2023 & GDPR</p>
      </div>

      <div className="glass-card p-8 space-y-6 text-xs text-dark-300 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">1. Information We Collect</h3>
          <p>CyberTwinX processes metadata regarding customer digital assets, IP ranges, vulnerability scan summaries, and user access logs required to construct the digital twin risk model. We do not store unencrypted customer PII or raw database payload data.</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">2. Data Sovereignty & Storage</h3>
          <p>For Indian enterprise clients, all risk telemetry and database records reside strictly within Tier-IV data centers in Mumbai (ap-south-1) in full compliance with RBI data localization directives and DPDP Act 2023.</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">3. Encryption Standards</h3>
          <p>All data in transit is encrypted using TLS 1.3 with AES-256 GCM. Data at rest is encrypted using FIPS 140-2 validated Hardware Security Modules (HSM).</p>
        </section>
      </div>
    </div>
  );
}
