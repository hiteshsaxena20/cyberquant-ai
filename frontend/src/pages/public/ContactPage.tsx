import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Contact Enterprise Sales & Engineering
        </h1>
        <p className="text-sm text-dark-300">
          Have questions about deploying CyberTwinX in your enterprise environment? Speak with our risk architects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">Global Headquarters</h3>
            <div className="space-y-3 text-xs text-dark-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-cyber-400" />
                <span>BKC Cyber Tower, Bandra Kurla Complex, Mumbai, Maharashtra 400051</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-400" />
                <span>+91 22 6800 9000 (Sales & Enterprise Support)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>enterprise@cybertwinx.ai</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Message Received</h3>
              <p className="text-xs text-dark-300">
                Our Senior Cyber Risk Architect will get back to you within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-dark-300 mb-1">Full Name</label>
                <input type="text" required className="input-field text-xs py-2.5" placeholder="Aditya Mandloi" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-dark-300 mb-1">Work Email</label>
                <input type="email" required className="input-field text-xs py-2.5" placeholder="ciso@company.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-dark-300 mb-1">Company / Bank</label>
                <input type="text" required className="input-field text-xs py-2.5" placeholder="ABC Bank India" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-dark-300 mb-1">Requirement Details</label>
                <textarea rows={4} required className="input-field text-xs py-2.5" placeholder="Tell us about your asset fleet, compliance goals, or custom evaluation..." />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full text-xs py-3 flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Submit Enterprise Inquiry</span><Send className="w-4 h-4" /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
