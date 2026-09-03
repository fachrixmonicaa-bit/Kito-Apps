import React, { useRef, useState } from 'react';
import { Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SellPropertyPage = () => {
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nomorTelepon: '',
    jenisTitipan: 'jual', // jual or sewa
    tipeProperti: '',
    harga: '',
    alamat: '',
    spesifikasi: '',
    isOwner: false,
  });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const isFormValid = formData.namaLengkap && formData.nomorTelepon && formData.tipeProperti && formData.harga && formData.alamat && formData.spesifikasi && formData.isOwner;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center pt-20 bg-slate-900">
        <div className="absolute inset-0 z-0 bg-slate-900">
           {/* Abstract gradients */}
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Content */}
            <div className="w-full lg:w-1/2">
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-sans font-extrabold tracking-tight text-white leading-tight mb-6 opacity-0 animate-fade-in-up delay-100">
                Titip Jual atau Sewa <span className="text-primary">
                  Properti Anda
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl font-light leading-relaxed opacity-0 animate-fade-in-up delay-200">
                Percayakan pemasaran properti Anda kepada agen profesional KitoProperty untuk transaksi yang aman, cepat, dan transparan.
              </p>
              <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up delay-300">
                <button 
                  onClick={scrollToForm}
                  className="group inline-flex items-center justify-center px-6 py-3.5 text-base md:text-lg font-bold rounded-full text-white bg-transparent border border-white/50 backdrop-blur-sm hover:bg-primary hover:text-black hover:border-primary hover:-translate-y-1 active:scale-95 transition-all duration-300 flex-1 sm:flex-none min-w-[180px]"
                >
                  Isi Form Sekarang
                </button>
              </div>
            </div>

            {/* Right Content - 4 Keuntungan */}
            <div className="w-full lg:w-1/2 flex justify-end">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl w-full max-w-md shadow-2xl opacity-0 animate-fade-in delay-400">
                <h3 className="text-2xl font-bold text-white mb-6 opacity-0 animate-fade-in-up delay-400">Keuntungan Titip di Kito</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4 opacity-0 animate-fade-in-up delay-500">
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/20">
                      <Check className="w-5 h-5 font-bold" />
                    </div>
                    <span className="text-lg text-slate-100 font-medium">Prioritas penanganan</span>
                  </li>
                  <li className="flex items-start gap-4 opacity-0 animate-fade-in-up delay-600">
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/20">
                      <Check className="w-5 h-5 font-bold" />
                    </div>
                    <span className="text-lg text-slate-100 font-medium">Laporan pemasaran secara berkala</span>
                  </li>
                  <li className="flex items-start gap-4 opacity-0 animate-fade-in-up delay-700">
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/20">
                      <Check className="w-5 h-5 font-bold" />
                    </div>
                    <span className="text-lg text-slate-100 font-medium">Jangkauan lebih luas</span>
                  </li>
                  <li className="flex items-start gap-4 opacity-0 animate-fade-in-up delay-800">
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/20">
                      <Check className="w-5 h-5 font-bold" />
                    </div>
                    <span className="text-lg text-slate-100 font-medium">Konsistensi informasi di seluruh kanal</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Form Section */}
      <section ref={formRef} className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Titip Jual atau Sewa Properti Anda</h2>
              <p className="text-slate-500">Silahkan masukan informasi di bawah ini</p>
            </div>

            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              
              {/* Data Diri */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Informasi Data Diri</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleInputChange}
                      placeholder="Masukkan Nama Lengkap" 
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-600 sm:text-sm font-medium">
                        +62
                      </span>
                      <input 
                        type="tel" 
                        name="nomorTelepon"
                        value={formData.nomorTelepon}
                        onChange={handleInputChange}
                        placeholder="Masukkan Nomor Telepon" 
                        className="w-full border border-slate-300 rounded-r-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informasi Properti */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Informasi Properti</h3>
                
                <div className="space-y-6">
                  {/* Radio Type */}
                  <div className="flex gap-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="jenisTitipan" 
                        value="jual" 
                        checked={formData.jenisTitipan === 'jual'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-primary focus:ring-primary border-slate-300"
                      />
                      <span className="text-slate-700 font-medium">Titip Jual</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="jenisTitipan" 
                        value="sewa" 
                        checked={formData.jenisTitipan === 'sewa'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-primary focus:ring-primary border-slate-300"
                      />
                      <span className="text-slate-700 font-medium">Titip Sewa</span>
                    </label>
                  </div>

                  {/* Property Type Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tipe Properti <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="tipeProperti"
                      value={formData.tipeProperti}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-slate-700"
                    >
                      <option value="" disabled>Pilih Tipe Properti</option>
                      <option value="Rumah">Rumah</option>
                      <option value="Ruko">Ruko</option>
                      <option value="Tanah">Tanah</option>
                      <option value="Apartemen">Apartemen</option>
                      <option value="Gudang">Gudang</option>
                    </select>
                  </div>

                  {/* Harga */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Harga <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-600 sm:text-sm font-medium">
                        Rp
                      </span>
                      <input 
                        type="text" 
                        name="harga"
                        value={formData.harga}
                        onChange={handleInputChange}
                        placeholder="Masukan Harga" 
                        className="w-full border border-slate-300 rounded-r-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Alamat */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Alamat Properti <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      placeholder="Masukkan Alamat Lengkap Properti" 
                      rows={3}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    />
                  </div>

                  {/* Spesifikasi */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Spesifikasi Properti <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      name="spesifikasi"
                      value={formData.spesifikasi}
                      onChange={handleInputChange}
                      placeholder="Masukkan Spesifikasi dari Properti Anda" 
                      rows={4}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Checkbox */}
              <div className="pt-6 border-t border-slate-100">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-0.5">
                    <input 
                      type="checkbox" 
                      name="isOwner"
                      checked={formData.isOwner}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary"
                    />
                  </div>
                  <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                    Dengan ini, saya menyatakan bahwa saya adalah Pemilik Langsung Properti yang akan menitipkan properti untuk di jual/sewa dan informasi yang saya berikan adalah benar dan akurat
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    isFormValid 
                      ? 'bg-primary text-black shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:bg-yellow-400' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Kirim
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SellPropertyPage;
