"use client";

import React, { useEffect, useState } from "react";
import {
  MapPin,
  Check,
  Baby,
  Bean,
  BookOpen,
  Atom,
  Wrench,
  GraduationCap,
} from "lucide-react";
import { getSiteContent, SiteContent } from "@/app/action/home";

const Jangkauan = () => {
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

  const getLevels = () => {
    const json = getContentValue("jangkauan", "levels_json", "[]");
    try {
      return JSON.parse(json);
    } catch (e) {
      return [];
    }
  };

  const getAreas = () => {
    const json = getContentValue("jangkauan", "areas_json", "[]");
    try {
      return JSON.parse(json);
    } catch (e) {
      return [];
    }
  };

  const getIconByName = (name: string, size: number = 28) => {
    switch (name) {
      case "Baby":
        return <Baby size={size} />;
      case "Bean":
        return <Bean size={size} />;
      case "BookOpen":
        return <BookOpen size={size} />;
      case "Atom":
        return <Atom size={size} />;
      case "Wrench":
        return <Wrench size={size} />;
      default:
        return <GraduationCap size={size} />;
    }
  };

  const levels = getLevels();
  const areas = getAreas();

  // Helper to handle potential string services in newer data format
  const parseServices = (services: any) => {
    if (Array.isArray(services)) return services;
    if (typeof services === "string") {
      return services.split("\n").filter((s) => s.trim() !== "");
    }
    return [];
  };

  return (
    <div className="w-full font-sans text-black">
      {/* 1. Header Section */}
      <section className="bg-black py-16 md:py-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 md:mb-6 tracking-tighter uppercase text-white">
            {getContentValue("jangkauan", "title", "Jangkauan Layanan Kami")}
          </h1>
          <p className="text-gray-400 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] md:tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
            {getContentValue(
              "jangkauan",
              "subtitle",
              "Melayani semua jenjang pendidikan dari PAUD hingga SMA/SMK di seluruh wilayah Indonesia.",
            )}
          </p>
        </div>
      </section>

      {/* 2. Intro Quote Section */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-100 italic px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <p className="text-gray-500 text-sm md:text-base font-normal leading-loose italic">
            "
            {getContentValue(
              "jangkauan",
              "quote",
              "PT Media Eduka Sentosa memiliki solusi yang komprehensif untuk setiap jenjang pendidikan. Dari modul pembelajaran hingga sistem digital, kami siap mendukung kebutuhan sekolah Anda.",
            )}
            "
          </p>
        </div>
      </section>

      {/* 3. Jenjang Sekolah Cards */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 space-y-12 max-w-5xl">
          <h2 className="text-2xl lg:text-3xl font-bold text-black text-center mb-16 tracking-tighter uppercase">
            Jenjang Sekolah yang Kami Layani
          </h2>

          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            {levels.map((level: any, i: number) => {
              const services = parseServices(level.services);
              return (
                <div
                  key={i}
                  className="flex flex-col lg:flex-row bg-white rounded-[1.25rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Card Header (Dark Box) */}
                  <div className="w-full lg:w-52 bg-[#334155] p-6 md:p-8 text-white flex lg:flex-col justify-between items-center lg:items-start shrink-0 group-odd:bg-[#334155] group-even:bg-black">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-0 lg:mb-6">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        {getIconByName(level.icon, 18)}
                      </div>
                    </div>
                    <div className="space-y-1 md:space-y-2 text-right lg:text-left">
                      <h3 className="text-lg md:text-xl font-black tracking-tight uppercase leading-tight">
                        {level.name}
                      </h3>
                      <p className="text-[7px] md:text-[8px] font-black uppercase text-white/40 tracking-[0.1em] md:tracking-[0.2em] leading-relaxed max-w-[150px]">
                        {level.detail}
                      </p>
                    </div>
                  </div>

                  {/* Card Body (Description & Services) */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 items-center md:items-start">
                    <div className="flex-1 space-y-4 md:space-y-6">
                      <p className="text-gray-400 font-normal text-xs md:text-[14px] leading-relaxed italic">
                        {level.desc}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-black rounded-full"></div>
                        <span className="text-[8px] md:text-[9px] font-semibold uppercase tracking-widest text-black">
                          Layanan Berkelanjutan
                        </span>
                      </div>
                    </div>

                    {/* Checkbox List */}
                    <div className="w-full md:w-56 lg:w-64 shrink-0 bg-gray-50/80 p-5 md:p-6 lg:p-7 rounded-2xl md:rounded-[1.25rem] border border-gray-50">
                      <p className="text-[8px] md:text-[9px] font-semibold uppercase tracking-[0.1em] md:tracking-[0.2em] mb-4 md:mb-5 text-black/40">
                        Layanan Tersedia:
                      </p>
                      <ul className="space-y-2 md:space-y-3">
                        {services.map((service: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 md:gap-3"
                          >
                            <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border border-black/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Check
                                size={5}
                                className="text-black/30 md:w-2 md:h-2"
                                strokeWidth={4}
                              />
                            </div>
                            <span className="text-[9px] md:text-[9.5px] font-normal text-gray-500 leading-tight pt-0.5">
                              {service}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Jangkauan Geografis Grid */}
      <section className="py-24 bg-gray-50/30">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <h2 className="text-4xl lg:text-3xl font-bold text-black mb-4 tracking-tighter uppercase">
            {getContentValue("jangkauan", "geo_title", "Jangkauan Geografis")}
          </h2>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.4em] mb-16">
            {getContentValue(
              "jangkauan",
              "geo_subtitle",
              "Melayani seluruh lembaga pendidikan di Indonesia",
            )}
          </p>

          <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 lg:p-14 rounded-3xl md:rounded-[3rem] border border-gray-100 shadow-sm relative">
            <div className="flex items-center justify-center gap-4 mb-8 md:mb-10 text-black/60">
              <MapPin size={18} className="md:w-5 md:h-5" />
              <span className="text-base md:text-lg font-semibold tracking-tight">
                Area Layanan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {areas.map((area: any, i: number) => (
                <div
                  key={i}
                  className="bg-gray-50/50 border border-gray-100 p-3 md:p-4 rounded-xl flex items-center gap-3 group hover:bg-black transition-all"
                >
                  <div className="w-1 h-1 bg-black/20 rounded-full group-hover:bg-white transition-colors"></div>
                  <span className="text-[10px] md:text-xs font-semibold tracking-tight text-black group-hover:text-white transition-colors">
                    {area.name}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-8 md:mt-12 text-[8px] md:text-[9px] italic font-normal text-gray-400">
              {getContentValue(
                "jangkauan",
                "geo_note",
                "* Untuk wilayah di luar Pulau Jawa, silakan hubungi kami untuk informasi lebih lanjut.",
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Jangkauan;
