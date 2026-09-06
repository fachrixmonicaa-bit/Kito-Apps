import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, CheckCircle2, ChevronLeft, CalendarDays, Maximize } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProperties } from '../context/PropertyContext';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { properties, listings, addLead } = useProperties();
  
  const listing = listings.find(l => String(l.listingId) === String(id));
  const prop = listing ? properties.find(p => String(p.propertyId) === String(listing.propertyId)) : null;
  
  const property = listing && prop ? {
    id: listing.listingId,
    title: listing.judulListing || `${prop.jenisProperti} Siap Huni`,
    type: prop.jenisProperti,
    location: `${prop.kelurahan || '-'}, ${prop.kecamatan || '-'}`,
    priceStr: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(listing.hargaListing || prop.hargaJual || 0),
    image: (listing.photos && listing.photos.length > 0) ? listing.photos[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
    exclusive: listing.tipeListing === 'Exclusive',
    description: listing.deskripsiListing || prop.catatanTambahan || 'Silakan hubungi agen kami untuk informasi lebih detail mengenai properti ini.',
    specs: [
      { label: 'Luas Tanah', value: `${prop.luasTanah || 0} m²` },
      { label: 'Luas Bangunan', value: `${prop.luasBangunan || 0} m²` },
      ...(prop.kamarTidur ? [{ label: 'Kamar Tidur', value: prop.kamarTidur }] : []),
      ...(prop.kamarMandi ? [{ label: 'Kamar Mandi', value: prop.kamarMandi }] : [])
    ]
  } : null;

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState(`Halo, saya tertarik dengan properti ini.`);
  const [inquirySent, setInquirySent] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Properti Tidak Ditemukan</h2>
            <Link to="/properties" className="text-primary hover:underline">Kembali ke Daftar Properti</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleContactSubmit = (e) => {
    e.preventDefault();
    addLead({
      name: contactName,
      phone: contactPhone,
      email: '',
      sumberLead: 'Website KitoApps',
      listingId: property.title,
      notes: contactMessage,
      status: 'New',
      createdBy: 'Sistem Web'
    });
    setInquirySent(true);
    // Open WA in new tab
    const waText = encodeURIComponent(`${contactMessage}\n\nReferensi Properti: ${property.title} (ID: ${property.id})`);
    window.open(`https://wa.me/628000000000?text=${waText}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Back */}
        <div className="mb-6 flex items-center text-sm text-slate-500">
          <Link to="/properties" className="flex items-center hover:text-slate-900 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Kembali
          </Link>
          <span className="mx-2">/</span>
          <span>{property.type}</span>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-medium truncate">{property.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-sm mb-8 aspect-video group bg-slate-200">
              <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
              {property.exclusive && (
                <div className="absolute top-4 left-4 bg-primary text-black text-sm font-bold px-4 py-1.5 rounded-full flex items-center shadow-md">
                  <CheckCircle2 className="w-5 h-5 mr-1" />
                  Verified Exclusive
                </div>
              )}
            </div>

            {/* Title & Price */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-slate-500">
                    <MapPin className="w-5 h-5 mr-1 text-slate-400" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-3xl font-bold text-primary mb-1">{property.priceStr}</p>
                  <span className="inline-block bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded">
                    Tersedia
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100 my-6">
                {property.specs.map((spec, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-slate-400 text-sm mb-1">{spec.label}</span>
                    <span className="font-semibold text-slate-800 text-lg">{spec.value}</span>
                  </div>
                ))}
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm mb-1">Tipe</span>
                  <span className="font-semibold text-slate-800 text-lg">{property.type}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Deskripsi Properti</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-28">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tertarik?</h3>
              <p className="text-slate-500 text-sm mb-6">Hubungi agen kami atau tinggalkan pesan untuk menjadwalkan survei.</p>

              {inquirySent ? (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold">Pesan Terkirim!</h4>
                    <p className="text-sm mt-1">Kami akan segera menghubungi Anda. Anda juga akan dialihkan ke WhatsApp.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 min-h-[44px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                      placeholder="Masukkan nama..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Telepon / WA</label>
                    <input 
                      type="tel" 
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 min-h-[44px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                      placeholder="0812..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pesan</label>
                    <textarea 
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 min-h-[44px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-24 resize-none"
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="w-full bg-primary hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Kirim Pesan & WA
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetailPage;
