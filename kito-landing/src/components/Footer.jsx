import React from 'react';
import { Phone } from 'lucide-react';

const Footer = () => {
  return (
    <>
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
    </>
  );
};

export default Footer;
