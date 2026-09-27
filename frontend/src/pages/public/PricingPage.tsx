import { Link } from 'react-router-dom';
import { Check, Shield, Zap, Building } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter SaaS',
      price: '₹2,50,000',
      period: '/ month',
      assets: 'Up to 2,500 Assets',
      features: ['FAIR Risk Engine (Basic)', '5 Monte Carlo Scenarios', 'NIST CSF & ISO Auto-mapping', 'Email & Slack Support'],
      buttonText: 'Start 14-Day Trial',
      highlight: false,
    },
    {
      name: 'Enterprise Pro',
      price: '₹7,50,000',
      period: '/ month',
      assets: 'Up to 25,000 Assets',
      features: ['Interactive Digital Twin Graph', '100,000 Monte Carlo Iterations', 'AI CFO Advisor & Board Generator', 'Attack Simulator & Domino Visualizer', 'SEBI & RBI Regulatory PDF Export', '24/7 Dedicated SOC Integration'],
      buttonText: 'Deploy Enterprise Pro',
      highlight: true,
    },
    {
      name: 'Global Financial Tier',
      price: 'Custom',
      period: 'Bespoke License',
      assets: 'Unlimited Fleet & Multi-Cloud',
      features: ['Dedicated On-Premise Air-Gapped Option', 'Custom Threat Actor TTP Models', 'Executive Board Advisory Briefings', 'SLA 99.99% Uptime Guarantee'],
      buttonText: 'Contact Sales Hotline',
      highlight: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Transparent Enterprise Pricing
        </h1>
        <p className="text-sm text-dark-300">
          Scale your cyber risk quantification with predictable per-asset subscription tiers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p, i) => (
          <div
            key={i}
            className={`glass-card p-8 flex flex-col justify-between space-y-6 border transition-all ${
              p.highlight ? 'border-cyber-500 shadow-2xl shadow-cyber-500/10 scale-105' : 'border-dark-700/80'
            }`}
          >
            <div className="space-y-4">
              {p.highlight && (
                <span className="badge badge-low text-[10px] bg-cyber-500/20 text-cyber-300">
                  Most Popular for Banks
                </span>
              )}
              <h3 className="text-xl font-bold text-white">{p.name}</h3>
              <div>
                <span className="text-3xl font-extrabold text-white">{p.price}</span>
                <span className="text-xs text-dark-400 ml-1">{p.period}</span>
              </div>
              <p className="text-xs font-semibold text-cyber-400">{p.assets}</p>
              <ul className="space-y-2.5 pt-2">
                {p.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-dark-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/dashboard"
              className={p.highlight ? 'btn-primary w-full text-center text-xs py-3' : 'btn-secondary w-full text-center text-xs py-3'}
            >
              {p.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
