import React, { useState } from 'react';
import { Search, Clock, ArrowRight, TrendingUp, Newspaper, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProperty } from '../context/PropertyContext';

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const categories = ['Semua', 'Investasi', 'Tips & Trik', 'Legalitas', 'Market', 'Berita Umum', 'Promo'];
  const { articles } = useProperty();

  const publishedArticles = articles?.filter(a => a.status === 'Published') || [];
  
  // Ambil artikel terbaru untuk dijadikan featured
  const featuredNews = publishedArticles.length > 0 ? publishedArticles[0] : null;
  // Sisanya untuk list
  const newsList = publishedArticles.length > 1 ? publishedArticles.slice(1) : [];

  const filteredNews = activeCategory === 'Semua' ? newsList : newsList.filter(n => n.category === activeCategory);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-24 pb-8 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-3xl rounded-full transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">Kito<span className="text-primary font-serif font-light tracking-wide">News</span></h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base">Berita terkini, tren investasi, dan wawasan mendalam seputar dunia properti.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            
            {/* Featured Article */}
            {featuredNews && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-primary" />
                  Sorotan Utama
                </h2>
                
                <Link to={`/news/${featuredNews.articleId || featuredNews.id}`} className="block group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div className="h-[300px] md:h-[400px] overflow-hidden relative">
                    {featuredNews.image ? (
                      <img src={featuredNews.image} alt={featuredNews.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                        <Newspaper size={64} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-primary text-black font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg">
                      {featuredNews.category}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors leading-tight">
                        {featuredNews.title}
                      </h3>
                      <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {formatDate(featuredNews.tanggalInput)}</span>
                        <span>Oleh {featuredNews.author}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Category Filter */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 custom-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                    activeCategory === cat 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredNews.map(news => (
                <Link to={`/news/${news.articleId || news.id}`} key={news.articleId || news.id} className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col h-full">
                  <div className="h-48 overflow-hidden relative">
                    {news.image ? (
                      <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                        <Newspaper size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{news.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDate(news.tanggalInput)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {news.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
                      {news.excerpt}
                    </p>
                    <span className="text-slate-900 font-bold text-sm inline-flex items-center group-hover:text-primary transition-colors">
                      Baca Selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            
            {filteredNews.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Belum ada artikel</h3>
                <p className="text-slate-500">Tidak ada artikel dalam kategori ini.</p>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-primary hover:text-black transition-colors shadow-lg">
                Muat Lebih Banyak
              </button>
            </div>
            
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Search Widget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Cari Artikel</h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ketik kata kunci..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Popular Widget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-5 pb-4 border-b border-slate-100">Terpopuler Minggu Ini</h3>
              <div className="space-y-5">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex gap-4 group cursor-pointer">
                    <div className="text-3xl font-black text-slate-200 group-hover:text-primary transition-colors leading-none">0{num}</div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-primary transition-colors line-clamp-2">Tips Memilih Properti Komersial untuk Usaha Kuliner</h4>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Investasi</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-slate-900 rounded-3xl p-8 text-center relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 rounded-full bg-primary/20 blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary rounded-full mx-auto flex items-center justify-center mb-5 shadow-lg shadow-primary/20">
                  <Newspaper className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Langganan Berita</h3>
                <p className="text-slate-400 text-sm mb-6">Dapatkan insight properti terbaik langsung di kotak masuk Anda.</p>
                <div className="flex gap-2">
                  <input type="email" placeholder="Email Anda" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary placeholder:text-slate-500" />
                  <button className="bg-primary text-black p-2.5 rounded-xl hover:bg-yellow-400 transition-colors shrink-0">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsPage;
