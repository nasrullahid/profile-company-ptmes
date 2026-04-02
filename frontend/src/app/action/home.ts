"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface SiteContent {
    id?: number;
    section: string;
    content_key: string;
    content_value: string;
    updated_at?: Date | string;
}

export async function getSiteContent(): Promise<SiteContent[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/site-content`, { next: { revalidate: 0 } });
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error("Error fetching site content:", error);
        return [];
    }
}

export async function updateSiteContent(section: string, key: string, value: string) {
    try {
        const tokenStr = await import("@/lib/cookies").then(m => m.getAuthCookie());
        if (!tokenStr) return { error: "Unauthorized" };
        const tokenPayload = await import("@/lib/jwt").then(m => m.verifyToken(tokenStr));
        const sanctumToken = (tokenPayload as any).sanctumToken;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/site-content`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${sanctumToken}`
            },
            body: JSON.stringify({ section, key, value })
        });
        
        if (!res.ok) throw new Error("API error");
        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error updating site content:", error);
        return { error: "Failed to update content" };
    }
}

export async function initializeSiteContent() {
    const initialData = [
        // HERO
        { section: "hero", content_key: "badge", content_value: "PT Media Eduka Sentosa" },
        { section: "hero", content_key: "title", content_value: "Solusi Pendidikan Terintegrasi untuk Sekolah di Indonesia" },
        { section: "hero", content_key: "description", content_value: "Kami membantu sekolah memenuhi kebutuhan pembelajaran, literasi, asesmen pendidikan, pengembangan kapasitas, sarana penunjang, sistem operasional, dan publikasi digital—selaras dengan Dana BOSP Reguler maupun sumber dana pendidikan sah lainnya." },
        { section: "hero", content_key: "cta_primary", content_value: "Konsultasi Kebutuhan Sekolah" },
        { section: "hero", content_key: "cta_secondary", content_value: "Minta Katalog & Proposal" },

        // HOME HIGHLIGHTS (Image 1 - cards)
        {
            section: "home",
            content_key: "highlights_json",
            content_value: JSON.stringify([
                { id: 1, title: "Lengkap", desc: "Dari konten pembelajaran sampai sistem digital sekolah yang terintegrasi.", icon: "Book" },
                { id: 2, title: "Rapi Administrasi", desc: "Output dan dokumen pendukung yang terstruktur dan jelas.", icon: "FileText" },
                { id: 3, title: "Skalabel", desc: "Solusi untuk semua jenjang dari PAUD hingga SMA/SMK.", icon: "TrendingUp" },
            ])
        },

        // ABOUT - STATS (Image 2)
        {
            section: "about",
            content_key: "stats_json",
            content_value: JSON.stringify([
                { label: "Sekolah Terlayani", value: "500+" },
                { label: "Tahun Pengalaman", value: "10+" },
                { label: "Brand Ekosistem", value: "6" },
                { label: "Jenjang Pendidikan", value: "5" },
            ])
        },

        // ABOUT - FEATURE GRID (Image 2)
        {
            section: "about",
            content_key: "features_json",
            content_value: JSON.stringify([
                { title: "Fokus Klien", desc: "Kepuasan sekolah, guru, dan peserta didik adalah prioritas kami.", icon: "Users" },
                { title: "Jangkauan", desc: "PAUD, SD/MI, SMP/MTs, SMA/MA, SMK.", icon: "Globe" },
                { title: "Terpercaya", desc: "Dukungan tim lengkap dan berkualitas di seluruh lini.", icon: "ShieldCheck" },
                { title: "Inovatif", desc: "Solusi kreatif yang terus berkembang.", icon: "Lightbulb" },
            ])
        },

        // ABOUT - DESCRIPTION
        { section: "about", content_key: "title", content_value: "Tentang PT MES" },
        { section: "about", content_key: "subtitle", content_value: "Partner terpercaya untuk solusi pendidikan terintegrasi di Indonesia" },
        { section: "about", content_key: "description_para1", content_value: "PT Media Eduka Sentosa (PT MES) adalah perusahaan yang bergerak di bidang solusi pendidikan terintegrasi untuk sekolah-sekolah di Indonesia. Kami memahami kompleksitas kebutuhan institusi pendidikan modern dan hadir sebagai mitra strategis yang dapat diandalkan." },
        { section: "about", content_key: "description_para2", content_value: "Sebagai bagian dari Magau Group, kami memiliki ekosistem lengkap yang mencakup berbagai aspek kebutuhan sekolah—mulai dari konten pembelajaran, asesmen, pengembangan kapasitas, hingga sistem digital dan publikasi." },
        { section: "about", content_key: "description_para3", content_value: "Kami berkomitmen untuk membantu sekolah mengoptimalkan penggunaan dana pendidikan, termasuk Dana BOSP Reguler, dengan solusi yang terukur, profesional, dan sesuai regulasi." },

        // ABOUT - INTRO FEATURES (The 2x2 grid beside paragraphs)
        {
            section: "about",
            content_key: "features_json",
            content_value: JSON.stringify([
                { title: "Fokus Klien", desc: "Kepuasan sekolah, guru, dan peserta didik adalah prioritas kami.", icon: "Users" },
                { title: "Jangkauan", desc: "PAUD, SD/MI, SMP/MTs, SMA/MA, SMK.", icon: "Globe" },
                { title: "Terpercaya", desc: "Dukungan tim lengkap dan berkualitas di seluruh lini.", icon: "ShieldCheck" },
                { title: "Inovatif", desc: "Solusi kreatif yang terus berkembang.", icon: "Lightbulb" },
            ])
        },

        // ABOUT - AREA FOKUS (The new 4-item grid)
        {
            section: "about",
            content_key: "area_fokus_json",
            content_value: JSON.stringify([
                { title: "Program Pendidikan Terukur", desc: "Solusi yang dirancang dengan indikator keberhasilan yang jelas dan dapat diukur", icon: "Target" },
                { title: "Administrasi Tertib", desc: "Dokumentasi lengkap dan sistematis untuk kebutuhan pelaporan dan audit", icon: "FileText" },
                { title: "Solusi Fleksibel", desc: "Dapat disesuaikan dengan kebutuhan dan karakteristik masing-masing sekolah", icon: "Settings" },
                { title: "Dukungan Pendampingan", desc: "Tim profesional yang siap memberikan konsultasi dan pendampingan berkelanjutan", icon: "Users" },
            ])
        },

        { section: "about", content_key: "vision", content_value: "Menjadi mitra strategis terdepan dalam ekosistem pendidikan Indonesia yang memberikan solusi terintegrasi, profesional, dan berkelanjutan untuk kemajuan pendidikan nasional." },
        {
            section: "about",
            content_key: "misi_json",
            content_value: JSON.stringify([
                { text: "Menyediakan solusi pendidikan yang komprehensif dan terintegrasi" },
                { text: "Membantu sekolah mengoptimalkan penggunaan dana pendidikan" },
                { text: "Mendukung peningkatan kualitas pembelajaran di seluruh jenjang" },
                { text: "Memberikan layanan profesional dengan administrasi yang tertib" },
                { text: "Berinovasi untuk menciptakan ekosistem pendidikan yang berkelanjutan" },
            ])
        },

        // ABOUT - MAGAU GROUP
        { section: "about", content_key: "magau_label", content_value: "BAGIAN DARI" },
        { section: "about", content_key: "magau_title", content_value: "Magau Group" },
        { section: "about", content_key: "magau_quote", content_value: "Didukung oleh jaringan perusahaan yang kuat untuk memberikan solusi pendidikan yang komprehensif." },


        // SOLUTIONS
        { section: "solutions", content_key: "title", content_value: "Ekosistem Solusi & Ekosistem" },
        { section: "solutions", content_key: "description", content_value: "PT MES memfasilitasi kebutuhan sekolah melalui enam klaster solusi yang terintegrasi." },
        {
            section: "solutions",
            content_key: "brands_json",
            content_value: JSON.stringify([
                { id: 1, title: "Nawasena Publishing", logo: "nawasena", desc: "Buku, literasi, dan modul pembelajaran untuk mendukung kegiatan belajar mengajar dan pengembangan perpustakaan sekolah.", target: "PAUD–SMA/SMK", categories: "buku literasi, buku pengayaan, modul pembelajaran, bahan ajar pendamping", color: "blue", qr_code: "/qr-nawasena.png" },
                { id: 2, title: "Q Personality", logo: "personality", desc: "Layanan asesmen pendidikan untuk pemetaan potensi belajar, minat-bakat, gaya belajar, serta dukungan kesiapan pengembangan diri dan karier (jenjang menengah).", target: "SD–SMA/SMK", categories: "Laporan hasil asesmen + rekomendasi tindak lanjut untuk sekolah/guru (non-klinis)", color: "purple", qr_code: "/qr-qpersonality.png" },
                { id: 3, title: "Mentorbox (Kolaborasi)", logo: "mentor", desc: "Platform pembelajaran & pendampingan untuk penguatan proses pembelajaran, pengembangan kompetensi guru, serta peningkatan kompetensi peserta didik.", target: "PAUD–SMK", categories: "Pelatihan guru, pendampingan pembelajaran, program berbasis proyek, penguatan kompetensi", color: "green", qr_code: "/qr-mentorbox.png" },
                { id: 4, title: "MJD Software House (Kolaborasi)", logo: "mjd", desc: "Layanan sistem dan dukungan operasional digital sekolah, dipasarkan melalui kolaborasi PT MES dengan PT Magau Jaya Digital.", target: "PAUD–SMA/SMK", categories: "PPDB, administrasi sekolah, dukungan sistem, pemeliharaan ringan perangkat TIK", color: "teal", qr_code: "/qr-mjd.png" },
                { id: 5, title: "EDUVANTE", logo: "eduvante", desc: "Pengadaan sarana dan peralatan penunjang pendidikan untuk mendukung kenyamanan dan efektivitas pembelajaran di sekolah.", target: "PAUD–SMA/SMK", categories: "Alat peraga, playground edukatif, bangku/mebel sekolah, perangkat elektronik, perlengkapan ruang kelas", color: "orange", qr_code: "/qr-mentorbox.png" },
                { id: 6, title: "MKD Digital Agency (Kolaborasi)", logo: "mkd", desc: "Komunikasi, informasi, dan publikasi digital sekolah, dipasarkan melalui kolaborasi PT MES dengan PT Magau Kreatif Digital.", target: "PAUD–SMA/SMK", categories: "Website sekolah, konten informasi, dokumentasi kegiatan, publikasi program, pengelolaan media", color: "pink", qr_code: "/qr-mentorbox.png" },
            ])
        },

        // WHY (Image 3)
        { section: "why", content_key: "title", content_value: "Mengapa Memilih PT MES?" },
        { section: "why", content_key: "subtitle", content_value: "Kami berfokus pada hasil yang terukur dan administrasi yang tertib untuk mendukung kemajuan sekolah di Indonesia." },
        {
            section: "why",
            content_key: "points_json",
            content_value: JSON.stringify([
                {
                    id: "01",
                    title: "Solusi Satu Pintu",
                    desc: "Akses lengkap ke berbagai layanan pendidikan melalui satu ekosistem terintegrasi. Tidak perlu mencari vendor berbeda untuk kebutuhan yang berbeda.",
                    point1: "Kualitas pembelajaran hingga sistem digital",
                    point2: "Koordinasi lebih mudah dan efisien",
                    point3: "Satu tim pendampingan profesional",
                    icon: "Box",
                    image: ""
                },
                {
                    id: "02",
                    title: "Administrasi Rapi & Output Jelas",
                    desc: "Setiap program dilengkapi dengan dokumen lengkap, terstruktur, dan sesuai standar pelaporan pendidikan.",
                    point1: "Dokumen pendukung lengkap",
                    point2: "Format standar dan sistematis",
                    point3: "Siap untuk audit and pelaporan",
                    icon: "FileText",
                    image: ""
                },
                {
                    id: "03",
                    title: "Fleksibel Sumber Anggaran",
                    desc: "Solusi kami dirancang selaras dengan Dana BOSP reguler maupun sumber dana pendidikan sah lainnya.",
                    point1: "Sesuai aturan penggunaan dana pendidikan",
                    point2: "Paket dapat disesuaikan dengan budget",
                    point3: "Transparansi biaya yang jelas",
                    icon: "Wallet",
                    image: ""
                },
                {
                    id: "04",
                    title: "Program Jangka Pendek & Panjang",
                    desc: "Kami menawarkan program yang dapat disesuaikan dengan kebutuhan berkala sekolah maupun rencana pengembangan jangka panjang sekolah.",
                    point1: "Workshop dan pelatihan singkat",
                    point2: "Program tahunan berkelanjutan",
                    point3: "Konsultasi strategis jangka panjang",
                    icon: "Calendar",
                    image: ""
                },
            ])
        },

        // WHY - ADDITIONAL (Image 4)
        {
            section: "why",
            content_key: "additional_json",
            content_value: JSON.stringify([
                { title: "Terpercaya & Berpengalaman", desc: "Dukungan oleh Magau Group dengan rekam jejak melayani ratusan sekolah.", icon: "Award" },
                { title: "Dukungan Berkelanjutan", desc: "Tim customer service dan pendampingan yang responsif dan profesional.", icon: "Headphones" },
                { title: "Kualitas Terjamin", desc: "Produk dan layanan berkualitas yang teruji dan sesuai standar pendidikan.", icon: "Lightbulb" },
            ])
        },
        { section: "why", content_key: "quote", content_value: "Kami memahami bahwa setiap sekolah memiliki kebutuhan unik. Oleh karena itu, kami hadir dengan solusi fleksibel yang dapat disesuaikan, didukung administrasi yang rapi, dan tim profesional yang siap mendampingi perjalanan pendidikan Anda." },

        // HOW (Image 5)
        { section: "how", content_key: "title", content_value: "Cara Kerja Kami" },
        { section: "how", content_key: "subtitle", content_value: "Proses kolaborasi yang terstruktur, transparan, dan profesional untuk memastikan hasil yang optimal bagi sekolah Anda." },
        {
            section: "how",
            content_key: "steps_json",
            content_value: JSON.stringify([
                { id: "01", title: "Pemetaan Kebutuhan", desc: "Kami melakukan analisis mendalam terhadap kebutuhan spesifik sekolah Anda, termasuk kondisi saat ini, tantangan, dan target yang ingin dicapai.", points: ["Analisis data pendidikan", "Diskusi panel stakeholder", "Rekomendasi prioritas"] },
                { id: "02", title: "Rekomendasi Solusi", desc: "Berdasarkan hasil pemetaan, kami menyusun rekomendasi solusi yang tepat dan sesuai dengan visi, misi, dan skala anggaran sekolah Anda.", points: ["Penyusunan paket program", "Fit-gap analysis", "Penentuan target sukses"] },
                { id: "03", title: "Dokumen Pendukung", desc: "Kami menyiapkan seluruh dokumen administratif yang diperlukan, termasuk proposal, RPK, dan dokumen lain yang sesuai dengan regulasi penggunaan dana pendidikan.", points: ["Penyusunan admin program", "Administrasi pengadaan", "Kesiapan dokumen pelaporan"] },
                { id: "04", title: "Pelaksanaan", desc: "Tim profesional kami melaksanakan program sesuai kesepakatan dengan standar kualitas tinggi dan pendampingan berkelanjutan.", points: ["Implementasi program di lapangan", "Monitoring dan evaluasi berkala", "Laporan kemajuan berkala"] },
                { id: "05", title: "Laporan & Dokumentasi", desc: "Setiap program ditutup dengan laporan pelaksanaan lengkap dan dokumentasi yang siap untuk keperluan pelaporan dan evaluasi sekolah.", points: ["Laporan kegiatan komprehensif", "Dokumen bukti fisik lengkap", "Sesi evaluasi dan tindak lanjut"] },
            ])
        },

        // HOW - PRINCIPLES (Image 5)
        {
            section: "how",
            content_key: "principles_json",
            content_value: JSON.stringify([
                { title: "Terukur", desc: "Setiap program memiliki target dan indikator yang jelas.", icon: "BarChart" },
                { title: "Kolaboratif", desc: "Melibatkan stakeholder dalam setiap keputusan penting.", icon: "Users" },
                { title: "Transparan", desc: "Komunikasi terbuka dan dokumentasi lengkap.", icon: "Eye" },
                { title: "Responsif", desc: "Cepat tanggap terhadap kebutuhan dan feedback.", icon: "Zap" },
            ])
        },

        // COVERAGE / JANGKAUAN
        { section: "jangkauan", content_key: "title", content_value: "Jangkauan Layanan Kami" },
        { section: "jangkauan", content_key: "subtitle", content_value: "Melayani semua jenjang pendidikan dari PAUD hingga SMA/SMK di seluruh wilayah Indonesia." },
        { section: "jangkauan", content_key: "quote", content_value: "PT Media Eduka Sentosa memiliki solusi yang komprehensif untuk setiap jenjang pendidikan. Dari modul pembelajaran hingga sistem digital, kami siap mendukung kebutuhan sekolah Anda." },
        {
            section: "jangkauan",
            content_key: "levels_json",
            content_value: JSON.stringify([
                {
                    id: "01",
                    name: "PAUD / TK",
                    detail: "DI SEKOLAH ANAK TIDAK PERLU BELAJAR SAMPAI TAMAN KANAK KANAK",
                    icon: "Baby",
                    desc: "Program pembelajaran yang menyenangkan dan pembentukan karakter dasar.",
                    services: ["Materi video animasi interaktif", "Project pembelajaran kreatif", "Alat peraga edukasi (APE)", "Media asesmen perkembangan anak"]
                },
                {
                    id: "02",
                    name: "SD / MI",
                    detail: "DI SEKOLAH DASAR / MADRASAH IBTIDAIYAH",
                    icon: "Bean",
                    desc: "Konten pendidikan lengkap untuk pembelajaran kurikulum terbaru.",
                    services: ["Modul Cetak dan Digital Lengkap", "Aplikasi Raport / Penilaian", "Bimbingan Teknis Kurikulum", "Sistem Monitoring Sekolah"]
                },
                {
                    id: "03",
                    name: "SMP / MTs",
                    detail: "DI SEKOLAH MENENGAH PERTAMA / MADRASAH TSANAWIYAH",
                    icon: "BookOpen",
                    desc: "Pengembangan kompetensi dan persiapan jenjang lanjutan.",
                    services: ["Modul Pengayaan Mata Pelajaran", "Aktivitas Literasi Siswa", "Pelatihan Guru & Tenaga Kependidikan", "Sistem Ujian Berbasis Komputer"]
                },
                {
                    id: "04",
                    name: "SMA / MA",
                    detail: "DI SEKOLAH MENENGAH ATAS / MADRASAH ALIYAH",
                    icon: "Atom",
                    desc: "Persiapan akademik dan pengembangan potensi untuk pendidikan tinggi.",
                    services: ["Modul Persiapan Akhir & Seleksi PTN", "Aktivitas Literasi Lanjutan", "Program Unggulan Sekolah", "Akses Literasi Universitas"]
                },
                {
                    id: "05",
                    name: "SMK",
                    detail: "DI SEKOLAH MENENGAH KEJURUAN",
                    icon: "Wrench",
                    desc: "Kompetensi praktis dan persiapan dunia kerja.",
                    services: ["Modul Kompetensi Produktif", "Aktivitas Literasi Siswa", "Sistem Manajemen Prakerin", "Media Informasi Lowongan Kerja"]
                },
            ])
        },
        { section: "jangkauan", content_key: "geo_title", content_value: "Jangkauan Geografis" },
        { section: "jangkauan", content_key: "geo_subtitle", content_value: "Melayani seluruh lembaga pendidikan di Indonesia" },
        {
            section: "jangkauan",
            content_key: "areas_json",
            content_value: JSON.stringify([
                { name: "DKI Jakarta" },
                { name: "Jawa Barat" },
                { name: "Jawa Tengah" },
                { name: "Jawa Timur" },
                { name: "Banten" },
                { name: "Sumatera" },
                { name: "Kalimantan" },
                { name: "Sulawesi" },
                { name: "Seluruh Indonesia" },
            ])
        },
        { section: "jangkauan", content_key: "geo_note", content_value: "* Untuk wilayah di luar Pulau Jawa, silakan hubungi kami untuk informasi lebih lanjut." },

        // FOOTER & SEO
        { section: "footer", content_key: "short_profile", content_value: "Solusi pendidikan terintegrasi untuk sekolah di Indonesia. Kami menghadirkan ekosistem digital yang handal untuk memajukan literasi dan administrasi pendidikan nasional." },
        { section: "footer", content_key: "email", content_value: "info@ptmes.id" },
        { section: "footer", content_key: "phone", content_value: "+62 811 888 88" },
        { section: "footer", content_key: "wa_number", content_value: "62811500580" },
        { section: "footer", content_key: "address", content_value: "Jakarta, Indonesia" },
        { section: "footer", content_key: "tagline", content_value: "Bagian dari Magau Group" },
        { section: "seo", content_key: "meta_description", content_value: "PT Media Eduka Sentosa (MES) menyediakan solusi pendidikan terintegrasi untuk sekolah PAUD–SMA/SMK: buku & literasi, asesmen pendidikan, pelatihan & pendampingan, sistem operasional digital, pengadaan sarana penunjang, dan publikasi digital sekolah." },
        
        // KATALOG
        {
            section: "katalog",
            content_key: "books_json",
            content_value: JSON.stringify([
                {
                    id: 1,
                    title: "Matematika SD Kelas I",
                    author: "Sofie Dewayani",
                    isbn: "978-602-244-533-3",
                    link: "https://buku.kemdikbud.go.id/katalog/matematika-untuk-sd-kelas-i",
                    type: "Buku PDF",
                    level: "SD/MI",
                    grade: "I",
                    tags: "PDF,Matematika,SD",
                    description: "Buku panduan guru kurikulum merdeka untuk mata pelajaran matematika kelas 1 Sekolah Dasar.",
                    full_description: "Buku ini dirancang untuk membantu guru dalam menyampaikan materi matematika secara menyenangkan dan mudah dipahami oleh siswa kelas 1 SD. Pembahasan mencakup pengenalan angka, penjumlahan dasar, dan bentuk-bentuk geometri sederhana.",
                    image: "/uploads/katalog/book1.jpg",
                },
                {
                    id: 2,
                    title: "Digitalisasi Arsip Sekolah",
                    author: "Dr. Ahmad Sudrajat",
                    isbn: "978-602-244-123-7",
                    link: "",
                    type: "Buku Interaktif",
                    level: "SMA/MA/SMK/MAK",
                    grade: "X",
                    tags: "Interaktif,Arsip,SMA",
                    description: "Strategi praktis dalam mendigitalkan dokumen dan arsip sekolah guna meningkatkan aksesibilitas dan keamanan data.",
                    full_description: "Menghadapi era digital, sekolah dituntut untuk memiliki manajemen pengarsipan yang modern. Dr. Ahmad Sudrajat menguraikan langkah-langkah praktis migrasi arsip fisik ke format digital dengan mempertimbangkan aspek legalitas dan keamanan informasi.",
                    image: "https://images.unsplash.com/photo-1512820790803-73c7e9ae832d?auto=format&fit=crop&q=80&w=800",
                },
                {
                    id: 3,
                    title: "Kurikulum Merdeka di Era Digital",
                    author: "Prof. Maria Ulfa",
                    isbn: "978-602-244-987-5",
                    link: "https://google.com",
                    type: "Buku PDF",
                    level: "SD/MI",
                    grade: "I",
                    tags: "PDF,Kurikulum,SD",
                    description: "Analisis mendalam mengenai adaptasi kurikulum nasional dengan bantuan teknologi informasi terkini.",
                    full_description: "Prof. Maria Ulfa membedah bagaimana elemen-elemen teknologi dapat memperkuat implementasi Kurikulum Merdeka. Fokus pada personalisasi pembelajaran dan pemanfaatan platform digital untuk asesmen formatif.",
                    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
                },
                {
                    id: 4,
                    title: "Inovasi Pembelajaran STEM",
                    author: "Ir. Bambang Wijaya",
                    isbn: "978-602-244-554-9",
                    link: "",
                    type: "Buku Audio",
                    level: "SMP/MTS",
                    grade: "VIII",
                    tags: "Audio,STEM,SMP",
                    description: "Metodologi pengajaran sains, teknologi, teknik, dan matematika menggunakan perangkat pembelajaran interaktif.",
                    full_description: "Pembelajaran STEM tidak lagi sulit dengan pendekatan yang tepat. Buku ini menawarkan berbagai modul praktikum berbasis teknologi yang dapat diterapkan langsung di laboratorium sekolah dengan biaya yang efisien.",
                    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
                }
            ])
        },
    ];

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/site-content/initialize`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ contents: initialData })
        });
        
        if (!res.ok) throw new Error("API error");
        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error initializing content:", error);
        return { error: "Failed to initialize content" };
    }
}
