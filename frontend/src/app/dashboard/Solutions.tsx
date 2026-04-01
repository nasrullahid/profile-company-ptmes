"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Settings2, ExternalLink, QrCode } from "lucide-react";
import EduvanteLogo from "../aset/Eduvante.png";
import NawasenaLogo from "../aset/nawasena.png";
import PersonalityLogo from "../aset/personality.jpeg";
import MentorLogo from "../aset/mentor.png";
import MJDLogo from "../aset/mjd_gambar.png";
import MKDLogo from "../aset/MKD@300x.png";
import { getSiteContent, SiteContent } from "@/app/action/home";

// QR Codes from public
const qrMap: Record<string, string> = {
  nawasena: "/qr-nawasena.png",
  personality: "/qr-qpersonality.png",
  mentor: "/qr-mentorbox.png",
  mjd: "/qr-mjd.png",
  eduvante: "/qr-mentorbox.png",
  mkd: "/qr-mentorbox.png",
};

const logoMap: Record<string, any> = {
  nawasena: NawasenaLogo,
  personality: PersonalityLogo,
  mentor: MentorLogo,
  mjd: MJDLogo,
  eduvante: EduvanteLogo,
  mkd: MKDLogo,
};

const Solutions = () => {
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

  const getBrands = () => {
    const json = getContentValue("solutions", "brands_json", "[]");
    try {
      return JSON.parse(json);
    } catch (e) {
      return [];
    }
  };

  const brands = getBrands();

  // Debug: Log brands to console to check QR code values
  useEffect(() => {
    if (brands.length > 0) {
      console.log("Brands data:", brands);
      brands.forEach((brand: any, i: number) => {
        console.log(`Brand ${i + 1} (${brand.title}):`, {
          qr_code: brand.qr_code,
          logo: brand.logo,
          title: brand.title,
        });
      });
    }
  }, [brands]);

  return (
    <div className="w-full font-sans bg-white text-black">
      {/* Header */}
      <section className="bg-black py-16 lg:py-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 lg:mb-6 tracking-tighter uppercase text-white">
            {getContentValue("solutions", "title", "Ekosistem Solusi PT MES")}
          </h1>
          <p className="text-gray-400 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] md:tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
            {getContentValue(
              "solutions",
              "description",
              "Portofolio brand unggulan yang melayani berbagai klaster kebutuhan strategis pendidikan di Indonesia.",
            )}
          </p>
        </div>
      </section>

      {/* Grid Brands - Premium Monochrome Version */}
      <section className="py-24 bg-gray-50/30">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.map((brand: any, i: number) => {
              const accentColor = brand.color || "blue";
              const colorMap: Record<string, string> = {
                blue: "border-blue-100 group-hover:border-blue-500/20 bg-blue-50/5",
                purple:
                  "border-purple-100 group-hover:border-purple-500/20 bg-purple-50/5",
                green:
                  "border-green-100 group-hover:border-green-500/20 bg-green-50/5",
                teal: "border-teal-100 group-hover:border-teal-500/20 bg-teal-50/5",
                orange:
                  "border-orange-100 group-hover:border-orange-500/20 bg-orange-50/5",
                pink: "border-pink-100 group-hover:border-pink-500/20 bg-pink-50/5",
              };

              const badgeMap: Record<string, string> = {
                blue: "bg-blue-600",
                purple: "bg-purple-600",
                green: "bg-green-600",
                teal: "bg-teal-600",
                orange: "bg-orange-600",
                pink: "bg-pink-600",
              };

              return (
                <div
                  key={i}
                  className={`p-6 md:p-8 lg:p-10 rounded-3xl md:rounded-[2.5rem] border shadow-sm hover:shadow-2xl transition-all flex flex-col group relative overflow-hidden h-full ${colorMap[accentColor] || "border-gray-100 bg-white"}`}
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden p-3 md:p-4 group-hover:scale-105 transition-transform duration-500 shadow-sm">
                      {logoMap[brand.logo] ? (
                        <Image
                          src={logoMap[brand.logo]}
                          alt={brand.title}
                          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      ) : (
                        <Settings2
                          size={32}
                          className="text-black md:w-10 md:h-10"
                        />
                      )}
                    </div>

                    {/* QR Popover style link */}
                    <div className="relative group/qr">
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-help hover:bg-black hover:text-white transition-all">
                        <QrCode size={20} />
                      </div>
                      {/* Floating QR on hover */}
                      <div className="absolute top-full right-0 mt-4 p-4 bg-white border border-gray-100 shadow-2xl rounded-2xl opacity-0 invisible group-hover/qr:opacity-100 group-hover/qr:visible transition-all z-20 w-40 h-40 flex flex-col items-center justify-center">
                        {brand.qr_code ? (
                          <>
                            <img
                              src={brand.qr_code}
                              alt={`QR Code for ${brand.title}`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                // Fallback silently or with warn
                                console.warn(
                                  `Failed to load QR code for ${brand.title}: ${brand.qr_code}`,
                                );
                                e.currentTarget.src = "/qr-mentorbox.png";
                              }}
                            />
                            <p className="text-[8px] text-gray-400 mt-1 text-center break-all">
                              {brand.qr_code}
                            </p>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <img
                              src="/qr-mentorbox.png"
                              alt="Default QR"
                              className="w-full h-full object-contain"
                            />
                            <p className="text-[8px] text-red-400 text-center">
                              No QR uploaded
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 md:mb-8">
                    <h3 className="text-xl md:text-2xl font-black mb-2 md:mb-3 tracking-tight text-black">
                      {brand.title}
                    </h3>
                    <p className="text-gray-400 font-normal text-xs md:text-sm leading-relaxed italic">
                      {brand.desc}
                    </p>
                  </div>

                  <div className="space-y-4 mb-8 md:mb-10">
                    <div className="p-3 md:p-4 bg-white rounded-xl md:rounded-2xl border border-gray-100">
                      <p className="text-[9px] md:text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2">
                        Klaster Layanan
                      </p>
                      <p className="text-xs font-medium text-black leading-tight">
                        {brand.categories}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2.5 md:px-3 py-1 text-white rounded-lg shadow-sm ${badgeMap[accentColor] || "bg-black"}`}
                      >
                        {brand.target}
                      </span>
                    </div>
                  </div>

                  {brand.link ? (
                    <a
                      href={
                        brand.link.startsWith("http")
                          ? brand.link
                          : `https://${brand.link}`
                      }
                      className="mt-auto w-full flex items-center justify-between py-3 md:py-4 px-5 md:px-6 bg-white border border-gray-200 rounded-xl md:rounded-2xl font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] group/btn hover:bg-black hover:text-white hover:border-black transition-all"
                    >
                      Lihat Detail
                      <ArrowUpRight
                        size={14}
                        className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform md:w-4 md:h-4"
                      />
                    </a>
                  ) : (
                    <button className="mt-auto w-full flex items-center justify-between py-3 md:py-4 px-5 md:px-6 bg-white border border-gray-200 rounded-xl md:rounded-2xl font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] group/btn hover:bg-black hover:text-white hover:border-black transition-all">
                      Lihat Detail
                      <ArrowUpRight
                        size={14}
                        className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform md:w-4 md:h-4"
                      />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cluster Summary (Bottom) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto p-8 md:p-16 rounded-3xl md:rounded-[2.5rem] bg-gray-50 border border-gray-100">
            <h2 className="text-xl md:text-2xl font-black text-black mb-6 md:mb-8 uppercase tracking-tight">
              Kebutuhan Anda, Solusi Kami.
            </h2>
            <p className="text-gray-500 font-normal text-sm md:text-base leading-relaxed italic mb-8 md:mb-10">
              "Setiap unit bisnis di bawah PT Media Eduka Sentosa dirancang
              untuk saling melengkapi, menciptakan ekosistem pendidikan yang
              holistik dari hulu ke hilir."
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {[
                "Media & Publikasi",
                "Software & IT",
                "Analisis Data",
                "Logistik Pendidikan",
              ].map((tag, i) => (
                <span
                  key={i}
                  className="px-4 md:px-6 py-1.5 md:py-2 bg-white border border-gray-200 rounded-full text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-widest"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Internal icon for button
const ArrowUpRight = ({
  size,
  className,
}: {
  size: number;
  className: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

export default Solutions;
