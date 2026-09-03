import React, { useMemo } from 'react';
import businessCategories from '../../data/businessCategories.json';

const BusinessCategorySelector = ({ 
  value = { kategoriUtama: '', subKategori: '', jenisSpesifik: '' }, 
  onChange,
  className = ''
}) => {
  const { kategoriUtama, subKategori, jenisSpesifik } = value;

  // Memoize options based on current selections
  const kategoriUtamaOptions = useMemo(() => {
    return businessCategories.map(cat => cat.kategori_utama);
  }, []);

  const subKategoriOptions = useMemo(() => {
    if (!kategoriUtama) return [];
    const cat = businessCategories.find(c => c.kategori_utama === kategoriUtama);
    return cat ? cat.sub_kategori.map(sub => sub.nama) : [];
  }, [kategoriUtama]);

  const jenisSpesifikOptions = useMemo(() => {
    if (!kategoriUtama || !subKategori) return [];
    const cat = businessCategories.find(c => c.kategori_utama === kategoriUtama);
    if (!cat) return [];
    const sub = cat.sub_kategori.find(s => s.nama === subKategori);
    return sub ? sub.jenis_spesifik : [];
  }, [kategoriUtama, subKategori]);

  const handleKategoriUtamaChange = (e) => {
    onChange({
      kategoriUtama: e.target.value,
      subKategori: '',
      jenisSpesifik: ''
    });
  };

  const handleSubKategoriChange = (e) => {
    onChange({
      ...value,
      subKategori: e.target.value,
      jenisSpesifik: ''
    });
  };

  const handleJenisSpesifikChange = (e) => {
    onChange({
      ...value,
      jenisSpesifik: e.target.value
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Bidang Usaha (Kategori Utama)</label>
        <select 
          value={kategoriUtama} 
          onChange={handleKategoriUtamaChange} 
          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all"
        >
          <option value="" disabled>-- Pilih Bidang Usaha --</option>
          {kategoriUtamaOptions.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {kategoriUtama && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Sub Bidang Usaha</label>
          <select 
            value={subKategori} 
            onChange={handleSubKategoriChange} 
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <option value="" disabled>-- Pilih Sub Bidang --</option>
            {subKategoriOptions.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {subKategori && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Jenis Usaha Spesifik</label>
          <select 
            value={jenisSpesifik} 
            onChange={handleJenisSpesifikChange} 
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <option value="" disabled>-- Pilih Spesifik --</option>
            {jenisSpesifikOptions.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default BusinessCategorySelector;
