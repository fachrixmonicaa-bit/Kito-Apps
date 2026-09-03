import React from 'react';
import { useProperties } from '../../context/PropertyContext';
import { MessageSquare, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Inquiries = () => {
  const { inquiries, properties, updateInquiryStatus } = useProperties();

  // Sort inquiries by newest first
  const sortedInquiries = [...inquiries].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Inquiries (Leads)</h1>
        <p className="text-slate-500">Kelola pesan dan prospek dari pengunjung website.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4 w-1/4">Kontak</th>
                <th className="px-6 py-4 w-1/3">Pesan & Properti</th>
                <th className="px-6 py-4 w-1/6">Tanggal</th>
                <th className="px-6 py-4 w-1/4 text-right">Status & Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedInquiries.length > 0 ? sortedInquiries.map((inquiry) => {
                const property = properties.find(p => p.id === inquiry.propertyId);
                
                return (
                  <tr key={inquiry.id} className={`hover:bg-slate-50/50 transition-colors ${inquiry.status === 'Baru' ? 'bg-slate-50' : ''}`}>
                    <td className="px-6 py-4 align-top">
                      <p className="font-bold text-slate-900 mb-1">{inquiry.name}</p>
                      <a href={`https://wa.me/${inquiry.phone}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 hover:underline">
                        <Phone size={14} className="mr-1" />
                        {inquiry.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="mb-3">
                        <p className="text-slate-700 italic">"{inquiry.message}"</p>
                      </div>
                      {property ? (
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <img src={property.image} alt="" className="w-12 h-12 rounded object-cover" />
                          <div>
                            <Link to={`/properties/${property.id}`} target="_blank" className="text-xs font-semibold text-slate-900 hover:text-primary transition-colors line-clamp-1 mb-1">
                              {property.title}
                            </Link>
                            <span className="text-[10px] text-slate-500 flex items-center">
                              <MapPin size={10} className="mr-1" /> {property.location}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-red-500">Properti telah dihapus</span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="font-medium text-slate-700">
                        {new Date(inquiry.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(inquiry.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <div className="flex flex-col items-end gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          inquiry.status === 'Baru' ? 'bg-red-100 text-red-800' :
                          inquiry.status === 'Diproses' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {inquiry.status}
                        </span>
                        
                        <div className="mt-2 flex gap-1">
                          {inquiry.status !== 'Diproses' && (
                            <button 
                              onClick={() => updateInquiryStatus(inquiry.id, 'Diproses')}
                              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-yellow-100 hover:text-yellow-800 rounded transition-colors"
                            >
                              Proses
                            </button>
                          )}
                          {inquiry.status !== 'Selesai' && (
                            <button 
                              onClick={() => updateInquiryStatus(inquiry.id, 'Selesai')}
                              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-green-100 hover:text-green-800 rounded transition-colors"
                            >
                              Selesai
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <MessageSquare size={32} className="text-slate-300 mb-2" />
                      <p className="text-lg font-medium mb-1">Belum ada Inquiries</p>
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

export default Inquiries;
