import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronRight, CheckCircle2, Heart, Phone, BedDouble, Bath, ArrowUpDown, SlidersHorizontal, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProperties } from '../context/PropertyContext';
import locationData from '../data/locationData.json';

const formatCompactCurrency = (num) => {
  if (!num) return 'Rp 0';
  const value = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  if (value >= 1000000000) return sign + 'Rp ' + (value / 1000000000).toFixed(1).replace('.0', '') + ' M';
  if (value >= 1000000) return sign + 'Rp ' + (value / 1000000).toFixed(1).replace('.0', '') + ' JT';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

const HERO_SLIDES = [
  {
    image: "/hero.jpg",
    title: "Space Available",
    subtitle: "Temukan berbagai pilihan rumah, ruko, tanah, dan properti lainnya di kota Padang dan sekitarnya."
  },
  {
    image: "/hero-sell-bg.jpg",
    title: "Pusat Bisnis Strategis",
    subtitle: "Ruko dan area komersial di lokasi premium untuk mengembangkan usaha Anda."
  },
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "Kawasan Eksklusif",
    subtitle: "Hunian mewah dengan fasilitas lengkap dan keamanan 24 jam."
  },
  {
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "Investasi Menguntungkan",
    subtitle: "Pilihan tepat untuk investasi masa depan dengan nilai jual yang terus meningkat."
  }
];

const ModernDropdown = ({ value, options, onChange, placeholder, disabled, icon: Icon, className = "", dropdownClass = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 border ${isOpen ? 'border-primary ring-1 ring-primary' : 'border-slate-200'} rounded-full ${Icon ? 'pl-11' : 'pl-4'} pr-10 py-2.5 text-sm text-slate-700 outline-none font-semibold transition-all flex items-center justify-between cursor-pointer disabled:cursor-not-allowed ${dropdownClass}`}
      >
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />}
        <span className="truncate">{displayLabel}</span>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
           <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] py-2 max-h-60 overflow-y-auto overflow-x-hidden animate-fade-in-up">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 mx-2 rounded-lg cursor-pointer text-sm font-medium transition-colors flex items-center justify-between ${
                value === opt.value
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="truncate">{opt.label}</span>
              {value === opt.value && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PriceDropdown = ({ minPrice, setMinPrice, maxPrice, setMaxPrice, className = "", dropdownClass = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatPrice = (val) => {
    if (!val) return '';
    const num = parseInt(val);
    if (num >= 1000000000) return `${num / 1000000000}M`;
    if (num >= 1000000) return `${num / 1000000}Jt`;
    return num;
  };

  const displayLabel = minPrice || maxPrice 
    ? `${minPrice ? formatPrice(minPrice) : '0'} - ${maxPrice ? formatPrice(maxPrice) : 'Max'}`
    : 'Harga';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-transparent border-none pr-10 py-2.5 text-sm ${minPrice || maxPrice ? 'text-primary font-bold' : 'text-slate-700 font-semibold'} outline-none hover:bg-slate-50 transition-all flex items-center justify-between cursor-pointer rounded-full px-2 relative ${dropdownClass}`}
      >
        <span className="truncate">{displayLabel}</span>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
           <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-[300px] mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-5 animate-fade-in-up left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0">
          <label className="block text-xs font-bold text-slate-800 mb-4">Rentang Harga</label>
          
          {/* Custom Slider / Barometer */}
          <div className="mb-6 px-1 relative">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 px-1">
               <span>Rp 0</span>
               <span>Rp 5 Miliar</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="5000000000" 
              step="100000000" 
              value={maxPrice || "5000000000"} 
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-primary h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer hover:accent-primary/80 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-slate-500 mb-1.5 block">Min Harga</span>
              <select 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-xs text-slate-700 font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="">Rp 0</option>
                <option value="200000000">Rp 200 Jt</option>
                <option value="500000000">Rp 500 Jt</option>
                <option value="1000000000">Rp 1 M</option>
                <option value="2000000000">Rp 2 M</option>
              </select>
            </div>
            <span className="text-slate-300 mt-5 font-medium">-</span>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-slate-500 mb-1.5 block">Max Harga</span>
              <select 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-xs text-slate-700 font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="">Tak Terhingga</option>
                <option value="500000000">Rp 500 Jt</option>
                <option value="1000000000">Rp 1 M</option>
                <option value="3000000000">Rp 3 M</option>
                <option value="5000000000">Rp 5 M</option>
              </select>
            </div>
          </div>

          {(minPrice || maxPrice) && (
             <button 
               onClick={() => { setMinPrice(''); setMaxPrice(''); }}
               className="mt-5 text-[11px] text-slate-400 hover:text-red-500 font-bold w-full text-center transition-colors"
             >
               Reset Harga
             </button>
          )}
        </div>
      )}
    </div>
  );
};

