import React, { useState } from 'react';
import { useProperty } from '../../../context/PropertyContext';
import { Plus, Search, Calendar, Clock, Edit, Trash2, MapPin, User, CheckCircle } from 'lucide-react';

const SurveyManagement = () => {
  const { surveys, addSurvey, updateSurvey, deleteSurvey, leads, listings, properties } = useProperty();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    leadId: '',
    listingId: '',
    tanggal: new Date().toLocaleDateString('en-CA'),
    jam: new Date().toTimeString().slice(0, 5),
    pic: '',
    status: 'Scheduled',
    hasil: '',
    catatan: ''
  });

  const statuses = ['Scheduled', 'Confirmed', 'Completed', 'Rescheduled', 'Cancelled', 'No Show'];

  const filteredSurveys = surveys.filter(s => {
    const lead = leads.find(l => l.id === s.leadId);
    const matchSearch = (lead?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenModal = (survey = null) => {
    if (survey) {
      setEditingId(survey.id);
      setFormData(survey);
    } else {
      setEditingId(null);
      setFormData({
        leadId: '',
        listingId: '',
        tanggal: new Date().toLocaleDateString('en-CA'),
        jam: new Date().toTimeString().slice(0, 5),
        pic: '',
        status: 'Scheduled',
        hasil: '',
        catatan: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      updateSurvey(editingId, formData);
    } else {
      addSurvey(formData);
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
      case 'Rescheduled': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Confirmed': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Completed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Cancelled':
      case 'No Show': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="w-full pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-3 backdrop-blur-sm">
            <Calendar size={12} className="text-primary" />
            CRM
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Jadwal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Survey</span>
          </h1>
          <p className="text-slate-400">Atur jadwal kunjungan lokasi prospek dengan agen.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOpenModal()}
            className="px-5 py-3 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,202,64,0.3)] flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} />
            Jadwalkan Survey
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
              placeholder="Cari berdasarkan nama prospek..."
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
                <th className="p-4">Waktu</th>
                <th className="p-4">Prospek</th>
                <th className="p-4">Lokasi / Listing</th>
                <th className="p-4">Agen / PIC</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSurveys.length > 0 ? filteredSurveys.map((survey) => {
                const lead = leads.find(l => l.id === survey.leadId);
                const listing = listings.find(l => l.listingId === survey.listingId);
                const property = listing ? properties.find(p => p.propertyId === listing.propertyId) : null;
                
                return (
                  <tr key={survey.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-bold text-white flex items-center gap-2 mb-1">
                        <Calendar size={14} className="text-primary" />
                        {new Date(survey.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-slate-400 text-xs flex items-center gap-2">
                        <Clock size={12} /> {survey.jam || 'Belum diset'}
                      </div>
                    </td>
                    <td className="p-4">
                      {lead ? (
                        <>
                          <div className="font-semibold text-white">{lead.name}</div>
                          <div className="text-xs text-slate-400">{lead.phone}</div>
                        </>
                      ) : (
                        <span className="text-rose-400 italic">Lead dihapus</span>
                      )}
                    </td>
                    <td className="p-4 max-w-[200px]">
                      {property ? (
                        <>
                          <div className="font-semibold text-slate-200 truncate" title={property.alamat}>
                            {property.alamat}
                          </div>
                          <div className="text-xs text-primary mt-1">{survey.listingId}</div>
                        </>
                      ) : (
                        <span className="text-slate-500 italic">Data tidak ditemukan</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-400" />
                        <span>{survey.pic || '-'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(survey.status)}`}>
                        {survey.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(survey)}
                          className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Hapus jadwal ini?')) deleteSurvey(survey.id);
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
                  <td colSpan="6" className="p-12 text-center text-slate-400">
                    <Calendar size={32} className="mx-auto mb-3 opacity-20" />
                    Belum ada jadwal survey.
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
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Jadwal Survey' : 'Buat Jadwal Survey'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="survey-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Pilih Prospek (Lead)</label>
                  <select value={formData.leadId} onChange={e => {
                    const lead = leads.find(l => l.id === e.target.value);
                    setFormData({...formData, leadId: e.target.value, listingId: lead?.listingId || formData.listingId});
                  }} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary" required>
                    <option value="">-- Pilih Lead --</option>
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>{l.name} - {l.phone}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Pilih Listing Tujuan</label>
                  <select value={formData.listingId} onChange={e => setFormData({...formData, listingId: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary" required>
                    <option value="">-- Pilih Listing --</option>
                    {listings.map(l => (
                      <option key={l.listingId} value={l.listingId}>{l.listingId} - {l.tipeListing}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Tanggal</label>
                    <input type="date" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Jam</label>
                    <input type="time" value={formData.jam} onChange={e => setFormData({...formData, jam: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Agen Pendamping</label>
                    <input type="text" value={formData.pic} onChange={e => setFormData({...formData, pic: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Status Survey</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary font-bold">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                {formData.status === 'Completed' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Hasil Kunjungan</label>
                    <textarea rows="2" value={formData.hasil} onChange={e => setFormData({...formData, hasil: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary" placeholder="Tuliskan impresi klien terhadap properti ini..."></textarea>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Catatan Tambahan</label>
                  <textarea rows="2" value={formData.catatan} onChange={e => setFormData({...formData, catatan: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-primary"></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">Batal</button>
              <button type="submit" form="survey-form" className="px-6 py-2.5 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors">Simpan Jadwal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyManagement;
