import { useState } from 'react';
import { FileText, Download, CheckCircle2, Shield, Eye } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { formatINR } from '../../api/client';
import { mockEnterpriseRisk } from '../../data/mockData';

export default function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const reports = [
    { id: 'rep-1', name: 'Board Cyber Risk & Financial Exposure Briefing', category: 'Executive / Board', format: 'PDF (14 Pages)', updated: 'Sep 27, 2026', description: 'CISO presentation summarizing 95% Cyber VaR, Expected Annual Loss (EAL), and requested ₹3.5 Cr security budget ROI.' },
    { id: 'rep-2', name: 'SEBI & RBI Quarterly Cyber Security Compliance Audit', category: 'Regulatory Compliance', format: 'PDF (28 Pages)', updated: 'Sep 20, 2026', description: 'Complete evidence checklist for SEBI Stock Broker guidelines and RBI Cyber Security Framework for Scheduled Banks.' },
    { id: 'rep-3', name: 'Technical Vulnerability Assessment & Penetration Test (VAPT)', category: 'Technical SecOps', format: 'PDF (42 Pages)', updated: 'Sep 15, 2026', description: 'Detailed breakdown of 47 critical CVEs, CVSS scores, remediation SLAs, and network micro-segmentation status.' },
    { id: 'rep-4', name: 'FAIR Monte Carlo Risk Engine Mathematical Model Proof', category: 'Quantitative Risk', format: 'PDF (18 Pages)', updated: 'Sep 10, 2026', description: '100,000 statistical iteration loss distribution curves, LEF/LM parameters, and confidence interval proofs.' },
  ];

  const handleDownload = (id: string, name: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      // Create dummy file download link
      const blob = new Blob([`CyberTwinX Executive PDF Report: ${name}\nGenerated on: ${new Date().toISOString()}\nModeled EAL: ${formatINR(mockEnterpriseRisk.total_eal)}`], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.replace(/\s+/g, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Executive PDF Reports & Compliance Export"
        description="Generate production-ready PDF reports for Board Meetings, SEBI / RBI Auditors, and Technical SecOps."
        badge="PDF Exporter"
      />

      <div className="space-y-4">
        {reports.map((r) => (
          <div key={r.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-cyber-500/30 transition-all">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="badge badge-low text-[10px]">{r.category}</span>
                <span className="text-xs text-dark-400 font-mono">{r.format}</span>
              </div>
              <h3 className="text-base font-bold text-white">{r.name}</h3>
              <p className="text-xs text-dark-300 leading-relaxed">{r.description}</p>
              <p className="text-[10px] text-dark-500">Last updated: {r.updated}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownload(r.id, r.name)}
                disabled={downloading === r.id}
                className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 whitespace-nowrap"
              >
                {downloading === r.id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
