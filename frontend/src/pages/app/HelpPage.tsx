import { useState } from 'react';
import { HelpCircle, BookOpen, Video, LifeBuoy, Send, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

export default function HelpPage() {
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Help & Enterprise Documentation Center"
        description="Search knowledge base articles, video walkthroughs, or contact 24/7 technical support."
        badge="SLA 99.9% Support"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 space-y-3">
          <BookOpen className="w-8 h-8 text-cyber-400" />
          <h3 className="text-lg font-bold text-white">Knowledge Base</h3>
          <p className="text-xs text-dark-400 leading-relaxed">
            Guides on configuring SIEM webhooks, customizing Monte Carlo iterations, and interpreting 95% Cyber VaR.
          </p>
        </div>
        <div className="glass-card p-6 space-y-3">
          <Video className="w-8 h-8 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Video Tutorials</h3>
          <p className="text-xs text-dark-400 leading-relaxed">
            Step-by-step video walkthroughs on Digital Twin graph navigation and Ransomware simulation playback.
          </p>
        </div>
        <div className="glass-card p-6 space-y-3">
          <LifeBuoy className="w-8 h-8 text-green-400" />
          <h3 className="text-lg font-bold text-white">24/7 SOC Hotline</h3>
          <p className="text-xs text-dark-400 leading-relaxed">
            Direct priority hotline access to Senior Cyber Risk Engineers for emergency incident response.
          </p>
        </div>
      </div>

      {/* Ticket Support Form */}
      <div className="glass-card p-6 space-y-4 max-w-2xl">
        <h3 className="text-base font-bold text-white">Submit Technical Support Ticket</h3>
        {ticketSubmitted ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto" />
            <p className="text-sm font-bold text-white">Support Ticket #TK-9402 Created</p>
            <p className="text-xs text-dark-300">An engineer will respond within 15 minutes.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setTicketSubmitted(true); }} className="space-y-3 text-xs">
            <div>
              <label className="block text-dark-300 font-semibold mb-1">Issue Category</label>
              <select className="input-field py-2">
                <option>Risk Engine Calculation Query</option>
                <option>Digital Twin Node Telemetry Sync</option>
                <option>SEBI/RBI Compliance Report Formatting</option>
                <option>API & Webhook Ingestion</option>
              </select>
            </div>
            <div>
              <label className="block text-dark-300 font-semibold mb-1">Description</label>
              <textarea rows={4} className="input-field py-2" placeholder="Describe your question or technical requirement..." required />
            </div>
            <button type="submit" className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2">
              <span>Submit Priority Ticket</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
