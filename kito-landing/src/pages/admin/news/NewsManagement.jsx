import React, { useState } from 'react';
import { Newspaper, Plus, Search, Edit2, Trash2, Eye, Globe, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProperty } from '../../../context/PropertyContext';

const NewsManagement = () => {
  const { articles, deleteArticle, updateArticle } = useProperty();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  const handleDelete = (id) => {
    if(window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      deleteArticle(id);
    }
  };

  const handleToggleStatus = (article) => {
    const newStatus = article.status === 'Published' ? 'Draft' : 'Published';
    updateArticle(article.articleId || article.id, { status: newStatus });
  };

  const filteredArticles = articles?.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || a.status === filterStatus;
    return matchSearch && matchStatus;
  }) || [];

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Manajemen Artikel KitoNews</h1>
          <p className="text-slate-400 text-sm">Kelola berita, wawasan, dan publikasi untuk pengunjung website.</p>
        </div>
        <Link 
          to="/admin/news/write"
          className="px-4 py-2.5 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> Tulis Artikel Baru
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari berdasarkan judul artikel..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-500"
          />
        </div>
        <div className="flex gap-2">
          {['Semua', 'Published', 'Draft'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                filterStatus === status 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm">
                <th className="p-4 font-semibold whitespace-nowrap">Artikel</th>
                <th className="p-4 font-semibold whitespace-nowrap">Kategori</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold whitespace-nowrap">Tanggal Input</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    Belum ada artikel yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredArticles.map(article => (
                  <tr key={article.articleId || article.id} className="hover:bg-slate-700/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-12 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 border border-slate-700">
                          {article.image ? (
                            <img src={article.image} alt="cover" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <Newspaper size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm line-clamp-1 mb-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/admin/news/edit/${article.articleId || article.id}`)}>
                            {article.title}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1">{article.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg border border-slate-600 whitespace-nowrap">
                        {article.category}
                      </span>
                    </td>
                    <td className="p-4">
                      {article.status === 'Published' ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2.5 py-1 rounded-lg w-fit border border-emerald-400/20">
                          <CheckCircle2 size={14} /> Published
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg w-fit border border-amber-400/20">
                          <Edit2 size={14} /> Draft
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 text-sm whitespace-nowrap">
                      {new Date(article.tanggalInput).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {article.status === 'Published' && (
                          <a 
                            href={`/news/${article.articleId || article.id}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors tooltip"
                            title="Lihat di Laman Visitor"
                          >
                            <Globe size={18} />
                          </a>
                        )}
                        <button 
                          onClick={() => handleToggleStatus(article)}
                          className={`p-2 rounded-lg transition-colors tooltip ${article.status === 'Published' ? 'text-amber-400 hover:bg-amber-400/10' : 'text-emerald-400 hover:bg-emerald-400/10'}`}
                          title={article.status === 'Published' ? 'Jadikan Draft' : 'Terbitkan Sekarang'}
                        >
                          {article.status === 'Published' ? <Eye size={18} className="opacity-50" /> : <Eye size={18} />}
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/news/edit/${article.articleId || article.id}`)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors tooltip"
                          title="Edit Artikel"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(article.articleId || article.id)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors tooltip"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewsManagement;