const AdvancedFilter = ({ 
  filterMinLT, setFilterMinLT,
  filterMaxLT, setFilterMaxLT,
  filterMinLB, setFilterMinLB,
  filterMaxLB, setFilterMaxLB,
  filterKecamatan, setFilterKecamatan,
  filterKelurahan, setFilterKelurahan,
  kecOptions, kelOptions
}) => {
  const [isOpen, setIsOpen] = useState(false);

  let activeLabels = [];
  if (filterKecamatan) activeLabels.push('Lokasi');
  if (filterMinLT || filterMaxLT) activeLabels.push('L.Tanah');
  if (filterMinLB || filterMaxLB) activeLabels.push('L.Bangunan');

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`bg-transparent border-none px-4 py-2 text-sm ${activeLabels.length > 0 ? 'text-primary font-bold' : 'text-slate-700 font-medium'} hover:text-slate-900 outline-none transition-all flex items-center justify-center gap-2 cursor-pointer relative`}
      >
        <SlidersHorizontal className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'text-primary' : ''}`} />
        <span>Filter</span>
        {activeLabels.length > 0 && <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-[350px] bg-white rounded-3xl shadow-2xl p-6 relative animate-fade-in-up max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Tetapkan Filter</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-2">Kecamatan</label>
              <select 
                value={filterKecamatan}
                onChange={(e) => { setFilterKecamatan(e.target.value); setFilterKelurahan(''); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2.5 text-[11px] text-slate-700 font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {kecOptions.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-2">Kelurahan</label>
              <select 
                value={filterKelurahan}
                onChange={(e) => setFilterKelurahan(e.target.value)}
                disabled={!filterKecamatan}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2.5 text-[11px] text-slate-700 font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {kelOptions.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          {/* Luas Tanah */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 mb-2">Luas Tanah (m²)</label>
            <div className="flex items-center gap-2">
              <input 
                type="number"
                placeholder="Min"
                value={filterMinLT}
                onChange={(e) => setFilterMinLT(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="text-slate-300">-</span>
              <input 
                type="number"
                placeholder="Max"
                value={filterMaxLT}
                onChange={(e) => setFilterMaxLT(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Luas Bangunan */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-700 mb-2">Luas Bangunan (m²)</label>
            <div className="flex items-center gap-2">
              <input 
                type="number"
                placeholder="Min"
                value={filterMinLB}
                onChange={(e) => setFilterMinLB(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="text-slate-300">-</span>
              <input 
                type="number"
                placeholder="Max"
                value={filterMaxLB}
                onChange={(e) => setFilterMaxLB(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
            <button 
              onClick={() => {
                setFilterMinLT('');
                setFilterMaxLT('');
                setFilterMinLB('');
                setFilterMaxLB('');
                setFilterKecamatan('');
                setFilterKelurahan('');
              }}
              className="w-1/3 py-3 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors"
            >
              Reset
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-2/3 py-3 min-h-[44px] bg-primary hover:bg-primary/90 text-black text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              Tutup
            </button>
          </div>

        </div>
        </div>
      )}
    </div>
  );
};


const ListingCard = ({ image, title, priceStr, location, description, specs, exclusive, beds, baths, carport, status, legalitas, rawType, id, views = 142, uploadTime = "2 hari lalu" }) => {
  const navigate = useNavigate();
  const [isVisibleOnMobile, setIsVisibleOnMobile] = useState(false);
  const cardRef = useRef(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisibleOnMobile(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.5
      }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCardMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  // Ekstrak LT, LB, dan Tingkat Bangunan
  const ltSpec = specs?.find(s => s.label.toLowerCase() === 'lt' || s.label.toLowerCase() === 'luas tanah')?.value || '-';
  const lbSpec = specs?.find(s => s.label.toLowerCase() === 'lb' || s.label.toLowerCase() === 'luas bangunan')?.value || '-';
  const lantaiSpec = specs?.find(s => s.label.toLowerCase() === 'lantai' || s.label.toLowerCase() === 'tingkat')?.value || '-';

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleCardMouseMove}
      onClick={() => navigate(`/properties/${id}`)}
      className="w-full bg-white rounded-2xl overflow-hidden shadow-md border-2 border-slate-100 hover:border-primary/80 hover:shadow-2xl hover:shadow-primary/10 text-slate-900 group card-spotlight hover:-translate-y-2.5 transition-all duration-300 relative select-none cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-52 overflow-hidden bg-slate-900 group/slider shrink-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-105 transition-all duration-500 ease-out"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none"></div>

        {/* Indikator Dots Slider */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 transition-all duration-300 group-hover:opacity-0 pointer-events-none">
          <span className="w-3.5 h-1.5 rounded-full bg-[#EACE40] transition-all"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/50 transition-all"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/50 transition-all"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/50 transition-all"></span>
        </div>

        <div className="absolute top-2.5 left-0 right-0 z-10 flex items-center justify-between px-3.5">
          <div className="flex flex-col gap-1 items-start">
            {exclusive && (
              <div className="flex items-center gap-1.5 text-[#EACE40] text-xs font-semibold uppercase tracking-wider leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                <svg className="w-3.5 h-3.5 fill-[#EACE40] shrink-0 transition-transform duration-700 ease-out group-hover:rotate-[360deg] group-hover:scale-125" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>Eksklusif</span>
              </div>
            )}
            {status && (
              <div className="text-white text-[10px] font-bold uppercase tracking-wider leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] mt-1">
                {status}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={toggleFavorite} 
              title="Simpan Properti"
              className="w-7 h-7 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white hover:text-rose-500 hover:bg-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md"
            >
              <svg className={`w-3.5 h-3.5 transition-transform active:scale-125 ${isFavorited ? 'text-rose-500' : ''}`} fill={isFavorited ? '#f43f5e' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>

            {rawType && (
              <span className="text-white text-[10px] font-semibold uppercase tracking-wider leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] translate-x-1.5">
                {rawType}
              </span>
            )}
          </div>
        </div>

        {(beds || baths || carport || legalitas) && (
          <div className={`absolute bottom-0 left-0 right-0 p-2.5 z-20 transition-all duration-300 transform ${isVisibleOnMobile ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:opacity-0 lg:translate-y-3 pointer-events-auto`}>
            <div className="bg-black/65 hover:bg-black/80 backdrop-blur-md rounded-[10.6px] flex items-center justify-center gap-4 py-2.5 px-3 text-white border border-white/20 shadow-2xl text-center transition-all divide-x divide-white/15">
              {beds && (
                <div className="flex items-center justify-center gap-1.5" title={`${beds} Kamar Tidur`}>
                  <svg className="w-4 h-4 text-white/90 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
                  </svg>
                  <span className="font-extrabold text-xs text-white">{beds}</span>
                </div>
              )}
              {baths && (
                <div className="flex items-center justify-center gap-1.5 pl-4" title={`${baths} Kamar Mandi`}>
                  <svg className="w-4 h-4 text-white/90 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 5h7a3 3 0 0 1 3 3v2" />
                    <path d="M9 10h8l1.5 3H7.5L9 10z" />
                    <path d="M9.5 15.5v2.5" />
                    <path d="M13 15v3.5" />
                    <path d="M16.5 15.5v2.5" />
                  </svg>
                  <span className="font-extrabold text-xs text-white">{baths}</span>
                </div>
              )}
              {(carport || true) && (
                <div className="flex items-center justify-center gap-1.5 pl-4" title={`${carport || 2} Carport`}>
                  <svg className="w-4 h-4 text-white/90 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <path d="M9 17h6" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                  <span className="font-extrabold text-xs text-white">{carport || 2}</span>
                </div>
              )}
              {legalitas && (
                <div className="flex items-center justify-center gap-1.5 pl-4" title={`Legalitas: ${legalitas}`}>
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span className="font-bold text-xs tracking-wider text-emerald-400">{legalitas}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 relative z-10 flex flex-col gap-2 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5 shrink-0">
            <span className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-[#cbb02e] transition-colors">
              {priceStr}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium min-w-0" title={location}>
            <svg className="w-3.5 h-3.5 text-[#EACE40] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 21s-6-5.333-6-10a6 6 0 0 1 12 0c0 4.667-6 10-6 10z"/>
              <circle cx="12" cy="11" r="2"/>
            </svg>
            <span className="truncate">{location}</span>
          </div>
        </div>

        <div className="mt-0.5">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide leading-tight line-clamp-2 group-hover:text-[#cbb02e] transition-colors" title={title}>
            {title}
          </h3>
        </div>



        <div className="mt-auto pt-2 flex items-center gap-2.5">
          <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-[10.6px] p-2 flex items-center justify-between divide-x divide-slate-200/80 shadow-inner transition-all">
            <div className="flex flex-col items-center justify-center flex-1 px-1">
              <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                <svg className="w-3.5 h-3.5 text-[#EACE40] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">LT</span>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-800 tracking-tight">{ltSpec}</span>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 px-1">
              <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                <svg className="w-3.5 h-3.5 text-[#EACE40] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                  <path d="M9 21v-7h6v7" />
                </svg>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">LB</span>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-800 tracking-tight">{lbSpec}</span>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 px-1">
              <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                <svg className="w-3.5 h-3.5 text-[#EACE40] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M3 21h18" />
                  <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" />
                  <path d="M6 9h12" />
                  <path d="M6 15h12" />
                  <path d="M10 21v-3h4v3" />
                </svg>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">TB</span>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-800 tracking-tight">{lantaiSpec !== '-' ? lantaiSpec : '-'}</span>
            </div>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); window.open('https://wa.me/6281234567890', '_blank'); }}
            className="w-11 h-11 shrink-0 bg-white text-slate-700 border-2 border-slate-200 rounded-[10.6px] flex items-center justify-center shadow-sm transition-all duration-300 group-hover:border-emerald-500 group-hover:text-emerald-600 group-hover:bg-emerald-50/40 hover:!bg-[#25D366] hover:!border-[#25D366] hover:!text-white hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 active:scale-95 group/wa cursor-pointer"
            title="Hubungi Agen via WhatsApp"
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover/wa:rotate-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-100 py-2.5 px-5 flex items-center justify-between text-slate-400 mt-auto">
        <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-tight">
          <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>{`Diunggah ${uploadTime}`}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>{`${views} tayangan`}</span>
        </div>
      </div>
    </div>
  );
};

const PropertyListPage = () => {
  const { properties, listings } = useProperties();
  const [filterType, setFilterType] = useState('Semua Tipe');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [filterKecamatan, setFilterKecamatan] = useState('');
  const [filterKelurahan, setFilterKelurahan] = useState('');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterMinLT, setFilterMinLT] = useState('');
  const [filterMaxLT, setFilterMaxLT] = useState('');
  const [filterMinLB, setFilterMinLB] = useState('');
  const [filterMaxLB, setFilterMaxLB] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [searchQuery, setSearchQuery] = useState('');

  // Hero Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const kecamatans = [...new Set(locationData.map(loc => loc.kecamatan))].sort();
  const kelurahans = filterKecamatan 
    ? [...new Set(locationData.filter(loc => loc.kecamatan === filterKecamatan).map(loc => loc.kelurahan))].sort() 
    : [];
  
  const statusOptions = [
    { value: 'Semua Status', label: 'Semua Status' },
    { value: 'Dijual', label: 'Dijual' },
    { value: 'Disewakan', label: 'Disewakan' }
  ];

  const typeOptions = [
    { value: 'Semua Tipe', label: 'Semua Tipe' },
    { value: 'Rumah', label: 'Rumah' },
    { value: 'Ruko', label: 'Ruko' },
    { value: 'Tanah', label: 'Tanah' },
    { value: 'Gudang', label: 'Gudang' }
  ];

  const hargaOptions = [
    { value: '', label: 'Harga' },
    { value: '0-500000000', label: '< 500 Juta' },
    { value: '500000000-1000000000', label: '500 Jt - 1 M' },
    { value: '1000000000-2000000000', label: '1 M - 2 M' },
    { value: '2000000000-999999999999', label: '> 2 M' }
  ];

  const kecOptions = [
    { value: '', label: 'Semua Kecamatan' },
    ...kecamatans.map(k => ({ value: k, label: k }))
  ];

  const kelOptions = [
    { value: '', label: 'Semua Kelurahan' },
    ...kelurahans.map(k => ({ value: k, label: k }))
  ];

  const sortOptions = [
    { value: 'terbaru', label: 'Terbaru' },
    { value: 'termurah', label: 'Harga Terendah' },
    { value: 'termahal', label: 'Harga Tertinggi' }
  ];
  
  const activeListings = listings ? listings.filter(l => l.status !== 'Draft' && l.status !== 'Terjual') : [];
  const mappedListings = activeListings.map(l => {
    const p = properties.find(prop => prop.propertyId === l.propertyId) || {};
    return {
      id: l.listingId,
      image: (l.photos && l.photos.length > 0) ? l.photos[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
      title: l.judulListing || `${p.jenisProperti || 'Properti'} Siap Huni di ${p.kecamatan || 'Padang'}`,
      priceRaw: l.hargaListing || p.hargaJual || 0,
      priceStr: formatCompactCurrency(l.hargaListing || p.hargaJual || 0),
      location: `${p.kelurahan || '-'}, ${p.kecamatan || '-'}`,
      specs: [
        { label: 'LT', value: `${p.luasTanah || 0}m²` },
        { label: 'LB', value: `${p.luasBangunan || 0}m²` }
      ],
      beds: p.kamarTidur || l.kamarTidur,
      baths: p.kamarMandi || l.kamarMandi,
      legalitas: p.legalitas || l.legalitas,
      exclusive: l.tipeListing === 'Exclusive',
      // For filtering
      rawLT: parseInt(p.luasTanah) || 0,
      rawLB: parseInt(p.luasBangunan) || 0,
      rawType: p.jenisProperti,
      rawLocation: `${p.alamat} ${p.kecamatan} ${p.kelurahan}`,
      status: p.jenisTransaksi || 'Dijual' // dummy if undefined
    };
  });

  let filteredProperties = mappedListings.filter(p => {
    const matchType = filterType === 'Semua Tipe' || !filterType || p.rawType === filterType;
    const matchStatus = filterStatus === 'Semua Status' || !filterStatus || p.status === filterStatus;
    const matchKecamatan = filterKecamatan ? p.rawLocation.toLowerCase().includes(filterKecamatan.toLowerCase()) : true;
    const matchKelurahan = filterKelurahan ? p.rawLocation.toLowerCase().includes(filterKelurahan.toLowerCase()) : true;
    
    const matchMinPrice = filterMinPrice ? p.priceRaw >= parseInt(filterMinPrice) : true;
    const matchMaxPrice = filterMaxPrice ? p.priceRaw <= parseInt(filterMaxPrice) : true;

    const matchMinLT = filterMinLT ? p.rawLT >= parseInt(filterMinLT) : true;
    const matchMaxLT = filterMaxLT ? p.rawLT <= parseInt(filterMaxLT) : true;
    const matchMinLB = filterMinLB ? p.rawLB >= parseInt(filterMinLB) : true;
    const matchMaxLB = filterMaxLB ? p.rawLB <= parseInt(filterMaxLB) : true;
    const matchSearch = searchQuery ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.rawLocation.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    
    return matchType && matchStatus && matchKecamatan && matchKelurahan && 
           matchMinPrice && matchMaxPrice && matchMinLT && matchMaxLT && matchMinLB && matchMaxLB && matchSearch;
  });

  filteredProperties.sort((a, b) => {
    if (sortBy === 'termurah') return a.priceRaw - b.priceRaw;
    if (sortBy === 'termahal') return b.priceRaw - a.priceRaw;
    return 0; // terbaru
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <div className="pt-28 pb-16 relative overflow-hidden h-[360px] md:h-[450px] flex items-center justify-center bg-slate-900">
        {/* Slides */}
        {HERO_SLIDES.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-white drop-shadow-lg" dangerouslySetInnerHTML={{ __html: slide.title.replace('Available', '<span class="text-primary">Available</span>') }}></h1>
              <p className="text-slate-200 max-w-2xl mx-auto text-lg drop-shadow-md">{slide.subtitle}</p>
            </div>
          </div>
        ))}

        {/* Indicators */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-3">
          {HERO_SLIDES.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-primary w-8' : 'bg-white/50 w-2.5 hover:bg-white/80'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-40">
        {/* Search Bar Wrapper */}
        <div className="mb-10 max-w-5xl mx-auto">
          {/* Unified Pill Filter Bar */}
          <div className="bg-white rounded-[2rem] lg:rounded-full shadow-[0_10px_40px_rgb(0,0,0,0.05)] py-2 px-3 flex flex-col lg:flex-row items-center lg:h-[72px] border border-white gap-3 lg:gap-0 w-full">
          
          {/* Search Input */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 lg:py-0 w-full min-h-[44px]">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Masukkan lokasi atau nama proyek" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium w-full text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="hidden lg:block w-[1px] h-8 bg-slate-200 shrink-0 mx-2"></div>

          {/* Status Toggle */}
          <div className="flex bg-slate-50 rounded-full p-1 shrink-0 w-full lg:w-auto h-12 lg:h-[52px]">
            <button 
              onClick={() => setFilterStatus(filterStatus === 'Dijual' ? 'Semua Status' : 'Dijual')} 
              className={`flex-1 lg:flex-none px-6 rounded-full text-sm font-bold transition-all border-2 ${filterStatus === 'Dijual' ? 'border-slate-900 text-slate-900 bg-white shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Dijual
            </button>
            <button 
              onClick={() => setFilterStatus(filterStatus === 'Disewakan' ? 'Semua Status' : 'Disewakan')} 
              className={`flex-1 lg:flex-none px-6 rounded-full text-sm font-bold transition-all border-2 ${filterStatus === 'Disewakan' ? 'border-slate-900 text-slate-900 bg-white shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Disewa
            </button>
          </div>

          <div className="hidden lg:block w-[1px] h-8 bg-slate-200 shrink-0 mx-2"></div>

          {/* Tipe & Harga Row */}
          <div className="flex flex-row w-full lg:w-auto items-center border-t border-slate-100 lg:border-t-0 pt-2 lg:pt-0">
            {/* Pilih Tipe */}
            <div className="flex-1 lg:w-40 relative">
              <ModernDropdown 
                value={filterType} 
                onChange={setFilterType} 
                options={typeOptions} 
                placeholder="Pilih Tipe" 
                dropdownClass="!bg-transparent !border-none !ring-0 !shadow-none hover:!bg-slate-50"
              />
            </div>

            <div className="w-[1px] h-8 bg-slate-200 shrink-0 mx-2"></div>

            {/* Harga */}
            <div className="flex-1 lg:w-36 relative">
              <PriceDropdown 
                minPrice={filterMinPrice} 
                setMinPrice={setFilterMinPrice} 
                maxPrice={filterMaxPrice} 
                setMaxPrice={setFilterMaxPrice} 
                dropdownClass="!px-2"
              />
            </div>
          </div>

          <div className="hidden lg:block w-[1px] h-8 bg-slate-200 shrink-0 mx-2"></div>

          {/* Filter & Cari Row */}
          <div className="flex flex-row w-full lg:w-auto items-center gap-2 lg:gap-0 px-2 pb-2 lg:p-0">
            {/* Advanced Filter Button */}
            <div className="flex-1 lg:flex-none flex justify-center">
               <AdvancedFilter 
                  filterMinLT={filterMinLT} setFilterMinLT={setFilterMinLT}
                  filterMaxLT={filterMaxLT} setFilterMaxLT={setFilterMaxLT}
                  filterMinLB={filterMinLB} setFilterMinLB={setFilterMinLB}
                  filterMaxLB={filterMaxLB} setFilterMaxLB={setFilterMaxLB}
                  filterKecamatan={filterKecamatan} setFilterKecamatan={setFilterKecamatan}
                  filterKelurahan={filterKelurahan} setFilterKelurahan={setFilterKelurahan}
                  kecOptions={kecOptions} kelOptions={kelOptions}
                />
            </div>

            {/* Cari Button */}
            <div className="flex-1 lg:flex-none">
              <button className="w-full lg:w-auto bg-black text-white px-8 h-12 lg:h-[52px] rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-md">
                <Search className="w-4 h-4" />
                Cari
              </button>
            </div>
          </div>
          </div>
        </div>

        {/* Listing Header & Sorting */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800">
            Menampilkan <span className="text-primary">{filteredProperties.length}</span> Properti
          </h2>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-500">Urutkan:</span>
            <div className="relative w-48 z-30">
              <ModernDropdown 
                value={sortBy} 
                onChange={setSortBy} 
                options={sortOptions} 
                placeholder="Urutkan" 
                dropdownClass="py-2.5 bg-white shadow-sm border border-slate-200" 
              />
            </div>
          </div>
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-24">
            {filteredProperties.map(listing => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm mb-24">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Properti tidak ditemukan</h3>
            <p className="text-slate-500">Coba ubah filter pencarian Anda untuk melihat lebih banyak properti.</p>
            <button 
              onClick={() => {
                setFilterType('Semua Tipe');
                setFilterStatus('Semua Status');
                setFilterKecamatan('');
                setFilterKelurahan('');
                setFilterMinPrice('');
                setFilterMaxPrice('');
                setFilterMinLT('');
                setFilterMaxLT('');
                setFilterMinLB('');
                setFilterMaxLB('');
              }}
              className="mt-6 px-6 py-3 min-h-[44px] bg-primary/10 text-slate-900 font-bold rounded-xl hover:bg-primary transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PropertyListPage;
