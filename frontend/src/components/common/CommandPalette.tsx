import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, LayoutDashboard, Cpu, Flame, GitFork, Bot, Calculator,
  Server, Shield, Cloud, Network, AlertTriangle, Building2, Users,
  CheckCircle2, FileText, History, Settings, HelpCircle, User, X
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: 'Pages' | 'Assets' | 'Actions';
  path: string;
  icon: any;
}

const COMMANDS: CommandItem[] = [
  { id: '1', title: 'Executive Dashboard', category: 'Pages', path: '/dashboard', icon: LayoutDashboard },
  { id: '2', title: 'Digital Twin Graph', category: 'Pages', path: '/digital-twin', icon: Cpu },
  { id: '3', title: 'FAIR Risk Engine', category: 'Pages', path: '/risk-engine', icon: Shield },
  { id: '4', title: 'Attack Simulator', category: 'Pages', path: '/attack-simulator', icon: Flame },
  { id: '5', title: 'Domino Propagation Effect', category: 'Pages', path: '/domino-effect', icon: GitFork },
  { id: '6', title: 'AI CFO Virtual Advisor', category: 'Pages', path: '/ai-cfo', icon: Bot },
  { id: '7', title: 'Cyber Investment Optimizer', category: 'Pages', path: '/investment-optimizer', icon: Calculator },
  { id: '8', title: 'Asset Inventory & Criticality', category: 'Pages', path: '/assets', icon: Server },
  { id: '9', title: 'Identity & Access Management', category: 'Pages', path: '/identity', icon: Shield },
  { id: '10', title: 'Cloud Posture (AWS/Azure/GCP)', category: 'Pages', path: '/cloud', icon: Cloud },
  { id: '11', title: 'Network Topology & VLANs', category: 'Pages', path: '/network', icon: Network },
  { id: '12', title: 'Threat Intelligence Feeds', category: 'Pages', path: '/threat-intelligence', icon: AlertTriangle },
  { id: '13', title: 'Business Unit Financial Exposure', category: 'Pages', path: '/business-units', icon: Building2 },
  { id: '14', title: 'Employee Security & Phishing', category: 'Pages', path: '/employees', icon: Users },
  { id: '15', title: 'Compliance Standards (NIST/ISO/SEBI/RBI)', category: 'Pages', path: '/compliance', icon: CheckCircle2 },
  { id: '16', title: 'Executive PDF Reports', category: 'Pages', path: '/reports', icon: FileText },
  { id: '17', title: 'System Audit Trail Logs', category: 'Pages', path: '/audit', icon: History },
  { id: '18', title: 'Enterprise Settings', category: 'Pages', path: '/settings', icon: Settings },
  { id: '19', title: 'User Profile & API Keys', category: 'Pages', path: '/profile', icon: User },
  { id: '20', title: 'Help & Knowledge Base', category: 'Pages', path: '/help', icon: HelpCircle },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-fade-in">
      <div className="glass-card w-full max-w-2xl overflow-hidden shadow-2xl border border-dark-700/80">
        {/* Search input header */}
        <div className="flex items-center px-4 py-3 border-b border-dark-700/50">
          <Search className="w-5 h-5 text-cyber-400 mr-3" />
          <input
            type="text"
            className="w-full bg-transparent text-white placeholder-dark-400 focus:outline-none text-base"
            placeholder="Search pages, assets, threats, reports, or commands... (Press ESC to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-dark-400 text-sm">
              No matching pages or commands found for "{query}"
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-dark-800/80 text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyber-500/10 text-cyber-400 border border-cyber-500/20 group-hover:bg-cyber-500/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white group-hover:text-cyber-300">
                        {item.title}
                      </span>
                      <p className="text-xs text-dark-400">{item.path}</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-dark-500 px-2 py-0.5 rounded bg-dark-900 border border-dark-700">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-dark-950/80 border-t border-dark-800 flex items-center justify-between text-xs text-dark-400">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-dark-800 border border-dark-700 text-dark-300 font-mono text-[10px]">↵</span>
            <span>Select</span>
            <span className="px-1.5 py-0.5 rounded bg-dark-800 border border-dark-700 text-dark-300 font-mono text-[10px] ml-2">ESC</span>
            <span>Close</span>
          </div>
          <span className="text-cyber-400 font-mono text-[11px]">CyberQuant Enterprise SaaS v2.4</span>
        </div>
      </div>
    </div>
  );
}
