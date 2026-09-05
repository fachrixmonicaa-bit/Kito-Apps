import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircle2, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // If not on landing page or sell page, always show the solid navbar
  const isLandingPage = location.pathname === '/' || location.pathname === '/sell';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClasses = isLandingPage && !isScrolled
    ? 'bg-transparent border-transparent py-2'
    : 'bg-[#EACE40] shadow-md border-b border-yellow-500/30';

  const textClasses = isLandingPage && !isScrolled ? 'text-white' : 'text-slate-900';
  const buttonClasses = isLandingPage && !isScrolled
    ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 shadow-sm shadow-black/10 hover:shadow-md'
    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarClasses}`}>
      <div className="w-full px-6 lg:px-16">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer">
            <img src="/logo.png" alt="Kito Apps" className={`h-10 w-auto object-contain rounded transition-all duration-300 ${isLandingPage && isScrolled ? 'brightness-0' : ''}`} onError={(e) => e.target.style.display='none'} />
            <div className={`font-extrabold text-2xl tracking-tight flex items-center transition-colors transform translate-y-[4px] -ml-1 ${textClasses}`}>
              <span className="font-light tracking-wide opacity-90 text-[22px] ml-[2px]">Property</span><span className={isLandingPage && !isScrolled ? "text-primary" : "text-white"}>.</span>
            </div>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/" className={`font-medium hover:text-primary transition-colors ${textClasses}`}>
                Home
              </Link>
              <Link to="/properties" className={`font-medium hover:text-primary transition-colors ${textClasses}`}>
                Cari Properti
              </Link>
              <Link to="/sell" className={`font-medium hover:text-primary transition-colors ${textClasses}`}>
                Jual Properti
              </Link>
              <Link to="/join" className={`font-medium hover:text-primary transition-colors ${textClasses}`}>
                Join Us
              </Link>
              <Link to="/news" className={`font-medium hover:text-primary transition-colors ${textClasses}`}>
                Kito News
              </Link>
            </div>

            {/* Tombol Hamburger HP */}
            <button 
              className={`lg:hidden p-1 transition-colors ${textClasses}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu HP */}
      <div 
        className={`lg:hidden absolute top-20 left-0 w-full bg-white shadow-xl flex flex-col border-t border-slate-100 overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100 py-2 px-6' : 'max-h-0 opacity-0 py-0 px-6'
        }`}
      >
        <Link to="/" className="text-slate-800 hover:text-primary font-medium py-3 border-b border-slate-100 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
        <Link to="/properties" className="text-slate-800 hover:text-primary font-medium py-3 border-b border-slate-100 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Cari Properti</Link>
        <Link to="/sell" className="text-slate-800 hover:text-primary font-medium py-3 border-b border-slate-100 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Jual Properti</Link>
        <Link to="/join" className="text-slate-800 hover:text-primary font-medium py-3 border-b border-slate-100 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Join Us</Link>
        <Link to="/news" className="text-slate-800 hover:text-primary font-medium py-3 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Kito News</Link>
      </div>
    </nav>
  );
};

export default Navbar;
