import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST() {
    try {
        const email = "admin@magau.com";
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: "admin",
            },
            create: {
                email,
                name: "Admin",
                password: hashedPassword,
                role: "admin",
            },
        });

        return NextResponse.json({ success: true, user });
    } catch (error: any) {
        console.error("Setup Admin Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
