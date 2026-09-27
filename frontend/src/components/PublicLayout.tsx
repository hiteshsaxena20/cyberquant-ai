import React from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { Shield, ArrowRight, Lock, Globe, Cpu, CheckCircle } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-dark-950 bg-cyber-grid bg-[size:40px_40px] text-white flex flex-col font-sans">
      {/* Public Header */}
      <header className="sticky top-0 z-50 glass-sidebar backdrop-blur-xl border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-500 to-cyber-700 shadow-lg shadow-cyber-500/25 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-cyber-300 bg-clip-text text-transparent">
                CyberTwinX
              </span>
              <span className="text-[10px] block text-cyber-400 font-semibold tracking-widest uppercase">
                AI Risk Platform
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-dark-300">
            <NavLink to="/features" className={({ isActive }) => isActive ? 'text-cyber-400 font-semibold' : 'hover:text-white transition-colors'}>
              Features
            </NavLink>
            <NavLink to="/platform" className={({ isActive }) => isActive ? 'text-cyber-400 font-semibold' : 'hover:text-white transition-colors'}>
              Platform Architecture
            </NavLink>
            <NavLink to="/pricing" className={({ isActive }) => isActive ? 'text-cyber-400 font-semibold' : 'hover:text-white transition-colors'}>
              Pricing
            </NavLink>
            <NavLink to="/documentation" className={({ isActive }) => isActive ? 'text-cyber-400 font-semibold' : 'hover:text-white transition-colors'}>
              Docs
            </NavLink>
            <NavLink to="/blog" className={({ isActive }) => isActive ? 'text-cyber-400 font-semibold' : 'hover:text-white transition-colors'}>
              Insights Blog
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'text-cyber-400 font-semibold' : 'hover:text-white transition-colors'}>
              About
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm py-2.5 px-4">
              Sign In
            </Link>
            <Link to="/dashboard" className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2">
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-dark-800 bg-dark-900/90 text-dark-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyber-500 to-cyber-700 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">CyberTwinX</span>
            </div>
            <p className="text-sm text-dark-400 max-w-sm leading-relaxed">
              Enterprise Cyber Risk Quantification & Digital Twin Platform powered by Monte Carlo FAIR methodology. Translating technical vulnerabilities into financial ₹ exposure.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="badge badge-low text-[10px]">ISO 27001 Certified</span>
              <span className="badge badge-low text-[10px]">SOC 2 Type II</span>
              <span className="badge badge-low text-[10px]">SEBI / RBI Compliant</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/features" className="hover:text-white transition-colors">FAIR Risk Engine</Link></li>
              <li><Link to="/digital-twin" className="hover:text-white transition-colors">Digital Twin Visualizer</Link></li>
              <li><Link to="/attack-simulator" className="hover:text-white transition-colors">Attack Scenario Simulator</Link></li>
              <li><Link to="/ai-cfo" className="hover:text-white transition-colors">AI CFO Advisor</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Enterprise Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/documentation" className="hover:text-white transition-colors">Documentation & API</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Cyber Risk Blog</Link></li>
              <li><Link to="/compliance" className="hover:text-white transition-colors">Compliance Frameworks</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center & SLA</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Sales</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy (DPDP Act)</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/audit" className="hover:text-white transition-colors">Security Audit Trail</Link></li>
              <li><a href="#cookie" className="hover:text-white transition-colors">Cookie Preferences</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2026 CyberTwinX Technologies Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Mumbai</span>
              <span>•</span>
              <span>Bengaluru</span>
              <span>•</span>
              <span>Singapore</span>
              <span>•</span>
              <span>London</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
