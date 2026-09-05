import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const { articles } = useProperty();

  const article = articles?.find(a => String(a.articleId) === id || String(a.id) === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Artikel Tidak Ditemukan</h2>
          <Link to="/news" className="text-primary font-bold hover:underline">Kembali ke Berita</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="w-full max-w-4xl mx-auto px-4 lg:px-8">
          
          <Link to="/news" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium mb-8">
            <ArrowLeft size={18} /> Kembali ke Berita
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full uppercase tracking-wider">
                {article.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Clock size={16} /> 
                {new Date(article.tanggalInput).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
              {article.title}
            </h1>
            
            <div className="flex items-center justify-between py-6 border-y border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{article.author}</p>
                  <p className="text-xs text-slate-500">Tim Redaksi Kito Property</p>
                </div>
              </div>
              
              <button className="p-2 text-slate-500 hover:text-primary hover:bg-yellow-50 rounded-full transition-colors tooltip" title="Bagikan">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {article.image && (
            <div className="w-full aspect-[21/9] bg-slate-200 rounded-2xl overflow-hidden mb-12 shadow-lg">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-lg prose-slate max-w-none">
            {article.content.split('\n').map((paragraph, idx) => (
              paragraph.trim() && <p key={idx} className="mb-6 leading-relaxed text-slate-700">{paragraph}</p>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
