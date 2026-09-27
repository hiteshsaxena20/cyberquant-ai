import { Building2, TrendingUp, Shield } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { mockBusinessUnits } from '../../data/mockData';
import { formatINR } from '../../api/client';

export default function BusinessUnitsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Business Unit Risk Breakdown"
        description="Allocate risk budgets, track Expected Annual Loss per division, and manage BU security owners."
        badge={`${mockBusinessUnits.length} Enterprise Divisions`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBusinessUnits.map((bu) => (
          <div key={bu.id} className="glass-card p-6 space-y-4 hover:border-cyber-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="badge badge-low text-[10px]">{bu.total_assets} Assets</span>
                <h3 className="text-lg font-bold text-white mt-1">{bu.name}</h3>
                <p className="text-xs text-dark-400 mt-0.5">{bu.head}</p>
              </div>
              <span className={`text-xl font-extrabold ${bu.risk_score >= 80 ? 'text-red-400' : 'text-amber-400'}`}>
                {bu.risk_score} / 100
              </span>
            </div>

            <div className="p-3 rounded-xl bg-dark-900 border border-dark-800 space-y-1">
              <span className="text-[10px] text-dark-400 font-semibold uppercase">Expected Annual Loss (EAL)</span>
              <p className="text-xl font-bold text-red-400">{formatINR(bu.eal)}</p>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 text-dark-300">
              <span>Compliance Index: <strong className="text-green-400">{bu.compliance_score}%</strong></span>
              <span>Allocated Budget: <strong className="text-white">{formatINR(bu.budget_allocated)}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
