import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import api, { setAuthTokens } from '../api';

export default function Login({ onLoginSuccess, onRegisterClick }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password.trim(),
      });

      const token =
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.data?.token;

      if (!token) {
        throw new Error('Token missing in login response');
      }

      const userEmail = response.data?.user?.email || email.trim();

      setAuthTokens({
        accessToken: token,
        refreshToken: response.data?.refreshToken,
        userEmail,
      });

      sessionStorage.setItem('demoUserEmail', userEmail);

      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      const message = error?.response?.data?.message || 'Login failed';
      if (error?.response?.status === 401 && message.toLowerCase().includes('invalid credentials')) {
        window.alert('Wrong password or email. Please try again.');
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background-light-sand px-4 py-8">
      <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-primary-soft-sky/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-secondary-sage-green/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-6 lg:grid-cols-[1fr_460px]">
        <motion.div
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm lg:block"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft-sky/20 px-3 py-1 text-xs font-semibold text-primary-dusty-blue">
            <Sparkles className="h-3.5 w-3.5" />
            Welcome back
          </div>
          <h1 className="mt-3 text-3xl font-bold text-accent-warm-grey">Sign in to Brindra</h1>
          <p className="mt-2 text-sm text-text-default">Access your team workspace, projects, and conversations.</p>
        </motion.div>

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="w-full rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-6 shadow-sm"
        >
          <div className="mb-5 space-y-1">
            <h2 className="text-2xl font-semibold text-accent-warm-grey">Team Login</h2>
            <p className="text-sm text-text-default">Welcome back to Brindra.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block space-y-1">
              <span className="text-xs font-medium text-text-default">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-dusty-blue" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white py-2.5 pl-10 pr-3 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
                  required
                />
              </div>
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-medium text-text-default">Password</span>
              <div className="flex rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 focus-within:border-primary-soft-sky focus-within:ring-2 focus-within:ring-primary-soft-sky/30">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-transparent py-2.5 text-sm text-accent-warm-grey outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-medium text-primary-dusty-blue transition hover:text-primary-soft-sky"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5E81AC] px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-[#88C0D0] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogIn className="h-4 w-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-text-default">
            <div className="h-px flex-1 bg-[#88C0D0]/35" />
            <span>New here?</span>
            <div className="h-px flex-1 bg-[#88C0D0]/35" />
          </div>

          {onRegisterClick ? (
            <button
              type="button"
              onClick={onRegisterClick}
              className="inline-flex w-full items-center justify-center rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-4 py-2.5 text-sm font-medium text-primary-dusty-blue transition hover:bg-background-warm-off-white"
            >
              Create Account
            </button>
          ) : (
            <Link
              to="/register"
              className="inline-flex w-full items-center justify-center rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-4 py-2.5 text-sm font-medium text-primary-dusty-blue transition hover:bg-background-warm-off-white"
            >
              Create Account
            </Link>
          )}

          <p className="mt-4 text-center text-xs text-text-default">By signing in, you agree to our Terms and Privacy Policy.</p>
        </motion.div>
      </div>
    </div>
  );
}
