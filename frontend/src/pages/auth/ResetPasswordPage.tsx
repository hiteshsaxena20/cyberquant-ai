import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-white">Set New Password</h2>
        <p className="text-xs text-dark-400">Ensure your new password contains at least 12 characters</p>
      </div>

      {done ? (
        <div className="p-6 rounded-2xl glass-card text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Password Updated</h3>
          <p className="text-xs text-dark-300">Your security credentials have been updated successfully.</p>
          <button onClick={() => navigate('/login')} className="btn-primary w-full text-xs py-2.5">
            Proceed to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark-300 mb-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 text-xs py-2.5"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-300 mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field pl-10 text-xs py-2.5"
                placeholder="••••••••••••"
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
              <>
                <span>Update Credentials</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
