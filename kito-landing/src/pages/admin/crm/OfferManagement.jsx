import React, { useState } from 'react';
import { useProperty } from '../../../context/PropertyContext';
import { useAuth } from '../../../context/AuthContext';
import { Plus, Search, FileText, CheckCircle, Edit, Trash2, ShieldCheck, Handshake, DollarSign } from 'lucide-react';

const formatCurrency = (num) => {
  if (!num) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

const OfferManagement = () => {
  const { offers, addOffer, updateOffer, deleteOffer, leads, listings, properties } = useProperty();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    leadId: '',
    listingId: '',
    tanggalOffer: new Date().toLocaleDateString('en-CA'),
    hargaOffer: '',
    metodePembayaran: 'Cash Keras',
    dp: '',
    tenor: '',
    status: 'Draft',
    catatan: '',
    pic: ''
  });

  const statuses = ['Draft', 'Submitted', 'Negotiation', 'Accepted', 'Rejected', 'Expired', 'Cancelled'];
  const paymentMethods = ['Cash Keras', 'Cash Bertahap', 'KPR'];

  // Filter based on role
  const visibleOffers = user?.role === 'admin'
    ? offers
    : offers.filter(o => o.createdBy === user?.name);

  const filteredOffers = visibleOffers.filter(o => {
    const lead = leads.find(l => l.id === o.leadId);
    const matchSearch = (lead?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenModal = (offer = null) => {
    if (offer) {
      setEditingId(offer.id);
      setFormData(offer);
    } else {
      setEditingId(null);
      setFormData({
        leadId: '',
        listingId: '',
        tanggalOffer: new Date().toLocaleDateString('en-CA'),
        hargaOffer: '',
        metodePembayaran: 'Cash Keras',
        dp: '',
        tenor: '',
        status: 'Draft',
        catatan: '',
        pic: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      updateOffer(editingId, formData);
    } else {
      addOffer(formData);
    }
    setIsModalOpen(false);
  };

  const handleCurrencyChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value.replace(/\D/g, '')
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      case 'Submitted': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Negotiation': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Accepted': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Rejected':
      case 'Expired':
      case 'Cancelled': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="w-full pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-3 backdrop-blur-sm">
            <Handshake size={12} className="text-primary" />
            CRM
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Manajemen <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Penawaran (Offer)</span>
          </h1>
          <p className="text-slate-400">Pusat negosiasi dan pengajuan harga dari calon pembeli.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOpenModal()}
            className="px-5 py-3 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,202,64,0.3)] flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} />
            Buat Penawaran
          </button>
        </div>
      </div>

      {/* FILTER & TABLE */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 bg-white/5 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama prospek (buyer)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-white transition-all"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-white transition-all"
          >
            <option value="All">Semua Status</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 min-w-[950px]">
            <thead className="bg-slate-900/40 border-b border-white/10 font-semibold text-slate-300">
              <tr>
                <th className="p-4 w-12 text-center">No</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Pembeli (Lead)</th>
                {user?.role === 'admin' && <th className="p-4">PIC / Agen</th>}
                <th className="p-4">Properti Target</th>
                <th className="p-4">Harga Penawaran</th>
                <th className="p-4">Metode Bayar</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOffers.length > 0 ? filteredOffers.map((offer, i) => {
                const lead = leads.find(l => l.id === offer.leadId);
                const listing = listings.find(l => l.listingId === offer.listingId);
                const property = listing ? properties.find(p => p.propertyId === listing.propertyId) : null;
                
                return (
                  <tr key={offer.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-center text-white/50">{i + 1}</td>
                    <td className="p-4 text-slate-400">
                      {new Date(offer.tanggalOffer).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      {lead ? (
                        <div className="font-bold text-white">{lead.name}</div>
                      ) : (
                        <span className="text-rose-400 italic">Data Dihapus</span>
                      )}
                    </td>
                    {user?.role === 'admin' && (
                      <td className="p-4">
                        <span className="text-xs font-semibold text-slate-300">{offer.createdBy || offer.pic || 'Unknown'}</span>
                      </td>
                    )}
                    <td className="p-4 max-w-[200px]">
                      {property ? (
                        <>
                          <div className="font-semibold text-slate-200 truncate" title={property.alamat}>
                            {property.alamat}
                          </div>
                          <div className="text-xs text-slate-400 flex justify-between mt-1">
                            <span>{offer.listingId}</span>
                            <span className="line-through">{formatCurrency(listing.hargaListing)}</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-slate-500 italic">Data tidak ditemukan</span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-emerald-400 text-lg">
                      {formatCurrency(offer.hargaOffer)}
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-md font-medium text-xs border border-blue-500/20">
                        <Wallet size={12} />
                        {offer.metodePembayaran}
                      </div>
                      {offer.dp && <div className="text-xs text-slate-400 mt-1">DP: {formatCurrency(offer.dp)}</div>}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(offer.status)}`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(offer)}
                          className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Hapus penawaran ini?')) deleteOffer(offer.id);
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
              }) : (
                <tr>
                  <td colSpan={user?.role === 'admin' ? "9" : "8"} className="p-12 text-center text-slate-400">
                    <Handshake size={32} className="mx-auto mb-3 opacity-20" />
                    Belum ada penawaran (offer) yang diajukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Penawaran' : 'Buat Penawaran Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="offer-form" onSubmit={handleSave} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Pilih Prospek (Buyer)</label>
                    <select value={formData.leadId} onChange={e => {
                      const lead = leads.find(l => l.id === e.target.value);
                      setFormData({...formData, leadId: e.target.value, listingId: lead?.listingId || formData.listingId});
                    }} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary" required>
                      <option value="">-- Pilih Lead --</option>
                      {leads.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Tanggal Offer</label>
                    <input type="date" value={formData.tanggalOffer} onChange={e => setFormData({...formData, tanggalOffer: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Pilih Listing Target</label>
                  <select value={formData.listingId} onChange={e => setFormData({...formData, listingId: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary" required>
                    <option value="">-- Pilih Listing --</option>
                    {listings.map(l => (
                      <option key={l.listingId} value={l.listingId}>{l.listingId} - Harga: {formatCurrency(l.hargaListing)}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                  <label className="block text-sm font-bold text-primary mb-1">Harga Penawaran (Rp)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 font-medium">Rp</span>
                    <input type="text" value={formData.hargaOffer ? new Intl.NumberFormat('id-ID').format(formData.hargaOffer) : ''} onChange={e => handleCurrencyChange('hargaOffer', e.target.value)} className="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary text-lg font-bold" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Metode Pembayaran</label>
                    <select value={formData.metodePembayaran} onChange={e => setFormData({...formData, metodePembayaran: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary">
                      {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Status Penawaran</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary font-bold">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {(formData.metodePembayaran === 'KPR' || formData.metodePembayaran === 'Cash Bertahap') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">DP / Uang Muka (Rp)</label>
                      <input type="text" value={formData.dp ? new Intl.NumberFormat('id-ID').format(formData.dp) : ''} onChange={e => handleCurrencyChange('dp', e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Tenor (Opsional)</label>
                      <input type="text" value={formData.tenor} onChange={e => setFormData({...formData, tenor: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary" placeholder="Berapa tahun/bulan?" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Catatan Tambahan (Syarat & Ketentuan Pembeli)</label>
                  <textarea rows="2" value={formData.catatan} onChange={e => setFormData({...formData, catatan: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary"></textarea>
                </div>

              </form>
            </div>
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">Batal</button>
              <button type="submit" form="offer-form" className="px-6 py-2.5 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors">Simpan Penawaran</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferManagement;
