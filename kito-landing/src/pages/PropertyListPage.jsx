import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronRight, CheckCircle2, Heart, Phone, BedDouble, Bath, ArrowUpDown, SlidersHorizontal, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProperties } from '../context/PropertyContext';
import locationData from '../data/locationData.json';

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
        className={`w-full bg-slate-50 border ${isOpen ? 'border-primary ring-1 ring-primary' : 'border-slate-200'} rounded-xl ${Icon ? 'pl-11' : 'pl-4'} pr-10 py-3 min-h-[44px] text-sm text-slate-700 outline-none font-semibold transition-all flex items-center justify-between shadow-sm cursor-pointer disabled:cursor-not-allowed ${dropdownClass}`}
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

const SpecificationFilter = ({ 
  filterMinPrice, setFilterMinPrice, 
  filterMaxPrice, setFilterMaxPrice,
  filterMinLT, setFilterMinLT,
  filterMaxLT, setFilterMaxLT,
  filterMinLB, setFilterMinLB,
  filterMaxLB, setFilterMaxLB
}) => {
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

  let activeLabels = [];
  if (filterMinPrice || filterMaxPrice) activeLabels.push('Harga');
  if (filterMinLT || filterMaxLT) activeLabels.push('L.Tanah');
  if (filterMinLB || filterMaxLB) activeLabels.push('L.Bangunan');

  const displayLabel = activeLabels.length > 0 ? activeLabels.join(' & ') : 'Spesifikasi (Harga, Luas)';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 border ${isOpen || activeLabels.length > 0 ? 'border-primary ring-1 ring-primary' : 'border-slate-200'} rounded-xl pl-4 pr-10 py-3 min-h-[44px] text-sm ${activeLabels.length > 0 ? 'text-primary font-bold' : 'text-slate-700 font-semibold'} outline-none transition-all flex items-center justify-between shadow-sm cursor-pointer`}
      >
        <span className="truncate">{displayLabel}</span>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
           <SlidersHorizontal className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'text-primary' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-[300px] md:w-[350px] top-full mt-2 left-0 md:-left-10 lg:left-0 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.15)] p-5 animate-fade-in-up origin-top-left">
          
          {/* Harga */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 mb-2">Rentang Harga (Rp)</label>
            <div className="flex items-center gap-2">
              <select 
                value={filterMinPrice}
                onChange={(e) => setFilterMinPrice(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="">Min</option>
                <option value="200000000">200 Juta</option>
                <option value="500000000">500 Juta</option>
                <option value="1000000000">1 Miliar</option>
                <option value="2000000000">2 Miliar</option>
              </select>
              <span className="text-slate-300">-</span>
              <select 
                value={filterMaxPrice}
                onChange={(e) => setFilterMaxPrice(e.target.value)}
                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs text-slate-700 font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="">Max</option>
                <option value="500000000">500 Juta</option>
                <option value="1000000000">1 Miliar</option>
                <option value="3000000000">3 Miliar</option>
                <option value="5000000000">5 Miliar</option>
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
                setFilterMinPrice('');
                setFilterMaxPrice('');
                setFilterMinLT('');
                setFilterMaxLT('');
                setFilterMinLB('');
                setFilterMaxLB('');
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
      )}
    </div>
  );
};

const ListingCard = ({ id, image, title, priceStr, location, specs, exclusive, beds, baths, status, legalitas }) => {
  const navigate = useNavigate();
  return (
    <div 
      className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
        exclusive 
          ? 'bg-gradient-to-b from-yellow-50 to-white shadow-lg hover:shadow-primary/30' 
          : 'bg-white border border-slate-100 shadow-sm hover:shadow-md'
      }`}
      onClick={() => navigate(`/properties/${id}`)}
    >
      <div className="relative h-40 overflow-hidden flex-shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {exclusive && (
            <div className="bg-primary text-black text-[10px] font-bold px-2 py-1 rounded-full flex items-center shadow-md">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Eksklusif
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2 py-1 rounded-full shadow-md w-max">
            {status}
          </div>
          {legalitas && (
            <div className="bg-blue-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md w-max">
              {legalitas}
            </div>
          )}
        </div>

        <div className="absolute top-2 right-2">
          <button 
            className="w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm text-slate-400 rounded-full hover:text-red-500 hover:bg-white shadow-sm transition-all"
            onClick={(e) => { e.stopPropagation(); /* handle save */ }}
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-3.5 flex flex-col flex-1">
        <h3 className={`font-semibold line-clamp-2 mb-1 text-sm leading-tight ${exclusive ? 'text-slate-900' : 'text-slate-800'}`}>{title}</h3>
        
        <p className={`text-lg font-black mb-2 mt-0.5 ${exclusive ? 'text-primary' : 'text-slate-900'}`}>{priceStr}</p>
        
        <div className="flex items-center text-slate-500 text-[11px] mb-3">
          <MapPin className="w-3 h-3 mr-1.5 shrink-0" />
          <span className="truncate">{location}</span>
        </div>
        
        <div className="flex flex-wrap gap-2.5 border-t border-slate-100 pt-3 mb-4">
          {beds && (
            <div className="flex items-center gap-1 text-slate-600">
              <BedDouble className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-xs">{beds}</span>
            </div>
          )}
          {baths && (
            <div className="flex items-center gap-1 text-slate-600">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-xs">{baths}</span>
            </div>
          )}
          {specs.map((spec, i) => (
            <div key={i} className="flex flex-col border-l border-slate-200 pl-2.5 first:border-0 first:pl-0">
              <span className="text-slate-400 text-[9px] uppercase tracking-wider">{spec.label}</span>
              <span className="font-semibold text-slate-700 text-xs">{spec.value}</span>
            </div>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex gap-1.5 mt-auto pt-2">
          <button 
            className="flex-1 bg-slate-900 text-white font-bold py-2.5 min-h-[44px] rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-1.5 text-[11px] shadow-sm"
            onClick={(e) => { e.stopPropagation(); /* handle contact */ }}
          >
            <MessageCircle className="w-4 h-4" />
            Hubungi
          </button>
          <button 
            className="flex-1 bg-primary text-black font-bold py-2.5 min-h-[44px] rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 text-[11px] shadow-sm"
            onClick={(e) => { e.stopPropagation(); navigate(`/properties/${id}`); }}
          >
            Detail
          </button>
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

  const minPriceOptions = [
    { value: '', label: 'Min Harga' },
    { value: '200000000', label: 'Rp 200 Juta' },
    { value: '500000000', label: 'Rp 500 Juta' },
    { value: '1000000000', label: 'Rp 1 Miliar' }
  ];

  const maxPriceOptions = [
    { value: '', label: 'Max Harga' },
    { value: '500000000', label: 'Rp 500 Juta' },
    { value: '1000000000', label: 'Rp 1 Miliar' },
    { value: '5000000000', label: 'Rp 5 Miliar' }
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
      priceStr: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(l.hargaListing || p.hargaJual || 0),
      location: `${p.kelurahan || '-'}, ${p.kecamatan || '-'}`,
      specs: [
        { label: 'LT', value: `${p.luasTanah || 0}m²` },
        { label: 'LB', value: `${p.luasBangunan || 0}m²` }
      ],
      beds: p.kamarTidur,
      baths: p.kamarMandi,
      legalitas: p.legalitas,
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
    const matchType = filterType === 'Semua Tipe' || p.rawType === filterType;
    const matchStatus = filterStatus === 'Semua Status' || p.status === filterStatus;
    const matchKecamatan = filterKecamatan ? p.rawLocation.toLowerCase().includes(filterKecamatan.toLowerCase()) : true;
    const matchKelurahan = filterKelurahan ? p.rawLocation.toLowerCase().includes(filterKelurahan.toLowerCase()) : true;
    const matchMinPrice = filterMinPrice ? p.priceRaw >= parseInt(filterMinPrice) : true;
    const matchMaxPrice = filterMaxPrice ? p.priceRaw <= parseInt(filterMaxPrice) : true;
    const matchMinLT = filterMinLT ? p.rawLT >= parseInt(filterMinLT) : true;
    const matchMaxLT = filterMaxLT ? p.rawLT <= parseInt(filterMaxLT) : true;
    const matchMinLB = filterMinLB ? p.rawLB >= parseInt(filterMinLB) : true;
    const matchMaxLB = filterMaxLB ? p.rawLB <= parseInt(filterMaxLB) : true;
    
    return matchType && matchStatus && matchKecamatan && matchKelurahan && 
           matchMinPrice && matchMaxPrice && matchMinLT && matchMaxLT && matchMinLB && matchMaxLB;
  });

  filteredProperties.sort((a, b) => {
    if (sortBy === 'termurah') return a.priceRaw - b.priceRaw;
    if (sortBy === 'termahal') return b.priceRaw - a.priceRaw;
    return 0; // terbaru
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <div className="pt-28 pb-12 bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-3xl rounded-full transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Cari Properti <span className="text-primary">Impian</span> Anda</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">Temukan berbagai pilihan rumah, ruko, tanah, dan properti lainnya di kota Padang dan sekitarnya.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Filter Bar */}
        <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl border border-slate-100 mb-10">
          <div className="flex items-center gap-2 mb-6 text-slate-800">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">Filter Pencarian</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Status & Tipe</label>
              <div className="flex gap-2">
                <ModernDropdown 
                  value={filterStatus} 
                  onChange={setFilterStatus} 
                  options={statusOptions} 
                  placeholder="Semua Status" 
                  className="w-1/2" 
                />
                <ModernDropdown 
                  value={filterType} 
                  onChange={setFilterType} 
                  options={typeOptions} 
                  placeholder="Semua Tipe" 
                  className="w-1/2" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Spesifikasi</label>
              <SpecificationFilter 
                filterMinPrice={filterMinPrice} setFilterMinPrice={setFilterMinPrice}
                filterMaxPrice={filterMaxPrice} setFilterMaxPrice={setFilterMaxPrice}
                filterMinLT={filterMinLT} setFilterMinLT={setFilterMinLT}
                filterMaxLT={filterMaxLT} setFilterMaxLT={setFilterMaxLT}
                filterMinLB={filterMinLB} setFilterMinLB={setFilterMinLB}
                filterMaxLB={filterMaxLB} setFilterMaxLB={setFilterMaxLB}
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Lokasi (Kecamatan & Kelurahan)</label>
              <div className="flex gap-2">
                <ModernDropdown 
                  value={filterKecamatan} 
                  onChange={(val) => { setFilterKecamatan(val); setFilterKelurahan(''); }} 
                  options={kecOptions} 
                  placeholder="Semua Kecamatan" 
                  icon={MapPin} 
                  className="w-1/2" 
                />
                <ModernDropdown 
                  value={filterKelurahan} 
                  onChange={setFilterKelurahan} 
                  options={kelOptions} 
                  placeholder="Semua Kelurahan" 
                  icon={MapPin} 
                  className="w-1/2" 
                  disabled={!filterKecamatan} 
                />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-24">
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
