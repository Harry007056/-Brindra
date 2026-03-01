import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/User/login', { email, password });
      localStorage.setItem('authToken', res.data.token);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F8F9F6] via-white to-[#F8F9F6]">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#5b8def]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4ade80]/5 rounded-full blur-3xl" />

      {/* Login Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-lg p-12 w-full max-w-md border border-[#E0DDD4]/50">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#4C566A] mb-2">Team Login</h1>
          <p className="text-[#8B8E7E] text-sm">Welcome back to Brindra</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#4C566A] uppercase tracking-wide mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-3 border border-[#E0DDD4]/50 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5E81AC] focus:border-[#5E81AC] text-[#4C566A] placeholder-[#8B8E7E] transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#4C566A] uppercase tracking-wide mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-[#E0DDD4]/50 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5b8def] focus:border-[#5b8def] text-[#4C566A] placeholder-[#8B8E7E] transition pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8E7E] hover:text-[#5b8def] transition text-xs font-semibold"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#5b8def] text-white font-semibold rounded-lg hover:bg-[#3d7bd4] transition shadow-md disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E0DDD4]/50" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-[#8B8E7E]">New here?</span>
          </div>
        </div>

        {/* Register Link */}
        <Link
          to="/register"
          className="block w-full py-3 px-4 border-2 border-[#E0DDD4]/50 text-[#4C566A] font-semibold rounded-lg hover:border-[#5b8def] hover:text-[#5b8def] transition text-center"
        >
          Create Account
        </Link>

        {/* Footer */}
        <p className="text-center text-xs text-[#8B8E7E] mt-6">
          By signing in, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}