const { PrismaClient } = require("./src/generated/client");

// Use the transaction pooler on port 6543
const url = "postgresql://postgres.jyjqjvpyclqaivtvxwbz:TesPublishStrong2026@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: url,
        },
    },
});

async function main() {
    try {
        console.log("Attempting to connect to database using Singapore Transaction Pooler (6543)...");
        await prisma.$connect();
        console.log("Successfully connected to database!");
        const usersCount = await prisma.user.count();
        console.log("Current user count:", usersCount);
    } catch (error) {
        console.error("Connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
