import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MessageSquare, Plus, Calculator, ChevronRight, Activity, TrendingUp, Users, Search, Rocket, Wallet, DollarSign, Target, Edit3, Check } from 'lucide-react';
import { useProperty } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import AnimatedNumber from '../../components/AnimatedNumber';

const DashboardHome = () => {
  const { properties = [], leads = [], offers = [], expenses = [], goals } = useProperty();
  const { user } = useAuth();

  // Use goals from context based on role
  const targetValue = user?.role === 'admin' ? (goals?.companyTargetValue || 10000000000) : (goals?.agentTargetValue || 1000000000);
  const targetListing = user?.role === 'admin' ? (goals?.companyTargetListing || 50) : (goals?.agentTargetListing || 5);
  const targetLead = user?.role === 'admin' ? (goals?.companyTargetLead || 100) : (goals?.agentTargetLead || 10);

  const totalProperties = properties.length;
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'Baru' || l.status === 'New').length;

  const recentLeads = [...leads].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

  // --- Finance Metrics for Admin ---
  const { totalPemasukanKantor, pendingCount } = useMemo(() => {
    if (user?.role !== 'admin') return { totalPemasukanKantor: 0, pendingCount: 0 };
    
    const accepted = offers.filter(o => o.status === 'Accepted');
    const pending = accepted.filter(o => o.financeStatus !== 'Approved').length;
    const approved = accepted.filter(o => o.financeStatus === 'Approved');
    
    let pemasukan = 0;
    approved.forEach(o => {
      pemasukan += parseInt(o.nilaiPemasukan) || 0;
    });

    return { totalPemasukanKantor: pemasukan, pendingCount: pending };
  }, [offers, user]);

  const labaBersih = useMemo(() => {
    if (user?.role !== 'admin') return 0;
    const totalPengeluaran = expenses.reduce((sum, exp) => sum + (parseInt(exp.nominal) || 0), 0);
    return totalPemasukanKantor - totalPengeluaran;
  }, [expenses, totalPemasukanKantor, user]);

  // --- Agent Pending Offers ---
  const agentPendingOffers = useMemo(() => {
    if (user?.role === 'admin') return [];
    return offers.filter(o => (o.createdBy === user?.name || o.pic === user?.name) && o.status === 'Accepted' && o.financeStatus !== 'Approved');
  }, [offers, user]);

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  };

  const agentActiveLeadsCount = useMemo(() => {
    if (user?.role === 'admin') return 0;
    return leads.filter(l => (l.createdBy === user?.name || l.agentId === user?.name) && l.status !== 'Won' && l.status !== 'Gagal' && l.status !== 'Lost').length;
  }, [leads, user]);

  const agentPendingValue = useMemo(() => {
    if (user?.role === 'admin') return 0;
    return agentPendingOffers.reduce((sum, offer) => sum + (parseInt(offer.hargaOffer) || 0), 0);
  }, [agentPendingOffers, user]);

  const formatCompactCurrency = (num) => {
    if (!num) return '0';
    if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace('.0', '') + ' M';
    if (num >= 1000000) return (num / 1000000).toFixed(0) + ' Jt';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const currentAchievement = user?.role === 'admin' ? labaBersih : agentPendingValue;
  const currentListing = user?.role === 'admin' ? totalProperties : properties.filter(p => p.agen === user?.name).length;
  const currentLead = user?.role === 'admin' ? totalLeads : leads.filter(l => l.createdBy === user?.name || l.agentId === user?.name).length;

  const valueProgress = Math.min(100, Math.max(0, (currentAchievement / targetValue) * 100));
  const listingProgress = Math.min(100, Math.max(0, (currentListing / targetListing) * 100));
  const leadProgress = Math.min(100, Math.max(0, (currentLead / targetLead) * 100));

  return (
    <div className="flex flex-col min-h-[calc(100vh-7rem)] pb-6">
      
      {/* MAIN TOP SECTION (Hero + Right Widget) */}
      <div className="relative rounded-3xl mb-8">
        <div className="relative z-10 py-2 flex flex-col xl:flex-row justify-between items-center gap-8 xl:gap-12">
          
          {/* LEFT SIDE: ACTIONS */}
          <div className="flex-1 flex flex-col items-start w-full">

            <div className="mb-12">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight leading-tight">
                {user?.role === 'admin' ? (
                  <><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Pusat</span> Kendali KitoApps.</>
                ) : (
                  <><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Tingkatkan</span> Performa Anda.</>
                )}
              </h1>
              <p className="text-base text-slate-400 max-w-lg leading-relaxed">
                Akses cepat ke seluruh metrik dan perangkat manajemen {user?.role === 'admin' ? 'operasional perusahaan.' : 'klien Anda.'}
              </p>
            </div>
              
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link to="/admin/listings/add" className="w-full sm:w-auto px-5 py-3 min-h-[44px] bg-primary text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg flex items-center justify-center gap-2 text-sm">
                <Plus size={18} /> Input Listing
              </Link>
              <Link to="/admin/crm" className="w-full sm:w-auto px-5 py-3 min-h-[44px] bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 transition-colors shadow-lg flex items-center justify-center gap-2 text-sm">
                <Users size={18} /> Update Leads
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin/monitor" className="w-full sm:w-auto px-5 py-3 min-h-[44px] glass-dark text-white font-semibold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm">
                  <Activity size={18} /> Monitor Agen
                </Link>
              )}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link to="/admin/ads" className="flex-1 sm:flex-none px-5 py-3 min-h-[44px] bg-rose-500/10 text-rose-400 font-bold rounded-xl hover:bg-rose-500/20 transition-colors border border-rose-500/20 flex items-center justify-center gap-2 text-sm shadow-md">
                  <Rocket size={18} /> Luncurkan Iklan
                </Link>
                <Link to="/admin/properties" className="p-3 w-11 h-11 glass-dark text-slate-300 rounded-xl hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center" title="Cari Data Properti">
                  <Search size={20} />
                </Link>
                <Link to="/admin/valuation" className="p-3 w-11 h-11 glass-dark text-slate-300 rounded-xl hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center group" title="Kalkulator Valuasi">
                  <div className="relative flex items-center justify-center">
                    <Calculator size={20} />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-800 group-hover:border-slate-700 transition-colors">
                      <DollarSign size={10} className="text-slate-900" strokeWidth={4} />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: STATS & FINANCE / PENDING OFFERS */}
          <div className="w-full xl:w-auto shrink-0 flex flex-col gap-6">
            
            {/* Shapeless Stats (Moved above widget) */}
            <div className="flex flex-wrap items-center gap-6 xl:gap-10 justify-start xl:justify-end">
              
              {user?.role === 'admin' ? (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                      <Building2 size={16} className="text-primary" />
                      <span className="text-xs font-semibold uppercase tracking-widest">Total Properti</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-5xl lg:text-6xl font-extrabold text-white leading-none font-counting tabular-nums tracking-tighter"><AnimatedNumber value={totalProperties} /></h3>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 uppercase">
                        <TrendingUp size={10} /> Aktif
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                      <Users size={16} className="text-blue-400" />
                      <span className="text-xs font-semibold uppercase tracking-widest">Leads Klien</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-5xl lg:text-6xl font-extrabold text-white leading-none font-counting tabular-nums tracking-tighter"><AnimatedNumber value={totalLeads} /></h3>
                      <span className="text-[10px] text-blue-400 font-bold flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20 uppercase">
                        <Activity size={10} /> Hot
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                      <Wallet size={16} className="text-amber-400" />
                      <span className="text-xs font-semibold uppercase tracking-widest">Nilai Pending</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-5xl lg:text-6xl font-extrabold text-white leading-none font-counting tabular-nums tracking-tighter">{formatCompactCurrency(agentPendingValue)}</h3>
                      <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20 uppercase">
                        Proses ACC
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                      <Activity size={16} className="text-emerald-400" />
                      <span className="text-xs font-semibold uppercase tracking-widest">Prospek Aktif</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-5xl lg:text-6xl font-extrabold text-white leading-none font-counting tabular-nums tracking-tighter"><AnimatedNumber value={agentActiveLeadsCount} /></h3>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 uppercase">
                        Berjalan
                      </span>
                    </div>
                  </div>
                </>
              )}

            </div>

            {user?.role === 'admin' ? (
              <div className="glass-dark rounded-2xl p-6 relative overflow-hidden group w-full xl:w-80 xl:ml-auto">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-3 mb-5 relative z-10">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shadow-inner"><Wallet size={18} /></div>
                  <h2 className="font-bold text-white text-sm tracking-wide">Ringkasan Keuangan</h2>
                </div>
                <div className="space-y-4 relative z-10">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Laba Bersih Kas</p>
                    <p className={`text-2xl font-bold font-counting tabular-nums tracking-tighter ${labaBersih >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <AnimatedNumber value={labaBersih} formatter={formatCurrency} />
                    </p>
                  </div>
                  {pendingCount > 0 && (
                    <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-2.5 rounded-lg flex justify-between items-center">
                      <span className="text-xs text-amber-400 flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span> Menunggu ACC
                      </span>
                      <span className="text-sm font-extrabold text-white font-counting"><AnimatedNumber value={pendingCount} /></span>
                    </div>
                  )}
                  <Link to="/admin/finance" className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 mt-2 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/20">
                    Lihat Laporan Lengkap <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              agentPendingOffers.length > 0 && (
                <div className="bg-gradient-to-b from-amber-900/20 to-slate-900/60 border border-amber-500/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden w-full xl:w-80 xl:ml-auto">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="flex items-center gap-2 mb-4 relative z-10">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                    <h2 className="font-bold text-amber-400 text-sm tracking-wide">Menunggu ACC Finance</h2>
                  </div>
                  <div className="space-y-2 relative z-10 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {agentPendingOffers.map(offer => {
                      const lead = leads.find(l => l.id === offer.leadId);
                      return (
                        <div key={offer.id} className="bg-white/5 border border-white/5 rounded-lg p-3 flex justify-between items-center hover:bg-white/10 transition-colors cursor-default">
                          <div>
                            <div className="font-bold text-white text-xs">{lead?.name || 'Klien'}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{offer.tanggalOffer ? new Date(offer.tanggalOffer).toLocaleDateString('id-ID') : '-'}</div>
                          </div>
                          <div className="font-bold text-emerald-400 text-sm font-counting tracking-tighter">{formatCurrency(offer.hargaOffer)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION (Target + Leads) */}
      <div className="w-full mt-auto pt-8 flex flex-col lg:flex-row items-end justify-between gap-8">
        
        {/* TARGET KITO WIDGET */}
        <div className="w-full lg:max-w-xs flex-1 shrink-0 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_8px_rgba(234,202,64,0.3)]">
              <Target size={16} /> {user?.role === 'admin' ? 'Goals Perusahaan' : 'Raih Bonus!'}
            </h2>
            {user?.role === 'admin' && (
              <Link to="/admin/goals" className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-slate-300 hover:text-white transition-colors">
                Atur Target
              </Link>
            )}
          </div>
          
          <div className="glass-dark rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="space-y-4 relative z-10">
              
              {/* TARGET 1: OMZET */}
              <div>
                <div className="flex items-end justify-between mb-1.5">
                  <span className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-1"><Wallet size={12} className="text-primary" /> Nilai</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-extrabold text-white font-counting tracking-tighter"><AnimatedNumber value={currentAchievement} formatter={formatCompactCurrency} /></span>
                    <span className="text-[10px] font-bold text-slate-500 font-counting">/ <AnimatedNumber value={targetValue} formatter={formatCompactCurrency} /></span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative z-10">
                  <div className="h-full bg-gradient-to-r from-primary to-yellow-200 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${valueProgress}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* TARGET 2: LISTING */}
              <div>
                <div className="flex items-end justify-between mb-1.5">
                  <span className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-1"><Building2 size={12} className="text-blue-400" /> Listing</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-extrabold text-white font-counting tracking-tighter"><AnimatedNumber value={currentListing} /></span>
                    <span className="text-[10px] font-bold text-slate-500 font-counting">/ <AnimatedNumber value={targetListing} /></span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative z-10">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${listingProgress}%` }}></div>
                </div>
              </div>

              {/* TARGET 3: LEADS */}
              <div>
                <div className="flex items-end justify-between mb-1.5">
                  <span className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-1"><Users size={12} className="text-emerald-400" /> Leads</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-extrabold text-white font-counting tracking-tighter"><AnimatedNumber value={currentLead} /></span>
                    <span className="text-[10px] font-bold text-slate-500 font-counting">/ <AnimatedNumber value={targetLead} /></span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative z-10">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${leadProgress}%` }}></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY SECTION */}
        <div className="max-w-4xl w-full flex flex-col">
          {/* Clean Leads Table */}
          <div className="flex justify-between items-end">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-t-xl bg-primary text-slate-900 shadow-[0_-4px_10px_rgba(234,202,64,0.1)]">
              <MessageSquare size={15} /> 
              <h2 className="text-xs font-extrabold uppercase tracking-widest mt-0.5">Leads Terbaru</h2>
            </div>
            <Link to="/admin/leads" className="text-xs font-bold text-primary hover:text-yellow-300 transition-colors mb-3">Lihat Semua →</Link>
          </div>
          
          <div className="glass-dark rounded-b-xl rounded-tr-xl overflow-hidden relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-white/5 tracking-widest">
                <tr>
                  <th className="px-4 py-2">Prospek</th>
                  <th className="px-4 py-2">Agen</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-right">Tanggal Masuk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentLeads.length > 0 ? recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-2">
                      <p className="font-semibold text-white text-sm">{lead.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{lead.email || lead.phone || 'Tidak ada kontak'}</p>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[9px] font-bold text-slate-300">
                          {lead.agentId ? lead.agentId.substring(0, 2).toUpperCase() : 'AG'}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-300">{lead.agentId || 'Internal'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        (lead.status === 'Baru' || lead.status === 'New') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        (lead.status === 'Diproses' || lead.status === 'Contacted' || lead.status === 'Negotiation') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {(lead.status === 'Baru' || lead.status === 'New') && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5 animate-pulse"></span>}
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-slate-400 text-[11px] text-right font-medium">
                      {new Date(lead.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-5 py-10 text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 mb-2 text-slate-500">
                        <MessageSquare size={16} />
                      </div>
                      <p className="text-slate-500 font-medium text-xs">Belum ada leads yang masuk.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
