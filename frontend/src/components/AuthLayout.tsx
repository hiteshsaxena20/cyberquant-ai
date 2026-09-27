import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Shield, Lock, CheckCircle2 } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-dark-950 bg-cyber-grid bg-[size:40px_40px] text-white flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyber-500 to-cyber-700 shadow-xl shadow-cyber-500/30 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-white to-cyber-300 bg-clip-text text-transparent">
            CyberTwinX
          </h1>
          <p className="text-xs text-dark-400 font-medium">
            Enterprise Cyber Risk Quantification & Financial AI
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 sm:p-8 shadow-2xl border border-dark-700/80 backdrop-blur-2xl relative">
          <Outlet />
        </div>

        {/* Security Badges Footer */}
        <div className="flex items-center justify-center gap-4 text-xs text-dark-400 font-medium pt-2">
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-cyber-400" />
            <span>256-Bit TLS Encryption</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span>SOC 2 Type II Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
