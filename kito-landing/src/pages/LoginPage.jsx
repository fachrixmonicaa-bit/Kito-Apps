import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email.trim(), password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans p-4 relative overflow-hidden">

      {/* Animated Background Glows */}
      <div className="absolute top-[-15%] right-[-10%] w-[55%] h-[70%] bg-primary/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[45%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-40 pointer-events-none" />

      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group z-10"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Kembali ke Beranda
      </Link>

      <div className="w-full max-w-md relative z-10">

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="px-8 pt-10 pb-8 text-center border-b border-white/10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-yellow-500 mb-5 shadow-lg shadow-primary/30">
              <img src="/logo.png" alt="Kito" className="w-10 h-10 object-contain" onError={(e) => { e.target.style.display='none'; }} />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Masuk ke <span className="text-primary">KitoAdmin</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Portal internal tim Kito Apps
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">

            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 animate-fade-in">
                <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                <p className="text-rose-300 text-sm">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kitoapps.com"
                  className="w-full bg-slate-800/60 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/60 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Masuk</span>
                </>
              )}
            </button>

          </form>

          {/* Footer */}
          <div className="px-8 pb-8 text-center">
            <p className="text-slate-600 text-xs">
              Hanya untuk tim internal Kito Apps. Hubungi administrator untuk akses.
            </p>
          </div>

        </div>

        {/* Credentials hint (remove in production) */}
        <div className="mt-4 bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Default Akun (ubah setelah login)</p>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>admin@kitoapps.com</span>
              <span className="text-slate-600">kito2024admin</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>agen1@kitoapps.com</span>
              <span className="text-slate-600">kito2024agent</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
