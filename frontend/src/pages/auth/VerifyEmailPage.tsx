import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function VerifyEmailPage() {
  const [resent, setResent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  const handleProceed = async () => {
    await login();
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6 animate-fade-in text-center">
      <div className="w-12 h-12 rounded-2xl bg-cyber-500/15 border border-cyber-500/30 text-cyber-400 flex items-center justify-center mx-auto">
        <Mail className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white">Verify Corporate Email</h2>
        <p className="text-xs text-dark-400">
          We sent a verification link to your registered enterprise email address.
        </p>
      </div>

      <div className="p-4 rounded-xl glass-card border border-dark-700 text-xs text-dark-300 space-y-2">
        <p>Click the link in your email to verify your domain authority.</p>
        {resent && (
          <p className="text-green-400 font-medium animate-fade-in">
            ✓ A new verification link was sent to your email!
          </p>
        )}
      </div>

      <div className="space-y-3">
        <button onClick={handleProceed} className="btn-primary w-full text-sm py-3 flex items-center justify-center gap-2">
          <span>I've Verified My Email</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button onClick={handleResend} className="btn-secondary w-full text-xs py-2.5">
          Resend Verification Email
        </button>
      </div>
    </div>
  );
}
