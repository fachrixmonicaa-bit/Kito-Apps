import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProperty, getZonaPerkembanganCategory } from '../../context/PropertyContext';
import { Save, Building2, MapPin, Tag, ListPlus, User, ImagePlus, X, ChevronRight, ChevronLeft } from 'lucide-react';

const ListingForm = ({ defaultType = 'Regular' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, listings, addListing, updateListing, addProperty, updateProperty, locations } = useProperty();

  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Group locations by kecamatan
  const uniqueKecamatan = [...new Set(locations.map(l => l.kecamatan))].sort();

  const [formData, setFormData] = useState({
    // --- PROPERTY PHYSICAL DATA ---
    sumber: '',
    urlSumber: '',
    alamat: '',
    kecamatan: '',
    kelurahan: '',
    googleMaps: '',
    jenisProperti: 'Rumah',
    tingkatBangunan: '1 Lantai',
    kondisiProperti: 'Standar',
    aksesJalan: 'Jalan Utama',
    posisiObjek: 'Tengah',
    legalitas: 'SHM',
    luasTanah: '',
    luasBangunan: '',
    kamarTidur: '0',
    kamarMandi: '0',
    hargaJual: '',
    hargaM2: '',
    skorMitigasi: '',
    skorUtilitas: '',
    zonaKawasan: 'Permukiman Standar',
    zonaPerkembangan: 'Netral',
    
    // --- LISTING SPECIFIC DATA ---
    tipeListing: defaultType,
    judulListing: '',
    hargaListing: '',
    agen: '',
    tanggalBerakhir: new Date().toLocaleDateString('en-CA'),
    status: 'Aktif',
    deskripsi: '',
    photos: [] // Array of base64 strings
  });

  const [linkedPropertyId, setLinkedPropertyId] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const listingToEdit = listings.find(l => l.listingId === id);
      if (listingToEdit) {
        // If we are editing, we also want to fetch the underlying physical property data
        // to populate the form, assuming it still exists.
        const propToEdit = properties.find(p => p.propertyId === listingToEdit.propertyId) || {};
        
        setFormData({
          ...propToEdit, // Load physical fields first
          ...listingToEdit, // Overlay with listing fields
          tanggalBerakhir: listingToEdit.tanggalBerakhir ? new Date(listingToEdit.tanggalBerakhir).toISOString().split('T')[0] : '',
          photos: listingToEdit.photos || []
        });
        setLinkedPropertyId(listingToEdit.propertyId);
      } else {
        navigate('/admin/listings/manage');
      }
    }
  }, [id, isEdit, listings, properties, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-fill logic when Kelurahan changes
    if (name === 'kelurahan') {
      const selectedLocation = locations.find(
        loc => loc.kecamatan === formData.kecamatan && loc.kelurahan === value
      );
      
      if (selectedLocation) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          skorMitigasi: selectedLocation.mitigasi,
          skorUtilitas: selectedLocation.utilitas,
          zonaKawasan: selectedLocation.kawasan,
          zonaPerkembangan: getZonaPerkembanganCategory(selectedLocation.bobot)
        }));
        return;
      }
    }

    // Reset kelurahan if kecamatan changes
    if (name === 'kecamatan') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        kelurahan: '' // Reset kelurahan so user must select the new one
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.replace(/\D/g, '')
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Simulate reading files as base64 for local storage prototyping
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, event.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Separate Physical Property Data vs Listing Data
    const propertyData = {
      sumber: formData.sumber,
      urlSumber: formData.urlSumber,
      alamat: formData.alamat,
      kecamatan: formData.kecamatan,
      kelurahan: formData.kelurahan,
      googleMaps: formData.googleMaps,
      jenisProperti: formData.jenisProperti,
      tingkatBangunan: formData.tingkatBangunan,
      kondisiProperti: formData.kondisiProperti,
      aksesJalan: formData.aksesJalan,
      posisiObjek: formData.posisiObjek,
      legalitas: formData.legalitas,
      luasTanah: formData.luasTanah,
      luasBangunan: formData.luasBangunan,
      kamarTidur: formData.kamarTidur,
      kamarMandi: formData.kamarMandi,
      hargaJual: formData.hargaJual,
      hargaM2: formData.hargaM2,
      skorMitigasi: formData.skorMitigasi,
      skorUtilitas: formData.skorUtilitas,
      zonaKawasan: formData.zonaKawasan,
      zonaPerkembangan: formData.zonaPerkembangan,
      // For standalone input, we align status
      status: formData.status === 'Terjual' ? 'Terjual' : 'Listing'
    };

    let finalPropertyId = linkedPropertyId;

    if (isEdit && linkedPropertyId) {
      updateProperty(linkedPropertyId, propertyData);
    } else {
      // Create new property in Database Properti
      finalPropertyId = addProperty(propertyData);
    }

    // 2. Listing Data
    const listingData = {
      propertyId: finalPropertyId,
      tipeListing: formData.tipeListing,
      judulListing: formData.judulListing,
      hargaListing: formData.hargaListing,
      agen: formData.agen,
      tanggalBerakhir: formData.tanggalBerakhir,
      status: formData.status,
      deskripsi: formData.deskripsi,
      photos: formData.photos
    };

    if (isEdit) {
      updateListing(id, listingData);
    } else {
      addListing(listingData);
    }
    
    navigate('/admin/listings/manage');
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 lg:gap-12 pt-4 pb-12">
      {/* LEFT COLUMN: Header & Progress */}
      <div className="lg:w-1/2 flex flex-col justify-start">
        <div className="lg:sticky lg:top-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-semibold mb-6 backdrop-blur-sm">
            <ListPlus size={16} className="text-primary" />
            {isEdit ? 'Edit Listing' : `Buat ${defaultType} Listing`}
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            {isEdit ? 'Edit' : 'Input'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Listing</span>
          </h1>
          <p className="text-slate-300 text-base lg:text-lg mb-10 leading-relaxed max-w-xl">
            Sistem akan otomatis membuat rekam jejak di <span className="font-semibold text-white">Database Properti</span> saat Anda mempublikasikan Listing ini.
          </p>
          
          {/* WIZARD PROGRESS */}
          <div className="flex flex-col gap-3 w-full lg:w-[85%] mb-8">
             <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-slate-200 text-sm font-bold uppercase tracking-widest">{currentStep === 1 ? 'Lokasi' : currentStep === 2 ? 'Karakteristik' : currentStep === 3 ? 'Harga' : 'Foto'}</span>
                <span className="text-slate-400 text-sm font-semibold">Langkah {currentStep}/{totalSteps}</span>
             </div>
             <div className="flex gap-2 w-full">
              {[1, 2, 3, 4].map(step => (
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
      <div className="lg:w-1/2">
        <form onSubmit={handleSubmit} className="w-full">
        <button id="listing-form-submit" type="submit" className="hidden">Submit Hidden</button>
        
        {/* WIZARD NAVIGATION BUTTONS (MOVED TO TOP) */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
          {currentStep > 1 ? (
            <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} className="px-5 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 transition-colors border border-white/5 flex items-center gap-2 text-sm">
              <ChevronLeft size={16} /> Kembali
            </button>
          ) : (
            <div></div>
          )}
          
          {currentStep < totalSteps ? (
            <button type="button" onClick={() => setCurrentStep(prev => prev + 1)} className="px-6 py-2.5 bg-primary/20 text-primary font-bold rounded-xl hover:bg-primary/30 transition-colors border border-primary/20 flex items-center gap-2 text-sm">
              Lanjut <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={() => document.getElementById('listing-form-submit').click()} className="px-6 py-2.5 bg-primary text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,202,64,0.3)] flex items-center gap-2 text-sm">
              <Save size={16} /> Simpan
            </button>
          )}
        </div>

        {/* LOCKED SECTION CONTAINER */}
        <div className="transition-all duration-500 relative min-h-[400px] mt-6">
          
          {/* LOKASI (Dari PropertyForm) */}
          {currentStep === 1 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                <MapPin className="text-primary" size={18} />
                1. Lokasi Properti
              </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Judul Listing</label>
              <input type="text" name="judulListing" value={formData.judulListing} onChange={handleChange} placeholder="Contoh: Rumah Mewah Minimalis Tropis di Pusat Kota" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all font-semibold" required />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Alamat Lengkap</label>
              <textarea name="alamat" value={formData.alamat} onChange={handleChange} rows="2" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Kecamatan</label>
              <select name="kecamatan" value={formData.kecamatan} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all" required>
                <option value="" disabled>-- Pilih Kecamatan --</option>
                {uniqueKecamatan.map(kec => (
                  <option key={kec} value={kec}>{kec}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Kelurahan</label>
              <select name="kelurahan" value={formData.kelurahan} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all" required disabled={!formData.kecamatan}>
                <option value="" disabled>-- Pilih Kelurahan --</option>
                {locations.filter(loc => loc.kecamatan === formData.kecamatan).map(loc => (
                  <option key={loc.kelurahan} value={loc.kelurahan}>{loc.kelurahan}</option>
                ))}
              </select>
            </div>
          </div>
          </div>
          )}

          {/* KARAKTERISTIK (Dari PropertyForm) */}
          {currentStep === 2 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
              <Building2 className="text-blue-400" size={18} />
              2. Karakteristik & Ukuran
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Jenis Properti</label>
              <select name="jenisProperti" value={formData.jenisProperti} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all">
                <option>Rumah</option>
                <option>Tanah</option>
                <option>Ruko</option>
                <option>Gudang</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Luas Tanah (m²)</label>
              <input type="number" name="luasTanah" value={formData.luasTanah} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Luas Bangunan (m²)</label>
              <input type="number" name="luasBangunan" value={formData.luasBangunan} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Kamar Tidur</label>
              <div className="flex gap-2">
                <select 
                  value={!['0','1','2','3','4','5','6'].includes(String(formData.kamarTidur)) ? 'Custom' : String(formData.kamarTidur)} 
                  onChange={(e) => {
                    if (e.target.value === 'Custom') {
                      handleChange({ target: { name: 'kamarTidur', value: '7' } });
                    } else {
                      handleChange({ target: { name: 'kamarTidur', value: e.target.value } });
                    }
                  }} 
                  className={`bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all ${!['0','1','2','3','4','5','6'].includes(String(formData.kamarTidur)) ? 'w-1/2' : 'w-full'}`}
                >
                  <option value="0">Tidak Ada</option>
                  {[1, 2, 3, 4, 5, 6].map(i => <option key={`kt-${i}`} value={i}>{i}</option>)}
                  <option value="Custom">Custom...</option>
                </select>
                {!['0','1','2','3','4','5','6'].includes(String(formData.kamarTidur)) && (
                  <input type="number" name="kamarTidur" value={formData.kamarTidur} onChange={handleChange} min="0" className="w-1/2 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Kamar Mandi</label>
              <div className="flex gap-2">
                <select 
                  value={!['0','1','2','3','4','5','6'].includes(String(formData.kamarMandi)) ? 'Custom' : String(formData.kamarMandi)} 
                  onChange={(e) => {
                    if (e.target.value === 'Custom') {
                      handleChange({ target: { name: 'kamarMandi', value: '7' } });
                    } else {
                      handleChange({ target: { name: 'kamarMandi', value: e.target.value } });
                    }
                  }} 
                  className={`bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all ${!['0','1','2','3','4','5','6'].includes(String(formData.kamarMandi)) ? 'w-1/2' : 'w-full'}`}
                >
                  <option value="0">Tidak Ada</option>
                  {[1, 2, 3, 4, 5, 6].map(i => <option key={`km-${i}`} value={i}>{i}</option>)}
                  <option value="Custom">Custom...</option>
                </select>
                {!['0','1','2','3','4','5','6'].includes(String(formData.kamarMandi)) && (
                  <input type="number" name="kamarMandi" value={formData.kamarMandi} onChange={handleChange} min="0" className="w-1/2 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Kondisi {formData.jenisProperti === 'Tanah' ? 'Tanah' : 'Bangunan'}</label>
              <select name="kondisiProperti" value={formData.kondisiProperti} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all">
                {formData.jenisProperti === 'Tanah' ? (
                  <>
                    <option>Kavling Siap Bangun</option>
                    <option>Timbun</option>
                    <option>Perbukitan</option>
                  </>
                ) : (
                  <>
                    <option>Baru</option>
                    <option>Standar</option>
                    <option>Mewah</option>
                    <option>Perlu Renovasi</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tingkat Bangunan</label>
              <select name="tingkatBangunan" value={formData.tingkatBangunan} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all">
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
              <label className="block text-sm font-medium text-slate-300 mb-2">Legalitas</label>
              <select name="legalitas" value={formData.legalitas} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all">
                <option>SHM</option>
                <option>HGB</option>
                <option>AJB/PPJB</option>
                <option>Girik/Letter C</option>
              </select>
            </div>
          </div>
          </div>
          )}

          
          {/* DATA LISTING (Harga Publik, Agen, dll) */}
          {currentStep === 3 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
              <Tag className="text-emerald-400" size={18} />
              3. Detail Penawaran (Listing)
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="hidden">
              <label className="block text-sm font-medium text-slate-300 mb-2">Harga Database Master (Internal)</label>
              <input type="text" name="hargaJual" value={formData.hargaJual ? new Intl.NumberFormat('id-ID').format(formData.hargaJual) : ''} onChange={handleCurrencyChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Harga Penawaran Publik (Rp)</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 font-medium">Rp</span>
                <input type="text" name="hargaListing" value={formData.hargaListing ? new Intl.NumberFormat('id-ID').format(formData.hargaListing) : ''} onChange={handleCurrencyChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-white transition-all text-lg font-bold" required />
              </div>
              <p className="text-xs text-slate-500 mt-2">Harga ini yang akan terlihat oleh calon pembeli.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Status Listing</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-white transition-all font-semibold">
                <option value="Aktif">Aktif / Tersedia</option>
                <option value="Draft">Draft (Disembunyikan)</option>
                <option value="Terjual">Terjual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tipe Listing</label>
              <select name="tipeListing" value={formData.tipeListing} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-white transition-all">
                <option>Regular</option>
                <option>Exclusive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Agen / Broker Bertugas</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400"><User size={16} /></span>
                <input type="text" name="agen" value={formData.agen} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-white transition-all" placeholder="Nama agen yang memasarkan..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Masa Berlaku Listing (Expired Date)</label>
              <input type="date" name="tanggalBerakhir" value={formData.tanggalBerakhir} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-white transition-all [color-scheme:dark]" />
            </div>

            <div className="col-span-1 mt-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Deskripsi Marketing</label>
              <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows="3" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-white transition-all custom-scrollbar" placeholder="Ketik promosi properti..." />
            </div>

          </div>
          </div>
          )}


          {/* FOTO LISTING */}
          {currentStep === 4 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
              <ImagePlus className="text-purple-400" size={18} />
              4. Foto Properti
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                  <img src={photo} alt={`Upload ${index+1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => removePhoto(index)} className="p-2 bg-rose-500 rounded-full text-white hover:scale-110 transition-transform">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              <label className="aspect-square rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-400 group">
                <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
                <ImagePlus size={24} className="mb-2 group-hover:text-purple-400 transition-colors" />
                <span className="text-xs font-medium">Tambah Foto</span>
              </label>
            </div>
            <p className="text-xs text-slate-500">Maksimal resolusi yang disarankan adalah 1MB per foto untuk performa optimal.</p>
          </div>
          )}

        </div>
        </form>
      </div>
    </div>
  );
};

export default ListingForm;
