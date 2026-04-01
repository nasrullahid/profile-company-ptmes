"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogIn, Menu, X } from "lucide-react";

interface NavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

import { getSiteContent, SiteContent } from "@/app/action/home";

const Navbar = ({ activeSection, onSectionChange }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contents, setContents] = useState<SiteContent[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const fetchContent = async () => {
      const data = await getSiteContent();
      setContents(data);
    };
    fetchContent();

    return () => window.removeEventListener("scroll", handleScroll);
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
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 bg-white border-b border-gray-100 ${
          isScrolled ? "py-2 shadow-sm" : "py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-12 flex items-center justify-between">
          {/* Logo Section */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => onSectionChange("beranda")}
          >
            <div className="h-8 md:h-10 px-2 md:px-3 py-1 md:py-1.5 border border-gray-200 rounded-lg flex items-center justify-center bg-white shadow-sm">
              <Image
                src="/Asset 2.jpg"
                alt="PT Media Eduka Sentosa Logo"
                width={120}
                height={28}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`text-sm px-4 py-2 transition-colors relative ${
                  activeSection === item.id
                    ? "text-gray-900 font-black"
                    : "text-gray-600 hover:text-black font-semibold"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 px-5 lg:px-7 py-2 md:py-2.5 bg-white border border-gray-300 text-gray-700 rounded-full font-bold text-xs hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
            >
              <LogIn size={16} />
              Login
            </Link>
            <a
              href={getWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-5 lg:px-7 py-2 md:py-2.5 bg-[#434d5e] text-white rounded-full font-bold text-xs hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
            >
              Hubungi Kami
            </a>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-black hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-screen py-6 shadow-xl" : "max-h-0"
          }`}
        >
          <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-base font-bold text-left py-3 px-4 rounded-xl transition-all ${
                    activeSection === item.id
                      ? "bg-black text-white"
                      : "text-slate-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 pt-6 border-t border-gray-100">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-4 bg-gray-100 text-black rounded-xl font-bold text-sm"
              >
                <LogIn size={18} /> Login ke Akun
              </Link>
              <a
                href={getWaLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center py-4 bg-[#434d5e] text-white rounded-xl font-bold text-sm"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
