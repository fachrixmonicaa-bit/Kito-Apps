import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProperty, getZonaPerkembanganCategory } from '../../context/PropertyContext';
import { Save, Building2, MapPin, Tag, ListPlus, Briefcase } from 'lucide-react';
import BusinessCategorySelector from '../../components/forms/BusinessCategorySelector';

const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, addProperty, updateProperty, locations } = useProperty();

  const isEdit = Boolean(id);

  // Group locations by kecamatan
  const uniqueKecamatan = [...new Set(locations.map(l => l.kecamatan))].sort();

  const [formData, setFormData] = useState({
    sumber: '',
    urlSumber: '',
    waktu: new Date().toLocaleDateString('en-CA'),
    status: 'Listing',
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
    hargaJual: '',
    hargaM2: '',
    njop: '',
    skorMitigasi: '',
    skorUtilitas: '',
    zonaKawasan: 'Permukiman Standar',
    zonaPerkembangan: 'Netral',
    catatan: '',
    peruntukanUsaha: { kategoriUtama: '', subKategori: '', jenisSpesifik: '' }
  });

  useEffect(() => {
    if (isEdit) {
      // Use == (loose) or String() because DB returns number but URL param is string
      const propToEdit = properties.find(p => String(p.propertyId) === String(id));
      if (propToEdit) {
        let parsedWaktu = propToEdit.waktu || '';
        if (parsedWaktu && parsedWaktu.includes('T')) {
           parsedWaktu = parsedWaktu.split('T')[0];
        } else if (!parsedWaktu && propToEdit.tanggalInput) {
           try {
             parsedWaktu = new Date(propToEdit.tanggalInput).toISOString().split('T')[0];
           } catch (e) {
             parsedWaktu = '';
           }
        }
        
        setFormData({
           ...propToEdit,
           waktu: parsedWaktu,
           status: propToEdit.status || 'Listing'
        });
      } else {
        navigate('/admin/properties');
      }
    }
  }, [id, isEdit, properties, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await updateProperty(id, formData);
    } else {
      await addProperty(formData);
    }
    navigate('/admin/properties');
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* HEADER SECTION */}
      <div className="relative rounded-3xl overflow-hidden mb-6">
        <div className="relative z-10 py-8 lg:py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-4 backdrop-blur-sm">
              <ListPlus size={14} className="text-primary" />
              {isEdit ? 'Edit Data' : 'Form Data Baru'}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
              {isEdit ? 'Edit' : 'Input'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Properti</span>
            </h1>
            <p className="text-slate-300 max-w-lg mb-0">
              Masukkan kelengkapan data fisik dan legalitas properti secara presisi untuk keperluan listing dan valuasi.
            </p>
          </div>
          <div className="shrink-0 flex gap-3">
            <button 
              type="button" 
              onClick={() => navigate('/admin/properties')} 
              className="px-6 py-4 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-300"
            >
              Batal
            </button>
            <button 
              type="button"
              onClick={() => document.getElementById('prop-form-submit').click()}
              className="px-8 py-4 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(234,202,64,0.3)] flex items-center gap-2"
            >
              <Save size={20} />
              Simpan
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-12">
        <button id="prop-form-submit" type="submit" className="hidden">Submit Hidden</button>
        
        {/* Lokasi & Identitas */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <MapPin className="text-primary" />
            Lokasi & Sumber
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all">
                <option value="Listing">Listing</option>
                <option value="Terjual">Terjual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Waktu (Tanggal)</label>
              <input type="date" name="waktu" value={formData.waktu} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all [color-scheme:dark]" required />
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
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Sumber Informasi (Opsional)</label>
              <input type="text" name="sumber" value={formData.sumber} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all" placeholder="Cth: Rumah123, Agen Rekan" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Link URL Google Maps (Opsional)</label>
              <input type="url" name="googleMaps" value={formData.googleMaps} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all" placeholder="https://maps.google.com/..." />
            </div>
          </div>
        </div>

        {/* Karakteristik & Ukuran */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <Building2 className="text-blue-400" />
            Karakteristik & Ukuran
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <label className="block text-sm font-medium text-slate-300 mb-2">Luas Tanah (m²)</label>
              <input type="number" name="luasTanah" value={formData.luasTanah} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Luas Bangunan (m²)</label>
              <input type="number" name="luasBangunan" value={formData.luasBangunan} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all" />
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
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Akses Jalan</label>
              <select name="aksesJalan" value={formData.aksesJalan} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all">
                <option>Jalan Utama</option>
                <option>Jalan Sekunder</option>
                <option>Jalan Gang</option>
                <option>Tanpa Akses (Land Locked)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Posisi Objek</label>
              <select name="posisiObjek" value={formData.posisiObjek} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all">
                <option>Tengah</option>
                <option>Hook</option>
              </select>
            </div>
          </div>
        </div>

        {/* Peruntukan Usaha Khusus Komersial */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
          <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Briefcase className="text-yellow-400" />
              Rekomendasi Peruntukan Usaha
            </h2>
            <span className="text-xs font-medium bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
              Optimal untuk Properti Komersial
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-6">Pilih klasifikasi bisnis yang paling cocok jika properti ini disewakan/dijual untuk ruang usaha.</p>
          <BusinessCategorySelector 
            value={formData.peruntukanUsaha}
            onChange={(val) => setFormData(prev => ({ ...prev, peruntukanUsaha: val }))}
          />
        </div>

        {/* Harga & Data Valuasi Default */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <Tag className="text-emerald-400" />
            Harga Asli & Data Lokasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Harga Jual / Penawaran Publik (Rp)</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 font-medium">Rp</span>
                <input type="text" name="hargaJual" value={formData.hargaJual ? new Intl.NumberFormat('id-ID').format(formData.hargaJual) : ''} onChange={handleCurrencyChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-white transition-all" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Harga per m² (Rp)</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 font-medium">Rp</span>
                <input type="number" name="hargaM2" value={formData.hargaM2} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-white transition-all" placeholder="Otomatis / Opsional" />
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2 mt-2 p-5 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4">Informasi Tambahan untuk Valuasi</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Skor Mitigasi (0-100)</label>
                  <input type="number" name="skorMitigasi" value={formData.skorMitigasi} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Skor Utilitas (0-100)</label>
                  <input type="number" name="skorUtilitas" value={formData.skorUtilitas} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Zona Kawasan</label>
                  <select name="zonaKawasan" value={formData.zonaKawasan} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                    <option>Komersial Utama</option>
                    <option>Dekat Pusat Keramaian</option>
                    <option>Komersial Sekunder</option>
                    <option>Permukiman Standar</option>
                    <option>Pinggiran / Industri</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Zona Perkembangan</label>
                  <select name="zonaPerkembangan" value={formData.zonaPerkembangan} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                    <option>Puncak</option>
                    <option>Berkembang Pesat</option>
                    <option>Berkembang</option>
                    <option>Netral</option>
                    <option>Tertinggal</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 mt-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Catatan Internal</label>
              <textarea name="catatan" value={formData.catatan} onChange={handleChange} rows="3" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-white transition-all" />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default PropertyForm;
