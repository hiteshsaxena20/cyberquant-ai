import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('aditya.mandloi@cyberquant.io');
  const [password, setPassword] = useState('••••••••••••');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(async () => {
      await login(email, password);
      setLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setTimeout(async () => {
      await login('demo.ciso@cyberquant.io', 'demo1234');
      setLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-white">Sign In to Enterprise Portal</h2>
        <p className="text-xs text-dark-400">Access your organization's real-time risk digital twin</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-dark-300 mb-1">Corporate Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10 text-xs py-2.5"
              placeholder="name@company.com"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-dark-300">Password</label>
            <Link to="/forgot-password" className="text-xs text-cyber-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10 text-xs py-2.5"
              placeholder="••••••••••••"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-dark-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded bg-dark-800 border-dark-600 text-cyber-500 focus:ring-cyber-500/50"
            />
            <span>Remember session for 30 days</span>
          </label>
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
              <span>Authenticate & Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dark-800" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-dark-900 px-3 text-dark-500 font-semibold">Or Explore Instantly</span>
        </div>
      </div>

      <button
        onClick={handleDemoLogin}
        disabled={loading}
        className="btn-secondary w-full text-xs py-2.5 flex items-center justify-center gap-2 text-cyber-300 border-cyber-500/30 hover:bg-cyber-600/10"
      >
        <Zap className="w-4 h-4 text-amber-400" />
        <span>One-Click Enterprise Demo Login</span>
      </button>

      <div className="text-center text-xs text-dark-400 pt-2">
        Don't have an enterprise account?{' '}
        <Link to="/register" className="text-cyber-400 font-semibold hover:underline">
          Request Workspace Access
        </Link>
      </div>
    </div>
  );
}
