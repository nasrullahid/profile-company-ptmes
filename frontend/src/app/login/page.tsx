"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/action/auth";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await login(formData);
    },
    undefined,
  );

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-[#1e40af] via-[#1e3a8a] to-[#0d9488] p-6 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-[120px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-[120px] opacity-20 translate-x-1/2 translate-y-1/2"></div>

      {/* Header Section */}
      <div className="z-10 flex flex-col items-center mb-8 text-white">
        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20 shadow-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Portal</h1>
        <p className="text-white/70 font-medium">PT Media Eduka Sentosa</p>
        <p className="text-[10px] text-white/30 mt-2 font-mono">Build: 20260305-1255</p>
      </div>

      {/* Login Card */}
      <div className="z-10 w-full max-w-105 bg-white rounded-4xl shadow-2xl p-8 lg:p-10">
        <h2 className="text-2xl font-bold text-[#171717] mb-6">Login</h2>



        <form action={action} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Email
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e40af] transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                placeholder="admn@gmaill.com"
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] block p-4 pl-12 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e40af] transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] block p-4 pl-12 pr-12 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88L4.62 4.62" />
                    <path d="M7.71 11.45L4.47 8.21c-.38-.38-.6-.9-.6-1.44 0-1.12.9-2.03 2.03-2.03.54 0 1.05.22 1.44.6L10.79 8.8" />
                    <path d="M1 1l22 22" />
                    <path d="M16.03 16.03l3.35 3.35c.38.38.9.6 1.44.6 1.12 0 2.03-.9 2.03-2.03 0-.54-.22-1.05-.6-1.44l-3.21-3.21" />
                    <path d="M15.11 11.2a4 4 0 0 0-4.83 4.79" />
                    <path d="M4 12a9 9 0 0 1 15.3-6.36" />
                    <path d="M20 12a9 9 0 0 1-15.3 6.36" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {state?.error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {state.error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#1e40af] text-white font-bold py-4 rounded-2xl hover:bg-[#1e3a8a] transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-800 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Footer Text */}
      <p className="z-10 mt-8 text-white/60 text-xs font-medium tracking-wide">
        Halaman ini dilindungi dengan enkripsi SSL
      </p>
    </main>
  );
};

export default LoginPage;
