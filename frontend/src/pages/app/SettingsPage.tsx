import { useState } from 'react';
import { Settings, Building, Sliders, Shield, Bell, Key, Users, History } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'org' | 'appearance' | 'security' | 'integrations' | 'notifications' | 'api' | 'users'>('org');
  const { currentOrg } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Enterprise Platform Settings"
        description="Configure tenant branding, access control policies, integration credentials, and notifications."
        badge="Super Admin"
      />

      {/* Tabs Header */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-dark-800 pb-2 text-xs">
        {[
          { id: 'org', label: 'Organization', icon: Building },
          { id: 'appearance', label: 'Appearance & Theme', icon: Sliders },
          { id: 'security', label: 'Security & 2FA', icon: Shield },
          { id: 'integrations', label: 'Integrations (SIEM/Cloud)', icon: Settings },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'api', label: 'API Keys & Webhooks', icon: Key },
          { id: 'users', label: 'Users & RBAC', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyber-600/20 text-cyber-300 border border-cyber-500/30'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="glass-card p-6 space-y-6">
        {activeTab === 'org' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-base font-bold text-white">Organization Profile</h3>
            <div>
              <label className="block text-xs text-dark-300 font-semibold mb-1">Company / Tenant Name</label>
              <input type="text" className="input-field text-xs py-2.5" defaultValue={currentOrg} />
            </div>
            <div>
              <label className="block text-xs text-dark-300 font-semibold mb-1">Primary Domain</label>
              <input type="text" className="input-field text-xs py-2.5" defaultValue="abcbank.co.in" />
            </div>
            <div>
              <label className="block text-xs text-dark-300 font-semibold mb-1">Default Risk Currency</label>
              <select className="input-field text-xs py-2.5">
                <option value="INR">INR (₹ Indian Rupee)</option>
                <option value="USD">USD ($ United States Dollar)</option>
                <option value="EUR">EUR (€ Euro)</option>
              </select>
            </div>
            <button className="btn-primary text-xs py-2.5 px-5">Save Organization Settings</button>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-base font-bold text-white">Appearance & Theme Settings</h3>
            <p className="text-xs text-dark-300">Choose your preferred visual presentation theme for charts and digital twin topologies.</p>
            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-900 border border-dark-800">
              <div>
                <span className="text-sm font-bold text-white">Active Theme Mode</span>
                <p className="text-xs text-dark-400 capitalize">{theme} Mode Active</p>
              </div>
              <button onClick={toggleTheme} className="btn-secondary text-xs py-2 px-4">
                Toggle to {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-base font-bold text-white">Enterprise Security Policy</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900 border border-dark-800 text-xs cursor-pointer">
                <div>
                  <span className="text-white font-bold block">Enforce Mandatory 2FA for All Admins</span>
                  <span className="text-dark-400">Require TOTP authenticator code on login</span>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-cyber-500" />
              </label>
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900 border border-dark-800 text-xs cursor-pointer">
                <div>
                  <span className="text-white font-bold block">Session Idle Timeout</span>
                  <span className="text-dark-400">Auto sign-out after 15 minutes of inactivity</span>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-cyber-500" />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Active SIEM & Cloud Integrations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'AWS Security Hub', status: 'Connected', statusColor: 'badge-low' },
                { name: 'Azure Sentinel', status: 'Connected', statusColor: 'badge-low' },
                { name: 'CrowdStrike Falcon', status: 'Connected', statusColor: 'badge-low' },
                { name: 'Splunk Enterprise SIEM', status: 'Sync Pending', statusColor: 'badge-medium' },
                { name: 'Palo Alto Cortex XSOAR', status: 'Connected', statusColor: 'badge-low' },
              ].map((ig, i) => (
                <div key={i} className="p-4 rounded-xl bg-dark-900 border border-dark-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{ig.name}</h4>
                    <span className={`badge ${ig.statusColor} text-[10px]`}>{ig.status}</span>
                  </div>
                  <button className="text-[11px] text-cyber-400 hover:underline">Configure Sync Keys →</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-base font-bold text-white">Alert Delivery Channels</h3>
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900 border border-dark-800">
                <span className="text-white font-semibold">Email Critical Risk Alerts</span>
                <input type="checkbox" defaultChecked className="rounded text-cyber-500" />
              </label>
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900 border border-dark-800">
                <span className="text-white font-semibold">Slack / Microsoft Teams Webhook</span>
                <input type="checkbox" defaultChecked className="rounded text-cyber-500" />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Production API Keys</h3>
            <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">SIEM Telemetry Ingestion Key</span>
                <span className="badge badge-low text-[10px]">Active</span>
              </div>
              <p className="font-mono text-cyber-400">cq_live_8f9a3b2c7d1e0f4a</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Role-Based Access Control (RBAC)</h3>
            <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Aditya Mandloi</p>
                <p className="text-dark-400">aditya.mandloi@cyberquant.io • Chief Information Security Officer</p>
              </div>
              <span className="badge badge-low text-[10px]">Super Admin</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
