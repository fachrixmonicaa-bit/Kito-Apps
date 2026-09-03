import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserCircle2, KeyRound, ShieldAlert, Users } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  const handleLogin = (role) => {
    login(role);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-3xl rounded-full transform translate-x-1/3 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full transform -translate-x-1/3 translate-y-1/2"></div>
      
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl border border-white/50 overflow-hidden relative z-10">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4 shadow-inner relative z-10 border border-slate-700">
            <UserCircle2 size={32} className="text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight relative z-10">Kito<span className="text-primary">Admin</span></h2>
          <p className="text-slate-400 text-sm mt-2 relative z-10">Internal Dashboard Portal</p>
        </div>
        
        <div className="p-8">
          <div className="mb-6 text-center">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Simulasi Login (RBAC)</h3>
            <p className="text-xs text-slate-400">Pilih role untuk mendemonstrasikan fitur pembatasan hak akses.</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => handleLogin('admin')}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-md flex items-center justify-between px-6 group"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-primary group-hover:scale-110 transition-transform" size={20} />
                <div className="text-left">
                  <div className="text-sm">Masuk sebagai</div>
                  <div className="text-lg leading-none mt-0.5">Administrator</div>
                </div>
              </div>
              <LogIn size={20} className="text-slate-500 group-hover:text-primary transition-colors" />
            </button>

            <button 
              onClick={() => handleLogin('agen1')}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-xl transition-all duration-300 border border-slate-200 hover:border-blue-400 shadow-sm flex items-center justify-between px-6 group"
            >
              <div className="flex items-center gap-3">
                <Users className="text-blue-500 group-hover:scale-110 transition-transform" size={20} />
                <div className="text-left">
                  <div className="text-sm font-medium text-slate-500">Masuk sebagai</div>
                  <div className="text-lg leading-none mt-0.5 text-slate-800">Agen 1</div>
                </div>
              </div>
              <LogIn size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </button>

            <button 
              onClick={() => handleLogin('agen2')}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-xl transition-all duration-300 border border-slate-200 hover:border-emerald-400 shadow-sm flex items-center justify-between px-6 group"
            >
              <div className="flex items-center gap-3">
                <Users className="text-emerald-500 group-hover:scale-110 transition-transform" size={20} />
                <div className="text-left">
                  <div className="text-sm font-medium text-slate-500">Masuk sebagai</div>
                  <div className="text-lg leading-none mt-0.5 text-slate-800">Agen 2</div>
                </div>
              </div>
              <LogIn size={20} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
