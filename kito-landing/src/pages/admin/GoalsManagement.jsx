import React, { useState, useEffect } from 'react';
import { Target, Save, Check, Building2, Users } from 'lucide-react';
import { useProperty } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GoalsManagement = () => {
  const { goals, setGoals } = useProperty();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [companyTargetValue, setCompanyTargetValue] = useState(goals?.companyTargetValue?.toString() || goals?.companyTarget?.toString() || '10000000000');
  const [companyTargetListing, setCompanyTargetListing] = useState(goals?.companyTargetListing?.toString() || '50');
  const [companyTargetLead, setCompanyTargetLead] = useState(goals?.companyTargetLead?.toString() || '100');

  const [agentTargetValue, setAgentTargetValue] = useState(goals?.agentTargetValue?.toString() || goals?.agentTarget?.toString() || '1000000000');
  const [agentTargetListing, setAgentTargetListing] = useState(goals?.agentTargetListing?.toString() || '5');
  const [agentTargetLead, setAgentTargetLead] = useState(goals?.agentTargetLead?.toString() || '10');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSave = () => {
    setGoals({
      companyTargetValue: parseInt(companyTargetValue.replace(/\D/g, '')) || 0,
      companyTargetListing: parseInt(companyTargetListing.replace(/\D/g, '')) || 0,
      companyTargetLead: parseInt(companyTargetLead.replace(/\D/g, '')) || 0,
      agentTargetValue: parseInt(agentTargetValue.replace(/\D/g, '')) || 0,
      agentTargetListing: parseInt(agentTargetListing.replace(/\D/g, '')) || 0,
      agentTargetLead: parseInt(agentTargetLead.replace(/\D/g, '')) || 0
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const formatCurrencyValue = (val) => {
    const num = parseInt(val.replace(/\D/g, '')) || 0;
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const handleChange = (setter) => (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setter(rawValue);
  };

  return (
    <div className="w-full pb-10 animate-fade-in-up">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-3 backdrop-blur-sm">
            <Target size={12} className="text-primary" />
            Manajemen Performa
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Target & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Goals</span>
          </h1>
          <p className="text-slate-400">Atur target pencapaian untuk perusahaan dan standar masing-masing agen.</p>
        </div>
        
        <button 
          onClick={handleSave}
          className={`px-6 py-3 font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg ${
            isSaved 
              ? 'bg-emerald-500 text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'bg-primary text-slate-900 hover:bg-yellow-400 shadow-[0_0_15px_rgba(234,202,64,0.3)]'
          }`}
        >
          {isSaved ? <><Check size={18} /> Tersimpan!</> : <><Save size={18} /> Simpan Target</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COMPANY TARGET CARD */}
        <div className="bg-slate-800/40 rounded-3xl border border-white/5 p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-primary/10 transition-colors"></div>
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Target Perusahaan</h2>
              <p className="text-xs text-slate-400">Total keseluruhan yang harus dicapai perusahaan</p>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Target Omzet (Rp)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                <input 
                  type="text" 
                  value={formatCurrencyValue(companyTargetValue)}
                  onChange={handleChange(setCompanyTargetValue)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-2xl font-extrabold text-white focus:outline-none focus:border-primary font-counting tracking-tighter"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Target Listing</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={companyTargetListing}
                    onChange={handleChange(setCompanyTargetListing)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-xl font-extrabold text-white focus:outline-none focus:border-primary font-counting tracking-tighter"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-xs">Unit</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Target Leads</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={companyTargetLead}
                    onChange={handleChange(setCompanyTargetLead)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-xl font-extrabold text-white focus:outline-none focus:border-primary font-counting tracking-tighter"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-xs">Klien</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AGENT TARGET CARD */}
        <div className="bg-slate-800/40 rounded-3xl border border-white/5 p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-500/10 transition-colors"></div>
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Target Individu Agen</h2>
              <p className="text-xs text-slate-400">Standar pencapaian yang ditugaskan per agen</p>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Target Omzet (Rp)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                <input 
                  type="text" 
                  value={formatCurrencyValue(agentTargetValue)}
                  onChange={handleChange(setAgentTargetValue)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-2xl font-extrabold text-white focus:outline-none focus:border-blue-400 font-counting tracking-tighter"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Target Listing</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={agentTargetListing}
                    onChange={handleChange(setAgentTargetListing)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-xl font-extrabold text-white focus:outline-none focus:border-blue-400 font-counting tracking-tighter"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-xs">Unit</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Target Leads</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={agentTargetLead}
                    onChange={handleChange(setAgentTargetLead)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-xl font-extrabold text-white focus:outline-none focus:border-blue-400 font-counting tracking-tighter"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-xs">Klien</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GoalsManagement;
