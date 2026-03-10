"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  FileText,
  Wallet,
  Calendar,
  CheckCircle2,
  Award,
  Headphones,
  Lightbulb,
  Quote,
} from "lucide-react";
import { getSiteContent, SiteContent } from "@/app/action/home";
import berkasImg from "../aset/berkas.jpg";
import workshopImg from "../aset/workshop.jpeg";

const Why = () => {
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

  const getPoints = () => {
    const json = getContentValue("why", "points_json", "[]");
    try {
      return JSON.parse(json);
    } catch (e) {
      return [];
    }
  };

  const getAdditionalPoints = () => {
    const json = getContentValue("why", "additional_json", "[]");
    try {
      return JSON.parse(json);
    } catch (e) {
      return [];
    }
  };

  const points = getPoints();
  const additionalPoints = getAdditionalPoints();

  const getIconByName = (name: string, size = 32) => {
    switch (name) {
      case "Box":
        return <Box size={size} className="text-black" />;
      case "FileText":
        return <FileText size={size} className="text-black" />;
      case "Wallet":
        return <Wallet size={size} className="text-black" />;
      case "Calendar":
        return <Calendar size={size} className="text-black" />;
      case "Award":
        return <Award size={size} className="text-black" />;
      case "Headphones":
        return <Headphones size={size} className="text-black" />;
      case "Lightbulb":
        return <Lightbulb size={size} className="text-black" />;
      default:
        return <CheckCircle2 size={size} className="text-black" />;
    }
  };

  return (
    <div className="w-full bg-white font-sans text-black">
      {/* Header Section */}
      <section className="bg-black py-16 lg:py-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 lg:mb-6 tracking-tight uppercase">
            {getContentValue("why", "title", "Mengapa Memilih PT MES?")}
          </h2>
          <p className="text-gray-400 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] md:tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
            {getContentValue(
              "why",
              "subtitle",
              "Kami berfokus pada hasil yang terukur dan administrasi yang tertib untuk mendukung kemajuan sekolah di Indonesia.",
            )}
          </p>
        </div>
      </section>

      {/* Main Points - Alternating Layout */}
      {points.map((point: any, i: number) => (
        <section
          key={i}
          className={`py-16 md:py-24 lg:py-32 ${i % 2 !== 0 ? "bg-gray-50/50" : "bg-white"}`}
        >
          <div className="container mx-auto px-6 lg:px-16">
            <div
              className={`flex flex-col ${i % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-10 md:gap-16 lg:gap-32`}
            >
              {/* Image/Icon Box */}
              <div className="flex-1 w-full order-1 lg:order-none">
                <div className="aspect-[16/10] bg-gray-50 rounded-3xl md:rounded-4xl border border-gray-100 flex items-center justify-center shadow-inner relative group overflow-hidden">
                  {point.image ||
                  point.title.toLowerCase().includes("administrasi") ||
                  point.title.toLowerCase().includes("program") ? (
                    <img
                      src={
                        point.image ||
                        (point.title.toLowerCase().includes("administrasi")
                          ? berkasImg.src
                          : workshopImg.src)
                      }
                      alt={point.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-3xl shadow-xl flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-500">
                      {getIconByName(point.icon || "Box", 24)}
                    </div>
                  )}
                  {/* Decorative faint pattern */}
                  {!point.image &&
                    !point.title.toLowerCase().includes("administrasi") &&
                    !point.title.toLowerCase().includes("program") && (
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <div className="grid grid-cols-10 gap-4 p-4">
                          {Array.from({ length: 100 }).map((_, idx) => (
                            <div
                              key={idx}
                              className="w-1 h-1 bg-black rounded-full"
                            ></div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 space-y-6 lg:space-y-8 order-2 lg:order-none">
                <div className="flex items-center gap-4">
                  <div className="text-3xl md:text-4xl font-black text-black italic tracking-tighter shrink-0">
                    {point.id || `0${i + 1}`}
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-lg md:rounded-xl flex items-center justify-center">
                    {getIconByName(point.icon || "Box", 16)}
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                  {point.title}
                </h3>
                <p className="text-gray-500 font-normal text-sm md:text-base leading-relaxed italic">
                  {point.desc}
                </p>

                <ul className="space-y-4 pt-4">
                  {(point.points || []).map((bullet: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4 group">
                      <CheckCircle2
                        size={18}
                        className="text-black shrink-0 mt-1 opacity-20 group-hover:opacity-100 transition-opacity"
                      />
                      <span className="text-gray-400 font-normal text-base tracking-tight group-hover:text-black transition-colors">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Additional Excellence */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-black mb-3 md:mb-4 tracking-tight uppercase">
            Keunggulan Tambahan
          </h2>
          <p className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.4em] mb-12 md:mb-20">
            Nilai lebih yang Anda dapatkan ketika bermitra dengan PT MES
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {additionalPoints.map((item: any, i: number) => (
              <div
                key={i}
                className="p-8 md:p-12 bg-white border border-gray-100 rounded-2xl md:rounded-4xl hover:border-black/10 transition-all group text-left shadow-sm"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 md:mb-10 group-hover:rotate-6 transition-transform border border-gray-100">
                  {getIconByName(item.icon, 20)}
                </div>
                <h4 className="text-lg md:text-xl font-black text-black mb-3 md:mb-4">
                  {item.title}
                </h4>
                <p className="text-gray-400 font-normal text-xs md:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Quote Banner */}
      <section className="pb-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gray-50 rounded-3xl md:rounded-[60px] p-10 md:p-20 lg:p-32 text-center relative overflow-hidden border border-gray-100 shadow-sm">
            <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 opacity-[0.03]">
              <Quote
                size={150}
                className="text-black md:w-[300px] md:h-[300px]"
              />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <Quote
                size={32}
                className="text-black mx-auto mb-6 md:mb-10 opacity-20 md:w-12 md:h-12"
              />
              <p className="text-lg md:text-2xl lg:text-4xl font-bold text-black leading-[1.3] tracking-tight mb-8 md:mb-12 italic">
                "
                {getContentValue(
                  "why",
                  "quote",
                  "Kami memahami bahwa setiap sekolah memiliki kebutuhan unik. Oleh karena itu, kami hadir dengan solusi fleksibel yang dapat disesuaikan.",
                )}
                "
              </p>
              <div className="flex flex-col items-center gap-3 md:gap-4">
                <div className="w-10 md:w-12 h-1 bg-black/10 rounded-full"></div>
                <p className="text-[10px] md:text-xs font-semibold text-black/40 uppercase tracking-[0.2em] md:tracking-[0.4em]">
                  PT Media Eduka Sentosa
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Why;
