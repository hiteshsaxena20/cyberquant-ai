import { useNavigate } from 'react-router-dom';
import { Building, Shield, ArrowRight, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function OrgSelectionPage() {
  const { availableOrgs, setOrganization, login } = useAuth();
  const navigate = useNavigate();

  const handleSelect = async (org: string) => {
    setOrganization(org);
    await login();
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-white">Select Workspace</h2>
        <p className="text-xs text-dark-400">
          Choose an enterprise environment to launch CyberTwinX
        </p>
      </div>

      <div className="space-y-2.5">
        {availableOrgs.map((org, index) => (
          <button
            key={index}
            onClick={() => handleSelect(org)}
            className="w-full p-4 rounded-xl glass-card hover:border-cyber-500/50 flex items-center justify-between text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyber-500/10 text-cyber-400 border border-cyber-500/20 group-hover:bg-cyber-500/20">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyber-300">
                  {org}
                </h4>
                <p className="text-[11px] text-dark-400">Enterprise Digital Twin Active</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-dark-500 group-hover:text-cyber-400 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      <button className="w-full p-3 rounded-xl border border-dashed border-dark-700 text-dark-400 hover:text-white hover:border-cyber-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all">
        <Plus className="w-4 h-4" />
        <span>Provision New Organization Tenant</span>
      </button>
    </div>
  );
}
