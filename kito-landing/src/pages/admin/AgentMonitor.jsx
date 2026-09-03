import React, { useMemo } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { Users, TrendingUp, DollarSign, Award, Target } from 'lucide-react';

const formatCurrency = (num) => {
  if (!num) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

const AgentMonitor = () => {
  const { leads, offers } = useProperty();

  // Calculate agent stats
  const agentStats = useMemo(() => {
    const statsMap = {};

    // Process Leads
    leads.forEach(lead => {
      const agentName = lead.createdBy || 'Unknown';
      if (!statsMap[agentName]) {
        statsMap[agentName] = { name: agentName, totalLeads: 0, wonLeads: 0, totalOffers: 0, potentialValue: 0, wonValue: 0, profitContribution: 0 };
      }
      statsMap[agentName].totalLeads += 1;
      if (lead.status === 'Won') {
        statsMap[agentName].wonLeads += 1;
      }
    });

    // Process Offers
    offers.forEach(offer => {
      const agentName = offer.createdBy || offer.pic || 'Unknown';
      if (!statsMap[agentName]) {
        statsMap[agentName] = { name: agentName, totalLeads: 0, wonLeads: 0, totalOffers: 0, potentialValue: 0, wonValue: 0, profitContribution: 0 };
      }
      statsMap[agentName].totalOffers += 1;
      
      const value = parseInt(offer.hargaOffer) || 0;
      if (offer.status === 'Accepted' || offer.status === 'Submitted' || offer.status === 'Negotiation') {
        statsMap[agentName].potentialValue += value;
      }
      if (offer.status === 'Accepted') {
        statsMap[agentName].wonValue += value;
      }
      
      // Calculate Profit Contribution from Finance module
      if (offer.financeStatus === 'Approved') {
        statsMap[agentName].profitContribution += (parseInt(offer.nilaiPemasukan) || 0);
      }
    });

    return Object.values(statsMap).sort((a, b) => b.profitContribution > 0 ? b.profitContribution - a.profitContribution : b.potentialValue - a.potentialValue);
  }, [leads, offers]);

  // Aggregate totals
  const totalSystemLeads = agentStats.reduce((sum, a) => sum + a.totalLeads, 0);
  const totalSystemOffers = agentStats.reduce((sum, a) => sum + a.totalOffers, 0);
  const totalSystemValue = agentStats.reduce((sum, a) => sum + a.potentialValue, 0);

  return (
    <div className="w-full pb-10 animate-fade-in-up">
      {/* HEADER */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-3 backdrop-blur-sm">
          <Target size={12} className="text-primary" />
          Admin Exclusive
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          Monitor <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Kinerja Agen</span>
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Pantau aktivitas prospek, jumlah penawaran, dan estimasi nilai transaksi (pipeline) dari setiap agen yang bertugas secara real-time.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-dark rounded-2xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Leads Terinput</p>
            <p className="text-3xl font-black text-white">{totalSystemLeads}</p>
          </div>
        </div>

        <div className="glass-dark rounded-2xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Offers Aktif</p>
            <p className="text-3xl font-black text-white">{totalSystemOffers}</p>
          </div>
        </div>

        <div className="glass-dark rounded-2xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Potensi Nilai Transaksi</p>
            <p className="text-2xl font-black text-white">{formatCurrency(totalSystemValue)}</p>
          </div>
        </div>
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="glass-dark rounded-2xl overflow-hidden relative z-10">
        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="text-primary" /> Leaderboard Agen
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/40 border-b border-white/10 font-semibold text-slate-300 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 w-12 text-center">Rank</th>
                <th className="p-4">Nama Agen</th>
                <th className="p-4 text-center">Closing Rate</th>
                <th className="p-4 text-center">Offers Aktif</th>
                <th className="p-4 text-right">Potensi Omzet</th>
                <th className="p-4 text-right text-emerald-400">Omzet Sukses</th>
                <th className="p-4 text-right text-yellow-400">Profit KitoApps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {agentStats.length > 0 ? agentStats.map((stat, i) => {
                const closingRate = stat.totalLeads > 0 ? (stat.wonLeads / stat.totalLeads) * 100 : 0;
                
                return (
                  <tr key={stat.name} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-center">
                      {i === 0 ? <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-yellow-500 text-black font-bold text-xs shadow-[0_0_10px_rgba(234,179,8,0.5)]">1</span> : 
                       i === 1 ? <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-slate-300 text-black font-bold text-xs">2</span> :
                       i === 2 ? <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-amber-700 text-white font-bold text-xs">3</span> :
                       <span className="text-white/50">{i + 1}</span>}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white text-base">{stat.name}</div>
                      <div className="text-[10px] text-slate-500">{stat.wonLeads} dari {stat.totalLeads} Leads Berhasil</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 items-center">
                        <span className={`font-bold text-xs ${closingRate >= 20 ? 'text-emerald-400' : closingRate > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {closingRate.toFixed(1)}%
                        </span>
                        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${closingRate >= 20 ? 'bg-emerald-500' : closingRate > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                            style={{ width: `${Math.min(closingRate, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-medium text-slate-300">
                      <span className="bg-white/10 px-2 py-1 rounded-md">{stat.totalOffers}</span>
                    </td>
                    <td className="p-4 text-right font-medium text-slate-400">{formatCurrency(stat.potentialValue)}</td>
                    <td className="p-4 text-right font-medium text-slate-300">{formatCurrency(stat.wonValue)}</td>
                    <td className="p-4 text-right font-black text-yellow-400">
                      {stat.profitContribution > 0 ? `+${formatCurrency(stat.profitContribution)}` : '-'}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400">
                    <Users size={32} className="mx-auto mb-3 opacity-20" />
                    Belum ada data aktivitas agen.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default AgentMonitor;
