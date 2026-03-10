"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Book,
  FileText,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { getSiteContent, SiteContent } from "@/app/action/home";
import HeroImage from "../aset/siswa-sekolah-dasar-ilustrasi-_120411093327-641.jpg";

import ContactModal from "../components/ContactModal";

const Home = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const data = await getSiteContent();
      setContents(data);
    };
    fetchContent();
  }, []);

  const getContentValue = (
    section: string,
    key: string,
    defaultValue: string,
  ) => {
    return (
      contents.find((c) => c.section === section && c.content_key === key)
        ?.content_value || defaultValue
    );
  };

  const getHighlights = () => {
    const json = getContentValue("home", "highlights_json", "[]");
    try {
      return JSON.parse(json);
    } catch (e) {
      return [];
    }
  };

  const getWaLink = () => {
    const raw = getContentValue("footer", "wa_number", "62811500580");
    const clean = raw.replace(/\D/g, "");
    const final = clean.startsWith("0") ? "62" + clean.slice(1) : clean;
    return `https://wa.me/${final}`;
  };

  const highlights = getHighlights();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Book":
        return <Book size={24} className="text-black" />;
      case "FileText":
        return <FileText size={24} className="text-black" />;
      case "TrendingUp":
        return <TrendingUp size={24} className="text-black" />;
      default:
        return <Book size={24} className="text-black" />;
    }
  };

  return (
    <div className="w-full bg-white font-sans text-black">
      {/* Hero Section - Clean White Background (Image 1) */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center pt-20 pb-12 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 lg:px-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/50 border border-gray-200 rounded-full mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-400"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  {getContentValue("hero", "badge", "PT Media Eduka Sentosa")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black mb-6 lg:mb-8 leading-[1.1] tracking-tighter">
                {getContentValue(
                  "hero",
                  "title",
                  "Solusi Pendidikan Terintegrasi untuk Sekolah di Indonesia",
                )}
              </h1>

              <p className="text-gray-400 font-normal italic text-base md:text-lg lg:text-xl mb-8 lg:mb-10 max-w-2xl leading-relaxed">
                {getContentValue(
                  "hero",
                  "description",
                  "Kami membantu sekolah memenuhi kebutuhan strategis...",
                )}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a
                  href={getWaLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-black/10 group"
                >
                  {getContentValue("hero", "cta_primary", "Hubungi Kami")}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-black border border-gray-200 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all">
                  {getContentValue("hero", "cta_secondary", "Lihat Profile")}
                </button>
              </div>
            </div>

            {/* Right Image (Image 1 style) */}
            <div className="flex-1 relative w-full lg:w-auto mt-8 lg:mt-0">
              <div className="relative z-10 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                <Image
                  src={HeroImage}
                  alt="Solusi Pendidikan"
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 lg:-left-12 z-20 bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-3 md:gap-4 animate-bounce-slow">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-lg md:rounded-xl flex items-center justify-center border border-gray-100">
                  <TrendingUp size={20} className="text-black md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-black text-black">
                    500+
                  </div>
                  <div className="text-[7px] md:text-[8px] font-black text-gray-400 uppercase tracking-widest">
                    Sekolah Terbantu
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gray-100 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gray-50 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Sections - Clean Cards (Image 1) */}
      <section className="py-24 bg-gray-50/30">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {highlights.map((item: any, i: number) => (
              <div
                key={i}
                className="group p-8 lg:p-10 bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-black/5 transition-all relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-50 rounded-xl lg:rounded-2xl flex items-center justify-center mb-6 lg:mb-8 border border-gray-100 transition-all transform group-hover:rotate-6">
                    {getIcon(item.icon)}
                  </div>
                  <h3 className="text-xl lg:text-2XL font-black text-black mb-3 lg:mb-4 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 font-normal text-sm lg:text-base leading-relaxed italic">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learn More Banner (Image 1 bottom) */}
      <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto border-t border-gray-100 pt-16">
            <h2 className="text-3xl lg:text-4xl font-black text-black mb-6 tracking-tight uppercase">
              Pelajari Lebih Lanjut
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-12 leading-relaxed">
              Temukan bagaimana PT MES dapat membantu sekolah Anda berkembang
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
              <div className="p-6 lg:p-8 bg-white border border-gray-100 rounded-xl lg:rounded-2xl flex items-center gap-4 hover:border-black/10 transition-all">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                  <Book size={18} className="text-gray-400" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] lg:text-xs font-black text-black uppercase">
                    Ekosistem Solusi
                  </div>
                  <div className="text-[8px] lg:text-[9px] font-bold text-gray-400">
                    Unit-unit layanan kami
                  </div>
                </div>
              </div>
              <div className="p-6 lg:p-8 bg-white border border-gray-100 rounded-xl lg:rounded-2xl flex items-center gap-4 hover:border-black/10 transition-all">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp size={18} className="text-gray-400" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] lg:text-xs font-black text-black uppercase">
                    Mengapa Kami
                  </div>
                  <div className="text-[8px] lg:text-[9px] font-bold text-gray-400">
                    Keunggulan kolaborasi
                  </div>
                </div>
              </div>
              <div className="p-6 lg:p-8 bg-white border border-gray-100 rounded-xl lg:rounded-2xl flex items-center gap-4 hover:border-black/10 transition-all sm:col-span-2 md:col-span-1">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                  <ArrowRight size={18} className="text-gray-400" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] lg:text-xs font-black text-black uppercase">
                    Cara Kerja
                  </div>
                  <div className="text-[8px] lg:text-[9px] font-bold text-gray-400">
                    Proses kerja teratur
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
