import { Link } from 'react-router-dom';
import {
  Shield, ArrowRight, Activity, DollarSign, Cpu, Flame, Bot,
  TrendingDown, CheckCircle2, Lock, FileText, ChevronRight, BarChart3, Globe
} from 'lucide-react';
import { formatINR } from '../../api/client';
import { mockEnterpriseRisk } from '../../data/mockData';

export default function LandingPage() {
  return (
    <div className="space-y-24 py-12 animate-fade-in">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-cyber-500/30 text-xs font-semibold text-cyber-300">
          <div className="w-2 h-2 rounded-full bg-cyber-400 animate-pulse" />
          <span>CyberTwinX AI 2.4 — Next-Gen Cyber Risk Quantification</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-5xl mx-auto">
          Translate Cyber Threats into{' '}
          <span className="bg-gradient-to-r from-cyber-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Real Financial ₹ Exposure
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed">
          Stop guessing with qualitative high/medium/low risk matrices. CyberTwinX constructs a real-time digital twin of your enterprise assets and simulates 100,000+ FAIR Monte Carlo attack vectors to compute exact 95% Cyber VaR and Expected Annual Loss (EAL).
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/dashboard" className="btn-primary text-base py-3.5 px-8 flex items-center gap-3 shadow-xl shadow-cyber-500/25">
            <span>Explore Live Platform</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/simulator" className="btn-secondary text-base py-3.5 px-8 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>Try Attack Simulator</span>
          </Link>
        </div>

        {/* Live Risk Metrics Banner */}
        <div className="pt-12 max-w-5xl mx-auto">
          <div className="glass-card p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-left border border-cyber-500/20 shadow-2xl">
            <div>
              <p className="text-xs text-dark-400 font-semibold uppercase">Expected Annual Loss</p>
              <p className="text-2xl lg:text-3xl font-bold text-red-400 mt-1">{formatINR(mockEnterpriseRisk.total_eal)}</p>
              <span className="text-[10px] text-dark-500">FAIR LEF × LM Modeled</span>
            </div>
            <div>
              <p className="text-xs text-dark-400 font-semibold uppercase">95% Cyber VaR</p>
              <p className="text-2xl lg:text-3xl font-bold text-orange-400 mt-1">{formatINR(mockEnterpriseRisk.var_95)}</p>
              <span className="text-[10px] text-dark-500">Worst-Case Exposure</span>
            </div>
            <div>
              <p className="text-xs text-dark-400 font-semibold uppercase">Enterprise Risk Score</p>
              <p className="text-2xl lg:text-3xl font-bold text-yellow-400 mt-1">{mockEnterpriseRisk.risk_score} / 100</p>
              <span className="text-[10px] text-dark-500">High Risk Threshold</span>
            </div>
            <div>
              <p className="text-xs text-dark-400 font-semibold uppercase">Monitored Assets</p>
              <p className="text-2xl lg:text-3xl font-bold text-cyber-400 mt-1">{mockEnterpriseRisk.total_assets.toLocaleString()}</p>
              <span className="text-[10px] text-dark-500">Real-time Telemetry</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white">Enterprise Power Features</h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm">
            Everything CISOs, CFOs, and Board Directors need to justify security investments and eliminate tail risk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 space-y-4 hover:border-cyber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-cyber-500/10 text-cyber-400 flex items-center justify-center border border-cyber-500/20 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Digital Twin Graph</h3>
            <p className="text-sm text-dark-400 leading-relaxed">
              Interactive node topology linking databases, APIs, cloud resources, ERPs, and employees. See how vulnerabilities cascade across business units.
            </p>
            <Link to="/digital-twin" className="inline-flex items-center gap-1.5 text-xs text-cyber-400 font-semibold group-hover:underline">
              <span>View Digital Twin Topology</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-card p-8 space-y-4 hover:border-cyber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Attack Simulator</h3>
            <p className="text-sm text-dark-400 leading-relaxed">
              Run step-by-step simulations of Ransomware, Cloud Data Leaks, and Supply Chain exploits to calculate financial recovery costs and SLA downtime.
            </p>
            <Link to="/attack-simulator" className="inline-flex items-center gap-1.5 text-xs text-cyber-400 font-semibold group-hover:underline">
              <span>Simulate Ransomware Scenario</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-card p-8 space-y-4 hover:border-cyber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">AI CFO Advisor</h3>
            <p className="text-sm text-dark-400 leading-relaxed">
              Conversational AI trained on security ROI optimization. Ask complex financial questions and generate executive board presentations automatically.
            </p>
            <Link to="/ai-cfo" className="inline-flex items-center gap-1.5 text-xs text-cyber-400 font-semibold group-hover:underline">
              <span>Consult AI CFO</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Security Standard CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-10 lg:p-14 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-cyber-500/30 flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl">
          <div className="space-y-3 max-w-2xl text-left">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white">
              Ready to Turn Cyber Risk into a Boardroom Financial Metric?
            </h2>
            <p className="text-sm text-dark-300 leading-relaxed">
              Join enterprise CISOs, banking leaders, and risk managers who use CyberTwinX to optimize security investments and satisfy SEBI, RBI, and NIST compliance mandates.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link to="/dashboard" className="btn-primary text-sm py-3.5 px-6 whitespace-nowrap text-center">
              Launch Executive Dashboard
            </Link>
            <Link to="/contact" className="btn-secondary text-sm py-3.5 px-6 whitespace-nowrap text-center">
              Book Custom Enterprise Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
