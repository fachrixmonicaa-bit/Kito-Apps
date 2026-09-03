import React, { useState, useMemo, useCallback } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  Rocket, Copy, Check, Download, Link2, MessageCircle,
  Globe, Camera, Store, Building2, MapPin,
  Sparkles, Image as ImageIcon, FileText, Share2
} from 'lucide-react';

const formatCurrency = (num) => {
  if (!num) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

const PLATFORMS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp Broadcast',
    icon: MessageCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    activeBg: 'bg-emerald-500/30 border-emerald-400',
  },
  {
    id: 'facebook',
    label: 'Facebook / Marketplace',
    icon: Globe,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
    activeBg: 'bg-blue-500/30 border-blue-400',
  },
  {
    id: 'instagram',
    label: 'Instagram Caption',
    icon: Camera,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/30',
    activeBg: 'bg-pink-500/30 border-pink-400',
  },
  {
    id: 'olx',
    label: 'OLX / Marketplace Umum',
    icon: Store,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/30',
    activeBg: 'bg-orange-500/30 border-orange-400',
  },
];

const generateCaption = (platform, listing, property) => {
  if (!listing || !property) return '';

  const price = formatCurrency(listing.hargaListing);
  const type = property.jenisProperti || 'Properti';
  const address = property.alamat || '-';
  const kecamatan = property.kecamatan || '';
  const lt = property.luasTanah ? `${property.luasTanah} m²` : '-';
  const lb = property.luasBangunan ? `${property.luasBangunan} m²` : '-';
  const legal = property.legalitas || '-';
  const kondisi = property.kondisiProperti || '-';
  const akses = property.aksesJalan || '-';
  const floors = property.tingkatBangunan || '-';
  const isExclusive = listing.tipeListing === 'Exclusive';
  const agentName = listing.agen || 'Tim KitoProperty';

  if (platform === 'whatsapp') {
    return `🏠 *${type.toUpperCase()} ${isExclusive ? '⭐ EXCLUSIVE' : ''} DIJUAL*
━━━━━━━━━━━━━━━━━━
💰 *Harga: ${price}*

📍 Lokasi: ${address}, ${kecamatan}
📐 LT/LB: ${lt} / ${lb}
🏗️ Kondisi: ${kondisi} | ${floors}
📄 Legalitas: ${legal}
🚗 Akses: ${akses}

✅ Siap disurvei!
📞 Hubungi: ${agentName}

_Dipasarkan oleh KitoProperty_`;
  }

  if (platform === 'facebook') {
    return `🏡 ${type} Dijual${isExclusive ? ' ⭐ EXCLUSIVE' : ''} di ${kecamatan}

💰 Harga: ${price}
📍 Lokasi: ${address}

SPESIFIKASI:
🔹 Luas Tanah: ${lt}
🔹 Luas Bangunan: ${lb}
🔹 Kondisi: ${kondisi}
🔹 Lantai: ${floors}
🔹 Legalitas: ${legal}
🔹 Akses Jalan: ${akses}

Properti ini adalah kesempatan emas! Lokasi strategis di ${kecamatan}, cocok untuk hunian maupun investasi.

📞 Hubungi kami sekarang untuk survei & info lebih lanjut:
${agentName} | KitoProperty

#properti #rumah #dijual #${kecamatan?.replace(/\s/g, '')} #investasi #realestate #${type?.replace(/\s/g, '')}`;
  }

  if (platform === 'instagram') {
    return `${type.toUpperCase()} IMPIAN DIJUAL ✨${isExclusive ? '\n⭐ EXCLUSIVE LISTING' : ''}

💰 ${price}
📍 ${kecamatan}
📐 LT ${lt} | LB ${lb}
🏗️ ${kondisi} | ${floors}
📄 ${legal}

DM kami atau hubungi ${agentName} untuk info survei 🏠

.
.
.
#rumah #dijual #properti #${kecamatan?.toLowerCase().replace(/\s/g, '')} #rumahidaman #realestate #investasiproperti #kitoproperty #${type?.toLowerCase().replace(/\s/g, '')} #rumahmurah #sumatera`;
  }

  if (platform === 'olx') {
    return `${type} Dijual – ${kondisi}, ${legal}

Harga: ${price}

Alamat: ${address}, ${kecamatan}

Detail Properti:
- Jenis: ${type}
- Luas Tanah: ${lt}
- Luas Bangunan: ${lb}
- Kondisi: ${kondisi}
- Jumlah Lantai: ${floors}
- Legalitas: ${legal}
- Akses Jalan: ${akses}

Properti ini dalam kondisi baik dan siap dihuni. Lokasi mudah dijangkau dari berbagai arah.

Untuk informasi lebih lanjut dan jadwal survei, silakan hubungi:
${agentName}
KitoProperty`;
  }

  return '';
};

const CopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
        copied
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
      }`}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? 'Tersalin!' : label}
    </button>
  );
};

const AdLauncher = () => {
  const { listings, properties } = useProperty();
  const [selectedListingId, setSelectedListingId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('whatsapp');

  const activeListings = listings.filter(l => l.status === 'Aktif');

  const selectedListing = useMemo(() =>
    listings.find(l => l.listingId === selectedListingId), [listings, selectedListingId]);

  const selectedProperty = useMemo(() =>
    selectedListing
      ? properties.find(p => p.propertyId === selectedListing.propertyId)
      : null,
    [selectedListing, properties]);

  const caption = useMemo(() =>
    generateCaption(selectedPlatform, selectedListing, selectedProperty),
    [selectedPlatform, selectedListing, selectedProperty]);

  const shareableLink = `${window.location.origin}/properties/${selectedListingId}`;

  const handleDownloadPhoto = (photo, index) => {
    const a = document.createElement('a');
    a.href = photo;
    a.download = `properti-${selectedListingId}-foto-${index + 1}.jpg`;
    a.click();
  };

  const handleDownloadAllPhotos = () => {
    if (!selectedListing?.photos?.length) return;
    selectedListing.photos.forEach((photo, i) => {
      setTimeout(() => handleDownloadPhoto(photo, i), i * 300);
    });
  };

  return (
    <div className="w-full pb-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium mb-3 backdrop-blur-sm">
            <Rocket size={12} className="text-primary" />
            Marketing Tools
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Luncurkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Iklan</span>
          </h1>
          <p className="text-slate-400">Generate konten iklan siap pakai untuk berbagai platform dalam hitungan detik.</p>
        </div>
      </div>

      {/* STEP 1: PILIH LISTING */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl mb-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-primary text-black font-extrabold text-xs flex items-center justify-center">1</span>
          Pilih Listing yang Ingin Diiklankan
        </h2>
        <select
          value={selectedListingId}
          onChange={e => setSelectedListingId(e.target.value)}
          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-white transition-all"
        >
          <option value="">-- Pilih Listing Aktif --</option>
          {activeListings.map(l => {
            const p = properties.find(prop => prop.propertyId === l.propertyId);
            return (
              <option key={l.listingId} value={l.listingId}>
                {l.listingId} {l.tipeListing === 'Exclusive' ? '⭐' : ''} — {p?.alamat || 'Alamat belum diset'} — {formatCurrency(l.hargaListing)}
              </option>
            );
          })}
        </select>

        {/* Property Preview Card */}
        {selectedProperty && selectedListing && (
          <div className="mt-5 p-5 bg-white/5 rounded-xl border border-white/10 flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-800">
              {selectedListing.photos?.[0]
                ? <img src={selectedListing.photos[0]} alt="cover" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-slate-600"><Building2 size={24} /></div>
              }
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white text-lg">{formatCurrency(selectedListing.hargaListing)}</span>
                {selectedListing.tipeListing === 'Exclusive' && (
                  <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-bold">⭐ Exclusive</span>
                )}
              </div>
              <div className="text-slate-300 text-sm flex items-start gap-1.5 mb-1">
                <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                {selectedProperty.alamat}, {selectedProperty.kecamatan}
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                <span>LT: {selectedProperty.luasTanah} m²</span>
                <span>LB: {selectedProperty.luasBangunan} m²</span>
                <span>{selectedProperty.legalitas}</span>
                <span>{selectedProperty.kondisiProperti}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedListingId && selectedListing && selectedProperty && (
        <>
          {/* STEP 2: PILIH PLATFORM */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl mb-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary text-black font-extrabold text-xs flex items-center justify-center">2</span>
              Pilih Platform Tujuan
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PLATFORMS.map(platform => {
                const Icon = platform.icon;
                const isActive = selectedPlatform === platform.id;
                return (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                      isActive ? platform.activeBg + ' scale-105 shadow-lg' : platform.bg + ' hover:scale-102 hover:opacity-80'
                    }`}
                  >
                    <Icon size={24} className={platform.color} />
                    <span className={`text-center text-xs leading-tight ${isActive ? 'text-white' : 'text-slate-400'}`}>
                      {platform.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: CAPTION */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-black font-extrabold text-xs flex items-center justify-center">3</span>
                Caption Iklan Siap Pakai
                <span className="ml-2 flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full border border-primary/20">
                  <Sparkles size={11} /> AI-Generated
                </span>
              </h2>
              <CopyButton text={caption} label="Salin Caption" />
            </div>
            <pre className="w-full bg-slate-950/70 border border-white/5 rounded-xl px-5 py-4 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans overflow-auto max-h-96">
              {caption}
            </pre>
          </div>

          {/* STEP 4: FOTO & LINK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Foto Panel */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-primary text-black font-extrabold text-xs flex items-center justify-center">4</span>
                  Unduh Foto Properti
                </h2>
                {selectedListing.photos?.length > 0 && (
                  <button
                    onClick={handleDownloadAllPhotos}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-bold hover:bg-purple-500/20 transition-colors"
                  >
                    <Download size={13} />
                    Unduh Semua
                  </button>
                )}
              </div>

              {selectedListing.photos?.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {selectedListing.photos.map((photo, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10">
                      <img src={photo} alt={`foto-${i}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleDownloadPhoto(photo, i)}
                          className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">
                  <ImageIcon size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Tidak ada foto di listing ini.</p>
                  <p className="text-xs">Tambahkan foto saat edit listing.</p>
                </div>
              )}
            </div>

            {/* Shareable Link Panel */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl flex flex-col">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-black font-extrabold text-xs flex items-center justify-center">5</span>
                Link & Ringkasan Cepat
              </h2>

              {/* Shareable Link */}
              <div className="mb-5">
                <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Link Halaman Properti</label>
                <div className="flex items-center gap-2 bg-slate-900/70 border border-white/10 rounded-xl px-4 py-3">
                  <Link2 size={14} className="text-slate-400 shrink-0" />
                  <span className="text-slate-300 text-xs truncate flex-1">{shareableLink}</span>
                  <CopyButton text={shareableLink} label="Salin" />
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="mb-5 space-y-2">
                <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Ringkasan Spek (Copyable)</label>
                {(() => {
                  const quickText = `${selectedProperty.jenisProperti} • LT ${selectedProperty.luasTanah}m² • LB ${selectedProperty.luasBangunan}m² • ${selectedProperty.legalitas} • ${formatCurrency(selectedListing.hargaListing)}`;
                  return (
                    <div className="flex items-center gap-2 bg-slate-900/70 border border-white/10 rounded-xl px-4 py-3">
                      <FileText size={14} className="text-slate-400 shrink-0" />
                      <span className="text-slate-300 text-xs flex-1">{quickText}</span>
                      <CopyButton text={quickText} label="Salin" />
                    </div>
                  );
                })()}
              </div>

              {/* Action Hints */}
              <div className="mt-auto space-y-2">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">💡 Tips Cepat</p>
                <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
                  <div className="flex gap-2"><span>📋</span><span>Salin caption di atas, paste langsung ke kolom deskripsi platform tujuan Anda.</span></div>
                  <div className="flex gap-2"><span>📸</span><span>Unduh semua foto, lalu upload ke Facebook/OLX/Instagram melalui perangkat Anda.</span></div>
                  <div className="flex gap-2"><span>🔗</span><span>Tambahkan link properti di bio Instagram atau deskripsi OLX untuk traffic balik.</span></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!selectedListingId && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-16 text-center shadow-2xl">
          <Rocket size={48} className="mx-auto mb-4 text-slate-600 opacity-40" />
          <h3 className="text-xl font-bold text-white mb-2">Siap Meluncur!</h3>
          <p className="text-slate-400">Pilih listing di atas untuk mulai generate konten iklan Anda.</p>
        </div>
      )}
    </div>
  );
};

export default AdLauncher;
