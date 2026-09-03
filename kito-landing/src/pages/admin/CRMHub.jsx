import React, { useState, useMemo } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import {
  Users, Calendar, Handshake, Plus, Search, Edit, Trash2,
  User, Phone, Clock, MapPin, Building2, ChevronRight,
  MessageSquare, TrendingUp, AlertCircle
} from 'lucide-react';

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────
const formatCurrency = (num) => {
  if (!num) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0
  }).format(num);
};

const handleCurrencyChange = (setter, name, value, setFormData) => {
  setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '') }));
};

// ─────────────────────────────────────────────
// STATUS COLORS
// ─────────────────────────────────────────────
const leadStatusColor = (s) => {
  if (s === 'New') return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  if (s === 'Contacted' || s === 'Follow Up') return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  if (['Qualified','Survey','Offer','Negotiation'].includes(s)) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  if (s === 'Won') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
};
const surveyStatusColor = (s) => {
  if (['Scheduled','Rescheduled'].includes(s)) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  if (s === 'Confirmed') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  if (s === 'Completed') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
};
const offerStatusColor = (s) => {
  if (s === 'Draft') return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  if (s === 'Submitted') return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  if (s === 'Negotiation') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  if (s === 'Accepted') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
};

// ─────────────────────────────────────────────
// MODAL COMPONENT
// ─────────────────────────────────────────────
const Modal = ({ title, onClose, formId, onSubmit, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="glass-dark rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
      <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
      </div>
      <div className="p-6 overflow-y-auto space-y-4">
        <form id={formId} onSubmit={onSubmit}>{children}</form>
      </div>
      <div className="p-5 border-t border-white/10 bg-white/5 rounded-b-2xl flex justify-end gap-3">
        <button onClick={onClose} className="px-5 py-3 min-h-[44px] bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm">Batal</button>
        <button type="submit" form={formId} className="px-6 py-3 min-h-[44px] bg-primary text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-colors text-sm shadow-lg">Simpan</button>
      </div>
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-white outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all";
const selectCls = "w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-white outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all";

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const TABS = [
  { id: 'leads', label: 'Leads', icon: Users, color: 'text-rose-400' },
  { id: 'survey', label: 'Survey', icon: Calendar, color: 'text-blue-400' },
  { id: 'offer', label: 'Penawaran', icon: Handshake, color: 'text-emerald-400' },
];

const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Survey', 'Offer', 'Negotiation', 'Won', 'Lost', 'Follow Up'];
const SURVEY_STATUSES = ['Scheduled', 'Confirmed', 'Completed', 'Rescheduled', 'Cancelled', 'No Show'];
const OFFER_STATUSES = ['Draft', 'Submitted', 'Negotiation', 'Accepted', 'Rejected', 'Expired', 'Cancelled'];
const PAYMENT_METHODS = ['Cash Keras', 'Cash Bertahap', 'KPR'];

const CRMHub = () => {
  const { leads, addLead, updateLead, deleteLead,
          surveys, addSurvey, updateSurvey, deleteSurvey,
          offers, addOffer, updateOffer, deleteOffer,
          listings, properties } = useProperty();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('leads');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modal, setModal] = useState(null); // { type, data }

  // ── KPI ──────────────────────────────────
  const kpi = useMemo(() => ({
    newLeads: leads.filter(l => l.status === 'New').length,
    scheduled: surveys.filter(s => s.status === 'Scheduled' || s.status === 'Confirmed').length,
    pendingOffers: offers.filter(o => o.status === 'Negotiation' || o.status === 'Submitted').length,
    wonDeals: offers.filter(o => o.status === 'Accepted').length,
  }), [leads, surveys, offers]);

  // ── MODAL STATE ──────────────────────────
  const emptyLead = { name:'', phone:'', email:'', listingId:'', sumberLead:'', status:'New', notes:'' };
  const emptySurvey = { leadId:'', listingId:'', tanggal: new Date().toLocaleDateString('en-CA'), jam: new Date().toTimeString().slice(0, 5), pic:'', status:'Scheduled', hasil:'', catatan:'' };
  const emptyOffer = { leadId:'', listingId:'', tanggalOffer: new Date().toLocaleDateString('en-CA'), hargaOffer:'', metodePembayaran:'Cash Keras', dp:'', tenor:'', status:'Draft', catatan:'', pic:'' };

  const [leadForm, setLeadForm] = useState(emptyLead);
  const [surveyForm, setSurveyForm] = useState(emptySurvey);
  const [offerForm, setOfferForm] = useState(emptyOffer);

  const openModal = (type, item = null) => {
    if (type === 'lead') setLeadForm(item ? {...item} : emptyLead);
    if (type === 'survey') setSurveyForm(item ? {...item} : emptySurvey);
    if (type === 'offer') setOfferForm(item ? {...item} : emptyOffer);
    setModal({ type, id: item?.id || null });
  };
  const closeModal = () => setModal(null);

  const handleSaveLead = (e) => {
    e.preventDefault();
    modal.id ? updateLead(modal.id, leadForm) : addLead(leadForm);
    closeModal();
  };
  const handleSaveSurvey = (e) => {
    e.preventDefault();
    modal.id ? updateSurvey(modal.id, surveyForm) : addSurvey(surveyForm);
    closeModal();
  };
  const handleSaveOffer = (e) => {
    e.preventDefault();
    modal.id ? updateOffer(modal.id, offerForm) : addOffer(offerForm);
    closeModal();
  };

  // ── FILTER DATA ──────────────────────────
  const filteredLeads = leads.filter(l => {
    if (user?.role !== 'admin' && l.createdBy !== user?.name) return false;
    const m = (l.name || '').toLowerCase().includes(search.toLowerCase()) || (l.phone || '').includes(search);
    const s = statusFilter === 'All' || l.status === statusFilter;
    return m && s;
  });

  const filteredSurveys = surveys.filter(sv => {
    if (user?.role !== 'admin' && sv.pic !== user?.name && sv.createdBy !== user?.name) return false;
    const lead = leads.find(l => l.id === sv.leadId);
    const m = (lead?.name || '').toLowerCase().includes(search.toLowerCase());
    const s = statusFilter === 'All' || sv.status === statusFilter;
    return m && s;
  });

  const filteredOffers = offers.filter(o => {
    if (user?.role !== 'admin' && o.pic !== user?.name && o.createdBy !== user?.name) return false;
    const lead = leads.find(l => l.id === o.leadId);
    const m = (lead?.name || '').toLowerCase().includes(search.toLowerCase());
    const s = statusFilter === 'All' || o.status === statusFilter;
    return m && s;
  });

  // ── HELPERS ──────────────────────────────
  const getStatuses = () => {
    if (activeTab === 'leads') return LEAD_STATUSES;
    if (activeTab === 'survey') return SURVEY_STATUSES;
    return OFFER_STATUSES;
  };

  return (
    <div className="w-full pb-10">

      {/* ── HEADER ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-3 backdrop-blur-sm">
            <TrendingUp size={12} className="text-primary" /> CRM Hub
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
            Pipeline <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Klien</span>
          </h1>
          <p className="text-slate-400 text-sm">Pantau seluruh perjalanan klien — dari pertama masuk hingga deal.</p>
        </div>
        <button
          onClick={() => openModal(activeTab === 'leads' ? 'lead' : activeTab === 'survey' ? 'survey' : 'offer')}
          className="px-6 py-3 min-h-[44px] bg-primary text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={18} />
          {activeTab === 'leads' ? 'Tambah Lead' : activeTab === 'survey' ? 'Jadwalkan Survey' : 'Buat Penawaran'}
        </button>
      </div>

      {/* ── KPI STRIP ──────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Lead Baru', value: kpi.newLeads, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'Survey Terjadwal', value: kpi.scheduled, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Offer Aktif', value: kpi.pendingOffers, icon: MessageSquare, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Deal Closed', value: kpi.wonDeals, icon: Handshake, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        ].map(k => (
          <div key={k.label} className={`glass-dark border rounded-2xl p-5 flex items-center gap-4`}>
            <div className={`p-3 rounded-xl bg-white/5 ${k.color} shadow-inner`}>
              <k.icon size={24} />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white font-counting tracking-tighter">{k.value}</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── TABS ───────────────────────────── */}
      <div className="glass-dark rounded-2xl overflow-hidden relative z-10">

        {/* Tab Headers */}
        <div className="flex border-b border-white/10">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const count = tab.id === 'leads' ? leads.length : tab.id === 'survey' ? surveys.length : offers.length;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearch(''); setStatusFilter('All'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
                  isActive
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-primary' : tab.color} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/10 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-white/10 bg-white/3 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Cari nama prospek..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 min-h-[44px] bg-slate-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white text-sm transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white text-sm transition-all"
          >
            <option value="All">Semua Status</option>
            {getStatuses().map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* ── LEADS TABLE ─────────────────── */}
        {activeTab === 'leads' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300 min-w-[700px]">
              <thead className="bg-slate-900/40 border-b border-white/10">
                <tr>
                  <th className="p-4 font-semibold w-40">PIC / Agen</th>
                  <th className="p-4 font-semibold">Prospek</th>
                  <th className="p-4 font-semibold">Minat Listing</th>
                  <th className="p-4 font-semibold">Sumber Lead</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold">Tgl Masuk</th>
                  <th className="p-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.length > 0 ? filteredLeads.map(lead => {
                  const lst = listings.find(l => l.listingId === lead.listingId);
                  const prop = lst ? properties.find(p => p.propertyId === lst.propertyId) : null;
                  return (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="font-bold text-slate-300">{lead.createdBy || '-'}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white flex items-center gap-2"><User size={13} className="text-slate-400" />{lead.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Phone size={11} />{lead.phone || '-'}</div>
                      </td>
                      <td className="p-4 max-w-[180px]">
                        {prop ? <div className="truncate text-slate-200 font-medium" title={prop.alamat}>{prop.alamat}</div>
                               : <span className="text-slate-500 italic text-xs">Umum</span>}
                        {lead.listingId && <div className="text-xs text-primary mt-0.5">{lead.listingId}</div>}
                      </td>
                      <td className="p-4">
                        {lead.sumberLead
                          ? <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-full font-medium">{lead.sumberLead}</span>
                          : <span className="text-slate-500 italic text-xs">-</span>}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${leadStatusColor(lead.status)}`}>{lead.status}</span>
                      </td>
                      <td className="p-4 text-slate-400 text-xs">{new Date(lead.date).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'})}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModal('lead', lead)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit size={15} /></button>
                          <button onClick={() => { if(window.confirm('Hapus lead ini?')) deleteLead(lead.id); }} className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="6" className="py-14 text-center text-slate-500"><Users size={28} className="mx-auto mb-2 opacity-20" />Belum ada data leads.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── SURVEY TABLE ─────────────────── */}
        {activeTab === 'survey' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300 min-w-[700px]">
              <thead className="bg-slate-900/40 border-b border-white/10">
                <tr>
                  <th className="p-4 font-semibold w-40">PIC / Agen</th>
                  <th className="p-4 font-semibold">Waktu Survey</th>
                  <th className="p-4 font-semibold">Prospek</th>
                  <th className="p-4 font-semibold">Lokasi</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSurveys.length > 0 ? filteredSurveys.map(sv => {
                  const lead = leads.find(l => l.id === sv.leadId);
                  const lst = listings.find(l => l.listingId === sv.listingId);
                  const prop = lst ? properties.find(p => p.propertyId === lst.propertyId) : null;
                  return (
                    <tr key={sv.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 font-bold text-slate-300">{sv.pic || '-'}</td>
                      <td className="p-4">
                        <div className="font-bold text-white flex items-center gap-2"><Calendar size={13} className="text-primary" />{sv.tanggal ? new Date(sv.tanggal).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'}) : '-'}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Clock size={11} />{sv.jam || 'Belum diset'}</div>
                      </td>
                      <td className="p-4">
                        {lead ? <div className="font-semibold text-white">{lead.name}</div> : <span className="text-rose-400 text-xs italic">Lead dihapus</span>}
                        {lead && <div className="text-xs text-slate-400">{lead.phone}</div>}
                      </td>
                      <td className="p-4 max-w-[180px]">
                        {prop ? <div className="truncate text-slate-200 font-medium" title={prop.alamat}>{prop.alamat}</div>
                               : <span className="text-slate-500 italic text-xs">-</span>}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${surveyStatusColor(sv.status)}`}>{sv.status}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModal('survey', sv)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit size={15} /></button>
                          <button onClick={() => { if(window.confirm('Hapus jadwal ini?')) deleteSurvey(sv.id); }} className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="6" className="py-14 text-center text-slate-500"><Calendar size={28} className="mx-auto mb-2 opacity-20" />Belum ada jadwal survey.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── OFFER TABLE ──────────────────── */}
        {activeTab === 'offer' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300 min-w-[800px]">
              <thead className="bg-slate-900/40 border-b border-white/10">
                <tr>
                  <th className="p-4 font-semibold w-40">PIC / Agen</th>
                  <th className="p-4 font-semibold">Tanggal</th>
                  <th className="p-4 font-semibold">Pembeli</th>
                  <th className="p-4 font-semibold">Properti Target</th>
                  <th className="p-4 font-semibold">Harga Tawar</th>
                  <th className="p-4 font-semibold">Metode</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOffers.length > 0 ? filteredOffers.map(o => {
                  const lead = leads.find(l => l.id === o.leadId);
                  const lst = listings.find(l => l.listingId === o.listingId);
                  const prop = lst ? properties.find(p => p.propertyId === lst.propertyId) : null;
                  return (
                    <tr key={o.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 font-bold text-slate-300">{o.pic || o.createdBy || '-'}</td>
                      <td className="p-4 text-slate-400 text-xs">{o.tanggalOffer ? new Date(o.tanggalOffer).toLocaleDateString('id-ID') : '-'}</td>
                      <td className="p-4">
                        {lead ? <div className="font-bold text-white">{lead.name}</div> : <span className="text-rose-400 text-xs italic">Dihapus</span>}
                      </td>
                      <td className="p-4 max-w-[180px]">
                        {prop ? <div className="truncate text-slate-200 font-medium" title={prop.alamat}>{prop.alamat}</div>
                               : <span className="text-slate-500 italic text-xs">-</span>}
                        {lst && <div className="text-xs text-slate-500 line-through">{formatCurrency(lst.hargaListing)}</div>}
                      </td>
                      <td className="p-4 font-bold text-emerald-400 text-base">{formatCurrency(o.hargaOffer)}</td>
                      <td className="p-4">
                        <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-md">{o.metodePembayaran}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${offerStatusColor(o.status)}`}>{o.status}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModal('offer', o)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit size={15} /></button>
                          <button onClick={() => { if(window.confirm('Hapus penawaran ini?')) deleteOffer(o.id); }} className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="7" className="py-14 text-center text-slate-500"><Handshake size={28} className="mx-auto mb-2 opacity-20" />Belum ada penawaran.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────
          MODALS
      ───────────────────────────────────── */}

      {/* LEAD MODAL */}
      {modal?.type === 'lead' && (
        <Modal title={modal.id ? 'Edit Lead' : 'Tambah Lead Baru'} onClose={closeModal} formId="lead-form" onSubmit={handleSaveLead}>
          <Field label="Nama Prospek">
            <input type="text" value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} className={inputCls} required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nomor HP">
              <input type="text" value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} className={inputCls} required />
            </Field>
            <Field label="Email">
              <input type="email" value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} className={inputCls} />
            </Field>
          </div>
          <Field label="Minat Listing (Opsional)">
            <select value={leadForm.listingId} onChange={e => setLeadForm({...leadForm, listingId: e.target.value})} className={selectCls}>
              <option value="">-- Umum / Belum Tahu --</option>
              {listings.map(l => <option key={l.listingId} value={l.listingId}>{l.listingId} — {l.tipeListing}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sumber Lead">
              <select value={leadForm.sumberLead} onChange={e => setLeadForm({...leadForm, sumberLead: e.target.value})} className={selectCls}>
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
            </Field>
            <Field label="Status">
              <select value={leadForm.status} onChange={e => setLeadForm({...leadForm, status: e.target.value})} className={selectCls}>
                {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Catatan">
            <textarea rows="3" value={leadForm.notes} onChange={e => setLeadForm({...leadForm, notes: e.target.value})} className={inputCls}></textarea>
          </Field>
        </Modal>
      )}

      {/* SURVEY MODAL */}
      {modal?.type === 'survey' && (
        <Modal title={modal.id ? 'Edit Jadwal Survey' : 'Jadwalkan Survey'} onClose={closeModal} formId="survey-form" onSubmit={handleSaveSurvey}>
          <Field label="Pilih Lead / Prospek">
            <select value={surveyForm.leadId} onChange={e => {
              const lead = leads.find(l => l.id === e.target.value);
              setSurveyForm({...surveyForm, leadId: e.target.value, listingId: lead?.listingId || surveyForm.listingId});
            }} className={selectCls} required>
              <option value="">-- Pilih Lead --</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.name} — {l.phone}</option>)}
            </select>
          </Field>
          <Field label="Listing Tujuan">
            <select value={surveyForm.listingId} onChange={e => setSurveyForm({...surveyForm, listingId: e.target.value})} className={selectCls} required>
              <option value="">-- Pilih Listing --</option>
              {listings.map(l => <option key={l.listingId} value={l.listingId}>{l.listingId} — {l.tipeListing}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tanggal"><input type="date" value={surveyForm.tanggal} onChange={e => setSurveyForm({...surveyForm, tanggal: e.target.value})} className={inputCls + ' [color-scheme:dark]'} required /></Field>
            <Field label="Jam"><input type="time" value={surveyForm.jam} onChange={e => setSurveyForm({...surveyForm, jam: e.target.value})} className={inputCls + ' [color-scheme:dark]'} required /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Agen Pendamping"><input type="text" value={surveyForm.pic} onChange={e => setSurveyForm({...surveyForm, pic: e.target.value})} className={inputCls} /></Field>
            <Field label="Status">
              <select value={surveyForm.status} onChange={e => setSurveyForm({...surveyForm, status: e.target.value})} className={selectCls}>
                {SURVEY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          {surveyForm.status === 'Completed' && (
            <Field label="Hasil Kunjungan">
              <textarea rows="2" value={surveyForm.hasil} onChange={e => setSurveyForm({...surveyForm, hasil: e.target.value})} className={inputCls} placeholder="Impresi klien terhadap properti..."></textarea>
            </Field>
          )}
          <Field label="Catatan">
            <textarea rows="2" value={surveyForm.catatan} onChange={e => setSurveyForm({...surveyForm, catatan: e.target.value})} className={inputCls}></textarea>
          </Field>
        </Modal>
      )}

      {/* OFFER MODAL */}
      {modal?.type === 'offer' && (
        <Modal title={modal.id ? 'Edit Penawaran' : 'Buat Penawaran Baru'} onClose={closeModal} formId="offer-form" onSubmit={handleSaveOffer}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Pembeli (Lead)">
              <select value={offerForm.leadId} onChange={e => {
                const lead = leads.find(l => l.id === e.target.value);
                setOfferForm({...offerForm, leadId: e.target.value, listingId: lead?.listingId || offerForm.listingId});
              }} className={selectCls} required>
                <option value="">-- Pilih Lead --</option>
                {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </Field>
            <Field label="Tanggal Offer"><input type="date" value={offerForm.tanggalOffer} onChange={e => setOfferForm({...offerForm, tanggalOffer: e.target.value})} className={inputCls + ' [color-scheme:dark]'} required /></Field>
          </div>
          <Field label="Listing Target">
            <select value={offerForm.listingId} onChange={e => setOfferForm({...offerForm, listingId: e.target.value})} className={selectCls} required>
              <option value="">-- Pilih Listing --</option>
              {listings.map(l => <option key={l.listingId} value={l.listingId}>{l.listingId} — {formatCurrency(l.hargaListing)}</option>)}
            </select>
          </Field>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <label className="block text-sm font-bold text-primary mb-1">Harga Penawaran (Rp)</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400 font-medium text-sm">Rp</span>
              <input type="text" value={offerForm.hargaOffer ? new Intl.NumberFormat('id-ID').format(offerForm.hargaOffer) : ''} onChange={e => setOfferForm({...offerForm, hargaOffer: e.target.value.replace(/\D/g,'')})} className={inputCls + ' pl-10 text-base font-bold'} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Metode Pembayaran">
              <select value={offerForm.metodePembayaran} onChange={e => setOfferForm({...offerForm, metodePembayaran: e.target.value})} className={selectCls}>
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={offerForm.status} onChange={e => setOfferForm({...offerForm, status: e.target.value})} className={selectCls}>
                {OFFER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          {(offerForm.metodePembayaran === 'KPR' || offerForm.metodePembayaran === 'Cash Bertahap') && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="DP / Uang Muka (Rp)">
                <input type="text" value={offerForm.dp ? new Intl.NumberFormat('id-ID').format(offerForm.dp) : ''} onChange={e => setOfferForm({...offerForm, dp: e.target.value.replace(/\D/g,'')})} className={inputCls} />
              </Field>
              <Field label="Tenor"><input type="text" value={offerForm.tenor} onChange={e => setOfferForm({...offerForm, tenor: e.target.value})} className={inputCls} placeholder="Contoh: 15 tahun" /></Field>
            </div>
          )}
          <Field label="Catatan">
            <textarea rows="2" value={offerForm.catatan} onChange={e => setOfferForm({...offerForm, catatan: e.target.value})} className={inputCls}></textarea>
          </Field>
        </Modal>
      )}

    </div>
  );
};

export default CRMHub;
