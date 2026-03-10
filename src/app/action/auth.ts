"use server";
console.log("Auth Action Loaded - Version: 2026-03-05 12:08");
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";
import { setAuthCookie } from "@/lib/cookies";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteAuthCookie } from "@/lib/cookies";

//REGISTER
export async function register(form: FormData) {
  const name = form.get("name") as string;
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  if (!name || !email || !password) {
    revalidatePath("/register");
    return {
      error: "Semua field harus diisi",
    };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return {
        error: "Email sudah terdaftar",
      };
    }
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    const token = await createToken({ email });
    await setAuthCookie(token);
    revalidatePath("/register");
  } catch (error) {
    console.error("Register error:", error);
    return { error: "[Register Error] Terjadi kesalahan saat pendaftaran atau koneksi database gagal" };
  }
}

//L0GIN
export async function login(form: FormData) {
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  if (!email || !password) {
    revalidatePath("/login");
    return {
      error: "semua field harus di isi",
    };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return {
        error: "username tidak ditemukan",
      };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        error: "password salah",
      };
    }
    const token = await createToken({ email: user.email });
    await setAuthCookie(token);
    revalidatePath("/admin");
  } catch (error: any) {
    console.error("Login error:", error);
    const msg = error?.message || error?.code || String(error);
    return { error: `[DB Error] ${msg.substring(0, 150)}` };
  }
  redirect("/admin");
}

//LOGOUT
export async function logout() {
  await deleteAuthCookie();
  redirect("/");
}

