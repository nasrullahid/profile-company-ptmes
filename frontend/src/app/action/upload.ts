"use server";

import { revalidatePath } from "next/cache";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function uploadImage(formData: FormData) {
    try {
        const tokenStr = await getAuthCookie();
        if (!tokenStr) return { success: false, error: "Unauthorized" };
        
        const tokenPayload = await verifyToken(tokenStr);
        const sanctumToken = (tokenPayload as any).sanctumToken;

        const res = await fetch(`${API_URL}/upload`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${sanctumToken}`,
                "Accept": "application/json",
            },
            body: formData,
        });

        const data = await res.json();

        if (res.ok && data.success) {
            revalidatePath("/admin");
            return { success: true, url: data.url };
        }

        return { success: false, error: data.error || "Upload failed" };
    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, error: "Upload failed" };
    }
}
