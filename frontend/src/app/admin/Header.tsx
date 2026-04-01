"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { logout } from "@/app/action/auth";
import {
  LayoutDashboard,
  Info,
  Lightbulb,
  HelpCircle,
  Search,
  MapPin,
  Settings,
  LogOut
} from "lucide-react";

const SidebarItem = ({
  icon,
  label,
  href,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${active
        ? "bg-black text-white shadow-lg shadow-black/10"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
  >
    <div className={`${active ? "text-white" : "text-gray-400"}`}>
      {icon}
    </div>
    <span className="text-[14px] font-bold">{label}</span>
  </Link>
);

const Header = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "home";

  const navItems = [
    { label: "Beranda", tab: "home", icon: <LayoutDashboard size={18} /> },
    { label: "Tentang Kami", tab: "about", icon: <Info size={18} /> },
    { label: "Solusi & Ekosistem", tab: "solutions", icon: <Lightbulb size={18} /> },
    { label: "Mengapa Kami", tab: "why", icon: <HelpCircle size={18} /> },
    { label: "Cara Kerja", tab: "how", icon: <Search size={18} /> },
    { label: "Jangkauan", tab: "jangkauan", icon: <MapPin size={18} /> },
    { label: "Settings", tab: "settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <div>
              <h1 className="text-[#171717] font-black text-base leading-none uppercase tracking-tighter">
                PT MES
              </h1>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">
                Admin Panel
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <SidebarItem
                key={item.tab}
                href={`/admin?tab=${item.tab}`}
                label={item.label}
                active={currentTab === item.tab}
                icon={item.icon}
              />
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-gray-50">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[14px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-72 flex flex-col">
        {/* Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Server Online</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 pl-4">
              <div className="text-right">
                <p className="text-sm font-bold text-[#171717]">Administrator</p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  PT Media Eduka Sentosa
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                <span className="text-black font-black text-sm">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-10">{children}</main>
      </div>
    </div>
  );
};

export default Header;
