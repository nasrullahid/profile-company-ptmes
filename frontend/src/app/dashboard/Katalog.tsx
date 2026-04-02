"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  BookOpen, 
  User, 
  Info, 
  ArrowRight, 
  X, 
  RefreshCcw, 
  Search, 
  Filter, 
  ChevronDown,
  Book,
  Monitor,
  Mic2,
  Check,
  ExternalLink
} from "lucide-react";
import { getSiteContent } from "@/app/action/home";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8000";

const getImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  
  const path = url.startsWith("/") ? url : `/${url}`;
  
  if (typeof window !== "undefined") {
    // If we're in the browser, use the current hostname but assume backend is on port 8000
    // or use the host from NEXT_PUBLIC_API_URL
    const apiHost = new URL(API_BASE_URL).hostname;
    const currentHost = window.location.hostname;
    
    // If they are different, and the user is accessing via IP, they might need the IP version
    if (currentHost !== "localhost" && currentHost !== "127.0.0.1" && apiHost === "localhost") {
       return `http://${currentHost}:8000${path}`;
    }
  }
  
  return `${API_BASE_URL}${path}`;
};

const Katalog = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedFilters, setSelectedFilters] = useState({
    type: [] as string[],
    level: [] as string[],
    grade: [] as string[]
  });

  useEffect(() => {
    const fetchBooks = async () => {
      const contents = await getSiteContent();
      const catalogContent = contents.find(c => c.section === "katalog" && c.content_key === "books_json");
      if (catalogContent) {
        try {
          // Add some dummy tags if they don't exist for demo purposes
          const parsed = JSON.parse(catalogContent.content_value).map((b: any) => ({
            ...b,
            type: b.type || (b.id % 2 === 0 ? "PDF" : "Interaktif"),
            level: b.level || (b.id % 3 === 0 ? "SMP/MTS" : "SD/MI"),
            grade: b.grade || (b.id % 4 === 0 ? "VII" : "I"),
            tags: b.tags ? b.tags.split(",") : [b.id % 2 === 0 ? "PDF" : "Interaktif", b.id % 3 === 0 ? "SMP/MTS" : "SD/MI"]
          }));
          setBooks(parsed);
        } catch (e) {
          console.error("Failed to parse books JSON", e);
        }
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchType = selectedFilters.type.length === 0 || selectedFilters.type.includes(book.type);
      const matchLevel = selectedFilters.level.length === 0 || selectedFilters.level.includes(book.level);
      const matchGrade = selectedFilters.grade.length === 0 || selectedFilters.grade.includes(book.grade);
      
      return matchSearch && matchType && matchLevel && matchGrade;
    }).sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return b.id - a.id; // latest
    });
  }, [books, searchQuery, sortBy, selectedFilters]);

  const toggleFilter = (category: 'type' | 'level' | 'grade', value: string) => {
    setSelectedFilters(prev => {
      const current = prev[category];
      const next = current.includes(value) 
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: next };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="animate-spin text-blue-600" size={32} />
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Memuat Katalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-16">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-black mb-4 tracking-tighter uppercase">
            Katalog Buku
          </h1>
          <p className="text-gray-400 font-normal italic text-sm md:text-base">
            Menampilkan {filteredBooks.length} buku {filteredBooks.length !== books.length && `(dari ${books.length} buku)`}
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="flex flex-col md:flex-row gap-6 mb-12">
              <div className="flex-1 relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Cari buku disini..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-black pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-500/5 focus:border-gray-500/30 focus:bg-white transition-all text-sm font-medium"
                />
                <button className="absolute right-2.5 top-2.5 bottom-2.5 px-8 bg-gray-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-700 transition-all active:scale-95 shadow-xl shadow-gray-500/20">
                  Cari
                </button>
              </div>
              
              <div className="md:w-64 flex items-center gap-4 bg-white border border-gray-100 px-6 py-5 rounded-2xl shadow-sm">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Urutkan:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-transparent text-xs font-black text-black focus:outline-none cursor-pointer uppercase tracking-widest"
                >
                  <option value="latest">Terbaru</option>
                  <option value="title">Judul A-Z</option>
                </select>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>

            {/* Catalog Grid */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {filteredBooks.map((book) => (
                  <div 
                    key={book.id}
                    className="group bg-white flex flex-col cursor-pointer transition-all duration-300"
                    onClick={() => setSelectedBook(book)}
                  >
                    {/* Book Cover Area */}
                    <div className="relative aspect-4/5 w-[85%] mx-auto overflow-hidden rounded-2xl bg-gray-100 mb-2.5 shadow-sm border border-gray-100 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-500">
                      <img
                        src={getImageUrl(book.image)}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col items-start text-left mx-3">
                      <h3 className="text-xs md:text-lg font-bold text-[#2d2d2d] leading-tight mb-1 group-hover:text-black transition-colors line-clamp-2 px-1">
                        {book.title}
                      </h3>
                      
                      <p className="text-xs font-medium text-black line-clamp-10 leading-relaxed px-1">
                        {book.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <BookOpen size={48} className="text-slate-200 mb-4" />
                <p className="text-slate-500 font-bold">Tidak ada buku ditemukan</p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFilters({ type: [], level: [], grade: [] });
                  }}
                  className="mt-4 text-blue-600 text-sm font-bold hover:underline"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] overflow-hidden max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-300 my-auto border border-gray-100">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-white transition-all z-20 shadow-sm border border-gray-100"
            >
              <X size={16} className="text-black" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left Side: Image */}
              <div className="w-full md:w-[40%] bg-gray-50 flex items-center justify-center p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="relative w-full aspect-[3/4] shadow-xl rounded-xl overflow-hidden border-2 border-white">
                    <img
                        src={getImageUrl(selectedBook.image)}
                        alt={selectedBook.title}
                        className="w-full h-full object-cover"
                    />
                </div>
              </div>

              {/* Right Side: Info */}
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                <h2 className="text-xl md:text-2xl font-black text-black mb-6 leading-tight tracking-tighter uppercase">
                  {selectedBook.title}
                </h2>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-300 uppercase tracking-widest mb-1.5">Penulis</span>
                    <span className="text-xs font-black text-black uppercase tracking-widest leading-none">{selectedBook.author}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-300 uppercase tracking-widest mb-1.5">ISBN</span>
                    <span className="text-xs font-black text-black uppercase tracking-widest leading-none">{selectedBook.isbn || "-"}</span>
                  </div>
                </div>

                <div className="mb-10">
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Ringkasan</h4>
                    <p className="text-black leading-relaxed text-xs md:text-sm font-medium">
                        {selectedBook.full_description || selectedBook.description}
                    </p>
                </div>

                <div className="mt-auto flex flex-col md:flex-row gap-4">
                    {selectedBook.link && (
                        <a 
                            href={selectedBook.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center px-10 py-4 border-2 border-black text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <ExternalLink size={14} />
                            Buka Link
                        </a>
                    )}
                    <button 
                        onClick={() => setSelectedBook(null)}
                        className="flex-1 px-10 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/20"
                    >
                        Tutup Detail
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Katalog;
