"use client";

import React, { useState } from "react";
import { X, Phone, ArrowRight } from "lucide-react";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    const [phoneNumber, setPhoneNumber] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clean phone number (remove non-digits)
        let cleanNumber = phoneNumber.replace(/\D/g, "");

        // Ensure format starts with 62
        if (cleanNumber.startsWith("0")) {
            cleanNumber = "62" + cleanNumber.substring(1);
        } else if (!cleanNumber.startsWith("62")) {
            // Assuming user might enter without 0 or 62, default to adding 62
            cleanNumber = "62" + cleanNumber;
        }

        const message = encodeURIComponent(`Halo, saya ingin bertanya info lebih lanjut.`);
        const whatsappUrl = `https://wa.me/62811500580?text=${message}&phone=${cleanNumber}`; // Note: 'phone' param in wa.me link isn't standard for *sender*, usually it's the target.
        // Wait, the requirement is "memasukkan nomor telepon dan otomatis ke Whatsapp".
        // Usually this means the user wants us to CONTACT THEM, or they want to contact US but we want to know who they are?
        // OR, maybe they just want to simulate "Proceed to Chat" with the entered number? 
        // BUT the standard use case for "Hubungi Kami" is the user chatting with the company (62811500580).
        // The "input phone number" might be to just capture it or maybe it's a misunderstanding of how WhatsApp links work?
        // IF the user means "Input MY number so you can contact me", that's a lead form.
        // IF the user means "I want to chat with you", they just click.
        // However, the prompt says "agar bisa memasukkan nomor telepon dan otomatis ke Whatsapp".
        // This sounds like: "Enter phone -> Redirect to WhatsApp (chatting with company)".
        // I will append the user's phone number to the pre-filled message so the company sees it.

        const finalMessage = encodeURIComponent(`Halo, saya ingin bertanya info lebih lanjut. Nomor saya: ${phoneNumber}`);
        // Target is likely the COMPANY number.
        const companyNumber = "62811500580";

        window.open(`https://wa.me/${companyNumber}?text=${finalMessage}`, "_blank");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                        <Phone size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-black text-black mb-2 tracking-tight">Hubungi Kami</h3>
                    <p className="text-gray-500 text-sm font-medium">
                        Masukkan nomor WhatsApp Anda untuk terhubung langsung dengan tim kami.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Nomor WhatsApp</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="0812xxxx"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-black font-bold outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-green-700 transition-all shadow-xl shadow-green-600/20 group"
                    >
                        Lanjut ke WhatsApp
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactModal;
