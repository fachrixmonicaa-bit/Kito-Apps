import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronRight, CheckCircle2, Home, Store, Map, Building2, ShieldCheck, BadgeDollarSign, Handshake, Newspaper, ArrowRight, Tag, Hammer, Info, Clock, CheckCircle, PhoneCall, ClipboardCheck, Megaphone, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProperties } from '../context/PropertyContext';

const LandingPage = () => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const totalFrames = 41;

  useEffect(() => {
    // Preload frames to prevent flickering
    for (let i = 1; i <= totalFrames; i++) {
      const img = new window.Image();
      img.src = `/hero-frames/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
    }

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev < totalFrames ? prev + 1 : 1));
    }, 100); 
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <img src={`/hero-frames/ezgif-frame-${String(currentFrame).padStart(3, '0')}.jpg`} alt="Hero Sequence" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent" />
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 w-full px-6 lg:px-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-sans font-extrabold tracking-tight text-white leading-tight mb-6 opacity-0 animate-fade-in-up delay-100">
              Selamat Datang Di <span className="text-primary">
                KitoProperty
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl font-light leading-relaxed opacity-0 animate-fade-in-up delay-200">
              Temukan hunian impian atau ruang komersial terbaik untuk bisnis Anda di kota Padang!
            </p>
            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up delay-300">
              <Link to="/properties" className="group inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] text-base md:text-lg font-bold rounded-full text-white glass hover:bg-primary hover:text-black hover:border-primary hover:-translate-y-1 active:scale-95 transition-all duration-300 flex-1 sm:flex-none min-w-[180px]">
                Cari Properti
                <Search className="w-5 h-5 ml-2 transition-transform group-hover:scale-110" />
              </Link>
              <Link to="/sell" className="group inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] text-base md:text-lg font-bold rounded-full text-white glass hover:bg-primary hover:text-black hover:border-primary hover:-translate-y-1 active:scale-95 transition-all duration-300 flex-1 sm:flex-none min-w-[180px]">
                Jual Properti
                <Tag className="w-5 h-5 ml-2 transition-transform group-hover:scale-110" />
              </Link>
              <Link to="/contact" className="group inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] text-base md:text-lg font-bold rounded-full text-white glass hover:bg-primary hover:text-black hover:border-primary hover:-translate-y-1 active:scale-95 transition-all duration-300 flex-1 sm:flex-none min-w-[180px]">
                Tentang Kito
                <Info className="w-5 h-5 ml-2 transition-transform group-hover:scale-110" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Floating Panel for Ads and News (Desktop Only) */}
        <div className="hidden lg:flex absolute right-8 top-28 bottom-12 w-[30%] max-w-[420px] z-20 flex-col opacity-0 animate-fade-in-up delay-[400ms]">
          
          {/* Ad Space - Premium Look */}
          <div className="mb-6 flex-shrink-0">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-[10px] text-white/50 uppercase font-bold tracking-[0.2em]">Partner Ads</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </div>
            <div className="w-full h-36 rounded-2xl flex items-end justify-start border border-white/20 group cursor-pointer hover:border-primary/80 transition-all relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
               {/* Fictitious Ad Image Background */}
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
               {/* Gradient Overlay for text readability */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
               
               {/* Fictitious Ad Content */}
               <div className="relative z-10 p-4 w-full">
                 <div className="inline-block px-2 py-0.5 bg-primary rounded text-[9px] font-black text-black uppercase tracking-wider mb-1">
                   Promo
                 </div>
                 <h4 className="text-white font-bold text-sm leading-tight mb-0.5 group-hover:text-primary transition-colors">
                   Grand Padang Residence
                 </h4>
                 <p className="text-white/80 text-[11px] font-medium">
                   Cicilan mulai <span className="text-primary font-bold">Rp 2 Juta/Bln</span>
                 </p>
               </div>
            </div>
          </div>

          {/* Kito News Headlines (Wrapped in Glass Shape) */}
          <div className="flex-1 flex flex-col p-6 glass-dark rounded-[28px] overflow-hidden">
            {/* Header ala Portal Berita */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10 shrink-0">
              <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-1">
                Kito<span className="text-primary font-serif font-light tracking-wide">News</span>
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest">Live</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </div>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              
              {/* News Item List 1 */}
              <div className="group cursor-pointer flex gap-3 items-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=200" alt="News 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-widest block mb-0.5">Investasi</span>
                  <h4 className="font-semibold text-[13px] text-white/90 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    Prospek Investasi Properti Komersial di Padang Semakin Menjanjikan
                  </h4>
                </div>
              </div>
              
              {/* News Item List 1 */}
              <div className="group cursor-pointer flex gap-3 items-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200" alt="News 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-0.5">Tips</span>
                  <h4 className="font-semibold text-[13px] text-white/90 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    5 Hal Wajib Dicek Sebelum Membeli Rumah Pertama Anda
                  </h4>
                </div>
              </div>
              
              {/* News Item List 2 */}
              <div className="group cursor-pointer flex gap-3 items-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=200" alt="News 3" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">Legal</span>
                  <h4 className="font-semibold text-[13px] text-white/90 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    Mengenal Perbedaan SHM, HGB, dan AJB Secara Tuntas
                  </h4>
                </div>
              </div>

            </div>
            
            <button className="mt-5 w-full py-3 rounded-xl bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white hover:text-black font-bold transition-all duration-300 text-sm flex items-center justify-center gap-2 shrink-0">
              Indeks Berita <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
