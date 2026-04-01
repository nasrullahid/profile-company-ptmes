"use client";

import React, { useEffect, useState } from "react";
import { Mail, Phone, ExternalLink } from "lucide-react";
import Image from "next/image";
import { getSiteContent, SiteContent } from "@/app/action/home";

import ContactModal from "../components/ContactModal";

const Footer = () => {
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

  const getWaLink = () => {
    const raw = getContentValue("footer", "wa_number", "62811500580");
    const clean = raw.replace(/\D/g, "");
    const final = clean.startsWith("0") ? "62" + clean.slice(1) : clean;
    return `https://wa.me/${final}`;
  };

  const menuItems = [
    { id: "beranda", label: "Beranda" },
    { id: "tentang-kami", label: "Tentang Kami" },
    { id: "solusi", label: "Solusi & Ekosistem" },
    { id: "mengapa-kami", label: "Mengapa Kami" },
    { id: "cara-kerja", label: "Cara Kerja" },
    { id: "jangkauan", label: "Jangkauan" },
  ];

  return (
    <>
      <footer className="bg-[#a3adbb] text-[#4b5563] pt-12 md:pt-20 pb-8 md:pb-10 font-sans">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-20 mb-12 md:mb-20">
            {/* Brand Section */}
            <div className="lg:col-span-5 space-y-6 md:space-y-8">
              <div className="inline-block p-1.5 md:p-1.5 bg-transparent border border-gray-500 rounded-lg">
                <Image
                  src="/Asset 2.jpg"
                  alt="PT Media Eduka Sentosa Logo"
                  width={120}
                  height={30}
                  className="object-contain md:w-[140px] md:h-[35px]"
                />
              </div>
              <p className="text-[#334155]/80 text-xs md:text-sm font-normal leading-relaxed max-w-sm italic">
                {getContentValue(
                  "footer",
                  "short_profile",
                  "Solusi pendidikan terintegrasi untuk sekolah di Indonesia. Kami menghadirkan ekosistem digital yang handal untuk memajukan literasi dan administrasi pendidikan nasional.",
                )}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
                <span className="text-[#334155]/80 text-xs font-medium">
                  Bagian dari{" "}
                  <span className="font-bold text-black">Magau Group</span>
                </span>
              </div>
            </div>

            {/* Navigation Section */}
            <div className="lg:col-span-3 space-y-6 md:space-y-8">
              <div className="space-y-2">
                <h3 className="text-black font-bold text-xs md:text-sm uppercase tracking-tight">
                  Navigasi
                </h3>
                <div className="w-5 md:w-6 h-0.5 bg-black"></div>
              </div>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href="#"
                      className="text-[#334155]/70 hover:text-black transition-colors text-xs md:text-sm font-medium"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Section */}
            <div className="lg:col-span-4 space-y-8 md:space-y-10">
              <div className="space-y-2">
                <h3 className="text-black font-bold text-xs md:text-sm uppercase tracking-tight">
                  Kontak & Bantuan
                </h3>
                <div className="w-5 md:w-6 h-0.5 bg-black"></div>
              </div>

              <a
                href={getWaLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full max-w-[280px] px-6 md:px-7 py-3.5 md:py-4 bg-black text-white rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs hover:scale-[1.02] transition-transform shadow-xl shadow-black/10 group"
              >
                <span>Hubungi Kami Sekarang</span>
                <ExternalLink
                  size={14}
                  className="opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </a>

              <div className="space-y-5 md:space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-8 h-8 md:w-9 md:h-9 bg-white/40 rounded-lg md:rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white transition-all">
                    <Mail size={14} className="text-black/60 md:w-4 md:h-4" />
                  </div>
                  <p className="text-[#334155]/80 text-xs md:text-sm font-normal">
                    {getContentValue("footer", "email", "admin@ptmes.com")}
                  </p>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-8 h-8 md:w-9 md:h-9 bg-white/40 rounded-lg md:rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white transition-all">
                    <Phone size={14} className="text-black/60 md:w-4 md:h-4" />
                  </div>
                  <p className="text-[#334155]/80 text-xs md:text-sm font-normal">
                    {getContentValue("footer", "phone", "+62 811-500-580")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[#334155]/70 font-normal text-xs tracking-wide">
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-black/90 font-semibold">
                PT Media Eduka Sentosa.
              </span>{" "}
              All rights reserved.
            </p>
            <div className="flex gap-8 text-[9px] font-semibold tracking-widest opacity-60">
              <a
                href="#"
                className="hover:text-black transition-colors uppercase"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-black transition-colors uppercase"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
