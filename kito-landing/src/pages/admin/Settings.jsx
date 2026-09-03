import React, { useState } from 'react';
import { Save, UserCircle2, Bell, Shield, Map, Calculator } from 'lucide-react';
import { useProperty, getZonaPerkembanganCategory } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useRef } from 'react';

const Settings = () => {
  const { locations, updateLocation, correctionFactors, updateCorrectionFactors, valuationSettings, updateValuationSettings } = useProperty();
  const [activeTab, setActiveTab] = useState('profil');

  const [factorsForm, setFactorsForm] = useState(correctionFactors || {
    akses: 10, posisi: 5, legalitas: 10, kawasan: 8, perkembangan: 2.5, mitigasi: 0.35, utilitas: 0.2
  });

  const [valSettingsForm, setValSettingsForm] = useState(valuationSettings || {
    basePrices: { 'Rumah': 3500000, 'Ruko': 4000000, 'Gudang': 3000000, 'Tanah': 0 },
    tingkatMultipliers: {}, kondisiMultipliers: {}, tanahDiscounts: { 'Perbukitan': 15, 'TimbunPerMeter': 5 }
  });

  useEffect(() => {
    if (correctionFactors) setFactorsForm(correctionFactors);
  }, [correctionFactors]);
  
  useEffect(() => {
    if (valuationSettings) setValSettingsForm(valuationSettings);
  }, [valuationSettings]);

  const handleSaveFactors = (e) => {
    e.preventDefault();
    updateCorrectionFactors(factorsForm);
    updateValuationSettings(valSettingsForm);
    alert('Faktor Koreksi berhasil disimpan!');
  };

  const { user, updateProfile } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    photo: user?.photo || null
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        photo: user.photo || null
      });
    }
  }, [user]);

  // State for editing location inline
  const [editLoc, setEditLoc] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profile);
    alert('Pengaturan Profil berhasil disimpan!');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditLocation = (loc) => {
    setEditLoc(`${loc.kecamatan}-${loc.kelurahan}`);
    setEditForm(loc);
  };

  const saveLocation = () => {
    updateLocation(editForm.kecamatan, editForm.kelurahan, {
      mitigasi: parseFloat(editForm.mitigasi),
      utilitas: parseFloat(editForm.utilitas),
      kawasan: editForm.kawasan,
      bobot: parseFloat(editForm.bobot),
      koreksiLuas: parseFloat(editForm.koreksiLuas ?? 1.0)
    });
    setEditLoc(null);
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      
      {/* HEADER SECTION */}
      <div className="relative rounded-3xl overflow-hidden mb-8">
        <div className="relative z-10 py-8 lg:py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-4 backdrop-blur-sm">
              <Shield size={14} className="text-primary" />
              Pengaturan {user?.role === 'admin' ? 'Sistem' : 'Akun'}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
              Pengaturan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">{user?.role === 'admin' ? 'Sistem' : 'Akun'}</span>
            </h1>
            <p className="text-slate-300 max-w-lg mb-0">
              Kelola profil, keamanan akses, {user?.role === 'admin' ? 'dan data master sistem' : 'serta informasi agen'} KitoApps.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]">
        
        {/* Settings Nav */}
        <div className="w-full md:w-72 bg-slate-900/60 border-b md:border-b-0 md:border-r border-white/10 p-6">
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('profil')}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all ${activeTab === 'profil' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
            >
              <UserCircle2 size={18} /> Profil
            </button>
            
            {user?.role === 'admin' && (
              <>
                <button 
                  onClick={() => setActiveTab('master')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all ${activeTab === 'master' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                  <Map size={18} /> Master Data Wilayah
                </button>
                <button 
                  onClick={() => setActiveTab('valuasi')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all ${activeTab === 'valuasi' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                  <Calculator size={18} /> Faktor Koreksi Valuasi
                </button>
              </>
            )}
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all font-medium border border-transparent">
              <Bell size={18} /> Notifikasi
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all font-medium border border-transparent">
              <Shield size={18} /> Keamanan
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6 md:p-10 overflow-x-auto">
          
          {activeTab === 'profil' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-8 border-b border-white/10 pb-4">Informasi Profil</h2>
              <form onSubmit={handleSaveProfile} className="space-y-8">
                <div className="flex items-center gap-6 mb-8">
                  {profile.photo ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-slate-800">
                      <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-tr from-primary to-yellow-600 rounded-full flex items-center justify-center text-slate-900 shadow-lg border-4 border-slate-800 font-extrabold text-3xl">
                      {profile.name ? profile.name.substring(0, 2).toUpperCase() : 'AK'}
                    </div>
                  )}
                  <div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handlePhotoUpload}
                    />
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current.click()}
                      className="px-5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm font-semibold text-white hover:bg-white/20 transition-all"
                    >
                      Ubah Foto
                    </button>
                    <p className="text-xs text-slate-400 mt-3">Format disarankan: JPG/PNG, maks 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Nama Lengkap</label>
                    <input 
                      type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Alamat Email</label>
                    <input 
                      type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Nomor Telepon</label>
                    <input 
                      type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white transition-all" 
                    />
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <button type="submit" className="px-8 py-4 bg-primary text-black font-bold rounded-xl shadow-[0_0_20px_rgba(234,202,64,0.3)] hover:bg-yellow-400 hover:scale-105 active:scale-95 flex items-center gap-2 transition-all">
                    <Save size={20} />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'master' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Master Data Wilayah</h2>
              <p className="text-slate-400 mb-8 border-b border-white/10 pb-4 text-sm">
                Kelola data faktor koreksi untuk setiap Kelurahan. Data ini akan otomatis terisi saat menambah/mengedit properti.
              </p>

              <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="p-4 font-semibold text-white">Kecamatan & Kelurahan</th>
                      <th className="p-4 font-semibold text-white text-center">Skor Mitigasi</th>
                      <th className="p-4 font-semibold text-white text-center">Skor Utilitas</th>
                      <th className="p-4 font-semibold text-white">Zona Kawasan</th>
                      <th className="p-4 font-semibold text-white text-center">Skor / Zona Perkembangan</th>
                      <th className="p-4 font-semibold text-white text-center">Koreksi Luas (%)</th>
                      <th className="p-4 font-semibold text-white text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {locations.map((loc) => {
                      const isEditing = editLoc === `${loc.kecamatan}-${loc.kelurahan}`;
                      return (
                        <tr key={`${loc.kecamatan}-${loc.kelurahan}`} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="font-semibold text-white">{loc.kelurahan}</div>
                            <div className="text-xs text-slate-500">{loc.kecamatan}</div>
                          </td>
                          <td className="p-4 text-center">
                            {isEditing ? (
                              <input type="number" step="0.1" value={editForm.mitigasi} onChange={e => setEditForm({...editForm, mitigasi: e.target.value})} className="w-20 bg-black/50 border border-white/20 rounded px-2 py-1 text-center text-white" />
                            ) : loc.mitigasi}
                          </td>
                          <td className="p-4 text-center">
                            {isEditing ? (
                              <input type="number" step="0.1" value={editForm.utilitas} onChange={e => setEditForm({...editForm, utilitas: e.target.value})} className="w-20 bg-black/50 border border-white/20 rounded px-2 py-1 text-center text-white" />
                            ) : loc.utilitas}
                          </td>
                          <td className="p-4">
                            {isEditing ? (
                              <select value={editForm.kawasan} onChange={e => setEditForm({...editForm, kawasan: e.target.value})} className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-white">
                                <option>Komersial Utama</option>
                                <option>Dekat Pusat Keramaian</option>
                                <option>Komersial Kuat</option>
                                <option>Komersial Sekunder</option>
                                <option>Permukiman Standar</option>
                                <option>Pinggiran/Aktivitas Rendah</option>
                                <option>Pinggiran / Industri</option>
                              </select>
                            ) : loc.kawasan}
                          </td>
                          <td className="p-4 text-center">
                            {isEditing ? (
                              <div className="flex flex-col gap-1 items-center">
                                <input type="number" step="0.01" value={editForm.bobot} onChange={e => setEditForm({...editForm, bobot: e.target.value})} className="w-20 bg-black/50 border border-white/20 rounded px-2 py-1 text-center text-white" />
                                <span className="text-[10px] text-primary">{getZonaPerkembanganCategory(editForm.bobot)}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <span>{loc.bobot}</span>
                                <span className="text-[10px] text-primary">{getZonaPerkembanganCategory(loc.bobot)}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {isEditing ? (
                              <input type="number" step="0.1" value={editForm.koreksiLuas ?? 1.0} onChange={e => setEditForm({...editForm, koreksiLuas: e.target.value})} className="w-20 bg-black/50 border border-white/20 rounded px-2 py-1 text-center text-white" />
                            ) : (loc.koreksiLuas ?? 1.0) + '%'}
                          </td>
                          <td className="p-4 text-center">
                            {isEditing ? (
                              <div className="flex justify-center gap-2">
                                <button onClick={saveLocation} className="text-green-400 hover:text-green-300 text-xs font-semibold px-2 py-1 bg-green-400/10 rounded">Simpan</button>
                                <button onClick={() => setEditLoc(null)} className="text-slate-400 hover:text-white text-xs px-2 py-1">Batal</button>
                              </div>
                            ) : (
                              <button onClick={() => startEditLocation(loc)} className="text-blue-400 hover:text-blue-300 text-xs font-semibold bg-blue-400/10 px-3 py-1.5 rounded-lg transition-colors">
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'valuasi' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Faktor Koreksi Valuasi</h2>
              <p className="text-slate-400 mb-8 border-b border-white/10 pb-4 text-sm">
                Atur besaran persentase pengurangan nilai properti untuk masing-masing faktor koreksi.
              </p>
              
              <form onSubmit={handleSaveFactors} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Akses Jalan (% per tingkat)</label>
                    <div className="relative flex items-center">
                      <input type="number" step="0.1" value={factorsForm.akses} onChange={e => setFactorsForm({...factorsForm, akses: parseFloat(e.target.value)})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white" />
                      <span className="absolute right-4 text-slate-400">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Posisi Objek (% per tingkat)</label>
                    <div className="relative flex items-center">
                      <input type="number" step="0.1" value={factorsForm.posisi} onChange={e => setFactorsForm({...factorsForm, posisi: parseFloat(e.target.value)})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white" />
                      <span className="absolute right-4 text-slate-400">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Legalitas (% per tingkat)</label>
                    <div className="relative flex items-center">
                      <input type="number" step="0.1" value={factorsForm.legalitas} onChange={e => setFactorsForm({...factorsForm, legalitas: parseFloat(e.target.value)})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white" />
                      <span className="absolute right-4 text-slate-400">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Zona Kawasan (% per tingkat)</label>
                    <div className="relative flex items-center">
                      <input type="number" step="0.1" value={factorsForm.kawasan} onChange={e => setFactorsForm({...factorsForm, kawasan: parseFloat(e.target.value)})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white" />
                      <span className="absolute right-4 text-slate-400">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Zona Perkembangan (% per tingkat)</label>
                    <div className="relative flex items-center">
                      <input type="number" step="0.1" value={factorsForm.perkembangan} onChange={e => setFactorsForm({...factorsForm, perkembangan: parseFloat(e.target.value)})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white" />
                      <span className="absolute right-4 text-slate-400">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Skor Mitigasi (% per poin)</label>
                    <div className="relative flex items-center">
                      <input type="number" step="0.01" value={factorsForm.mitigasi} onChange={e => setFactorsForm({...factorsForm, mitigasi: parseFloat(e.target.value)})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white" />
                      <span className="absolute right-4 text-slate-400">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Skor Utilitas (% per poin)</label>
                    <div className="relative flex items-center">
                      <input type="number" step="0.01" value={factorsForm.utilitas} onChange={e => setFactorsForm({...factorsForm, utilitas: parseFloat(e.target.value)})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white" />
                      <span className="absolute right-4 text-slate-400">%</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">Harga Dasar Bangunan (Per m²)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Rumah', 'Ruko', 'Gudang'].map(jenis => (
                    <div key={jenis}>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{jenis}</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-slate-400">Rp</span>
                        <input type="number" value={valSettingsForm.basePrices[jenis]} onChange={e => setValSettingsForm({...valSettingsForm, basePrices: {...valSettingsForm.basePrices, [jenis]: parseInt(e.target.value)}})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white" />
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">Faktor Kondisi Tanah (Diskon Harga Final)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Perbukitan (%)</label>
                    <div className="relative flex items-center">
                      <input type="number" step="0.1" value={valSettingsForm.tanahDiscounts['Perbukitan']} onChange={e => setValSettingsForm({...valSettingsForm, tanahDiscounts: {...valSettingsForm.tanahDiscounts, 'Perbukitan': parseFloat(e.target.value)}})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white" />
                      <span className="absolute right-4 text-slate-400">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Timbun (% per Meter Kedalaman)</label>
                    <div className="relative flex items-center">
                      <input type="number" step="0.1" value={valSettingsForm.tanahDiscounts['TimbunPerMeter']} onChange={e => setValSettingsForm({...valSettingsForm, tanahDiscounts: {...valSettingsForm.tanahDiscounts, 'TimbunPerMeter': parseFloat(e.target.value)}})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-white" />
                      <span className="absolute right-4 text-slate-400">%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex justify-end">
                  <button type="submit" className="px-8 py-3 bg-primary text-black font-bold rounded-xl shadow-[0_0_20px_rgba(234,202,64,0.3)] hover:bg-yellow-400 transition-all flex items-center gap-2">
                    <Save size={18} /> Simpan Pengaturan
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
