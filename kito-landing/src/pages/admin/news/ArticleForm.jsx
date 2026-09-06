import React, { useState, useEffect, useRef } from 'react';
import { Save, UploadCloud, Eye, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProperty } from '../../../context/PropertyContext';

const ArticleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { articles, addArticle, updateArticle } = useProperty();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Berita Umum',
    excerpt: '',
    content: '',
    status: 'Draft',
    image: '',
    author: 'Admin Kito'
  });

  useEffect(() => {
    if (id && articles) {
      const existing = articles.find(a => String(a.articleId) === String(id) || String(a.id) === String(id));
      if (existing) {
        setFormData(existing);
      }
    }
  }, [id, articles]);

  const categories = [
    'Berita Umum', 'Investasi', 'Market', 'Tips & Trik', 'Legalitas', 'Promo'
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e, statusOverride) => {
    e.preventDefault();
    const finalStatus = statusOverride || formData.status;
    const finalData = { ...formData, status: finalStatus };

    if (!finalData.title || !finalData.content) {
      alert("Judul dan Isi Artikel wajib diisi!");
      return;
    }

    if (id) {
      updateArticle(id, finalData);
      alert('Artikel berhasil diperbarui!');
    } else {
      addArticle(finalData);
      alert('Artikel berhasil disimpan!');
    }
    navigate('/admin/news/manage');
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{id ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h1>
          <p className="text-slate-400 text-sm">Publikasikan wawasan, berita, dan tips seputar properti.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => handleSave(e, 'Draft')}
            className="px-4 py-2 bg-slate-800 text-slate-300 font-medium rounded-lg border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
          >
            <Save size={18} /> Simpan Draft
          </button>
          <button 
            onClick={(e) => handleSave(e, 'Published')}
            className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <CheckCircle2 size={18} /> Terbitkan Sekarang
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Editor Content (Left/Center) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary rounded-full"></span>
              Konten Utama
            </h2>

            <div className="space-y-5">
              {/* Judul */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Judul Artikel <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Contoh: Suku Bunga KPR Turun, Ini Momen Emas Beli Properti"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-lg placeholder:text-slate-600"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Ringkasan (Excerpt)</label>
                <textarea 
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  placeholder="Satu atau dua kalimat ringkasan yang akan muncul di daftar berita."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm placeholder:text-slate-600 resize-none"
                />
              </div>

              {/* Editor Teks (Mockup) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Isi Artikel <span className="text-rose-500">*</span></label>
                
                {/* Fake Toolbar */}
                <div className="bg-slate-900 border border-slate-700 border-b-0 rounded-t-xl p-2 flex items-center gap-1 overflow-x-auto">
                  {['B', 'I', 'U', 'H1', 'H2', 'Link', 'Image'].map(tool => (
                    <button key={tool} className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors">
                      {tool}
                    </button>
                  ))}
                </div>
                
                <textarea 
                  rows={15}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Ketik isi artikel Anda di sini..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-b-xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm placeholder:text-slate-600 resize-y"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings (Right) */}
        <div className="space-y-6">
          
          {/* Metadata & Kategori */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-500 rounded-full"></span>
              Kategori & Metadata
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Kategori Topik</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Penulis</label>
                <input 
                  type="text" 
                  disabled
                  value={formData.author}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed text-sm"
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-rose-500 rounded-full"></span>
              Gambar Cover (Hero)
            </h2>

            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload}
            />

            {formData.image ? (
              <div className="relative rounded-xl overflow-hidden group">
                <img src={formData.image} alt="Cover" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current.click()}>
                  <p className="text-white text-sm font-bold flex items-center gap-2"><UploadCloud size={16} /> Ganti Gambar</p>
                </div>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-700/50 hover:border-primary transition-colors group">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="text-slate-400 group-hover:text-primary" size={24} />
                </div>
                <p className="text-slate-300 font-medium mb-1">Upload gambar thumbnail</p>
                <p className="text-slate-500 text-xs mb-4">PNG, JPG, WebP max 2MB</p>
                <button type="button" className="px-4 py-1.5 bg-slate-900 text-slate-300 text-xs font-bold rounded-lg border border-slate-700">Pilih File</button>
              </div>
            )}
          </div>

          {/* Publishing */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full"></span>
              Publikasi
            </h2>
            
            <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Status saat ini</span>
              </div>
              <span className="text-sm font-bold text-white">{formData.status}</span>
            </div>

            <div className="space-y-4">
              <button className="w-full py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl border border-slate-700 hover:border-primary transition-colors flex items-center justify-center gap-2">
                <Eye size={16} /> Preview Artikel
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArticleForm;
