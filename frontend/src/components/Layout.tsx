import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Shield, TrendingUp, PieChart, Calculator,
  FlaskConical, CheckCircle, MessageSquare, ChevronLeft, ChevronRight,
  Zap, Menu,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Executive Dashboard' },
  { path: '/risk-explorer', icon: TrendingUp, label: 'Risk Explorer' },
  { path: '/risk-drivers', icon: PieChart, label: 'Risk Drivers' },
  { path: '/optimizer', icon: Calculator, label: 'Investment Optimizer' },
  { path: '/simulator', icon: FlaskConical, label: 'Scenario Simulator' },
  { path: '/compliance', icon: CheckCircle, label: 'Compliance' },
  { path: '/assistant', icon: MessageSquare, label: 'AI Assistant' },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950 bg-cyber-grid bg-[size:40px_40px]">
      {/* Sidebar */}
      <aside
        className={`glass-sidebar flex flex-col transition-all duration-300 ease-in-out z-30 ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b border-dark-700/50">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-500 to-cyber-700 shadow-lg shadow-cyber-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-cyber-300 bg-clip-text text-transparent">
                CyberQuant
              </h1>
              <p className="text-[10px] text-cyber-400 font-medium tracking-wider uppercase">
                AI Risk Platform
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-cyber-600/15 text-cyber-400 border border-cyber-500/20 shadow-sm shadow-cyber-500/10'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800/60'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-dark-700/50">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 rounded-lg text-dark-500 hover:text-white hover:bg-dark-800 transition-all"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Status */}
        {!collapsed && (
          <div className="px-4 pb-4">
            <div className="glass-card p-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-dark-400">System Operational</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
