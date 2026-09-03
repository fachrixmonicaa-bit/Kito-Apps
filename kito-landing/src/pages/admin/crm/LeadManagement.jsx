import React, { useState } from 'react';
import { useProperty } from '../../../context/PropertyContext';
import { useAuth } from '../../../context/AuthContext';
import { Plus, Search, User, Phone, Edit, Trash2, Users, Building2, Wallet, Briefcase } from 'lucide-react';
import BusinessCategorySelector from '../../../components/forms/BusinessCategorySelector';

const formatCurrency = (num) => {
  if (!num) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

const LeadManagement = () => {
  const { leads, addLead, updateLead, deleteLead, listings, properties } = useProperty();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    listingId: '',
    sumberLead: '',
    status: 'New',
    notes: '',
    kebutuhanUsaha: { kategoriUtama: '', subKategori: '', jenisSpesifik: '' }
  });

  const statuses = ['New', 'Contacted', 'Qualified', 'Survey', 'Offer', 'Negotiation', 'Won', 'Lost', 'Follow Up'];

  // Filter based on role
  const visibleLeads = user?.role === 'admin' 
    ? leads 
    : leads.filter(l => l.createdBy === user?.name);

  const filteredLeads = visibleLeads.filter(l => {
    const matchSearch = (l.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (l.phone || '').includes(searchTerm);
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenModal = (lead = null) => {
    if (lead) {
      setEditingId(lead.id);
      setFormData(lead);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        listingId: '',
        sumberLead: '',
        status: 'New',
        notes: '',
        kebutuhanUsaha: { kategoriUtama: '', subKategori: '', jenisSpesifik: '' }
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      updateLead(editingId, formData);
    } else {
      addLead(formData);
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
      case 'New': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Contacted':
      case 'Follow Up': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Qualified':
      case 'Survey':
      case 'Offer':
      case 'Negotiation': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Won': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Lost': return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="w-full pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-3 backdrop-blur-sm">
            <Users size={12} className="text-primary" />
            CRM
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Manajemen <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Leads</span>
          </h1>
          <p className="text-slate-400">Kelola prospek pembeli Anda dan pantau proses konversi.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOpenModal()}
            className="px-5 py-3 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,202,64,0.3)] flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} />
            Tambah Lead
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
              placeholder="Cari nama atau nomor HP..."
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
          <table className="w-full text-left text-sm text-slate-300 min-w-[900px]">
            <thead className="bg-slate-900/40 border-b border-white/10 font-semibold text-slate-300">
              <tr>
                <th className="p-4 w-12 text-center">No</th>
                <th className="p-4">Prospek</th>
                <th className="p-4">Minat Listing</th>
                <th className="p-4">Sumber Lead</th>
                {user?.role === 'admin' && <th className="p-4">PIC / Agen</th>}
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Tanggal Masuk</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.length > 0 ? filteredLeads.map((lead, i) => {
                const interestListing = listings.find(l => l.listingId === lead.listingId);
                const interestProperty = interestListing ? properties.find(p => p.propertyId === interestListing.propertyId) : null;
                
                return (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-center text-white/50">{i + 1}</td>
                    <td className="p-4">
                      <div className="font-bold text-white mb-1 flex items-center gap-2">
                        <User size={14} className="text-slate-400" /> {lead.name}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <Phone size={12} /> {lead.phone || '-'}
                      </div>
                    </td>
                    <td className="p-4 max-w-[200px]">
                      {interestProperty ? (
                        <>
                          <div className="font-semibold text-slate-200 truncate" title={interestProperty.alamat}>
                            {interestProperty.alamat}
                          </div>
                          <div className="text-xs text-primary mt-1">{lead.listingId}</div>
                        </>
                      ) : (
                        <span className="text-slate-500 italic">Umum / Belum spesifik</span>
                      )}
                    </td>
                      <td className="p-4">
                        {lead.sumberLead
                          ? <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-full font-medium">{lead.sumberLead}</span>
                          : <span className="text-slate-500 italic text-xs">-</span>}
                      </td>
                    {user?.role === 'admin' && (
                      <td className="p-4">
                        <span className="text-xs font-semibold text-slate-300">{lead.createdBy || 'Unknown'}</span>
                      </td>
                    )}
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      {new Date(lead.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(lead)}
                          className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Hapus lead ini?')) deleteLead(lead.id);
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
                  <td colSpan={user?.role === 'admin' ? "8" : "7"} className="p-12 text-center text-slate-400">
                    <Users size={32} className="mx-auto mb-3 opacity-20" />
                    Belum ada data leads.
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
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Lead' : 'Tambah Lead Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="lead-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Nama Prospek</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nomor HP</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Minat Listing (Opsional)</label>
                  <select value={formData.listingId} onChange={e => setFormData({...formData, listingId: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary">
                    <option value="">-- Umum / Belum Tahu --</option>
                    {listings.map(l => (
                      <option key={l.listingId} value={l.listingId}>{l.listingId} - {l.tipeListing}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Sumber Lead</label>
                      <select value={formData.sumberLead} onChange={e => setFormData({...formData, sumberLead: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary">
                        <option value="">-- Pilih Sumber --</option>
                        <option value="Meta Ads (Facebook)">Meta Ads (Facebook)</option>
                        <option value="Meta Ads (Instagram)">Meta Ads (Instagram)</option>
                        <option value="WhatsApp Broadcast">WhatsApp Broadcast</option>
                        <option value="OLX / Marketplace">OLX / Marketplace</option>
                        <option value="Rumah123 / Lamudi">Rumah123 / Lamudi</option>
                        <option value="Referral / Kenalan">Referral / Kenalan</option>
                        <option value="Walk-in">Walk-in</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Status Lead</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary font-bold">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="text-yellow-400" size={16} />
                    <h3 className="text-sm font-semibold text-white">Kebutuhan Usaha / Peruntukan</h3>
                  </div>
                  <BusinessCategorySelector 
                    value={formData.kebutuhanUsaha}
                    onChange={(val) => setFormData(prev => ({ ...prev, kebutuhanUsaha: val }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Catatan</label>
                  <textarea rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary"></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">Batal</button>
              <button type="submit" form="lead-form" className="px-6 py-2.5 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors">Simpan Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadManagement;
