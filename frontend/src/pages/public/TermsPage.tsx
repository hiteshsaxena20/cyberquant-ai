export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <span className="badge badge-low text-xs">Legal Documentation</span>
        <h1 className="text-3xl font-extrabold text-white">Master SaaS Terms of Service</h1>
        <p className="text-xs text-dark-400">Effective Date: September 27, 2026 | Enterprise SLA 99.9% Uptime Commitment</p>
      </div>

      <div className="glass-card p-8 space-y-6 text-xs text-dark-300 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">1. Service Provision & SLA</h3>
          <p>CyberTwinX Technologies Inc. guarantees 99.9% monthly availability for the Cyber Risk Quantification Engine. Service credits apply for any unplanned downtime exceeding SLA thresholds.</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">2. Acceptable Use & Scanning Protocols</h3>
          <p>Customers must own or possess explicit legal authorization for all IP ranges and hostnames registered within the CyberTwinX platform. Unauthorized external network probing is strictly prohibited.</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">3. Intellectual Property</h3>
          <p>The Open FAIR Monte Carlo simulation algorithms, graph topology visualizers, and AI CFO models are the exclusive intellectual property of CyberTwinX Technologies Inc.</p>
        </section>
      </div>
    </div>
  );
}
