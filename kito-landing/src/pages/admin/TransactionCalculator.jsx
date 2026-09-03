import React, { useState } from 'react';
import { FileText, Landmark, Percent } from 'lucide-react';

const formatCurrency = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

const TransactionCalculator = () => {
  const [propertyPrice, setPropertyPrice] = useState('');
  
  // KPR States
  const [dpPercent, setDpPercent] = useState('20');
  const [interestRate, setInterestRate] = useState('7.5');
  const [tenureYears, setTenureYears] = useState('15');

  // Tax States
  const [njoptkp, setNjoptkp] = useState('60000000'); // Default NJOPTKP Padang (example)

  const calculateResults = () => {
    const price = parseFloat(propertyPrice) || 0;
    
    // 1. Simulasi KPR
    const dpAmount = price * ((parseFloat(dpPercent) || 0) / 100);
    const loanAmount = price - dpAmount;
    
    const monthlyRate = ((parseFloat(interestRate) || 0) / 100) / 12;
    const totalMonths = (parseFloat(tenureYears) || 0) * 12;
    
    let monthlyInstallment = 0;
    if (monthlyRate > 0 && totalMonths > 0 && loanAmount > 0) {
      monthlyInstallment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else if (totalMonths > 0 && loanAmount > 0) {
      monthlyInstallment = loanAmount / totalMonths;
    }

    // 2. Estimasi Pajak & Biaya Transaksi
    const njoptkpVal = parseFloat(njoptkp) || 0;
    
    const bphtbBase = Math.max(0, price - njoptkpVal);
    const bphtb = bphtbBase * 0.05;

    const pph = price * 0.025;
    const notaryFee = price * 0.01;

    return {
      dpAmount,
      loanAmount,
      monthlyInstallment,
      bphtb,
      pph,
      notaryFee,
      totalBuyerCost: dpAmount + bphtb + notaryFee
    };
  };

  const results = calculateResults();

  const handleCurrencyChange = (setter, value) => {
    setter(value.replace(/\D/g, ''));
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* HEADER SECTION */}
      <div className="relative rounded-3xl overflow-hidden mb-8">
        <div className="relative z-10 py-8 lg:py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-4 backdrop-blur-sm">
              <FileText size={14} className="text-primary" />
              Financial Simulator
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
              Kalkulator <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Transaksi</span>
            </h1>
            <p className="text-slate-300 max-w-lg mb-0">
              Simulasi cicilan KPR dan estimasi pajak serta biaya transaksi jual beli secara instan dan akurat.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Input Form */}
        <div className="flex-1 space-y-6">
          
          {/* Main Price */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Harga Properti (Rp)</label>
            <div className="relative flex items-center">
              <span className="absolute left-6 text-2xl md:text-3xl font-bold text-slate-400">Rp</span>
              <input 
                type="text" value={propertyPrice ? new Intl.NumberFormat('id-ID').format(propertyPrice) : ''} onChange={(e) => handleCurrencyChange(setPropertyPrice, e.target.value)}
                className="w-full text-2xl md:text-3xl font-bold text-primary bg-slate-900/80 border border-primary/30 rounded-xl pl-16 pr-6 py-5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-600 shadow-inner" 
                placeholder="Contoh: 1.500.000.000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Simulasi KPR */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                <Landmark className="text-blue-400" />
                Parameter KPR
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Uang Muka / DP (%)</label>
                  <input 
                    type="number" min="0" max="100" value={dpPercent} onChange={(e) => setDpPercent(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all" 
                  />
                  <p className="text-xs text-blue-300 mt-2 font-medium">Estimasi DP: {formatCurrency(results.dpAmount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Suku Bunga (% per tahun)</label>
                  <input 
                    type="number" min="0" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tenor (Tahun)</label>
                  <input 
                    type="number" min="1" max="30" value={tenureYears} onChange={(e) => setTenureYears(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all" 
                  />
                </div>
              </div>
            </div>

            {/* Pajak & Legal */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                <Percent className="text-rose-400" />
                Parameter Pajak
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">NJOPTKP (Rp)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 font-medium">Rp</span>
                    <input 
                      type="text" value={njoptkp ? new Intl.NumberFormat('id-ID').format(njoptkp) : ''} onChange={(e) => handleCurrencyChange(setNjoptkp, e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none text-white transition-all" 
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Nilai Jual Objek Pajak Tidak Kena Pajak (Bervariasi tiap daerah)</p>
                </div>
                <div className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/20 mt-6">
                  <p className="text-sm text-rose-300 mb-2 font-medium">Informasi Rumus Default:</p>
                  <ul className="text-xs text-rose-200/70 list-disc pl-4 space-y-1.5">
                    <li>BPHTB (Pembeli) = 5% x (Harga - NJOPTKP)</li>
                    <li>PPh Final (Penjual) = 2.5% x Harga</li>
                    <li>Notaris = Asumsi 1% dari Harga (Bisa dinego)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          
          {/* Hasil KPR */}
          <div className="bg-blue-600/20 backdrop-blur-xl text-white rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.15)] border border-blue-500/30 p-6 md:p-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-300"><Landmark size={20}/> Hasil Simulasi KPR</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-end border-b border-blue-500/20 pb-3">
                <span className="text-blue-200 text-sm">Pokok Pinjaman</span>
                <span className="font-semibold text-lg">{formatCurrency(results.loanAmount)}</span>
              </div>
            </div>
            <div>
              <p className="text-blue-300 text-sm mb-2 uppercase tracking-wider font-semibold">Estimasi Cicilan per Bulan</p>
              <p className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-md break-words">
                {formatCurrency(results.monthlyInstallment)}
              </p>
            </div>
          </div>

          {/* Hasil Pajak */}
          <div className="bg-rose-600/20 backdrop-blur-xl text-white rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.1)] border border-rose-500/30 p-6 md:p-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-rose-300"><Percent size={20}/> Estimasi Biaya Transaksi</h2>
            <div className="space-y-5">
              <div className="border-b border-rose-500/20 pb-3">
                <p className="text-rose-200 text-xs uppercase tracking-wider mb-1">BPHTB (Pajak Pembeli)</p>
                <p className="font-semibold text-xl">{formatCurrency(results.bphtb)}</p>
              </div>
              <div className="border-b border-rose-500/20 pb-3">
                <p className="text-rose-200 text-xs uppercase tracking-wider mb-1">PPh Final (Pajak Penjual)</p>
                <p className="font-semibold text-xl">{formatCurrency(results.pph)}</p>
              </div>
              <div>
                <p className="text-rose-200 text-xs uppercase tracking-wider mb-1">Estimasi Notaris / PPAT</p>
                <p className="font-semibold text-xl">{formatCurrency(results.notaryFee)}</p>
              </div>
            </div>
          </div>

          {/* Total Dana Awal Pembeli */}
          <div className="bg-white/10 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-white/20 p-6 md:p-8">
            <p className="text-slate-300 text-sm mb-2 font-semibold uppercase tracking-wider">Total Dana Awal Pembeli</p>
            <p className="text-3xl font-extrabold text-primary mb-2 drop-shadow-md">{formatCurrency(results.totalBuyerCost)}</p>
            <p className="text-xs text-slate-400 bg-black/20 p-2 rounded-lg inline-block">DP + BPHTB + Notaris</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TransactionCalculator;
