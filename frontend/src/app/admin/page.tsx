"use client";

import React, { useEffect, useState, Suspense } from "react";
import Header from "./Header";
import { getSiteContent, updateSiteContent, initializeSiteContent, SiteContent } from "@/app/action/home";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Save,
  RefreshCcw,
  CheckCircle2,
  Info,
  HelpCircle,
  MapPin,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings as SettingsIcon,
  Quote,
  Target,
  Search,
  Lightbulb,
  Camera,
} from "lucide-react";
import Image from "next/image";
import { uploadImage } from "@/app/action/upload";

const AdminPageContent = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, SiteContent>>({});
  const [loading, setLoading] = useState(true);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Keep dummy saving var for TS compiler since old components still pass saving={saving === ...}
  const saving: string | null = null;

  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "home";

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const data = await getSiteContent();
    setContents(data);
    setPendingUpdates({});
    setLoading(false);
  };

  const handleUpdate = (section: string, key: string, value: string) => {
    const existing = contents.find(c => c.section === section && c.content_key === key);
    if (existing?.content_value === value) return;

    setContents(prev => {
      const index = prev.findIndex(c => c.section === section && c.content_key === key);
      if (index > -1) {
        const newContents = [...prev];
        newContents[index] = { ...newContents[index], content_value: value };
        return newContents;
      }
      return [...prev, { section, content_key: key, content_value: value } as SiteContent];
    });

    setPendingUpdates(prev => ({
        ...prev,
        [`${section}-${key}`]: { section, content_key: key, content_value: value }
    }));
  };

  const handleSaveAll = async () => {
    const updates = Object.values(pendingUpdates);
    if (updates.length === 0) return;

    setIsSavingAll(true);
    await Promise.all(
        updates.map(update => updateSiteContent(update.section, update.content_key, update.content_value))
    );
    
    setPendingUpdates({});
    setIsSavingAll(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleInitialize = async () => {
    if (confirm("Initialize database with final PT MES copy? This will fill/reset entries with the text provided.")) {
      setLoading(true);
      await initializeSiteContent();
      await fetchContent();
      setLoading(false);
    }
  };

  const getContentValue = (section: string, key: string) => {
    return contents.find(c => c.section === section && c.content_key === key)?.content_value || "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Syncing...</p>
        </div>
      </div>
    );
  }

  const getSurgicalLabel = (tab: string) => {
    switch (tab) {
      case "home": return "Beranda";
      case "about": return "Tentang Kami";
      case "solutions": return "Solusi & Ekosistem";
      case "why": return "Mengapa Kami";
      case "how": return "Cara Kerja";
      case "jangkauan": return "Jangkauan";
      default: return tab;
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#171717] mb-2 tracking-tight">
            Edit {getSurgicalLabel(activeTab)}
          </h1>
          <p className="text-gray-500 font-semibold italic">Koding data khusus PT Media Eduka Sentosa.</p>
        </div>
        <button
          onClick={handleInitialize}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 text-gray-700 font-black rounded-2xl hover:bg-gray-50 transition-all text-xs shadow-sm"
        >
          <RefreshCcw size={14} />
          Reset to Final Copy
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">

        {/* BERANDA */}
        {activeTab === "home" && (
          <div className="space-y-8">
            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<LayoutDashboard size={24} />} title="Hero Section" desc="Banner utama" />
              <div className="grid grid-cols-1 gap-8">
                <InputField label="Hero Badge" value={getContentValue("hero", "badge")} onSave={(v) => handleUpdate("hero", "badge", v)} saving={saving === "hero-badge"} />
                <InputField label="H1 Main Title" value={getContentValue("hero", "title")} onSave={(v) => handleUpdate("hero", "title", v)} saving={saving === "hero-title"} textarea bold />
                <InputField label="Hero Description" value={getContentValue("hero", "description")} onSave={(v) => handleUpdate("hero", "description", v)} saving={saving === "hero-description"} textarea rows={4} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField label="Primary CTA" value={getContentValue("hero", "cta_primary")} onSave={(v) => handleUpdate("hero", "cta_primary", v)} saving={saving === "hero-cta_primary"} />
                  <InputField label="Secondary CTA" value={getContentValue("hero", "cta_secondary")} onSave={(v) => handleUpdate("hero", "cta_secondary", v)} saving={saving === "hero-cta_secondary"} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<CheckCircle2 size={24} />} title="Ringkasan (3 Poin Cepat)" desc="Keunggulan singkat" />
              <ListEditor
                value={getContentValue("home", "highlights_json")}
                onSave={(v) => handleUpdate("home", "highlights_json", v)}
                fields={[
                  { key: "title", label: "Label", type: "text" },
                  { key: "desc", label: "Penjelasan", type: "text" },
                ]}
                saving={saving === "home-highlights_json"}
              />
            </div>
          </div>
        )}

        {/* TENTANG KAMI */}
        {activeTab === "about" && (
          <div className="space-y-8">
            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<Info size={24} />} title="Profil PT MES" desc="Deskripsi Perusahaan" />
              <div className="space-y-8">
                <InputField label="Judul Utama" value={getContentValue("about", "title")} onSave={(v) => handleUpdate("about", "title", v)} saving={saving === "about-title"} bold />
                <InputField label="Subtitle (Partner terpercaya...)" value={getContentValue("about", "subtitle")} onSave={(v) => handleUpdate("about", "subtitle", v)} saving={saving === "about-subtitle"} textarea />
                <InputField label="Paragraf 1" value={getContentValue("about", "description_para1")} onSave={(v) => handleUpdate("about", "description_para1", v)} saving={saving === "about-description_para1"} textarea rows={3} />
                <InputField label="Paragraf 2 (Magau Group)" value={getContentValue("about", "description_para2")} onSave={(v) => handleUpdate("about", "description_para2", v)} saving={saving === "about-description_para2"} textarea rows={3} />
                <InputField label="Paragraf 3 (Komitmen...)" value={getContentValue("about", "description_para3")} onSave={(v) => handleUpdate("about", "description_para3", v)} saving={saving === "about-description_para3"} textarea rows={3} />
              </div>
            </div>

            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<CheckCircle2 size={24} />} title="Intro Highlights" desc="2x2 Small Cards beside intro text" />
              <ListEditor
                value={getContentValue("about", "features_json")}
                onSave={(v) => handleUpdate("about", "features_json", v)}
                fields={[
                  { key: "icon", label: "Icon (Users/Globe/ShieldCheck/Lightbulb)", type: "text" },
                  { key: "title", label: "Label", type: "text" },
                  { key: "desc", label: "Penjelasan", type: "text" },
                ]}
                saving={saving === "about-features_json"}
              />
            </div>

            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<Target size={24} />} title="Area Fokus Kami" desc="Grid 4 item besar" />
              <ListEditor
                value={getContentValue("about", "area_fokus_json")}
                onSave={(v) => handleUpdate("about", "area_fokus_json", v)}
                fields={[
                  { key: "icon", label: "Icon (Target/FileText/Settings/Users)", type: "text" },
                  { key: "title", label: "Fokus", type: "text" },
                  { key: "desc", label: "Deskripsi", type: "textarea" }
                ]}
                saving={saving === "about-area_fokus_json"}
              />
            </div>

            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<Quote size={24} />} title="Visi & Misi" desc="Arah strategis" />
              <div className="space-y-8">
                <InputField label="Visi" value={getContentValue("about", "vision")} onSave={(v) => handleUpdate("about", "vision", v)} saving={saving === "about-vision"} textarea rows={4} />
                <ListEditor
                  value={getContentValue("about", "misi_json")}
                  onSave={(v) => handleUpdate("about", "misi_json", v)}
                  fields={[{ key: "text", label: "Misi Point", type: "text" }]}
                  saving={saving === "about-misi_json"}
                />
              </div>
            </div>

            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<SettingsIcon size={24} />} title="Magau Group Section" desc="Bagian penutup halaman" />
              <div className="space-y-8">
                <InputField label="Label (BAGIAN DARI)" value={getContentValue("about", "magau_label")} onSave={(v) => handleUpdate("about", "magau_label", v)} saving={saving === "about-magau_label"} />
                <InputField label="Group Name" value={getContentValue("about", "magau_title")} onSave={(v) => handleUpdate("about", "magau_title", v)} saving={saving === "about-magau_title"} bold />
                <InputField label="Quote Footer" value={getContentValue("about", "magau_quote")} onSave={(v) => handleUpdate("about", "magau_quote", v)} saving={saving === "about-magau_quote"} textarea rows={3} italic />
              </div>
            </div>
          </div>
        )}


        {/* SOLUSI & EKOSISTEM */}
        {activeTab === "solutions" && (
          <div className="space-y-8">
            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<Lightbulb size={24} />} title="Ekosistem Brand" desc="Teks Header & Keunggulan" />
              <div className="space-y-8">
                <InputField label="Solutions Header" value={getContentValue("solutions", "title")} onSave={(v) => handleUpdate("solutions", "title", v)} saving={saving === "solutions-title"} bold />
                <InputField label="Header Description" value={getContentValue("solutions", "description")} onSave={(v) => handleUpdate("solutions", "description", v)} saving={saving === "solutions-description"} textarea />
                <hr className="border-gray-100" />
                <InputField label="Keunggulan Title" value={getContentValue("solutions", "keunggulan_title")} onSave={(v) => handleUpdate("solutions", "keunggulan_title", v)} saving={saving === "solutions-keunggulan_title"} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <InputField label="Point 1: Title" value={getContentValue("solutions", "keunggulan_point1_title")} onSave={(v) => handleUpdate("solutions", "keunggulan_point1_title", v)} />
                    <InputField label="Point 1: Desc" value={getContentValue("solutions", "keunggulan_point1_desc")} onSave={(v) => handleUpdate("solutions", "keunggulan_point1_desc", v)} textarea rows={2} />
                  </div>
                  <div className="space-y-4">
                    <InputField label="Point 2: Title" value={getContentValue("solutions", "keunggulan_point2_title")} onSave={(v) => handleUpdate("solutions", "keunggulan_point2_title", v)} />
                    <InputField label="Point 2: Desc" value={getContentValue("solutions", "keunggulan_point2_desc")} onSave={(v) => handleUpdate("solutions", "keunggulan_point2_desc", v)} textarea rows={2} />
                  </div>
                  <div className="space-y-4">
                    <InputField label="Point 3: Title" value={getContentValue("solutions", "keunggulan_point3_title")} onSave={(v) => handleUpdate("solutions", "keunggulan_point3_title", v)} />
                    <InputField label="Point 3: Desc" value={getContentValue("solutions", "keunggulan_point3_desc")} onSave={(v) => handleUpdate("solutions", "keunggulan_point3_desc", v)} textarea rows={2} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<Plus size={24} />} title="Kelola Brand" desc="Detail setiap brand" />
              <ListEditor
                value={getContentValue("solutions", "brands_json")}
                onSave={(v) => handleUpdate("solutions", "brands_json", v)}
                fields={[
                  { key: "title", label: "Brand Name", type: "text" },
                  { key: "desc", label: "Deskripsi", type: "textarea" },
                  { key: "target", label: "Cocok Untuk", type: "text" },
                  { key: "categories", label: "Kategori Utama", type: "textarea" },
                  { key: "output", label: "Output Laporan (Optional)", type: "text" },
                  { key: "qr_code", label: "QR Code Image", type: "image" },
                  { key: "logo", label: "Logo Key (eduvante/nawasena/personality/mentor/mjd/mkd)", type: "text" },
                  { key: "link", label: "Link URL (https://...)", type: "text" },
                  { key: "color", label: "Aksen Warna (blue/purple/green/teal/orange/pink)", type: "text" },
                ]}
                saving={saving === "solutions-brands_json"}
              />
            </div>
          </div>
        )}

        {/* MENGAPA KAMI */}
        {activeTab === "why" && (
          <div className="space-y-8">
            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<HelpCircle size={24} />} title="Kenapa Memilih PT MES" desc="Poin-poin Utama" />
              <div className="space-y-8">
                <InputField label="Section Title" value={getContentValue("why", "title")} onSave={(v) => handleUpdate("why", "title", v)} saving={saving === "why-title"} bold />
                <InputField label="Section Subtitle" value={getContentValue("why", "subtitle")} onSave={(v) => handleUpdate("why", "subtitle", v)} saving={saving === "why-subtitle"} textarea />
                <ListEditor
                  value={getContentValue("why", "points_json")}
                  onSave={(v) => handleUpdate("why", "points_json", v)}
                  fields={[
                    { key: "title", label: "Alasan", type: "text" },
                    { key: "desc", label: "Penjelasan", type: "textarea" },
                    { key: "point1", label: "Poin Penjelas 1", type: "textarea" },
                    { key: "point2", label: "Poin Penjelas 2 (Opsional)", type: "textarea" },
                    { key: "point3", label: "Poin Penjelas 3 (Opsional)", type: "textarea" },
                    { key: "icon", label: "Icon Name (Box/FileText/Wallet/Calendar)", type: "text" },
                    { key: "image", label: "Custom Image", type: "image" },
                  ]}
                  saving={saving === "why-points_json"}
                />
              </div>
            </div>

            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<Plus size={24} />} title="Keunggulan Tambahan" desc="Grid 3 kolom di bawah" />
              <ListEditor
                value={getContentValue("why", "additional_json")}
                onSave={(v) => handleUpdate("why", "additional_json", v)}
                fields={[
                  { key: "title", label: "Judul", type: "text" },
                  { key: "desc", label: "Deskripsi Singkat", type: "textarea" },
                  { key: "icon", label: "Icon (Award/Headphones/Lightbulb)", type: "text" },
                ]}
                saving={saving === "why-additional_json"}
              />
            </div>

            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<Quote size={24} />} title="Banner Quote" desc="Bagian penutup premium" />
              <InputField label="Teks Quote" value={getContentValue("why", "quote")} onSave={(v) => handleUpdate("why", "quote", v)} saving={saving === "why-quote"} textarea rows={4} italic />
            </div>
          </div>
        )}

        {/* CARA KERJA */}
        {activeTab === "how" && (
          <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
            <SectionHeader icon={<Search size={24} />} title="Cara Kerja Kami" desc="Tahapan kolaborasi" />
            <div className="space-y-8">
              <InputField label="Section Title" value={getContentValue("how", "title")} onSave={(v) => handleUpdate("how", "title", v)} saving={saving === "how-title"} bold />
              <InputField label="Section Subtitle" value={getContentValue("how", "subtitle")} onSave={(v) => handleUpdate("how", "subtitle", v)} saving={saving === "how-subtitle"} textarea />
              <ListEditor
                value={getContentValue("how", "steps_json")}
                onSave={(v) => handleUpdate("how", "steps_json", v)}
                fields={[
                  { key: "id", label: "Step ID (01, 02...)", type: "text" },
                  { key: "title", label: "Aktivitas", type: "text" },
                  { key: "desc", label: "Rincian", type: "text" },
                ]}
                saving={saving === "how-steps_json"}
              />
            </div>
          </div>
        )}

        {/* JANGKAUAN */}
        {activeTab === "jangkauan" && (
          <div className="space-y-8">
            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<MapPin size={24} />} title="Hero & Intro" desc="Header jangkauan" />
              <div className="space-y-8">
                <InputField label="Section Title" value={getContentValue("jangkauan", "title")} onSave={(v) => handleUpdate("jangkauan", "title", v)} saving={saving === "jangkauan-title"} bold />
                <InputField label="Section Subtitle" value={getContentValue("jangkauan", "subtitle")} onSave={(v) => handleUpdate("jangkauan", "subtitle", v)} saving={saving === "jangkauan-subtitle"} textarea />
                <InputField label="Intro Quote" value={getContentValue("jangkauan", "quote")} onSave={(v) => handleUpdate("jangkauan", "quote", v)} saving={saving === "jangkauan-quote"} textarea italic />
              </div>
            </div>

            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<Plus size={24} />} title="Sekolah Terlayani" desc="Target market & Jenjang" />
              <ListEditor
                value={getContentValue("jangkauan", "levels_json")}
                onSave={(v) => handleUpdate("jangkauan", "levels_json", v)}
                fields={[
                  { key: "id", label: "ID (01, 02...)", type: "text" },
                  { key: "name", label: "Nama Jenjang (e.g. SD / MI)", type: "text" },
                  { key: "detail", label: "Detail Nama (Teks Kecil)", type: "text" },
                  { key: "icon", label: "Icon Lucide (Baby/Bean/BookOpen/Atom/Wrench)", type: "text" },
                  { key: "desc", label: "Deskripsi Singkat", type: "textarea" },
                  { key: "services", label: "Layanan Tersedia (pisah baris)", type: "textarea" },
                ]}
                saving={saving === "jangkauan-levels_json"}
              />
            </div>

            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<MapPin size={24} />} title="Jangkauan Geografis" desc="Area Layanan" />
              <div className="space-y-8">
                <InputField label="Geo Title" value={getContentValue("jangkauan", "geo_title")} onSave={(v) => handleUpdate("jangkauan", "geo_title", v)} saving={saving === "jangkauan-geo_title"} bold />
                <InputField label="Geo Subtitle" value={getContentValue("jangkauan", "geo_subtitle")} onSave={(v) => handleUpdate("jangkauan", "geo_subtitle", v)} saving={saving === "jangkauan-geo_subtitle"} />
                <ListEditor
                  value={getContentValue("jangkauan", "areas_json")}
                  onSave={(v) => handleUpdate("jangkauan", "areas_json", v)}
                  fields={[{ key: "name", label: "Nama Wilayah", type: "text" }]}
                  saving={saving === "jangkauan-areas_json"}
                />
                <InputField label="Geo Note" value={getContentValue("jangkauan", "geo_note")} onSave={(v) => handleUpdate("jangkauan", "geo_note", v)} saving={saving === "jangkauan-geo_note"} italic />
              </div>
            </div>
            <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
              <SectionHeader icon={<Target size={24} />} title="Mitra Card" desc="Card di sebelah kanan" />
              <div className="space-y-8">
                <InputField label="Card Title" value={getContentValue("jangkauan", "card_title")} onSave={(v) => handleUpdate("jangkauan", "card_title", v)} saving={saving === "jangkauan-card_title"} />
                <InputField label="Card Description" value={getContentValue("jangkauan", "card_desc")} onSave={(v) => handleUpdate("jangkauan", "card_desc", v)} saving={saving === "jangkauan-card_desc"} textarea />
                <ListEditor
                  value={getContentValue("jangkauan", "card_points_json")}
                  onSave={(v) => handleUpdate("jangkauan", "card_points_json", v)}
                  fields={[{ key: "text", label: "Point", type: "text" }]}
                  saving={saving === "jangkauan-card_points_json"}
                />
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-sm">
            <SectionHeader icon={<SettingsIcon size={24} />} title="Global Footer & SEO" desc="Data Penunjang" />
            <div className="space-y-8">
              <InputField label="Footer Short Profile" value={getContentValue("footer", "short_profile")} onSave={(v) => handleUpdate("footer", "short_profile", v)} saving={saving === "footer-short_profile"} textarea rows={4} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField label="Official Email" value={getContentValue("footer", "email")} onSave={(v) => handleUpdate("footer", "email", v)} saving={saving === "footer-email"} />
                <InputField label="Contact Phone" value={getContentValue("footer", "phone")} onSave={(v) => handleUpdate("footer", "phone", v)} saving={saving === "footer-phone"} />
              </div>
              <InputField label="WhatsApp Number (Format: 628...)" value={getContentValue("footer", "wa_number")} onSave={(v) => handleUpdate("footer", "wa_number", v)} saving={saving === "footer-wa_number"} />
              <hr className="border-gray-100" />
              <InputField label="SEO Meta Description (Google Result)" value={getContentValue("seo", "meta_description")} onSave={(v) => handleUpdate("seo", "meta_description", v)} saving={saving === "seo-meta_description"} textarea rows={3} />
            </div>
          </div>
        )}
      </div>

      {Object.keys(pendingUpdates).length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#171717] text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-6 border border-white/10">
            <div className="flex flex-col">
              <span className="text-sm font-bold">{Object.keys(pendingUpdates).length} Perubahan Tertunda</span>
              <span className="text-[10px] text-gray-400">Pastikan untuk menyimpan sebelum keluar.</span>
            </div>
            <button 
              onClick={handleSaveAll}
              disabled={isSavingAll}
              className="bg-white text-black px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all shadow-sm flex items-center gap-2"
            >
              {isSavingAll ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
              {isSavingAll ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-bottom-5 duration-300 pointer-events-none">
          <div className="bg-[#171717] text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/5">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <CheckCircle2 size={16} className="text-white" />
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-widest leading-none mb-1">Success</p>
              <p className="text-[11px] font-bold text-gray-400">Content Synchronized</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- CORE COMPONENTS ---

const SectionHeader = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex items-center gap-6 mb-12">
    <div className="w-16 h-16 bg-gray-50 text-black rounded-3xl flex items-center justify-center border border-gray-100 shadow-sm transform hover:rotate-6 transition-transform">
      {icon}
    </div>
    <div>
      <h2 className="text-3xl font-black text-[#171717] tracking-tight">{title}</h2>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">{desc}</p>
    </div>
  </div>
);

interface InputFieldProps {
  label: string;
  value: string;
  onSave: (val: string) => void;
  saving?: boolean;
  textarea?: boolean;
  rows?: number;
  bold?: boolean;
  italic?: boolean;
}

const InputField = ({ label, value, onSave, saving, textarea, rows = 3, bold, italic }: InputFieldProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="relative group">
      <div className="flex justify-between items-center mb-2.5 px-1">
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
        {saving && (
          <div className="flex items-center gap-2 text-[#171717]">
            <RefreshCcw size={10} className="animate-spin" />
            <span className="text-[8px] font-black uppercase tracking-tighter">Syncing...</span>
          </div>
        )}
      </div>

      {textarea ? (
        <textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={() => onSave(localValue)}
          rows={rows}
          placeholder={`Enter ${label}...`}
          className={`w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-black/20 transition-all font-medium text-gray-700 resize-none leading-relaxed text-sm ${bold ? "font-bold text-base" : ""} ${italic ? "italic" : ""}`}
        />
      ) : (
        <input
          type="text"
          value={localValue}
          placeholder={`Enter ${label}...`}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={() => onSave(localValue)}
          className={`w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-black/20 transition-all font-medium text-gray-700 text-sm ${bold ? "font-bold text-base" : ""}`}
        />
      )}
    </div>
  );
};

interface ListEditorProps {
  value: string;
  onSave: (val: string) => void;
  fields: { key: string; label: string; type: "text" | "textarea" | "image" | "string-array" }[];
  saving?: boolean;
}

const ListEditor = ({ value, onSave, fields, saving }: ListEditorProps) => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      setItems(JSON.parse(value || "[]"));
    } catch (e) {
      setItems([]);
    }
  }, [value]);

  const handleItemChange = (index: number, key: string, val: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: val };
    setItems(newItems);
  };

  const handleSave = () => {
    onSave(JSON.stringify(items));
  };

  const addItem = () => {
    const newItem = fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (confirm("Hapus baris data ini?")) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      onSave(JSON.stringify(newItems));
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if ((index === 0 && direction === 'up') || (index === items.length - 1 && direction === 'down')) return;
    const newItems = [...items];
    const otherIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[otherIndex]] = [newItems[otherIndex], newItems[index]];
    setItems(newItems);
    onSave(JSON.stringify(newItems));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-50 p-6 rounded-4xl border border-gray-100">
        <div className="flex items-center gap-4">
          <span className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-[11px] font-black">{items.length}</span>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Items</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#171717] text-white px-7 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-black/10"
          >
            {saving ? <RefreshCcw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            Terapkan List
          </button>
          <button
            onClick={addItem}
            className="bg-white text-black border border-gray-100 px-7 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Plus size={14} />
            Add New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white rounded-4xl border border-gray-100 p-8 space-y-6 relative hover:border-black/20 transition-all group shadow-sm">
            <div className="flex justify-between items-center pb-6 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-[10px] font-black">
                  {idx + 1}
                </span>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Row Data ID-{idx + 1}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => moveItem(idx, 'up')} className="p-2.5 text-gray-400 hover:text-black rounded-xl hover:bg-gray-50 transition-all"><ChevronUp size={18} /></button>
                <button onClick={() => moveItem(idx, 'down')} className="p-2.5 text-gray-400 hover:text-black rounded-xl hover:bg-gray-50 transition-all"><ChevronDown size={18} /></button>
                <div className="w-px h-6 bg-gray-100 mx-2 self-center"></div>
                <button onClick={() => removeItem(idx)} className="p-2.5 text-red-300 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all"><Trash2 size={18} /></button>
              </div>
            </div>

            <div className={`grid grid-cols-1 ${fields.length > 1 ? "md:grid-cols-2" : ""} gap-10`}>
              {fields.map((field) => (
                <div key={field.key} className={fields.length === 1 ? "" : field.type === "textarea" ? "md:col-span-2" : "col-span-1"}>
                  <label className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2 px-1">{field.label}</label>

                  {field.type === "image" ? (
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0 group/img relative">
                        {item[field.key] ? (
                          <img src={item[field.key]} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Camera size={24} className="text-gray-300" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const formData = new FormData();
                              formData.append("file", file);
                              const res = await uploadImage(formData);
                              if (res.success && res.url) {
                                handleItemChange(idx, field.key, res.url);
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={item[field.key] || ""}
                          onChange={(e) => handleItemChange(idx, field.key, e.target.value)}
                          onBlur={handleSave}
                          placeholder="/uploads/..."
                          className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black/5 text-[11px] font-bold text-gray-600 transition-all"
                        />
                        <p className="text-[9px] text-gray-400 italic">Upload atau masukkan path gambar manual.</p>
                      </div>
                    </div>
                  ) : field.type === "string-array" ? (
                    <textarea
                      value={Array.isArray(item[field.key]) ? item[field.key].join("\n") : (item[field.key] || "")}
                      onChange={(e) => handleItemChange(idx, field.key, e.target.value.split("\n"))}
                      onBlur={handleSave}
                      rows={4}
                      placeholder={`Enter ${field.label}...\nPoint 1\nPoint 2\nPoint 3`}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-5 outline-none focus:ring-4 focus:ring-black/5 focus:bg-white text-[13px] font-bold text-gray-700 transition-all resize-none"
                    />
                  ) : field.type === "textarea" ? (
                    <textarea
                      value={item[field.key] || ""}
                      onChange={(e) => handleItemChange(idx, field.key, e.target.value)}
                      onBlur={handleSave}
                      rows={3}
                      placeholder={`Enter ${field.label}...`}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-5 outline-none focus:ring-4 focus:ring-black/5 focus:bg-white text-[13px] font-bold text-gray-700 transition-all resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={item[field.key] || ""}
                      onChange={(e) => handleItemChange(idx, field.key, e.target.value)}
                      onBlur={handleSave}
                      placeholder={`Enter ${field.label}...`}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-5 outline-none focus:ring-4 focus:ring-black/5 focus:bg-white text-[13px] font-bold text-gray-700 transition-all"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Initialising Admin Panel...</p>
        </div>
      </div>
    }>
      <Header>
        <AdminPageContent />
      </Header>
    </Suspense>
  );
};

export default AdminPage;
