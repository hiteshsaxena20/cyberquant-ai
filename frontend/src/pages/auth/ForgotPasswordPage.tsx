import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
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
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-white">Reset Enterprise Password</h2>
        <p className="text-xs text-dark-400">Enter your corporate email to receive a secure recovery link</p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-2xl glass-card text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Check Your Inbox</h3>
          <p className="text-xs text-dark-300 leading-relaxed">
            We sent a password reset authorization link to <span className="text-cyber-400 font-semibold">{email}</span>.
          </p>
          <Link to="/login" className="btn-secondary w-full text-xs py-2.5 inline-block">
            Return to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark-300 mb-1">Corporate Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10 text-xs py-2.5"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-sm py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Send Recovery Email</span>
            )}
          </button>
        </form>
      )}

      <div className="text-center pt-2">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs text-dark-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
