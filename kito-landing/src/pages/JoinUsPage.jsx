import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const JoinUsPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    domicile: ''
  });

  const isFormValid = formData.fullName && formData.phone && formData.email && formData.domicile;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans flex flex-col">
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        
        {/* Card Container */}
        <div className="max-w-5xl w-full bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Side: Image / Hero */}
          <div className="lg:w-1/2 relative bg-[#802B21] min-h-[400px] lg:min-h-full flex items-end justify-center">
            {/* We use a sample team image that blends well with a colored background */}
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
              alt="Kito Team" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
            />
            {/* Adding a gradient to ensure it looks elegant */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#802B21] via-transparent to-transparent"></div>
            
            <div className="relative z-10 p-10 text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-2">Jadilah Bagian dari Kami</h2>
              <p className="text-white/80">Kembangkan karir properti Anda bersama tim profesional KitoApps.</p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <h2 className="text-2xl md:text-[28px] font-bold text-slate-900 mb-2 leading-tight">
              Gabung Bersama Kami Sekarang
            </h2>
            <p className="text-slate-500 mb-8">
              Raih peluang jadi agen properti sukses.
            </p>

            <form className="space-y-6">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Masukkan Nama Lengkap"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm placeholder:text-slate-400"
                />
              </div>

              {/* Nomor Telepon */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <div className="flex-shrink-0 bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-4 py-3.5 flex items-center justify-center text-slate-600 font-medium text-sm">
                    +62
                  </div>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Masukkan Nomor Telepon"
                    className="w-full border border-slate-200 rounded-r-xl px-4 py-3.5 text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Masukkan Email"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm placeholder:text-slate-400"
                />
              </div>

              {/* Domisili */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Domisili Anda <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  name="domicile"
                  value={formData.domicile}
                  onChange={handleChange}
                  placeholder="Masukkan Domisili Anda"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm placeholder:text-slate-400"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="button"
                className={`w-full py-4 mt-4 rounded-xl font-bold text-base transition-all duration-300 ${
                  isFormValid 
                    ? 'bg-primary text-slate-900 shadow-lg hover:bg-yellow-400 hover:-translate-y-0.5' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Selanjutnya
              </button>
            </form>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JoinUsPage;
