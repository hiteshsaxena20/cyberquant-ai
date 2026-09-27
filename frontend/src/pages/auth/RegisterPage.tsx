import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Building, User, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    password: '',
    agreeTerms: true,
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      await login(formData.email, formData.password);
      setLoading(false);
      navigate('/organization-selection');
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-white">Create Enterprise Account</h2>
        <p className="text-xs text-dark-400">Deploy CyberTwinX across your organization infrastructure</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-dark-300 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="input-field pl-10 text-xs py-2.5"
              placeholder="Aditya Mandloi"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-dark-300 mb-1">Corporate Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field pl-10 text-xs py-2.5"
              placeholder="ciso@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-dark-300 mb-1">Organization Name</label>
          <div className="relative">
            <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="text"
              required
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="input-field pl-10 text-xs py-2.5"
              placeholder="ABC Bank India"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-dark-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field pl-10 text-xs py-2.5"
              placeholder="Minimum 12 characters"
            />
          </div>
        </div>

        <div className="flex items-start gap-2 pt-1 text-xs text-dark-300">
          <input
            type="checkbox"
            required
            checked={formData.agreeTerms}
            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
            className="mt-0.5 rounded bg-dark-800 border-dark-600 text-cyber-500"
          />
          <span>
            I agree to the <Link to="/terms" className="text-cyber-400 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-cyber-400 hover:underline">Privacy Policy</Link>.
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-sm py-3 flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Register Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-dark-400">
        Already have an account?{' '}
        <Link to="/login" className="text-cyber-400 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
