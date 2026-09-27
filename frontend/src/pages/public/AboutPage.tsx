import { Shield, Target, Award, Users, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 animate-fade-in">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="badge badge-low text-xs">About CyberTwinX</span>
        <h1 className="text-4xl font-extrabold text-white">
          Revolutionizing Cyber Risk Quantification with Financial AI
        </h1>
        <p className="text-base text-dark-300 leading-relaxed">
          CyberTwinX was built by security architects and financial engineers to bridge the gap between technical vulnerability management and executive financial decision making.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-6 space-y-3">
          <Target className="w-8 h-8 text-cyber-400" />
          <h3 className="text-lg font-bold text-white">Our Mission</h3>
          <p className="text-xs text-dark-400 leading-relaxed">
            Eliminate subjective heatmaps and replace them with rigorous Open FAIR Monte Carlo probabilistic loss models measured in Indian Rupees (₹) and US Dollars ($).
          </p>
        </div>

        <div className="glass-card p-6 space-y-3">
          <Shield className="w-8 h-8 text-green-400" />
          <h3 className="text-lg font-bold text-white">Digital Twin Methodology</h3>
          <p className="text-xs text-dark-400 leading-relaxed">
            We map every IP, cloud bucket, application, and employee credential into a dynamic graph to model systemic vulnerability propagation in real time.
          </p>
        </div>

        <div className="glass-card p-6 space-y-3">
          <Award className="w-8 h-8 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Enterprise Regulatory Readiness</h3>
          <p className="text-xs text-dark-400 leading-relaxed">
            Direct auto-mapping to SEBI Cyber Security Guidelines, RBI Cyber Security Framework, NIST CSF 2.0, ISO 27001, and DPDP Act 2023.
          </p>
        </div>
      </div>
    </div>
  );
}
