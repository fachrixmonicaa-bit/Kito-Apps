import React, { useState, useMemo, useRef } from 'react';
import { useProperty } from '../../../context/PropertyContext';
import { FileText, TrendingDown, Users, Calendar, Handshake, MessageSquare, Building2, Printer } from 'lucide-react';

const formatCurrency = (num) => {
  if (!num) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

const maskName = (name) => {
  if (!name) return 'Hamba Allah';
  const parts = name.split(' ');
  if (parts.length === 1) return name.charAt(0) + '***';
  return parts[0] + ' ' + parts[1].charAt(0) + '***';
};

const VendorReport = () => {
  const { listings, properties, leads, surveys, offers } = useProperty();
  const [selectedListingId, setSelectedListingId] = useState('');

  const reportRef = useRef(null);

  // Get active exclusive listings
  const exclusiveListings = useMemo(() => {
    return listings.filter(l => l.tipeListing === 'Exclusive');
  }, [listings]);

  // Derived Data for the Selected Listing
  const reportData = useMemo(() => {
    if (!selectedListingId) return null;

    const listing = listings.find(l => l.listingId === selectedListingId);
    const property = properties.find(p => p.propertyId === listing?.propertyId);
    
    // Funnel 1: Leads
    const listingLeads = leads.filter(l => l.listingId === selectedListingId);
    
    // Funnel 2: Surveys
    const listingSurveys = surveys.filter(s => s.listingId === selectedListingId);
    
    // Funnel 3: Offers
    const listingOffers = offers.filter(o => o.listingId === selectedListingId);

    return {
      listing,
      property,
      leads: listingLeads,
      surveys: listingSurveys,
      offers: listingOffers,
      metrics: {
        totalLeads: listingLeads.length,
        totalSurveys: listingSurveys.length,
        totalOffers: listingOffers.length,
      }
    };
  }, [selectedListingId, listings, properties, leads, surveys, offers]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full pb-10">
      {/* HEADER SECTION - HIDDEN ON PRINT */}
      <div className="print:hidden flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-3 backdrop-blur-sm">
            <FileText size={12} className="text-primary" />
            Laporan
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Vendor <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Report</span>
          </h1>
          <p className="text-slate-400">Generate laporan kinerja pemasaran untuk Klien Eksklusif Anda.</p>
        </div>
      </div>

      {/* CONTROLS - HIDDEN ON PRINT */}
      <div className="print:hidden bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-slate-300 mb-2">Pilih Properti Eksklusif</label>
          <select 
            value={selectedListingId} 
            onChange={e => setSelectedListingId(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-white"
          >
            <option value="">-- Silakan Pilih Listing --</option>
            {exclusiveListings.map(l => {
              const p = properties.find(prop => prop.propertyId === l.propertyId);
              return (
                <option key={l.listingId} value={l.listingId}>
                  {l.listingId} - {p?.alamat || 'Alamat Tidak Diketahui'}
                </option>
              );
            })}
          </select>
        </div>
        {reportData && (
          <button 
            onClick={handlePrint}
            className="w-full md:w-auto px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,202,64,0.3)] flex items-center justify-center gap-2 mt-6 md:mt-0"
          >
            <Printer size={18} />
            Cetak Laporan PDF
          </button>
        )}
      </div>

      {/* REPORT CONTENT - WILL BE PRINTED */}
      {reportData ? (
        <div ref={reportRef} 
             className="bg-white/10 text-white rounded-2xl shadow-xl border border-primary/20 p-6 md:p-10 mb-8 print:bg-white print:text-slate-900 print:shadow-none print:border-none print:p-8 print:m-0"
             style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
        >
          
          {/* Header Cetak */}
          <div className="hidden print:flex justify-between items-center mb-8 p-6 rounded-xl bg-slate-50 relative overflow-hidden border border-slate-200">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#EACE40]"></div>
            <div className="flex flex-col pl-4">
              <div className="inline-block bg-[#EACE40]/10 rounded-full px-3 py-1 mb-3 self-start border border-[#EACE40]/30">
                 <span className="text-[10px] font-bold text-[#b39500] tracking-wider uppercase">Laporan Kinerja Pemasaran</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-black mb-1">Vendor Report</h1>
              <p className="text-[11px] font-medium text-slate-500">Periode: S.d. {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex items-center justify-center mr-2 text-right">
              <div className="flex flex-col items-end">
                <img src="/logo-kito.png" alt="Kito Property Logo" className="h-10 lg:h-12 object-contain print:brightness-0 mb-2" onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }} />
                <div className="font-bold text-slate-800 text-sm">{reportData.listing.listingId}</div>
                <div className="text-[10px] text-slate-500 font-medium">Exclusive Listing</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4 print:hidden">
            <FileText size={20} className="text-primary" />
            <h2 className="text-xl md:text-2xl font-bold">Laporan Kinerja Pemasaran</h2>
            <div className="ml-auto text-right">
                <div className="font-bold text-lg">{reportData.listing.listingId}</div>
                <div className="text-xs text-slate-400">Exclusive Listing</div>
            </div>
          </div>
          
          {/* DATA PROPERTI */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 mb-8 print:bg-white print:border-slate-200">
            <h3 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-widest print:text-slate-400">Data Properti</h3>
            
            <div className="flex flex-col gap-6">
              {/* Gambar (Sangat Diperbesar - Full Width Banner) */}
              <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-md print:shadow-none border border-white/10 print:border-slate-200 bg-black/20 print:bg-slate-50 flex items-center justify-center relative">
                {reportData.listing?.photos && reportData.listing.photos.length > 0 ? (
                  <img src={reportData.listing.photos[0]} alt="Properti" className="w-full h-full object-cover" />
                ) : (
                  <Building2 size={64} className="text-primary/50 print:text-slate-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent hidden print:block"></div>
                <div className="absolute bottom-4 left-4 hidden print:block text-white z-10">
                   <p className="font-bold text-lg">{reportData.property?.jenisProperti || '-'}</p>
                   <p className="text-sm text-white/80">{reportData.property?.alamat || 'Alamat Belum Tersedia'}</p>
                </div>
              </div>
              
              {/* Info Text */}
              <div className="flex-1 flex flex-col justify-center print:hidden">
                <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-wider">Lokasi Properti</p>
                <p className="font-bold text-white text-lg md:text-xl leading-snug mb-6">
                  {reportData.property?.alamat || 'Alamat Belum Tersedia'}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/20 px-4 py-3 rounded-lg border border-white/5 print:bg-slate-50 print:border-slate-200">
                  <p className="text-[10px] text-slate-500 mb-1 print:text-slate-400 font-bold uppercase tracking-wider">Jenis Properti</p>
                  <p className="font-bold text-white print:text-black text-sm">{reportData.property?.jenisProperti || '-'}</p>
                </div>
                <div className="bg-black/20 px-4 py-3 rounded-lg border border-white/5 print:bg-slate-50 print:border-slate-200">
                  <p className="text-[10px] text-slate-500 mb-1 print:text-slate-400 font-bold uppercase tracking-wider">Harga Listing</p>
                  <p className="font-bold text-[#EACE40] print:text-[#b39500] text-sm">{formatCurrency(reportData.listing.hargaListing)}</p>
                </div>
                <div className="bg-black/20 px-4 py-3 rounded-lg border border-white/5 print:bg-slate-50 print:border-slate-200">
                  <p className="text-[10px] text-slate-500 mb-1 print:text-slate-400 font-bold uppercase tracking-wider">Luas Tanah</p>
                  <p className="font-bold text-white print:text-black text-sm">{reportData.property?.luasTanah || 0} m²</p>
                </div>
                <div className="bg-black/20 px-4 py-3 rounded-lg border border-white/5 print:bg-slate-50 print:border-slate-200">
                  <p className="text-[10px] text-slate-500 mb-1 print:text-slate-400 font-bold uppercase tracking-wider">Luas Bangunan</p>
                  <p className="font-bold text-white print:text-black text-sm">{reportData.property?.luasBangunan || 0} m²</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            
            {/* EXECUTIVE SUMMARY */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 print:bg-white print:border-slate-200 print:p-0 print:border-none">
              <h3 className="text-lg font-bold border-b border-white/10 print:border-slate-200 pb-4 mb-6 flex items-center gap-2 print:text-black">
                <TrendingDown className="text-blue-400 print:text-blue-600" /> Sales Funnel & Traffic
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 text-center print:bg-blue-50 print:border-blue-100">
                  <div className="mx-auto w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-3 print:bg-blue-100 print:text-blue-600">
                    <Users size={24} />
                  </div>
                  <div className="text-4xl font-extrabold text-white mb-1 print:text-blue-700">{reportData.metrics.totalLeads}</div>
                  <div className="text-sm font-semibold text-blue-400 uppercase tracking-wide print:text-blue-600/70">Inquiries Masuk</div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 text-center print:bg-amber-50 print:border-amber-100">
                  <div className="mx-auto w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-3 print:bg-amber-100 print:text-amber-600">
                    <Calendar size={24} />
                  </div>
                  <div className="text-4xl font-extrabold text-white mb-1 print:text-amber-700">{reportData.metrics.totalSurveys}</div>
                  <div className="text-sm font-semibold text-amber-400 uppercase tracking-wide print:text-amber-600/70">Kunjungan Lokasi</div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center print:bg-emerald-50 print:border-emerald-100">
                  <div className="mx-auto w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-3 print:bg-emerald-100 print:text-emerald-600">
                    <Handshake size={24} />
                  </div>
                  <div className="text-4xl font-extrabold text-white mb-1 print:text-emerald-700">{reportData.metrics.totalOffers}</div>
                  <div className="text-sm font-semibold text-emerald-400 uppercase tracking-wide print:text-emerald-600/70">Penawaran Formal</div>
                </div>
              </div>
              
              <div className="bg-black/20 border border-white/5 rounded-xl p-6 print:bg-slate-50 print:border-slate-200">
                <p className="text-slate-300 italic print:text-slate-600 text-sm">
                  <strong className="text-white print:text-black">Analisis Singkat:</strong> Berdasarkan data interaksi di atas, dari {reportData.metrics.totalLeads} orang yang menunjukkan ketertarikan, {reportData.metrics.totalSurveys} orang melakukan peninjauan langsung ke lokasi, dan menghasilkan {reportData.metrics.totalOffers} penawaran (Letter of Offer). Terdapat rasio konversi kunjungan sebesar {reportData.metrics.totalLeads ? Math.round((reportData.metrics.totalSurveys / reportData.metrics.totalLeads) * 100) : 0}%.
                </p>
              </div>
            </div>

            {/* FEEDBACK PASAR */}
            <div className="break-inside-avoid bg-slate-900/50 p-6 rounded-xl border border-white/5 print:bg-white print:border-slate-200 print:p-0 print:border-none">
              <h3 className="text-lg font-bold border-b border-white/10 print:border-slate-200 pb-4 mb-6 flex items-center gap-2 print:text-black">
                <MessageSquare className="text-amber-400 print:text-amber-500" /> Respon & Feedback Pasar (Hasil Survey)
              </h3>
              
              {reportData.surveys.filter(s => s.status === 'Completed' || s.hasil).length > 0 ? (
                <div className="space-y-4">
                  {reportData.surveys.filter(s => s.status === 'Completed' || s.hasil).map((survey, index) => {
                    const lead = leads.find(l => l.id === survey.leadId);
                    return (
                      <div key={index} className="bg-black/20 border border-white/5 rounded-xl p-5 shadow-sm flex gap-4 print:bg-white print:border-slate-200">
                        <div className="shrink-0 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400 font-bold print:bg-slate-100 print:text-slate-500">
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-white print:text-slate-800">{maskName(lead?.name)}</span>
                            <span className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded print:bg-slate-100 print:text-slate-400">
                              {new Date(survey.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed print:text-slate-600">"{survey.hasil || survey.catatan || 'Kunjungan dilakukan tanpa meninggalkan catatan spesifik.'}"</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center p-8 bg-black/20 rounded-xl border border-white/5 text-slate-500 print:bg-slate-50 print:border-slate-200 print:text-slate-500 text-sm">
                  Belum ada rekaman catatan hasil kunjungan survei untuk properti ini.
                </div>
              )}
            </div>

            {/* RIWAYAT PENAWARAN */}
            <div className="break-inside-avoid bg-slate-900/50 p-6 rounded-xl border border-white/5 print:bg-white print:border-slate-200 print:p-0 print:border-none">
              <h3 className="text-lg font-bold border-b border-white/10 print:border-slate-200 pb-4 mb-6 flex items-center gap-2 print:text-black">
                <Handshake className="text-emerald-400 print:text-emerald-500" /> Riwayat Penawaran Harga (Offers)
              </h3>
              
              {reportData.offers.length > 0 ? (
                <div className="overflow-hidden border border-white/10 rounded-xl shadow-sm print:border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/40 border-b border-white/10 font-semibold text-slate-300 print:bg-slate-50 print:border-slate-200 print:text-slate-700">
                      <tr>
                        <th className="p-4">Tanggal</th>
                        <th className="p-4">Calon Pembeli</th>
                        <th className="p-4">Harga Penawaran</th>
                        <th className="p-4">Metode Bayar</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print:divide-slate-100">
                      {reportData.offers.map((offer) => {
                        const lead = leads.find(l => l.id === offer.leadId);
                        return (
                          <tr key={offer.id}>
                            <td className="p-4 text-slate-300 print:text-slate-600">
                              {new Date(offer.tanggalOffer).toLocaleDateString('id-ID')}
                            </td>
                            <td className="p-4 font-medium text-white print:text-slate-800">
                              {maskName(lead?.name)}
                            </td>
                            <td className="p-4 font-bold text-emerald-400 print:text-emerald-600">
                              {formatCurrency(offer.hargaOffer)}
                            </td>
                            <td className="p-4 text-slate-300 print:text-slate-600">
                              {offer.metodePembayaran}
                            </td>
                            <td className="p-4">
                              <span className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded border ${
                                offer.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 print:bg-emerald-100 print:text-emerald-700 print:border-emerald-200' :
                                offer.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 print:bg-rose-100 print:text-rose-700 print:border-rose-200' :
                                'bg-amber-500/20 text-amber-400 border-amber-500/30 print:bg-amber-100 print:text-amber-700 print:border-amber-200'
                              }`}>
                                {offer.status}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-8 bg-black/20 rounded-xl border border-white/5 text-slate-500 print:bg-slate-50 print:border-slate-200 print:text-slate-500 text-sm">
                  Belum ada penawaran harga formal yang masuk.
                </div>
              )}
            </div>
            
            <div className="pt-8 text-center text-slate-400 text-[10px] uppercase tracking-widest print:block hidden border-t border-slate-200 mt-8">
              Dicetak secara otomatis oleh sistem KitoProperty Management
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center shadow-2xl">
          <FileText size={48} className="mx-auto mb-4 text-slate-600 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">Laporan Belum Dipilih</h3>
          <p className="text-slate-400">Silakan pilih properti eksklusif di atas untuk menghasilkan laporan.</p>
        </div>
      )}
      
    </div>
  );
};

export default VendorReport;
