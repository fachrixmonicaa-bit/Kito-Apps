import React, { useState, useMemo } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Plus, Trash2, Receipt, CheckCircle, Clock, Edit2 } from 'lucide-react';

const formatCurrency = (num) => {
  if (!num) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

const FinanceDashboard = () => {
  const { offers, leads, properties, listings, expenses, addExpense, deleteExpense, updateOffer } = useProperty();

  // Tab State for Revenue List
  const [revenueTab, setRevenueTab] = useState('pending'); // 'pending' | 'approved'
  
  // Modal State for ACC
  const [isAccModalOpen, setIsAccModalOpen] = useState(false);
  const [offerToAcc, setOfferToAcc] = useState(null);
  const [accAmount, setAccAmount] = useState('');
  const [accPercentage, setAccPercentage] = useState('');

  const [formData, setFormData] = useState({
    tanggal: new Date().toLocaleDateString('en-CA'),
    kategori: 'Marketing / Iklan',
    nominal: '',
    keterangan: ''
  });

  const expenseCategories = ['Marketing / Iklan', 'Operasional Kantor', 'Gaji & Bonus', 'Transportasi', 'Lainnya'];

  // Calculations
  const { omzetTotal, totalPemasukanKantor, pendingOffers, approvedOffers } = useMemo(() => {
    const accepted = offers.filter(o => o.status === 'Accepted');
    
    const pending = accepted.filter(o => o.financeStatus !== 'Approved');
    const approved = accepted.filter(o => o.financeStatus === 'Approved');
    
    let omzet = 0;
    let pemasukan = 0;

    approved.forEach(o => {
      omzet += parseInt(o.hargaOffer) || 0;
      pemasukan += parseInt(o.nilaiPemasukan) || 0;
    });

    return { omzetTotal: omzet, totalPemasukanKantor: pemasukan, pendingOffers: pending, approvedOffers: approved };
  }, [offers]);

  const totalPengeluaran = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + (parseInt(exp.nominal) || 0), 0);
  }, [expenses]);

  const labaBersih = totalPemasukanKantor - totalPengeluaran;

  const handleCurrencyChange = (value) => {
    setFormData(prev => ({ ...prev, nominal: value.replace(/\D/g, '') }));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!formData.nominal) return;
    addExpense({
      ...formData,
      nominal: parseInt(formData.nominal)
    });
    setFormData({
      tanggal: new Date().toLocaleDateString('en-CA'),
      kategori: 'Marketing / Iklan',
      nominal: '',
      keterangan: ''
    });
  };

  const openAccModal = (offer) => {
    setOfferToAcc(offer);
    
    // If it's already approved, use existing values
    if (offer.financeStatus === 'Approved' && offer.nilaiPemasukan) {
      const amount = parseInt(offer.nilaiPemasukan);
      const hargaOffer = parseInt(offer.hargaOffer) || 1;
      const percentage = (amount / hargaOffer) * 100;
      setAccAmount(amount.toString());
      setAccPercentage(parseFloat(percentage.toFixed(2)).toString());
    } else {
      const suggestedPercentage = 3;
      const suggestedAmount = (parseInt(offer.hargaOffer) || 0) * (suggestedPercentage / 100);
      setAccPercentage(suggestedPercentage.toString());
      setAccAmount(suggestedAmount.toString());
    }
    
    setIsAccModalOpen(true);
  };

  const handlePercentageChange = (val) => {
    // Only allow numbers and max 1 decimal point
    const cleanVal = val.replace(/[^0-9.]/g, '');
    setAccPercentage(cleanVal);
    
    if (offerToAcc && cleanVal) {
      const percentage = parseFloat(cleanVal) || 0;
      const amount = Math.round((parseInt(offerToAcc.hargaOffer) || 0) * (percentage / 100));
      setAccAmount(amount.toString());
    } else {
      setAccAmount('');
    }
  };

  const handleAccAmountChange = (val) => {
    const cleanVal = val.replace(/\D/g, '');
    setAccAmount(cleanVal);
    
    if (offerToAcc && cleanVal) {
      const amount = parseInt(cleanVal) || 0;
      const hargaOffer = parseInt(offerToAcc.hargaOffer) || 1;
      const percentage = (amount / hargaOffer) * 100;
      // Format to max 2 decimal places without trailing zeros
      setAccPercentage(parseFloat(percentage.toFixed(2)).toString());
    } else {
      setAccPercentage('');
    }
  };

  const submitAcc = (e) => {
    e.preventDefault();
    if (!offerToAcc || !accAmount) return;
    
    updateOffer(offerToAcc.id, {
      financeStatus: 'Approved',
      nilaiPemasukan: parseInt(accAmount)
    });
    
    setIsAccModalOpen(false);
    setOfferToAcc(null);
    setAccAmount('');
  };

  return (
    <div className="w-full pb-10 animate-fade-in-up">
      {/* HEADER */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3 backdrop-blur-sm">
          <Wallet size={12} />
          Laporan Keuangan
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          Profit & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Loss Dashboard</span>
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Pantau omzet penjualan properti, pemasukan komisi kantor (3%), dan pengeluaran operasional untuk menghitung laba bersih perusahaan.
        </p>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <h3 className="text-slate-400 text-sm font-semibold">Omzet Penjualan (Kotor)</h3>
          </div>
          <p className="text-2xl font-black text-white pl-1">{formatCurrency(omzetTotal)}</p>
          <p className="text-xs text-slate-500 mt-2 pl-1">Total dari transaksi Accepted</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-emerald-400 text-sm font-semibold">Total Pemasukan</h3>
          </div>
          <p className="text-2xl font-black text-white pl-1 relative z-10">{formatCurrency(totalPemasukanKantor)}</p>
          <p className="text-xs text-slate-500 mt-2 pl-1 relative z-10">Pemasukan riil kantor KitoApps</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(244,63,94,0.1)] relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl transform translate-x-1/3 translate-y-1/3"></div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
            <h3 className="text-rose-400 text-sm font-semibold">Total Pengeluaran</h3>
          </div>
          <p className="text-2xl font-black text-white pl-1 relative z-10">{formatCurrency(totalPengeluaran)}</p>
          <p className="text-xs text-slate-500 mt-2 pl-1 relative z-10">Beban operasional & marketing</p>
        </div>

        <div className={`bg-gradient-to-br ${labaBersih >= 0 ? 'from-emerald-600 to-teal-800 border-emerald-400/50' : 'from-rose-600 to-red-800 border-rose-400/50'} backdrop-blur-xl border rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-center`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative z-10">
            <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-1">Net Profit (Laba Bersih)</h3>
            <p className="text-3xl font-black text-white">{formatCurrency(labaBersih)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* REVENUE LIST */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col h-full max-h-[600px]">
          <div className="p-5 border-b border-white/10 bg-white/5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="text-emerald-400" size={20} /> Pemasukan Transaksi (Offers)
            </h2>
            <div className="flex bg-slate-900/50 rounded-lg p-1">
              <button 
                onClick={() => setRevenueTab('pending')}
                className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${revenueTab === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white'}`}
              >
                <Clock size={16} /> Pengajuan ({pendingOffers.length})
              </button>
              <button 
                onClick={() => setRevenueTab('approved')}
                className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${revenueTab === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
              >
                <CheckCircle size={16} /> Approved ({approvedOffers.length})
              </button>
            </div>
          </div>

          <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
            {revenueTab === 'pending' && (
              pendingOffers.length > 0 ? (
                <div className="space-y-4">
                  {pendingOffers.map(offer => {
                    const lead = leads.find(l => l.id === offer.leadId);
                    const listing = listings.find(l => l.listingId === offer.listingId);
                    const property = listing ? properties.find(p => p.propertyId === listing.propertyId) : null;
                    
                    return (
                      <div key={offer.id} className="bg-slate-900/50 border border-amber-500/20 rounded-xl p-4 hover:border-amber-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-bold text-white">{lead?.name || 'Unknown'}</div>
                            <div className="text-xs text-slate-400">{property?.alamat || 'Unknown Property'}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-200 text-sm">Omzet: {formatCurrency(offer.hargaOffer)}</div>
                            <div className="text-[10px] text-slate-500 mt-1">PIC: {offer.createdBy || offer.pic || '-'}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => openAccModal(offer)}
                          className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold rounded-lg text-sm transition-colors border border-amber-500/30 flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} /> ACC & Masukkan Profit
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 py-10">
                  <Receipt size={40} className="mb-3 opacity-20" />
                  <p>Tidak ada pengajuan pemasukan yang tertunda.</p>
                </div>
              )
            )}

            {revenueTab === 'approved' && (
              approvedOffers.length > 0 ? (
                <div className="space-y-4">
                  {approvedOffers.map(offer => {
                    const lead = leads.find(l => l.id === offer.leadId);
                    const listing = listings.find(l => l.listingId === offer.listingId);
                    const property = listing ? properties.find(p => p.propertyId === listing.propertyId) : null;
                    
                    return (
                      <div key={offer.id} className="bg-slate-900/50 border border-emerald-500/20 rounded-xl p-4 hover:border-emerald-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold text-white">{lead?.name || 'Unknown'}</div>
                            <div className="text-xs text-slate-400">{property?.alamat || 'Unknown Property'}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-emerald-400 text-lg">+{formatCurrency(offer.nilaiPemasukan)}</div>
                            <div className="text-[10px] text-slate-500">Omzet: {formatCurrency(offer.hargaOffer)}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-xs text-slate-400">
                          <span>Tanggal: {new Date(offer.tanggalOffer).toLocaleDateString('id-ID')}</span>
                          <div className="flex items-center gap-3">
                            <span>PIC: <span className="font-semibold text-slate-300">{offer.createdBy || offer.pic || '-'}</span></span>
                            <button 
                              onClick={() => openAccModal(offer)}
                              className="text-emerald-400/70 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 p-1.5 rounded transition-colors"
                              title="Ralat Pemasukan"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 py-10">
                  <CheckCircle size={40} className="mb-3 opacity-20" />
                  <p>Belum ada transaksi yang di-ACC.</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* EXPENSES LIST & FORM */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col h-full max-h-[600px]">
          <div className="p-5 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingDown className="text-rose-400" size={20} /> Pengeluaran Kantor
            </h2>
          </div>
          
          <div className="p-5 bg-slate-900/30 border-b border-white/5">
            <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tanggal</label>
                <input type="date" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-rose-400 [color-scheme:dark]" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Kategori</label>
                <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-rose-400" required>
                  {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Nominal (Rp)</label>
                <input type="text" value={formData.nominal ? new Intl.NumberFormat('id-ID').format(formData.nominal) : ''} onChange={e => handleCurrencyChange(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-rose-400" placeholder="Contoh: 1500000" required />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <input type="text" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-rose-400" placeholder="Keterangan (contoh: Meta Ads Campaign A)" required />
                <button type="submit" className="px-4 py-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 font-bold rounded-lg transition-colors flex items-center gap-1 text-sm whitespace-nowrap">
                  <Plus size={16} /> Tambah
                </button>
              </div>
            </form>
          </div>

          <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
            {expenses.length > 0 ? (
              <div className="space-y-3">
                {expenses.map((exp) => (
                  <div key={exp.id} className="flex justify-between items-center bg-slate-900/50 border border-rose-500/10 rounded-xl p-3 hover:border-rose-500/30 transition-colors group">
                    <div>
                      <div className="font-bold text-slate-200 text-sm">{exp.keterangan}</div>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">{exp.kategori}</span>
                        <span className="text-[10px] text-slate-500">{new Date(exp.tanggal).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-bold text-rose-400">-{formatCurrency(exp.nominal)}</div>
                      <button onClick={() => deleteExpense(exp.id)} className="text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 py-10">
                <Receipt size={40} className="mb-3 opacity-20" />
                <p>Belum ada catatan pengeluaran.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ACC MODAL */}
      {isAccModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold text-white">ACC Profit Transaksi</h2>
              <button onClick={() => setIsAccModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-300 mb-6">
                Masukkan nilai riil keuntungan kotor (Gross Profit) yang masuk ke KitoApps dari transaksi ini. Komisi untuk agen bisa dicatat nanti pada kolom pengeluaran.
              </p>
              
              <form id="acc-form" onSubmit={submitAcc}>
                <div className="grid grid-cols-3 gap-4 mb-2">
                  <div className="col-span-1">
                    <label className="block text-sm font-bold text-emerald-400 mb-2">Persentase (%)</label>
                    <div className="relative flex items-center">
                      <input 
                        type="text" 
                        value={accPercentage} 
                        onChange={e => handlePercentageChange(e.target.value)} 
                        className="w-full bg-slate-800/80 border border-emerald-500/30 focus:border-emerald-500 rounded-xl pr-8 pl-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-xl font-bold" 
                        placeholder="3"
                        required 
                      />
                      <span className="absolute right-4 text-slate-400 font-medium">%</span>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-emerald-400 mb-2">Manual Setor (Rp)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-400 font-medium">Rp</span>
                      <input 
                        type="text" 
                        value={accAmount ? new Intl.NumberFormat('id-ID').format(accAmount) : ''} 
                        onChange={e => handleAccAmountChange(e.target.value)} 
                        className="w-full bg-slate-800/80 border border-emerald-500/30 focus:border-emerald-500 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-xl font-bold" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                {offerToAcc && (
                  <div className="text-xs text-slate-400 mt-2 text-right">
                    Omzet Total: <span className="font-semibold text-slate-300">{formatCurrency(offerToAcc.hargaOffer)}</span>
                  </div>
                )}
              </form>
            </div>
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsAccModalOpen(false)} className="px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">Batal</button>
              <button type="submit" form="acc-form" className="px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2">
                <CheckCircle size={18} /> Simpan & ACC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;
