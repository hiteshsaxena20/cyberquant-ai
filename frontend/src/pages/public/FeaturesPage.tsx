import { Link } from 'react-router-dom';
import { Cpu, Flame, GitFork, Bot, Calculator, CheckCircle, Shield, ArrowRight } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    { title: 'Interactive Digital Twin Graph', desc: 'Full graph visualization of servers, cloud, apps, employees, and databases with live vulnerability telemetry.', icon: Cpu, path: '/digital-twin' },
    { title: 'FAIR Monte Carlo Risk Engine', desc: '100,000 statistical iterations calculating LEF (Loss Event Frequency) and LM (Loss Magnitude) in ₹ exposure.', icon: Shield, path: '/risk-engine' },
    { title: 'Attack Scenario Simulator', desc: 'Simulate Ransomware on Core Banking, Cloud Misconfig, and Supply Chain exploits with timeline playback.', icon: Flame, path: '/attack-simulator' },
    { title: 'Domino Effect Visualizer', desc: 'Trace lateral breach propagation from a single compromised endpoint across upstream business units.', icon: GitFork, path: '/domino-effect' },
    { title: 'AI CFO Advisory Chatbot', desc: 'Conversational assistant answering security ROI, budget optimization, and board presentation queries.', icon: Bot, path: '/ai-cfo' },
    { title: 'Investment Optimizer', desc: 'Interactive budget slider generating Pareto-optimal security control portfolios maximizing risk reduction.', icon: Calculator, path: '/investment-optimizer' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Comprehensive Cyber Risk Quantification Suite
        </h1>
        <p className="text-sm text-dark-300">
          Built for CISOs, Risk Officers, and Financial Executives managing complex enterprise IT fleets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="glass-card p-8 space-y-4 hover:border-cyber-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyber-500/10 text-cyber-400 flex items-center justify-center border border-cyber-500/20">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{f.title}</h3>
                <p className="text-xs text-dark-400 leading-relaxed">{f.desc}</p>
              </div>
              <Link to={f.path} className="inline-flex items-center gap-2 text-xs text-cyber-400 font-semibold hover:underline pt-4">
                <span>Explore Feature</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
