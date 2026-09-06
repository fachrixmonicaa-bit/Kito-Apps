import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProperty } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, Building2, MapPin, Tag, Edit, Trash2, List, Image as ImageIcon } from 'lucide-react';

const formatCurrency = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

const safeDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('id-ID');
};

const ListingManagement = () => {
  const { listings, properties, deleteListing } = useProperty();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredListings = listings.filter(l => {
    // 1. Role-based filtering: Agents only see their own listings
    if (user?.role !== 'admin' && l.agen !== user?.name) {
      return false;
    }
    
    // 2. Search filtering
    return String(l.listingId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
           String(l.agen || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-3 backdrop-blur-sm">
            <List size={12} className="text-primary" />
            Marketing
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Manajemen <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Listing</span>
          </h1>
          <p className="text-slate-400">Pusat kendali properti yang sedang dipasarkan.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/admin/listings/add" 
            className="px-5 py-3 bg-primary text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,202,64,0.3)] flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} />
            Input Listing
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
                placeholder="Cari berdasarkan Listing ID atau Nama Agen..."
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

        {/* Listing Grid/Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300 whitespace-nowrap min-w-[1200px]">
            <thead className="bg-slate-900/40 border-b border-white/10 font-semibold text-slate-300">
              <tr>
                <th className="p-4 w-12 text-center">No</th>
                <th className="p-4">Listing ID & Judul</th>
                <th className="p-4">Lokasi & Tipe</th>
                <th className="p-4">Spesifikasi</th>
                <th className="p-4">Legal & Kondisi</th>
                <th className="p-4">Tipe & Agen</th>
                <th className="p-4">Harga Publik</th>
                <th className="p-4 text-center">Tgl Expired</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredListings.length > 0 ? (
                filteredListings.map((listing, i) => {
                  const propertyRef = properties.find(p => String(p.propertyId) === String(listing.propertyId)) || {};
                  
                  return (
                    <tr key={listing.listingId} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 text-center text-white/50">{i + 1}</td>
                      <td className="p-4">
                        <div className="font-mono text-sm font-bold text-white">{listing.listingId}</div>
                        <div className="text-sm font-semibold text-primary truncate max-w-[200px]" title={listing.judulListing}>{listing.judulListing || 'Tanpa Judul'}</div>
                        <div className="text-xs text-slate-400 mt-1">{safeDate(listing.tanggalInput)}</div>
                      </td>
                      <td className="p-4 align-top max-w-[250px]">
                        {propertyRef.propertyId ? (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <Building2 size={12} className="text-primary" />
                              <span className="font-semibold text-slate-200">{propertyRef.propertyId} ({propertyRef.jenisProperti})</span>
                              {listing.photos && listing.photos.length > 0 && (
                                <div className="flex items-center gap-1 bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                  <ImageIcon size={10} />
                                  <span>{listing.photos.length}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-start gap-1">
                              <MapPin size={12} className="text-rose-400 shrink-0 mt-0.5" />
                              <p className="text-xs text-slate-400 truncate" title={propertyRef.alamat}>{propertyRef.alamat}</p>
                            </div>
                          </>
                        ) : (
                          <span className="text-slate-500 italic">Properti Dihapus</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-xs text-slate-300">
                          <div>LT: <span className="font-semibold text-white">{propertyRef.luasTanah || '-'}</span> m² | LB: <span className="font-semibold text-white">{propertyRef.luasBangunan || '-'}</span> m²</div>
                          <div>KT: <span className="font-semibold text-white">{propertyRef.kamarTidur || '-'}</span> | KM: <span className="font-semibold text-white">{propertyRef.kamarMandi || '-'}</span></div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-xs text-slate-300">
                          <div>Legal: <span className="font-semibold text-blue-400">{propertyRef.legalitas || '-'}</span></div>
                          <div>Kondisi: <span className="font-semibold text-emerald-400">{propertyRef.kondisiProperti || '-'}</span></div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 text-[10px] uppercase font-bold rounded border mb-1 ${listing.tipeListing === 'Exclusive' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                          {listing.tipeListing || 'REGULAR'}
                        </span>
                        <div className="font-medium text-slate-200 text-xs truncate max-w-[150px]">{listing.agen || '-'}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Tag size={14} className="text-emerald-400" />
                          <span className="font-bold text-white">{formatCurrency(listing.hargaListing)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-rose-300 font-medium text-xs">{safeDate(listing.tanggalBerakhir)}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2 py-1 text-[10px] font-bold rounded ${listing.status === 'Aktif' ? 'bg-emerald-500/20 text-emerald-400' : listing.status === 'Terjual' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400'}`}>
                          {listing.status || 'Aktif'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => navigate(`/admin/listings/edit/${listing.listingId}`)}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                            title="Edit Listing"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              if(window.confirm('Yakin ingin menghapus listing ini?')) {
                                deleteListing(listing.listingId);
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
                  )
                })
              ) : (
                <tr>
                  <td colSpan="10" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <List size={24} className="text-slate-500" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Belum ada data listing.</h3>
                      <p className="text-sm text-slate-400 mb-6">Mulai pasarkan properti dengan membuat listing baru.</p>
                      <div className="flex gap-3 justify-center">
                        <Link 
                          to="/admin/listings/regular" 
                          className="px-5 py-2.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors inline-block"
                        >
                          Regular Listing Baru
                        </Link>
                      </div>
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

export default ListingManagement;
