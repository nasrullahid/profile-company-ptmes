import { PrismaClient } from "../src/generated/client/default.js";
import bcrypt from "bcryptjs";

// Konfigurasi admin - ubah sesuai kebutuhan
const ADMIN_EMAIL = "admin@ptmes.com";
const ADMIN_PASSWORD = "Admin123!";
const ADMIN_NAME = "Administrator";

const prisma = new PrismaClient({
    log: ["query"],
});

async function main() {
    console.log("🔄 Connecting to database...");

    // Cek apakah user admin sudah ada
    const existingUser = await prisma.user.findUnique({
        where: { email: ADMIN_EMAIL },
    });

    if (existingUser) {
        console.log(`✅ User admin sudah ada: ${ADMIN_EMAIL}`);
        console.log(`   Role: ${existingUser.role}`);

        // Update role ke admin jika belum admin
        if (existingUser.role !== "admin") {
            await prisma.user.update({
                where: { email: ADMIN_EMAIL },
                data: { role: "admin" },
            });
            console.log("   ✅ Role berhasil diupdate ke 'admin'");
        }
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Buat user admin baru
    const newAdmin = await prisma.user.create({
        data: {
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
        },
    });

    console.log("✅ User admin berhasil dibuat!");
    console.log(`   Email   : ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role    : admin`);
    console.log(`   ID      : ${newAdmin.id}`);
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
