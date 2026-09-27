import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Shield, Building, Key, CreditCard, Laptop, LogOut,
  CheckCircle2, Clock, Smartphone, Plus, Trash2, Sliders
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user, currentOrg, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'info' | 'org' | 'security' | 'sessions' | 'api' | 'billing'>('info');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="User Profile & Security Credentials"
        description="Manage your account profile, 2FA security, active sessions, API keys, and billing tier."
        badge="Super Administrator"
        actions={[
          { label: 'Log Out of Session', icon: LogOut, onClick: handleLogout, variant: 'danger' },
        ]}
      />

      {/* Top Identity Card */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-cyber-500/30">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyber-500 shadow-xl"
          />
          <div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-xs text-cyber-400 font-medium">{user.title}</p>
            <p className="text-xs text-dark-400 mt-0.5">{user.email} • {currentOrg}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="badge badge-low text-xs flex items-center gap-1.5 py-1 px-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>2FA Authenticated</span>
          </span>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-dark-800 pb-2 text-xs">
        {[
          { id: 'info', label: 'Personal Info', icon: User },
          { id: 'org', label: 'Organization', icon: Building },
          { id: 'security', label: 'Security & 2FA', icon: Shield },
          { id: 'sessions', label: 'Devices & Sessions', icon: Laptop },
          { id: 'api', label: 'Personal API Keys', icon: Key },
          { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
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
        {activeTab === 'info' && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="text-base font-bold text-white">Personal Details</h3>
            <div>
              <label className="block text-dark-300 font-semibold mb-1">Full Name</label>
              <input type="text" className="input-field py-2.5" defaultValue={user.name} />
            </div>
            <div>
              <label className="block text-dark-300 font-semibold mb-1">Corporate Email</label>
              <input type="email" className="input-field py-2.5" defaultValue={user.email} />
            </div>
            <div>
              <label className="block text-dark-300 font-semibold mb-1">Job Title</label>
              <input type="text" className="input-field py-2.5" defaultValue={user.title} />
            </div>
            <div>
              <label className="block text-dark-300 font-semibold mb-1">Phone Number</label>
              <input type="text" className="input-field py-2.5" defaultValue={user.phone} />
            </div>
            <button className="btn-primary text-xs py-2.5 px-5">Save Profile Changes</button>
          </div>
        )}

        {activeTab === 'org' && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="text-base font-bold text-white">Organization Details</h3>
            <div>
              <label className="block text-dark-300 font-semibold mb-1">Organization Name</label>
              <input type="text" className="input-field py-2.5" defaultValue={currentOrg} readOnly />
            </div>
            <div>
              <label className="block text-dark-300 font-semibold mb-1">Assigned Role</label>
              <input type="text" className="input-field py-2.5" defaultValue={user.role} readOnly />
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="text-base font-bold text-white">Security Credentials</h3>
            <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Two-Factor Authentication (2FA)</span>
                <span className="text-dark-400">TOTP Authenticator app enabled</span>
              </div>
              <span className="badge badge-low text-[10px]">Enabled</span>
            </div>
            <div className="pt-2">
              <label className="block text-dark-300 font-semibold mb-1">Change Account Password</label>
              <input type="password" className="input-field py-2.5 mb-2" placeholder="Current Password" />
              <input type="password" className="input-field py-2.5" placeholder="New Password" />
            </div>
            <button className="btn-primary text-xs py-2.5 px-5">Update Password</button>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Active Devices & Login Sessions</h3>
            <div className="space-y-3">
              {user.sessions.map((sess) => (
                <div key={sess.id} className="p-4 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{sess.device}</span>
                      {sess.current && <span className="badge badge-low text-[10px]">This Device</span>}
                    </div>
                    <p className="text-dark-400">{sess.location} • IP: {sess.ip} • {sess.time}</p>
                  </div>
                  {!sess.current && (
                    <button className="text-red-400 hover:underline font-semibold">Revoke</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Personal API Tokens</h3>
              <button className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Generate New Token</span>
              </button>
            </div>
            <div className="space-y-3">
              {user.api_keys.map((key) => (
                <div key={key.id} className="p-4 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{key.name}</span>
                    <span className="font-mono text-cyber-400">{key.prefix}</span>
                  </div>
                  <button className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-4 text-xs max-w-xl">
            <h3 className="text-base font-bold text-white">Subscription & Licensing</h3>
            <div className="p-4 rounded-xl glass-card border-cyber-500/30 space-y-2">
              <span className="badge badge-low text-[10px]">{user.billing.plan}</span>
              <p className="text-xl font-bold text-white">
                {user.billing.assets_used.toLocaleString()} / {user.billing.assets_licensed.toLocaleString()} Assets Licensed
              </p>
              <p className="text-dark-400">Renews on {user.billing.renew_date}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
