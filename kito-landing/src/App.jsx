import React, { useState, useEffect } from 'react';
import { Search, MapPin, Home, Phone, ChevronRight, CheckCircle2, UserCircle2 } from 'lucide-react';

const ListingCard = ({ image, title, price, location, specs, exclusive }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 group">
    <div className="relative h-56 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      {exclusive && (
        <div className="absolute top-3 left-3 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
          <CheckCircle2 className="w-4 h-4 mr-1" />
          Verified Exclusive
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <h3 className="text-white font-semibold text-lg line-clamp-1">{title}</h3>
      </div>
      <div className="absolute top-3 right-3">
        <img src="/logo.jpg" alt="Watermark" className="w-8 h-8 opacity-50 rounded bg-white p-1" onError={(e) => e.target.style.display='none'} />
      </div>
    </div>
    <div className="p-5">
      <p className="text-2xl font-bold text-slate-900 mb-1">{price}</p>
      <div className="flex items-center text-slate-500 text-sm mb-4">
        <MapPin className="w-4 h-4 mr-1 shrink-0" />
        <span className="truncate">{location}</span>
      </div>
      
      <div className="flex gap-4 border-t border-slate-100 pt-4 mb-4">
        {specs.map((spec, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-slate-400 text-xs">{spec.label}</span>
            <span className="font-semibold text-slate-700 text-sm">{spec.value}</span>
          </div>
        ))}
      </div>
      
      <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 active:scale-95 flex items-center justify-center border border-slate-200">
        Tanya via WhatsApp
        <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const totalFrames = 41;

  useEffect(() => {
    // Preload frames to prevent flickering
    for (let i = 1; i <= totalFrames; i++) {
      const img = new window.Image();
      img.src = `/hero-frames/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev < totalFrames ? prev + 1 : 1));
    }, 100); // 10 fps (adjust speed here)
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const exclusiveListings = [
    {
      id: 1,
      title: "Rumah Mewah Minimalis Tepi Bypass",
      price: "Rp 1.500.000.000",
      location: "Kuranji, Padang",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      exclusive: true,
      specs: [{label: "LT", value: "200 m²"}, {label: "LB", value: "150 m²"}, {label: "KT", value: "4"}]
    },
    {
      id: 2,
      title: "Ruko Premium Pusat Kota",
      price: "Rp 3.200.000.000",
      location: "Padang Barat, Padang",
      image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80",
      exclusive: true,
      specs: [{label: "LT", value: "120 m²"}, {label: "LB", value: "240 m²"}, {label: "Lantai", value: "3"}]
    },
    {
      id: 3,
      title: "Hunian Asri View Gunung",
      price: "Rp 850.000.000",
      location: "Lubuk Kilangan, Padang",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      exclusive: true,
      specs: [{label: "LT", value: "150 m²"}, {label: "LB", value: "90 m²"}, {label: "KT", value: "3"}]
    }
  ];

  const catalogListings = [
    ...exclusiveListings,
    {
      id: 4,
      title: "Tanah Kavling Siap Bangun",
      price: "Rp 350.000.000",
      location: "Koto Tangah, Padang",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      exclusive: false,
      specs: [{label: "Luas", value: "300 m²"}, {label: "Sertifikat", value: "SHM"}]
    },
    {
      id: 5,
      title: "Gudang Komersial Strategis",
      price: "Rp 120.000.000 / thn",
      location: "Padang Selatan, Padang",
      image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c83a7f?auto=format&fit=crop&w=800&q=80",
      exclusive: false,
      specs: [{label: "LB", value: "500 m²"}, {label: "Akses", value: "Kontainer"}]
    },
    {
      id: 6,
      title: "Rumah Subsidi Minimalis",
      price: "Rp 165.000.000",
      location: "Pauh, Padang",
      image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80",
      exclusive: false,
      specs: [{label: "LT", value: "84 m²"}, {label: "LB", value: "36 m²"}, {label: "KT", value: "2"}]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary selection:text-black">
      
      {/* Sticky Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent border-transparent py-2'}`}>
        <div className="w-full px-6 lg:px-16">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <img src="/logo.jpg" alt="Kito Apps" className="h-10 w-auto object-contain rounded" onError={(e) => e.target.style.display='none'} />
              <div className={`font-extrabold text-2xl tracking-tight flex items-center transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                Kito<span className="text-primary">.</span>
              </div>
            </div>

            {/* Internal Login */}
            <div>
              <button className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${isScrolled ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg' : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 shadow-sm shadow-black/10 hover:shadow-md'}`}>
                <UserCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Internal Login</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center pt-20">
        <div className="absolute inset-0 z-0 bg-black">
          <img src={`/hero-frames/ezgif-frame-${String(currentFrame).padStart(3, '0')}.jpg`} alt="Hero Sequence" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">

            <h1 className="text-4xl md:text-5xl lg:text-5xl font-sans font-extrabold tracking-tight text-white leading-tight mb-6 opacity-0 animate-fade-in-up delay-100">
              Selamat Datang Di <span className="text-primary">
                KitoProperty
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl font-light leading-relaxed opacity-0 animate-fade-in-up delay-200">
              Temukan hunian impian atau ruang komersial terbaik untuk bisnis Anda di kota Padang!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up delay-300">
              <a href="#catalog" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-black bg-primary hover:bg-yellow-400 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/40">
                Cari Properti Sekarang
                <Search className="w-5 h-5 ml-2 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Exclusive Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Verified Exclusive</h2>
              <p className="text-slate-500 max-w-2xl">
                Properti pilihan dengan mandat eksklusif yang telah diverifikasi secara ketat oleh tim Kito Apps.
              </p>
            </div>
            <a href="#catalog" className="hidden md:flex items-center text-primary font-semibold hover:text-yellow-600 transition-colors mt-4 md:mt-0">
              Lihat Semua
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exclusiveListings.map(listing => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <a href="#catalog" className="inline-flex items-center justify-center w-full py-3 rounded-lg border border-slate-200 text-slate-700 font-medium">
              Lihat Semua Properti
            </a>
          </div>
        </div>
      </section>

      {/* Katalog Listing Utama */}
      <section id="catalog" className="py-20 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Katalog Properti</h2>
            <p className="text-slate-500">Jelajahi seluruh daftar properti yang tersedia.</p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-10 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">Tipe Properti</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                <option>Semua Tipe</option>
                <option>Rumah</option>
                <option>Ruko</option>
                <option>Tanah</option>
                <option>Gudang</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">Rentang Harga</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                <option>Semua Harga</option>
                <option>&lt; 500 Juta</option>
                <option>500 Jt - 1 Milyar</option>
                <option>1 M - 3 Milyar</option>
                <option>&gt; 3 Milyar</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">Area Kelurahan</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" placeholder="Ketik kelurahan di Padang..." className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
            </div>
            <div className="flex items-end">
              <button className="group w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 flex items-center justify-center">
                <Search className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                Terapkan
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {catalogListings.map(listing => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <button className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-slate-200 text-slate-600 font-semibold hover:border-slate-300 hover:bg-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95">
              Muat Lebih Banyak
            </button>
          </div>
        </div>
      </section>

      {/* Footer Minimalist */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="font-extrabold text-2xl tracking-tight text-slate-900 flex items-center justify-center md:justify-start mb-2">
              Kito<span className="text-primary">.</span>
            </div>
            <p className="text-slate-500 text-sm">© 2026 Kito Apps. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors text-sm font-medium">Kebijakan Privasi</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors text-sm font-medium">Syarat & Ketentuan</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors text-sm font-medium">Hubungi Kami</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/628000000000" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg shadow-green-500/30 hover:-translate-y-2 hover:shadow-green-500/50 active:scale-90 transition-all duration-300 flex items-center justify-center group">
        <Phone className="w-6 h-6 fill-current transition-transform group-hover:scale-110 group-hover:rotate-12" />
        <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md">
          Tanya Kito via WhatsApp
        </span>
      </a>
    </div>
  );
}

export default App;
