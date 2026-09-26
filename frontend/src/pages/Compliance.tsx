import { useState, useEffect } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { CheckCircle, AlertTriangle, Shield, ExternalLink } from 'lucide-react';
import { getCompliance, formatINR } from '../api/client';

const FW_COLORS: Record<string, string> = {
  'NIST CSF 2.0': '#3b82f6',
  'ISO 27001': '#8b5cf6',
  'CIS Controls': '#22c55e',
  'RBI Cyber Security Framework': '#f97316',
  'SEBI CSCRF': '#06b6d4',
};

export default function Compliance() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFw, setSelectedFw] = useState<string | null>(null);

  useEffect(() => {
    getCompliance()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-6"><div className="h-10 bg-dark-800 rounded-xl w-48" /><div className="h-96 bg-dark-800/50 rounded-2xl" /></div>;

  const frameworks = data?.frameworks || [];
  const overall = data?.overall_posture || 0;

  // Radar data
  const radarData = frameworks.map((fw: any) => ({
    framework: fw.framework.replace('Cyber Security Framework', 'CSF').replace('Framework', ''),
    score: fw.overall_score,
    fullMark: 100,
  }));

  const selected = selectedFw ? frameworks.find((f: any) => f.framework === selectedFw) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
          Compliance
        </h1>
        <p className="text-dark-400 mt-1">Multi-framework compliance posture across NIST, ISO, CIS, RBI & SEBI</p>
      </div>

      {/* Overall Posture */}
      <div className="glass-card p-6 text-center">
        <p className="text-sm text-dark-400 mb-2">Overall Compliance Posture</p>
        <div className="relative mx-auto w-32 h-32">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" stroke="#1e293b" strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" stroke="#3383ff" strokeWidth="3"
              strokeDasharray={`${overall}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-cyber-400">
            {overall.toFixed(0)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Framework Comparison</h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="framework" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="#3383ff" fill="#3383ff" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Framework Cards */}
        <div className="space-y-3">
          {frameworks.map((fw: any, i: number) => {
            const color = FW_COLORS[fw.framework] || '#3b82f6';
            const isSelected = selectedFw === fw.framework;
            return (
              <div
                key={i}
                onClick={() => setSelectedFw(isSelected ? null : fw.framework)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-dark-800 border-cyber-500/30'
                    : 'bg-dark-800/50 border-dark-700/50 hover:border-dark-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="font-semibold text-sm">{fw.framework}</span>
                    {fw.version && <span className="text-xs text-dark-500">v{fw.version}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {fw.overall_score >= 80 ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : fw.overall_score >= 60 ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-xl font-bold" style={{ color }}>{fw.overall_score}%</span>
                  </div>
                </div>

                {fw.gap_count > 0 && (
                  <p className="text-xs text-dark-500 mt-2">
                    {fw.gap_count} categories below 75% threshold
                  </p>
                )}

                {/* Expanded category scores */}
                {isSelected && fw.category_scores && (
                  <div className="mt-4 pt-4 border-t border-dark-700/50 space-y-2">
                    {Object.entries(fw.category_scores).map(([cat, score]: [string, any]) => (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-dark-300">{cat}</span>
                          <span className={`font-mono font-semibold ${
                            score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {score}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${score}%`,
                              background: score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* References */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyber-400" />
          Framework References
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'NIST CSF 2.0', url: 'https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final', desc: 'Cybersecurity risk assessment framework' },
            { name: 'ISO/IEC 27001:2022', url: 'https://www.iso.org/standard/27001', desc: 'Information Security Management System' },
            { name: 'CIS Controls v8.1', url: 'https://www.cisecurity.org/controls/v8-1', desc: 'Prioritized cybersecurity safeguards' },
            { name: 'RBI Cyber Security Framework', url: 'https://rbi.org.in', desc: 'Reserve Bank of India guidelines' },
            { name: 'SEBI CSCRF', url: 'https://www.sebi.gov.in', desc: 'Cybersecurity & Cyber Resilience Framework' },
            { name: 'Open FAIR', url: 'https://www.opengroup.org/open-fair', desc: 'Risk quantification methodology' },
          ].map((ref, i) => (
            <a
              key={i}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-colors flex items-center justify-between group"
            >
              <div>
                <p className="text-sm font-medium text-dark-200 group-hover:text-cyber-400 transition-colors">{ref.name}</p>
                <p className="text-xs text-dark-500">{ref.desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-dark-600 group-hover:text-cyber-400 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
