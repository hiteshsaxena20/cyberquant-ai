import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS: Record<string, string> = {
  'dashboard': 'Executive Dashboard',
  'digital-twin': 'Digital Twin',
  'risk-engine': 'Risk Engine',
  'attack-simulator': 'Attack Simulator',
  'domino-effect': 'Domino Effect',
  'ai-cfo': 'AI CFO Advisor',
  'investment-optimizer': 'Investment Optimizer',
  'assets': 'Asset Inventory',
  'identity': 'Identity & Access',
  'cloud': 'Cloud Security',
  'network': 'Network Topology',
  'threat-intelligence': 'Threat Intelligence',
  'business-units': 'Business Units',
  'employees': 'Employee Risk',
  'compliance': 'Compliance & Audit',
  'reports': 'Executive Reports',
  'audit': 'System Audit Logs',
  'settings': 'Settings',
  'help': 'Help & Support',
  'profile': 'User Profile',
  'risk-explorer': 'Risk Explorer',
  'risk-drivers': 'Risk Drivers',
  'optimizer': 'Investment Optimizer',
  'simulator': 'Scenario Simulator',
  'assistant': 'AI Assistant',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center text-xs text-dark-400 mb-3 space-x-1 font-medium">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-cyber-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Platform</span>
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = ROUTE_LABELS[value] || value.replace(/-/g, ' ').toUpperCase();

        return (
          <div key={to} className="flex items-center space-x-1">
            <ChevronRight className="w-3.5 h-3.5 text-dark-600 flex-shrink-0" />
            {isLast ? (
              <span className="text-dark-200 font-semibold truncate max-w-[200px]">{label}</span>
            ) : (
              <Link to={to} className="hover:text-cyber-400 transition-colors truncate max-w-[150px]">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
