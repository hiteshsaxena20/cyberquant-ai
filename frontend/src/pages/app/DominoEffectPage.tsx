import { useState } from 'react';
import { GitFork, Play, RotateCcw, AlertTriangle, Shield, DollarSign, Clock, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { formatINR } from '../../api/client';

export default function DominoEffectPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [simulating, setSimulating] = useState(false);

  const steps = [
    { step: 1, name: 'Initial Vector: Spear-Phishing Credential Theft', asset: 'Executive Laptop (CISO Desk)', loss: 500000, downtime: '0.5h', description: 'Attacker harvests OAuth access tokens via malicious link.' },
    { step: 2, name: 'Lateral Pivot: Active Directory Admin Escalation', asset: 'AD Domain Controller 01', loss: 4500000, downtime: '2h', description: 'Elevated privileges acquired using Pass-the-Hash on unpatched CVE-2024-3094.' },
    { step: 3, name: 'Crown Jewels Breach: Core Retail PostgreSQL DB', asset: 'db-primary-mumbai.bank.internal', loss: 112000000, downtime: '12h', description: 'Attacker deploys ransomware payload across customer database tables.' },
    { step: 4, name: 'Upstream Cascade: UPI Gateway Shutdown', asset: 'api-gateway-upi.bank.com', loss: 74000000, downtime: '8h', description: 'Automated circuit breaker halts UPI transaction processing due to database unavailability.' },
    { step: 5, name: 'Total Business Impact: Core Banking Halt', asset: 'Entire Retail Business Unit', loss: 191000000, downtime: '22.5h Total', description: 'Regulatory reporting SLA breached; SEBI penalty and customer churn risk triggered.' },
  ];

  const handlePlay = () => {
    setSimulating(true);
    setActiveStep(0);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < steps.length) {
        setActiveStep(current);
      } else {
        clearInterval(interval);
        setSimulating(false);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Domino Effect Breach Propagation Visualizer"
        description="Analyze how a single compromised endpoint cascades into upstream business units and catastrophic financial loss."
        badge="Cascading Risk Engine"
        actions={[
          { label: simulating ? 'Simulating Propagation...' : 'Play Propagation Animation', icon: Play, onClick: handlePlay, variant: 'primary' },
          { label: 'Reset Cascade', icon: RotateCcw, onClick: () => setActiveStep(0), variant: 'secondary' },
        ]}
      />

      {/* Summary Banner */}
      <div className="glass-card p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-red-500/30">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-dark-400 uppercase font-semibold">Total Domino Financial Impact</span>
            <p className="text-2xl font-bold text-red-400">{formatINR(191000000)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-dark-400 uppercase font-semibold">Projected Outage Duration</span>
            <p className="text-2xl font-bold text-orange-400">22.5 Hours</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyber-500/10 text-cyber-400 border border-cyber-500/20">
            <GitFork className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-dark-400 uppercase font-semibold">Propagation Stages</span>
            <p className="text-2xl font-bold text-white">5 Sequential Hops</p>
          </div>
        </div>
      </div>

      {/* Stepper Timeline & Domino Progression */}
      <div className="space-y-4">
        {steps.map((st, idx) => {
          const isActive = idx === activeStep;
          const isPassed = idx < activeStep;

          return (
            <div
              key={st.step}
              onClick={() => setActiveStep(idx)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isActive
                  ? 'glass-card border-cyber-500 shadow-xl shadow-cyber-500/10 scale-[1.01]'
                  : isPassed
                  ? 'bg-dark-900/60 border-red-500/30 text-dark-300'
                  : 'glass-card border-dark-800 opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isActive
                        ? 'bg-cyber-600 text-white shadow-lg'
                        : isPassed
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-dark-800 text-dark-400'
                    }`}
                  >
                    Hop {st.step}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{st.name}</h3>
                    <p className="text-xs text-cyber-400 font-mono mt-0.5">{st.asset}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-semibold">
                  <div>
                    <span className="text-dark-400 block text-[10px] uppercase">Downtime</span>
                    <span className="text-dark-200">{st.downtime}</span>
                  </div>
                  <div>
                    <span className="text-dark-400 block text-[10px] uppercase">Stage Loss</span>
                    <span className="text-red-400 font-bold">{formatINR(st.loss)}</span>
                  </div>
                </div>
              </div>

              {isActive && (
                <div className="mt-4 pt-3 border-t border-dark-700/50 text-xs text-dark-300 leading-relaxed animate-fade-in">
                  {st.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
