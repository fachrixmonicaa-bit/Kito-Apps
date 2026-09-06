import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProperty } from '../../context/PropertyContext';
import Papa from 'papaparse';
import { Plus, Search, Building2, MapPin, Tag, Edit, Trash2, Database, Upload } from 'lucide-react';

const formatCurrency = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

const PropertyManagement = () => {
  const { properties, deleteProperty, addBulkProperties } = useProperty();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        
        let colMap = {
           alamat: -1, kecamatan: -1, kelurahan: -1, jenis: -1, tingkat: -1, kondisi: -1,
           akses: -1, posisi: -1, lt: -1, lb: -1, legalitas: -1, harga: -1
        };

        // Scan up to first 3 rows to find column indices (handles merged headers)
        for (let i = 0; i < Math.min(3, rows.length); i++) {
           rows[i].forEach((cell, index) => {
              if (typeof cell !== 'string') return;
              const val = cell.toLowerCase().trim();
              if (val.includes('alamat') || val.includes('lokasi')) colMap.alamat = index;
              if (val.includes('kecamatan')) colMap.kecamatan = index;
              if (val.includes('kelurahan')) colMap.kelurahan = index;
              if (val === 'jenis' || val === 'properti') colMap.jenis = index;
              if (val.includes('tingkat')) colMap.tingkat = index;
              if (val.includes('kondisi')) colMap.kondisi = index;
              if (val === 'akses' || val.includes('akses jalan')) colMap.akses = index;
              if (val.includes('posisi')) colMap.posisi = index;
              if (val.includes('lt (m2)') || val === 'lt' || val.includes('luas tanah')) colMap.lt = index;
              if (val.includes('lb') || val.includes('luas bangunan')) colMap.lb = index;
              if (val.includes('legalitas')) colMap.legalitas = index;
              if (val.includes('harga')) colMap.harga = index;
           });
        }

        const formattedData = rows.map((row) => {
          const getVal = (colIndex) => (colIndex >= 0 && row[colIndex]) ? row[colIndex].trim() : '';
          
          const kecamatan = getVal(colMap.kecamatan);
          const jenisProperti = getVal(colMap.jenis);
          
          // Filter header rows and incomplete rows
          if (!kecamatan || !jenisProperti || kecamatan.toLowerCase() === 'kecamatan') return null;

          const hargaJualStr = getVal(colMap.harga);
          let hargaJual = 0;
          if (hargaJualStr) hargaJual = parseFloat(hargaJualStr.replace(/[^0-9,-]+/g,""));
          
          const ltStr = getVal(colMap.lt);
          const lt = parseFloat(ltStr) || 0;
          
          const hargaM2 = (lt > 0 && hargaJual > 0) ? Math.round(hargaJual / lt).toString() : '';

          return {
            alamat: getVal(colMap.alamat),
            kecamatan: kecamatan,
            kelurahan: getVal(colMap.kelurahan),
            jenisProperti: jenisProperti,
            tingkatBangunan: getVal(colMap.tingkat),
            kondisiProperti: getVal(colMap.kondisi),
            aksesJalan: getVal(colMap.akses),
            posisiObjek: getVal(colMap.posisi),
            luasTanah: ltStr,
            luasBangunan: getVal(colMap.lb),
            legalitas: getVal(colMap.legalitas),
            hargaJual: hargaJual > 0 ? hargaJual.toString() : '',
            hargaM2: hargaM2,
            waktu: new Date().toISOString()
          };
        }).filter(item => item !== null); 
        
        if (formattedData.length > 0) {
          setIsImporting(true);
          try {
            const count = await addBulkProperties(formattedData);
            alert(`✅ ${count} dari ${formattedData.length} properti berhasil di-import ke database!`);
          } finally {
            setIsImporting(false);
          }
        } else {
          alert('Tidak ada data valid yang bisa di-import. Pastikan format kolom sesuai standar (memiliki Kecamatan dan Jenis).');
        }
      },
      error: (error) => {
        alert('Gagal membaca file CSV: ' + error.message);
      }
    });
    // Reset input so the same file can be uploaded again if needed
    e.target.value = null;
  };

  const filteredProperties = properties.filter(p => 
    (p.alamat || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.propertyId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.kecamatan || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-3 backdrop-blur-sm">
            <Database size={12} className="text-primary" />
            Master Data
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Database <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Properti</span>
          </h1>
          <p className="text-slate-400">Pusat data fisik dan legalitas seluruh properti.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className={`cursor-pointer px-5 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 border border-white/10 transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg ${isImporting ? 'opacity-60 pointer-events-none' : ''}`}>
            <Upload size={18} className={isImporting ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isImporting ? 'Mengimpor...' : 'Upload CSV'}</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={isImporting} />
          </label>
          <Link 
            to="/admin/properties/add" 
            className="px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,202,64,0.3)] flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Input Baru</span>
            <span className="sm:hidden">Input</span>
          </Link>
        </div>
      </div>

      {/* GLASSMORPHISM TABLE CONTAINER */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        
        {/* Advanced Search Header */}
        <div className="p-6 border-b border-white/10 bg-white/5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari berdasarkan Alamat, ID, atau Kecamatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-slate-500 transition-all"
              />
            </div>
            <button className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 border border-white/10 transition-colors">
              Filter Lanjutan
            </button>
          </div>
        </div>

        {/* Property Grid/Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300 whitespace-nowrap min-w-[1600px]">
            <thead className="bg-slate-900/40 border-b border-white/10 font-semibold text-slate-300">
              <tr>
                <th className="p-4 sticky left-0 bg-slate-900/90 z-10 w-12 text-center border-r border-white/10">No</th>
                <th className="p-4 w-24 text-center text-primary font-bold">ID</th>
                <th className="p-4 w-28 text-center">Waktu</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 w-48">Alamat</th>
                <th className="p-4">Kecamatan</th>
                <th className="p-4">Kelurahan</th>
                <th className="p-4 text-center">Jenis</th>
                <th className="p-4 text-center">Tingkat</th>
                <th className="p-4 text-center">Kondisi</th>
                <th className="p-4 text-center">Akses</th>
                <th className="p-4 text-center">Posisi</th>
                <th className="p-4 text-center">LT (m²)</th>
                <th className="p-4 text-center">LB (m²)</th>
                <th className="p-4 text-center">Legalitas</th>
                <th className="p-4 text-right">Harga Jual (Rp)</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((prop, i) => (
                  <tr key={prop.propertyId} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-center sticky left-0 bg-slate-900/90 group-hover:bg-slate-800/90 z-10 border-r border-white/10 font-mono text-white/50">
                      {i + 1}
                    </td>
                    <td className="p-4 text-center font-mono text-xs font-bold text-primary bg-primary/5">
                      PR-{String(i + 1).padStart(4, '0')}
                    </td>
                    <td className="p-4 text-center text-slate-400">
                      {prop.waktu ? new Date(prop.waktu).toLocaleDateString('id-ID') : new Date(prop.tanggalInput).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2 py-1 bg-white/10 text-slate-300 text-[10px] font-bold rounded">
                        {prop.status || 'LISTING'}
                      </span>
                    </td>
                    <td className="p-4 truncate max-w-[200px]" title={prop.alamat}>
                      {prop.alamat}
                    </td>
                    <td className="p-4">{prop.kecamatan}</td>
                    <td className="p-4">{prop.kelurahan}</td>
                    <td className="p-4 text-center">{prop.jenisProperti}</td>
                    <td className="p-4 text-center">{prop.tingkatBangunan}</td>
                    <td className="p-4 text-center">{prop.kondisiProperti}</td>
                    <td className="p-4 text-center">{prop.aksesJalan}</td>
                    <td className="p-4 text-center">{prop.posisiObjek}</td>
                    <td className="p-4 text-center font-medium">{prop.luasTanah}</td>
                    <td className="p-4 text-center font-medium">{prop.luasBangunan || 0}</td>
                    <td className="p-4 text-center">
                      <span className="text-blue-400 font-semibold">{prop.legalitas}</span>
                    </td>
                    <td className="p-4 font-bold text-white text-right">{formatCurrency(prop.hargaJual)}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => navigate(`/admin/properties/edit/${prop.propertyId}`)}
                          className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                          title="Edit Properti"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Yakin ingin menghapus data master properti ini?')) {
                              deleteProperty(prop.propertyId);
                            }
                          }}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Database size={24} className="text-slate-500" />
                      </div>
                      <p className="text-slate-300 font-medium text-lg">Belum ada data properti.</p>
                      <p className="text-slate-500 text-sm mt-1 mb-4">Mulai dengan menambahkan master data properti pertama Anda.</p>
                      <Link to="/admin/properties/add" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-semibold border border-white/10">
                        Input Property Baru
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PropertyManagement;
