import React, { useState, useEffect } from 'react';
import { Calculator, AlertCircle, HelpCircle, MapPin, ArrowRight, ArrowLeft, Edit3, FileText, Database, TrendingUp, RefreshCw, ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import { useProperty, getZonaPerkembanganCategory, predictBuildingPrice, calculateDistance } from '../../context/PropertyContext';

const formatCurrency = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

const formatPercent = (multiplier) => {
  const percent = (multiplier - 1) * 100;
  return percent > 0 ? `+${percent.toFixed(1)}%` : `${percent.toFixed(1)}%`;
};

const ValuationCalculator = () => {
  const { locations, properties, correctionFactors = {
    akses: 10, posisi: 5, legalitas: 10, kawasan: 8, perkembangan: 2.5, mitigasi: 0.35, utilitas: 0.2
  }, valuationSettings } = useProperty();
  const uniqueKecamatan = [...new Set(locations.map(l => l.kecamatan))].sort();

  // Location Selector
  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');

  // Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const [isComparing, setIsComparing] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  // Building Type Prediction
  const [jenisProperti, setJenisProperti] = useState('Rumah');
  const [kondisiProperti, setKondisiProperti] = useState('Standar');
  const [tingkatBangunan, setTingkatBangunan] = useState('1 Lantai');
  const [kedalamanTimbun, setKedalamanTimbun] = useState('1 Meter');

  useEffect(() => {
    if (jenisProperti === 'Tanah') {
      setKondisiProperti('Kavling Siap Bangun');
    } else {
      setKondisiProperti('Standar');
    }
  }, [jenisProperti]);

  // Base Parameters
  const [landArea, setLandArea] = useState('100');
  const [landPrice, setLandPrice] = useState('5000000');
  const [buildingArea, setBuildingArea] = useState('60');
  const [buildingPrice, setBuildingPrice] = useState('3500000');
  const [alamat, setAlamat] = useState('');

  // Comparables (Data Pembanding)
  const [comparablesMode, setComparablesMode] = useState('auto');
  const [comparablesCount, setComparablesCount] = useState(10);
  const [comparables, setComparables] = useState(Array(10).fill({ price: '' }));
  
  // Auto Building Price Effect
  useEffect(() => {
    if (!valuationSettings) return;
    const predicted = predictBuildingPrice(jenisProperti, kondisiProperti, tingkatBangunan, valuationSettings);
    setBuildingPrice(predicted.toString());
  }, [jenisProperti, kondisiProperti, tingkatBangunan, valuationSettings]);

  // Auto Comparables Effect
  useEffect(() => {
    if (comparablesMode === 'auto') {
      const selectedLoc = locations.find(l => l.kecamatan === kecamatan && l.kelurahan === kelurahan);

      // Evaluate properties
      const evaluated = properties.map(p => {
        const pLoc = locations.find(l => l.kecamatan === p.kecamatan && l.kelurahan === p.kelurahan);
        let dist = 9999;
        if (pLoc && selectedLoc) {
          dist = calculateDistance(selectedLoc.lat, selectedLoc.lng, pLoc.lat, pLoc.lng);
        }

        const samaKecamatan = p.kecamatan === kecamatan;
        const samaKelurahan = p.kelurahan === kelurahan;
        const samaJenis = p.jenisProperti === jenisProperti;
        const samaTingkat = p.tingkatBangunan === tingkatBangunan;
        const samaKondisi = p.kondisiProperti === kondisiProperti;

        let priority = 3;
        if (samaKecamatan && samaKelurahan) priority = 1;
        else if (samaKecamatan) priority = 2;

        let matchScore = 0;
        if (samaKelurahan) matchScore += 30;
        if (samaKecamatan) matchScore += 20;
        if (samaJenis) matchScore += 20;
        if (samaTingkat) matchScore += 15;
        if (samaKondisi) matchScore += 15;

        const targetLT = parseFloat(landArea) || 0;
        const propLT = parseFloat(p.luasTanah) || 0;
        const selisihLuas = Math.abs(propLT - targetLT);

        return { ...p, dist, priority, matchScore, selisihLuas };
      });

      // Sort and slice
      let closest = evaluated
        .filter(p => p.hargaM2) // must have a valid price
        .sort((a, b) => {
          if (a.priority !== b.priority) return a.priority - b.priority;
          if (a.priority === 3 && a.dist !== b.dist) return a.dist - b.dist;
          if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;
          return a.selisihLuas - b.selisihLuas;
        })
        .slice(0, comparablesCount);

      if (closest.length === 0) {
        // Generate Dummy Data for Demo
        for (let i = 0; i < comparablesCount; i++) {
          closest.push({
            hargaM2: (Math.random() * 2000000 + 2000000).toFixed(0).toString(),
            alamat: `Jl. Fiktif ${i + 1}, ${kelurahan || 'Padang'}`,
            dist: Number((Math.random() * 5).toFixed(1)),
            matchScore: 95 - (i * 7),
            kecamatan: kecamatan || 'Padang',
            kelurahan: kelurahan || 'Fiktif',
            jenisProperti: jenisProperti,
            tingkatBangunan: tingkatBangunan,
            kondisiProperti: kondisiProperti,
            luasTanah: (parseFloat(landArea) || 100) + (i * 10 - 20),
            luasBangunan: (parseFloat(buildingArea) || 60) + (i * 5 - 10),
            hargaJual: '1000000000'
          });
        }
      }

      const newComparables = closest.map(p => ({
          price: p.hargaM2 || '',
          alamat: p.alamat || '',
          dist: p.dist,
          matchScore: p.matchScore,
          selected: true,
          kecamatan: p.kecamatan || '',
          kelurahan: p.kelurahan || '',
          status: 'Listing',
          jenis: p.jenisProperti || '',
          tingkat: p.tingkatBangunan || '',
          kondisi: p.kondisiProperti || '',
          akses: p.aksesJalan || '',
          posisi: p.posisiObjek || '',
          lt: p.luasTanah || '',
          lb: p.luasBangunan || '',
          legalitas: p.legalitas || '',
          hargaJual: p.hargaJual || ''
      }));

      // Pad if not enough
      while (newComparables.length < comparablesCount) {
        newComparables.push({ price: '', selected: false, alamat: '', waktu: '', kecamatan: '', kelurahan: '', status: '', jenis: '', tingkat: '', kondisi: '', akses: '', posisi: '', lt: '', lb: '', legalitas: '', hargaJual: '' });
      }
      setComparables(newComparables);
    }
  }, [comparablesMode, comparablesCount, kelurahan, kecamatan, jenisProperti, locations, properties]);

  // Auto update land price using average of selected comparables
  useEffect(() => {
    const selectedLoc = locations.find(l => l.kecamatan === kecamatan && l.kelurahan === kelurahan);
    const koreksiLuasPct = selectedLoc ? (parseFloat(selectedLoc.koreksiLuas) || 1.0) : 1.0;

    const validPrices = comparables.filter(c => c.price && c.selected).map(c => {
       const basePrice = parseFloat(c.price);
       const compLT = parseFloat(c.lt) || 0;
       const targetLT = parseFloat(landArea) || 0;
       
       if (compLT > 0 && targetLT > 0) {
          const diffM2 = compLT - targetLT;
          const correctionFactor = (diffM2 / 100) * (koreksiLuasPct / 100);
          return basePrice * (1 + correctionFactor);
       }
       return basePrice;
    });

    if (validPrices.length > 0) {
      const avg = validPrices.reduce((a, b) => a + b, 0) / validPrices.length;
      setLandPrice(Math.round(avg).toString());
    } else {
      setLandPrice('0');
    }
  }, [comparables, landArea, kecamatan, kelurahan, locations]);

  const handleManualComparableChange = (index, field, value) => {
    const newComp = [...comparables];
    newComp[index] = { ...newComp[index], [field]: value };
    
    // Auto-calculate Harga per m2 if LT and Harga Jual are provided
    if ((field === 'lt' || field === 'hargaJual') && newComp[index].lt && newComp[index].hargaJual) {
      newComp[index].price = Math.round(parseFloat(newComp[index].hargaJual) / parseFloat(newComp[index].lt)).toString();
    }

    setComparables(newComp);
    // Note: Land price is automatically recalculated by the useEffect above
    // when 'comparables' state changes, so we don't need to recalculate it here.
  };

  // Correction Factors
  const [mitigasiScore, setMitigasiScore] = useState('100');
  const [utilitasScore, setUtilitasScore] = useState('100');
  const [zonaKawasan, setZonaKawasan] = useState('Permukiman Standar');
  const [zonaPerkembangan, setZonaPerkembangan] = useState('Netral');
  const [aksesJalan, setAksesJalan] = useState('Jalan Sekunder');
  const [posisiObjek, setPosisiObjek] = useState('Tengah');
  const [legalitas, setLegalitas] = useState('SHM');
  
  // Selisih Luas
  const [luasFisik, setLuasFisik] = useState('100');
  const [luasSertifikat, setLuasSertifikat] = useState('100');

  useEffect(() => {
    if (kecamatan && kelurahan) {
      const selectedLocation = locations.find(
        loc => loc.kecamatan === kecamatan && loc.kelurahan === kelurahan
      );
      if (selectedLocation) {
        setMitigasiScore(selectedLocation.mitigasi.toString());
        setUtilitasScore(selectedLocation.utilitas.toString());
        setZonaKawasan(selectedLocation.kawasan);
        setZonaPerkembangan(getZonaPerkembanganCategory(selectedLocation.bobot));
      }
    }
  }, [kelurahan, kecamatan, locations]);

  const handleKecamatanChange = (e) => {
    setKecamatan(e.target.value);
    setKelurahan('');
  };

  // Base Options Mapping
  const options = {
    kawasan: ['Komersial Utama', 'Dekat Pusat Keramaian', 'Komersial Sekunder', 'Permukiman Standar', 'Pinggiran / Industri'],
    perkembangan: ['Puncak', 'Berkembang Pesat', 'Berkembang', 'Netral', 'Tertinggal'],
    akses: ['Jalan Utama', 'Jalan Sekunder', 'Jalan Gang', 'Tanpa Akses (Land Locked)'],
    posisi: ['Hook', 'Tengah'],
    legalitas: ['SHM', 'HGB', 'AJB/PPJB', 'Girik/Letter C']
  };

  const calculateValuation = () => {
    const lArea = parseFloat(landArea) || 0;
    const lPrice = parseFloat(landPrice) || 0;
    const bArea = parseFloat(buildingArea) || 0;
    const bPrice = parseFloat(buildingPrice) || 0;

    // Hitung Selisih Luas (%)
    const lFisik = parseFloat(luasFisik) || 0;
    const lSertif = parseFloat(luasSertifikat) || 1;
    // DITUNDA: mLuas is forced to 1.0 for now as requested.
    const mLuas = 1.0; 

    // Helper to get modifier dynamically based on settings
    const getModifier = (value, optionList, percentDropPerLevel) => {
      const index = optionList.indexOf(value);
      if (index === -1) return 1.0;
      return Math.max(0, 1.0 - (index * (percentDropPerLevel / 100)));
    };

    // Nilai Pilihan (Dynamic Multipliers)
    const vLegalitas = getModifier(legalitas, options.legalitas, correctionFactors.legalitas);
    const vPosisi = getModifier(posisiObjek, options.posisi, correctionFactors.posisi);
    const vAkses = getModifier(aksesJalan, options.akses, correctionFactors.akses);
    const vKawasan = getModifier(zonaKawasan, options.kawasan, correctionFactors.kawasan);
    const vPerkembangan = getModifier(zonaPerkembangan, options.perkembangan, correctionFactors.perkembangan);
    
    // Skor: 100 = 1.0, tiap poin di bawah 100 dipotong % per poin
    const sMitigasi = parseFloat(mitigasiScore) || 0;
    const vMitigasi = Math.max(0, 1.0 - ((100 - sMitigasi) * (correctionFactors.mitigasi / 100)));
    
    const sUtilitas = parseFloat(utilitasScore) || 0;
    const vUtilitas = Math.max(0, 1.0 - ((100 - sUtilitas) * (correctionFactors.utilitas / 100)));

    // Kalkulasi Total Faktor Koreksi (Multiplicative)
    const totalCorrection = vLegalitas * vPosisi * vAkses * vKawasan * vPerkembangan * mLuas * vMitigasi * vUtilitas;

    // Value Calculations
    let correctedLandPrice = lPrice * totalCorrection;
    
    // Land Condition Discount (Tanah) - Applied at the end
    let landConditionDiscountPct = 0;
    if (jenisProperti === 'Tanah' && valuationSettings) {
      if (kondisiProperti === 'Perbukitan') {
        landConditionDiscountPct = parseFloat(valuationSettings.tanahDiscounts['Perbukitan']) || 15;
      } else if (kondisiProperti === 'Timbun') {
        const kedalaman = parseInt(kedalamanTimbun) || 1;
        const perMeterDiscount = parseFloat(valuationSettings.tanahDiscounts['TimbunPerMeter']) || 5;
        landConditionDiscountPct = kedalaman * perMeterDiscount;
      }
      correctedLandPrice = correctedLandPrice * (1 - (landConditionDiscountPct / 100));
    }

    const totalLandValue = lArea * correctedLandPrice;
    
    const initialBuildingValue = bArea * bPrice;
    const depreciationAmount = 0;
    const currentBuildingValue = Math.max(0, initialBuildingValue - depreciationAmount);
    
    const marketValue = totalLandValue + currentBuildingValue;
    const listingPrice = marketValue * 1.075;
    const liquidationPrice = marketValue * 0.85;

    return {
      totalCorrection,
      correctedLandPrice,
      totalLandValue,
      initialBuildingValue,
      depreciationAmount,
      currentBuildingValue,
      marketValue,
      listingPrice,
      liquidationPrice,
      landConditionDiscountPct,
      factors: [
        { name: 'Legalitas', val: legalitas, mult: vLegalitas },
        { name: 'Posisi Objek', val: posisiObjek, mult: vPosisi },
        { name: 'Akses Jalan', val: aksesJalan, mult: vAkses },
        { name: 'Zona Kawasan', val: zonaKawasan, mult: vKawasan },
        { name: 'Perkembangan', val: zonaPerkembangan, mult: vPerkembangan },
        { name: 'Skor Mitigasi', val: sMitigasi.toString(), mult: vMitigasi },
        { name: 'Skor Utilitas', val: sUtilitas.toString(), mult: vUtilitas },
      ]
    };
  };

  const results = calculateValuation();

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 lg:gap-12 pt-4 pb-12 print:block print:p-0">
      
      {/* LEFT COLUMN: Header & Progress */}
      <div className="lg:w-1/2 flex flex-col justify-start print:hidden">
        <div className="lg:sticky lg:top-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-semibold mb-6 backdrop-blur-sm">
            <Calculator size={16} className="text-primary" />
            Smart Valuation Engine
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Kalkulator <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Valuasi</span>
          </h1>
          <p className="text-slate-300 text-base lg:text-lg mb-10 leading-relaxed max-w-xl">
            Estimasi nilai pasar dengan memperhitungkan faktor koreksi lokasi, legalitas, kondisi bangunan, hingga utilitas secara akurat.
          </p>
          
          {/* WIZARD PROGRESS */}
          <div className="flex flex-col gap-3 w-full lg:w-[85%] mb-8">
             <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-slate-200 text-sm font-bold uppercase tracking-widest">
                  {currentStep === 1 ? 'Lokasi Properti' : 
                   currentStep === 2 ? 'Spesifikasi Bangunan' : 
                   currentStep === 3 ? 'Legalitas & Posisi' : 
                   currentStep === 4 ? 'Data Pembanding' : 
                   'Hasil Valuasi'}
                </span>
                <span className="text-slate-400 text-sm font-semibold">Langkah {currentStep}/5</span>
             </div>
             <div className="flex gap-2 w-full">
              {[1, 2, 3, 4, 5].map(step => (
                <div 
                  key={step} 
                  onClick={() => setCurrentStep(step)}
                  className={`h-2.5 flex-1 rounded-full transition-all cursor-pointer ${currentStep >= step ? 'bg-primary shadow-[0_0_12px_rgba(234,202,64,0.6)]' : 'bg-white/10 hover:bg-white/20'}`}
                ></div>
              ))}
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Form */}
      <div className="lg:w-1/2 print:w-full">
        <div className="w-full">
          {/* WIZARD NAVIGATION BUTTONS (MOVED TO TOP) */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6 print:hidden">
            {currentStep > 1 ? (
              <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} className="px-5 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 transition-colors border border-white/5 flex items-center gap-2 text-sm">
                <ChevronLeft size={16} /> Kembali
              </button>
            ) : (
              <div></div>
            )}
            
            {currentStep < 5 ? (
              <button type="button" onClick={() => {
                  if (currentStep === 3) {
                    setIsComparing(true);
                    setCurrentStep(4);
                    setTimeout(() => setIsComparing(false), 2000);
                  } else {
                    setCurrentStep(prev => prev + 1);
                  }
              }} className="px-6 py-2.5 bg-primary/20 text-primary font-bold rounded-xl hover:bg-primary/30 transition-colors border border-primary/20 flex items-center gap-2 text-sm">
                {currentStep === 3 ? 'Compare' : 'Lanjut'} <ChevronRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={handlePrint} className="px-6 py-2.5 bg-primary text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,202,64,0.3)] flex items-center gap-2 text-sm">
                <Printer size={16} /> Export PDF
              </button>
            )}
          </div>

          {/* LOCKED SECTION CONTAINER */}
          <div className="transition-all duration-500 relative min-h-[400px]">
            
            {/* Step 1: Input Form */}
            {currentStep === 1 && (
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">

          
          {/* Lokasi Properti */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <MapPin className="text-primary" />
              Lokasi Properti
            </h2>
            
            <div className="space-y-6">
              {/* Alamat */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Alamat Lengkap</label>
                <textarea 
                  value={alamat} onChange={(e) => setAlamat(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all"
                  rows="2"
                  placeholder="Masukkan alamat properti..."
                />
              </div>

              {/* Kecamatan & Kelurahan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Kecamatan</label>
                  <select 
                    value={kecamatan} onChange={handleKecamatanChange} 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all"
                  >
                    <option value="" disabled>-- Pilih Kecamatan --</option>
                    {uniqueKecamatan.map(kec => (
                      <option key={kec} value={kec}>{kec}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Kelurahan</label>
                  <select 
                    value={kelurahan} onChange={(e) => setKelurahan(e.target.value)} 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all"
                    disabled={!kecamatan}
                  >
                    <option value="" disabled>-- Pilih Kelurahan --</option>
                    {locations.filter(loc => loc.kecamatan === kecamatan).map(loc => (
                      <option key={loc.kelurahan} value={loc.kelurahan}>{loc.kelurahan}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>
        </div>
        )}

        {/* Step 2: Spesifikasi Bangunan */}
        {currentStep === 2 && (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <Calculator className="text-primary" />
              Spesifikasi Bangunan & Tanah
            </h2>
            <div className="space-y-6">
              {/* Data Bangunan & Tanah */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Jenis Properti</label>
                  <select value={jenisProperti} onChange={e => setJenisProperti(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all text-sm">
                    <option>Rumah</option>
                    <option>Tanah</option>
                    <option>Ruko</option>
                    <option>Gudang</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tingkat Bangunan</label>
                  <select value={tingkatBangunan} onChange={e => setTingkatBangunan(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all text-sm">
                    <option>1 Lantai</option>
                    <option>1,5 Lantai</option>
                    <option>2 Lantai</option>
                    <option>2,5 Lantai</option>
                    <option>3 Lantai</option>
                    <option>3,5 Lantai</option>
                    <option>4 Lantai</option>
                    <option>4,5 Lantai</option>
                    <option>5 Lantai</option>
                    <option>&gt; 5 Lantai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Kondisi</label>
                  <select value={kondisiProperti} onChange={e => setKondisiProperti(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all text-sm">
                    {jenisProperti === 'Tanah' ? (
                      <>
                        <option>Kavling Siap Bangun</option>
                        <option>Timbun</option>
                        <option>Perbukitan</option>
                      </>
                    ) : (
                      <>
                        <option>Standar</option>
                        <option>Mewah</option>
                        <option>Baru</option>
                        <option>Perlu Renovasi</option>
                      </>
                    )}
                  </select>
                </div>
                {jenisProperti === 'Tanah' && kondisiProperti === 'Timbun' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Kedalaman Timbun</label>
                    <select value={kedalamanTimbun} onChange={e => setKedalamanTimbun(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all text-sm">
                      <option>1 Meter</option>
                      <option>2 Meter</option>
                      <option>3 Meter</option>
                      <option>4 Meter</option>
                      <option>5 Meter</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Luas Tanah (m²)</label>
                  <input 
                    type="number" value={landArea} onChange={(e) => setLandArea(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Luas Bangunan (m²)</label>
                  <input 
                    type="number" value={buildingArea} onChange={(e) => setBuildingArea(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Harga Bgn Baru/m² (Otomatis)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-blue-400/70 font-bold">Rp</span>
                    <input 
                      type="number" value={buildingPrice} onChange={(e) => setBuildingPrice(e.target.value)}
                      className="w-full bg-blue-500/10 border border-blue-500/30 font-bold text-blue-400 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        )}

        {/* Step 3: Legalitas & Posisi */}
        {currentStep === 3 && (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <FileText className="text-primary" />
              Legalitas & Kondisi Posisi
            </h2>
            <div className="space-y-6">
              {/* Data Legalitas & Posisi dll */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Posisi Objek</label>
                    <select 
                      value={posisiObjek} onChange={(e) => setPosisiObjek(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all"
                    >
                      {options.posisi.map(k => <option key={k}>{k}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Akses Jalan</label>
                    <select 
                      value={aksesJalan} onChange={(e) => setAksesJalan(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all"
                    >
                      {options.akses.map(k => <option key={k}>{k}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Legalitas</label>
                    <select 
                      value={legalitas} onChange={(e) => setLegalitas(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all"
                    >
                      {options.legalitas.map(k => <option key={k}>{k}</option>)}
                    </select>
                  </div>
              </div>

            </div>
          </div>

          {/* Bubble 2: Terintegrasi Kelurahan */}
          <div className="hidden bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <MapPin className="text-rose-400" />
              Lokasi & Faktor Kewilayahan (Terintegrasi Data)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Zona Kawasan</label>
                    <select 
                      value={zonaKawasan} onChange={(e) => setZonaKawasan(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none text-white transition-all"
                    >
                      {options.kawasan.map(k => <option key={k}>{k}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Zona Perkembangan</label>
                    <select 
                      value={zonaPerkembangan} onChange={(e) => setZonaPerkembangan(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none text-white transition-all"
                    >
                      {options.perkembangan.map(k => <option key={k}>{k}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="flex justify-between text-sm font-medium text-slate-300 mb-3">
                      <span>Skor Mitigasi Bencana</span>
                      <span className="text-blue-400 font-bold">{mitigasiScore}</span>
                    </label>
                    <input 
                      type="range" min="0" max="100" value={mitigasiScore} onChange={(e) => setMitigasiScore(e.target.value)}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-2">100 = Sangat Aman, 0 = Risiko Sangat Tinggi</p>
                  </div>

                  <div>
                    <label className="flex justify-between text-sm font-medium text-slate-300 mb-3">
                      <span>Skor Utilitas (PDAM, PLN, dll)</span>
                      <span className="text-blue-400 font-bold">{utilitasScore}</span>
                    </label>
                    <input 
                      type="range" min="0" max="100" value={utilitasScore} onChange={(e) => setUtilitasScore(e.target.value)}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <p className="text-xs text-slate-500 mt-2">100 = Sangat Lengkap, 0 = Tidak Ada</p>
                  </div>
            </div>
          </div>



        </div>
        )}

        {/* Step 4: Data Pembanding */}
        {currentStep === 4 && (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
           {isComparing ? (
             <div className="flex flex-col items-center justify-center py-32 animate-in fade-in zoom-in duration-500">
                <RefreshCw className="animate-spin text-primary mb-6" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">Menganalisis Properti...</h3>
                <p className="text-slate-400 text-center max-w-md">
                   Mencari data pembanding untuk <b>{jenisProperti}</b> di area <b>{kelurahan || kecamatan || 'sekitar'}</b> dengan algoritma matriks jarak dan spesifikasi...
                </p>
             </div>
           ) : (
             <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                  <Database className="text-emerald-400" size={18} />
                  Tabel Data Pembanding
                </h3>
                <select 
                  value={comparablesCount} onChange={e => {
                    setComparablesCount(parseInt(e.target.value));
                    setComparables(Array(parseInt(e.target.value)).fill({ price: '', alamat: '', waktu: '', kecamatan: '', kelurahan: '', status: '', jenis: '', tingkat: '', kondisi: '', akses: '', posisi: '', lt: '', lb: '', legalitas: '', hargaJual: '' }));
                  }}
                  className="bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {[3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Data</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {comparables.map((c, i) => c.price ? (
                  <div key={i} onClick={() => {
                      const newComp = [...comparables];
                      newComp[i] = { ...newComp[i], selected: !c.selected };
                      setComparables(newComp);
                    }} 
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer shadow-lg ${c.selected ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(234,202,64,0.15)]' : 'bg-slate-900/50 border-white/10 opacity-70 hover:opacity-100 hover:border-white/20'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                       <div>
                         <span className="text-[11px] font-bold text-white bg-white/10 px-2 py-1 rounded">PR-{String(i+1).padStart(3, '0')}</span>
                         {c.matchScore !== undefined && <div className="text-[10px] font-bold text-primary mt-2 flex items-center gap-1"><TrendingUp size={10} /> Kecocokan {c.matchScore}%</div>}
                       </div>
                       <input 
                         type="checkbox"
                         checked={!!c.selected}
                         readOnly
                         className="w-4 h-4 rounded border-white/20 bg-black/50 accent-primary pointer-events-none"
                       />
                    </div>
                    
                    <div className="space-y-1.5 text-[11px] text-slate-300 mb-4">
                      <div className="border-b border-white/5 pb-1 text-white font-medium line-clamp-1" title={c.alamat}>{c.alamat || 'Alamat tidak tersedia'}</div>
                      <div className="border-b border-white/5 pb-1 line-clamp-1">{c.kelurahan || '-'}, {c.kecamatan || '-'}</div>
                      <div className="flex justify-between border-b border-white/5 pb-1 mt-1">
                        <span>LB / LT:</span> 
                        <span className="font-semibold text-white">{c.lb || 0} / {c.lt || 0} m²</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-white/10">
                      <div className="text-[10px] text-slate-400 mb-1">Harga Lahan per m²</div>
                      <div className="font-bold text-emerald-400 text-sm">Rp {parseInt(c.price).toLocaleString('id-ID')}</div>
                    </div>
                  </div>
                ) : null)}
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end items-center mt-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Estimasi Harga Tanah/m² (Rp) - <i>(Terisi Otomatis)</i></label>
                    <div className="relative flex items-center max-w-xs">
                      <span className="absolute left-4 text-emerald-400/70 font-bold">Rp</span>
                      <input 
                        type="number" value={landPrice} onChange={(e) => setLandPrice(e.target.value)}
                        className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl pl-11 pr-4 py-3 font-bold text-emerald-400 outline-none transition-all" 
                      />
                    </div>
                  </div>
              </div>
           </div>
           )}
        </div>
        )}

        {/* Step 5: Hasil Valuasi */}
        {currentStep === 5 && (
        <div className="w-full animate-in fade-in slide-in-from-left-4 duration-500 pb-10">
          <div 
            className="bg-white/10 text-white rounded-2xl shadow-xl border border-primary/20 p-6 md:p-10 mb-8 print:bg-white print:text-slate-900 print:shadow-none print:border-none print:p-8 print:m-0"
            style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
          >
            
            {/* Header Cetak */}
            <div className="hidden print:flex justify-between items-center mb-8 p-6 rounded-xl bg-slate-50 relative overflow-hidden border border-slate-200">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#EACE40]"></div>
              <div className="flex flex-col pl-4">
                <div className="inline-block bg-[#EACE40]/10 rounded-full px-3 py-1 mb-3 self-start border border-[#EACE40]/30">
                   <span className="text-[10px] font-bold text-[#b39500] tracking-wider uppercase">Laporan Penilaian</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-black mb-1">Ringkasan Eksekutif</h1>
                <p className="text-[11px] font-medium text-slate-500">Analisis Nilai Lahan & Properti Resmi</p>
              </div>
              <div className="flex items-center justify-center mr-2">
                <img src="/logo-kito.png" alt="Kito Property Logo" className="h-10 lg:h-12 object-contain print:brightness-0" onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }} />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4 print:hidden">
              <Calculator size={20} className="text-primary" />
              <h2 className="text-xl md:text-2xl font-bold">Ringkasan Eksekutif</h2>
            </div>
            
            {/* DATA PROPERTI */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 mb-6 print:bg-white print:border-slate-200">
              <h3 className="text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-widest print:text-slate-400">Data Properti</h3>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500 mb-1 print:text-slate-400 font-bold uppercase tracking-wider">Lokasi Properti</p>
                  <p className="font-bold text-white print:text-black text-base leading-snug">
                    {alamat ? `${alamat}, ` : ''}{kelurahan ? `Kel. ${kelurahan}, ` : ''}{kecamatan ? `Kec. ${kecamatan}` : ''}
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-w-[280px]">
                  <div className="bg-black/20 px-4 py-3 rounded-lg border border-white/5 print:bg-slate-50 print:border-slate-200 flex flex-col justify-center">
                    <p className="text-[10px] text-slate-500 mb-1 print:text-slate-400 font-bold uppercase tracking-wider">Luas Tanah</p>
                    <p className="font-bold text-[#EACE40] print:text-[#b39500] text-base">{landArea || 0} m²</p>
                  </div>
                  <div className="bg-black/20 px-4 py-3 rounded-lg border border-white/5 print:bg-slate-50 print:border-slate-200 flex flex-col justify-center">
                    <p className="text-[10px] text-slate-500 mb-1 print:text-slate-400 font-bold uppercase tracking-wider">Luas Bangunan</p>
                    <p className="font-bold text-white print:text-slate-500 text-base">{jenisProperti === 'Tanah' ? '-' : `${buildingArea || 0} m²`}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ESTIMASI & KOREKSI NILAI */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 mb-6 print:bg-white print:border-slate-200">
              <h3 className="text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-widest print:text-slate-400">Estimasi & Koreksi Nilai</h3>
              
              <div className="flex flex-col gap-6">
                {/* Nilai Lahan */}
                <div className="flex justify-between items-center pb-6 border-b border-white/5 print:border-slate-200">
                  <div>
                     <p className="text-slate-300 text-sm print:text-slate-700">Total Estimasi Nilai Lahan</p>
                     <p className="text-[11px] text-slate-500 mt-1 print:text-slate-500">@ {formatCurrency(results.correctedLandPrice)} / m²</p>
                     {results.landConditionDiscountPct > 0 && (
                       <p className="text-[10px] text-rose-400 mt-1 italic print:text-rose-500">
                         *Didiskon {results.landConditionDiscountPct}% (Kondisi {kondisiProperti})
                       </p>
                     )}
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                     <span className="text-[9px] font-bold text-[#EACE40] bg-[#332b00] px-2 py-0.5 rounded print:bg-[#EACE40]/20 print:text-[#b39500]">Terkoreksi {(results.totalCorrection * 100).toFixed(1)}%</span>
                     <p className="text-xl font-bold text-white print:text-black mt-1">{formatCurrency(results.totalLandValue)}</p>
                  </div>
                </div>

                {/* Nilai Bangunan */}
                <div className="flex justify-between items-center">
                  <div>
                     <p className="text-slate-300 text-sm print:text-slate-700">Total Estimasi Nilai Bangunan</p>
                     <p className="text-[11px] text-slate-500 mt-1 print:text-slate-500">
                        {results.currentBuildingValue === 0 ? 'Tidak ada struktur bangunan terdaftar' : `Penyusutan: -${formatCurrency(results.depreciationAmount)}`}
                     </p>
                  </div>
                  <div className="text-right">
                     <p className="text-xl font-bold text-white print:text-slate-500">{results.currentBuildingValue === 0 ? 'Rp 0' : formatCurrency(results.currentBuildingValue)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Indikasi Nilai Pasar Box */}
            <div className="p-6 md:p-8 rounded-xl bg-[#EACE40] mb-8 print:bg-[#EACE40]">
              <p className="text-[10px] font-bold text-black/70 uppercase tracking-widest mb-1">Indikasi Nilai Pasar (Market Value)</p>
              <p className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                {formatCurrency(results.marketValue)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/60 p-6 rounded-xl border border-white/5 print:hidden">
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Rekomendasi Harga Listing (+7.5%)</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(results.listingPrice)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Harga Likuidasi Minimum (-15%)</p>
                <p className="text-2xl font-bold text-rose-400">{formatCurrency(results.liquidationPrice)}</p>
              </div>
            </div>
            
            {/* Footer Print */}
            <div className="hidden print:block text-center mt-12">
              <p className="text-[9px] font-medium text-slate-600">Dokumen ini dihasilkan secara otomatis oleh sistem Penilaian Properti Modern • Confidential & Proprietary</p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 print:hidden">
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Rincian Bobot Pengaruh</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.factors.map((f, i) => (
                  <div key={i} className="flex justify-between items-center text-sm bg-black/20 p-3 rounded-lg">
                    <span className="text-slate-400 truncate pr-2" title={f.val}>{f.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{(f.mult).toFixed(2)}</span>
                      <span className="text-primary font-mono bg-primary/10 px-2 py-1 rounded text-xs">
                        {f.mult * f.weight >= 0 ? '+' : ''}{(f.mult * f.weight * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuationCalculator;
