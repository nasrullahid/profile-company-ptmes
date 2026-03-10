"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Globe,
  ShieldCheck,
  Lightbulb,
  CheckCircle2,
  Target,
  FileText,
  Settings,
} from "lucide-react";
import { getSiteContent, SiteContent } from "@/app/action/home";

const About = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);

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

  const getStats = () => {
    const json = getContentValue("about", "stats_json", "[]");
    try {
      return JSON.parse(json);
    } catch (e) {
      return [];
    }
  };

  const getFeatures = () => {
    const json = getContentValue("about", "features_json", "[]");
    try {
      return JSON.parse(json);
    } catch (e) {
      return [];
    }
  };

  const getAreaFokus = () => {
    const json = getContentValue("about", "area_fokus_json", "[]");
    try {
      return JSON.parse(json);
    } catch (e) {
      return [];
    }
  };

  const getMisiList = () => {
    const json = getContentValue("about", "misi_json", "[]");
    try {
      return JSON.parse(json);
    } catch (e) {
      return [];
    }
  };

  const stats = getStats();
  const features = getFeatures();
  const areaFokus = getAreaFokus();
  const misiList = getMisiList();

  const getIcon = (iconName: string, size = 24) => {
    switch (iconName) {
      case "Users":
        return <Users size={size} className="text-black" />;
      case "Globe":
        return <Globe size={size} className="text-black" />;
      case "ShieldCheck":
        return <ShieldCheck size={size} className="text-black" />;
      case "Lightbulb":
        return <Lightbulb size={size} className="text-black" />;
      case "Target":
        return <Target size={size} className="text-black" />;
      case "FileText":
        return <FileText size={size} className="text-black" />;
      case "Settings":
        return <Settings size={size} className="text-black" />;
      default:
        return <CheckCircle2 size={size} className="text-black" />;
    }
  };

  return (
    <div className="w-full bg-white font-sans text-black">
      {/* Page Header */}
      <section className="bg-black py-16 lg:py-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 lg:mb-6 tracking-tighter uppercase text-white">
            {getContentValue("about", "title", "Tentang PT MES")}
          </h1>
          <p className="text-gray-400 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] md:tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
            {getContentValue(
              "about",
              "subtitle",
              "Partner terpercaya untuk solusi pendidikan terintegrasi di Indonesia",
            )}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 border-b border-gray-100">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat: any, i: number) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-black mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="flex-[1.2] space-y-6 lg:space-y-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-black tracking-tight">
                PT Media Eduka Sentosa
              </h2>
              <div className="space-y-4 lg:space-y-6 text-gray-500 font-normal leading-relaxed text-sm md:text-base max-w-2xl italic">
                <p>{getContentValue("about", "description_para1", "")}</p>
                <p>{getContentValue("about", "description_para2", "")}</p>
                <p>{getContentValue("about", "description_para3", "")}</p>
              </div>
            </div>

            {/* Right Feature Grid */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature: any, i: number) => (
                  <div
                    key={i}
                    className="p-5 lg:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-black/5 transition-all"
                  >
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-50 rounded-lg flex items-center justify-center mb-3 lg:mb-4">
                      {getIcon(feature.icon, 18)}
                    </div>
                    <h4 className="text-xs md:text-sm font-bold text-black mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-gray-400 font-normal text-[10px] md:text-xs leading-relaxed line-clamp-2">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Area Fokus Section */}
      <section className="py-16 md:py-24 bg-gray-50/50">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-black mb-2 tracking-tight">
            Area Fokus Kami
          </h2>
          <p className="text-gray-400 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] md:tracking-[0.3em] mb-12 md:mb-16">
            Produk dan Kompetensi untuk Memenuhi Kebutuhan Sekolah Modern
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {areaFokus.map((item: any, i: number) => (
              <div
                key={i}
                className="p-6 md:p-10 bg-white border border-gray-50 rounded-2xl md:rounded-[40px] text-left shadow-sm flex flex-col sm:flex-row gap-6 md:gap-8 items-start hover:border-black/5 transition-all"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-900 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                  {React.cloneElement(
                    getIcon(item.icon, 24) as React.ReactElement<any>,
                    { className: "text-white" },
                  )}
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-black text-black mb-2 md:mb-3">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 font-normal text-sm md:text-base leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
            {/* Vision */}
            <div className="space-y-6 md:space-y-10">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white">
                Visi Kami
              </h3>
              <div className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-2xl md:rounded-[40px]">
                <p className="text-xl md:text-2xl font-bold leading-relaxed tracking-tight italic">
                  {getContentValue("about", "vision", "")}
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="space-y-6 md:space-y-10">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white">
                Misi Kami
              </h3>
              <ul className="space-y-4 md:space-y-6">
                {misiList.map((item: any, i: number) => (
                  <li key={i} className="flex gap-4 items-center group">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <p className="text-white font-medium text-sm md:text-base leading-relaxed">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Magau Group Section */}
      <section className="py-20 md:py-32 text-center bg-white">
        <div className="container mx-auto px-6">
          <p className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.4em] mb-3 md:mb-4">
            {getContentValue("about", "magau_label", "BAGIAN DARI")}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-6 md:mb-8 tracking-tighter">
            {getContentValue("about", "magau_title", "Magau Group")}
          </h2>
          <p className="text-gray-500 font-normal text-sm md:text-base max-w-2xl mx-auto italic leading-relaxed">
            "{getContentValue("about", "magau_quote", "")}"
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
