import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Cpu, Flame, GitFork, Bot, Calculator,
  Server, Shield, Cloud, Network, AlertTriangle, Building2, Users,
  CheckCircle2, FileText, History, Settings, HelpCircle, User,
  ChevronLeft, ChevronRight, Search, Bell, Sun, Moon, LogOut,
  Building, ChevronDown, Menu, X, Keyboard, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import CommandPalette from './common/CommandPalette';
import NotificationCenter from './common/NotificationCenter';
import KeyboardShortcutsModal from './common/KeyboardShortcutsModal';

const NAV_CATEGORIES = [
  {
    title: 'Core Quantification',
    items: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Executive Dashboard' },
      { path: '/digital-twin', icon: Cpu, label: 'Digital Twin' },
      { path: '/risk-engine', icon: Shield, label: 'FAIR Risk Engine' },
      { path: '/attack-simulator', icon: Flame, label: 'Attack Simulator' },
      { path: '/domino-effect', icon: GitFork, label: 'Domino Effect' },
    ],
  },
  {
    title: 'Financial Advisory',
    items: [
      { path: '/ai-cfo', icon: Bot, label: 'AI CFO Advisor' },
      { path: '/investment-optimizer', icon: Calculator, label: 'Investment Optimizer' },
    ],
  },
  {
    title: 'Posture & Threats',
    items: [
      { path: '/assets', icon: Server, label: 'Asset Inventory' },
      { path: '/identity', icon: Shield, label: 'Identity & Access' },
      { path: '/cloud', icon: Cloud, label: 'Cloud Security' },
      { path: '/network', icon: Network, label: 'Network Topology' },
      { path: '/threat-intelligence', icon: AlertTriangle, label: 'Threat Intelligence' },
    ],
  },
  {
    title: 'Governance & Audit',
    items: [
      { path: '/business-units', icon: Building2, label: 'Business Units' },
      { path: '/employees', icon: Users, label: 'Employee Risk' },
      { path: '/compliance', icon: CheckCircle2, label: 'Compliance & Audit' },
      { path: '/reports', icon: FileText, label: 'Executive Reports' },
    ],
  },
  {
    title: 'System',
    items: [
      { path: '/audit', icon: History, label: 'System Audit Logs' },
      { path: '/settings', icon: Settings, label: 'Settings' },
      { path: '/profile', icon: User, label: 'Profile & Security' },
      { path: '/help', icon: HelpCircle, label: 'Help & Docs' },
    ],
  },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  const { user, currentOrg, availableOrgs, setOrganization, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#user-profile-menu') && !target.closest('#user-profile-btn')) {
        setProfileDropdownOpen(false);
      }
      if (!target.closest('#org-select-menu') && !target.closest('#org-select-btn')) {
        setOrgDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950 bg-cyber-grid bg-[size:40px_40px] text-white">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-fade-in"
        />
      )}

      {/* Persistent Sidebar */}
      <aside
        className={`glass-sidebar flex flex-col transition-all duration-300 ease-in-out z-40 fixed lg:static inset-y-0 left-0 ${
          collapsed ? 'w-[76px]' : 'w-[260px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700/50">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-500 to-cyber-700 shadow-lg shadow-cyber-500/20 flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="animate-fade-in overflow-hidden">
                <h1 className="text-lg font-bold bg-gradient-to-r from-white via-white to-cyber-300 bg-clip-text text-transparent truncate">
                  CyberTwinX
                </h1>
                <p className="text-[10px] text-cyber-400 font-medium tracking-wider uppercase truncate">
                  Enterprise Cyber Risk AI
                </p>
              </div>
            )}
          </NavLink>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 rounded-lg text-dark-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Categories */}
        <nav className="flex-1 py-3 px-3 space-y-4 overflow-y-auto custom-scrollbar">
          {NAV_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <h3 className="px-3 text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-1">
                  {cat.title}
                </h3>
              )}
              {cat.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-cyber-600/15 text-cyber-400 border border-cyber-500/30 shadow-sm shadow-cyber-500/10 font-semibold'
                        : 'text-dark-400 hover:text-white hover:bg-dark-800/60'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-xs truncate">{item.label}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar Collapse Toggle */}
        <div className="p-3 border-t border-dark-700/50 hidden lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 rounded-lg text-dark-500 hover:text-white hover:bg-dark-800 transition-all"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Live Operational Status */}
        {!collapsed && (
          <div className="px-3 pb-3 hidden lg:block">
            <div className="glass-card p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] text-dark-300">FAIR Engine v4.2</span>
              </div>
              <span className="text-[10px] text-cyber-400 font-mono">99.9%</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Body Column */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Navbar */}
        <header className="h-16 glass-sidebar flex items-center justify-between px-4 lg:px-6 z-20 border-b border-dark-700/50 flex-shrink-0">
          {/* Left Side: Mobile Menu Button & Org Selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Org Selector */}
            <div className="relative" id="org-select-menu">
              <button
                id="org-select-btn"
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card text-xs font-medium text-dark-200 hover:border-cyber-500/40 transition-all"
              >
                <Building className="w-3.5 h-3.5 text-cyber-400" />
                <span className="max-w-[140px] sm:max-w-[180px] truncate">{currentOrg}</span>
                <ChevronDown className="w-3 h-3 text-dark-500" />
              </button>

              {orgDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 glass-card p-1 shadow-2xl border border-dark-700 z-50 animate-fade-in">
                  <div className="px-3 py-2 text-[10px] font-bold text-dark-400 uppercase border-b border-dark-800">
                    Select Workspace
                  </div>
                  {availableOrgs.map((org) => (
                    <button
                      key={org}
                      onClick={() => {
                        setOrganization(org);
                        setOrgDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        org === currentOrg
                          ? 'bg-cyber-600/20 text-cyber-300 font-semibold'
                          : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{org}</span>
                      {org === currentOrg && <div className="w-1.5 h-1.5 rounded-full bg-cyber-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Global Search trigger */}
            <button
              onClick={() => setCommandOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900/80 border border-dark-700/80 text-dark-400 text-xs hover:border-cyber-500/30 hover:text-white transition-all shadow-inner"
            >
              <Search className="w-3.5 h-3.5 text-cyber-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-dark-800 border border-dark-700 text-[10px] font-mono text-dark-300">
                ⌘K
              </kbd>
            </button>

            {/* Keyboard shortcuts */}
            <button
              onClick={() => setShortcutsOpen(true)}
              className="p-2 rounded-xl glass-card text-dark-400 hover:text-white hover:border-cyber-500/30 transition-all hidden sm:flex"
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Theme switch */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl glass-card text-dark-400 hover:text-white hover:border-cyber-500/30 transition-all"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyber-400" />}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative p-2 rounded-xl glass-card text-dark-400 hover:text-white hover:border-cyber-500/30 transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-dark-300" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                3
              </span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" id="user-profile-menu">
              <button
                id="user-profile-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl glass-card hover:border-cyber-500/40 transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-cyber-500/30"
                />
                <span className="text-xs font-semibold text-white hidden md:inline truncate max-w-[100px]">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-dark-500 hidden md:inline" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-card p-2 shadow-2xl border border-dark-700 z-50 animate-fade-in space-y-1">
                  <div className="p-3 border-b border-dark-800 space-y-1">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-cyber-400 truncate">{user.title}</p>
                    <p className="text-[10px] text-dark-400 truncate">{user.email}</p>
                  </div>
                  <NavLink
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-dark-300 hover:bg-dark-800 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-cyber-400" />
                    <span>My Account & API Keys</span>
                  </NavLink>
                  <NavLink
                    to="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-dark-300 hover:bg-dark-800 hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4 text-cyber-400" />
                    <span>Organization Settings</span>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/15 transition-colors border-t border-dark-800 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Main Content Workspace */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
      <NotificationCenter isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
      <KeyboardShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
