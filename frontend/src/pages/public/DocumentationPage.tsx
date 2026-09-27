import { FileText, Code, BookOpen, Terminal, CheckCircle2 } from 'lucide-react';

export default function DocumentationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          CyberTwinX Developer & API Documentation
        </h1>
        <p className="text-sm text-dark-300">
          Learn how to integrate CyberTwinX REST APIs, ingest asset telemetry, and programatically query 95% Cyber VaR.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-6 space-y-3">
          <BookOpen className="w-8 h-8 text-cyber-400" />
          <h3 className="text-lg font-bold text-white">Open FAIR Model Spec</h3>
          <p className="text-xs text-dark-400 leading-relaxed">
            Mathematical definitions of Loss Event Frequency (LEF), Threat Event Frequency (TEF), Vulnerability (V), and Loss Magnitude (LM).
          </p>
        </div>
        <div className="glass-card p-6 space-y-3">
          <Code className="w-8 h-8 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">REST & Webhook SDK</h3>
          <p className="text-xs text-dark-400 leading-relaxed">
            API key authentication, rate limits, webhooks for real-time risk alerts, and Python/Node.js SDK samples.
          </p>
        </div>
        <div className="glass-card p-6 space-y-3">
          <Terminal className="w-8 h-8 text-green-400" />
          <h3 className="text-lg font-bold text-white">SIEM & Cloud Ingestion</h3>
          <p className="text-xs text-dark-400 leading-relaxed">
            Pre-built connectors for AWS Security Hub, Azure Sentinel, CrowdStrike Falcon, Splunk, and Palo Alto Cortex.
          </p>
        </div>
      </div>
    </div>
  );
}
