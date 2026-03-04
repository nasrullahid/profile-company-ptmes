"use client";
import { useState } from "react";

export default function SetupAdmin() {
    const [status, setStatus] = useState<string>("Ready to create admin account.");
    const [loading, setLoading] = useState(false);

    const handleSetup = async () => {
        setLoading(true);
        setStatus("Creating admin account...");
        try {
            const res = await fetch("/api/setup-admin", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                setStatus("Success! Admin account created/updated. Email: admin@magau.com, Password: password123. You can now go to /login");
            } else {
                setStatus("Error: " + (data.error || "Unknown error"));
            }
        } catch (err: any) {
            setStatus("Failed to connect to API: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4 text-black">Admin Setup</h1>
                <p className="mb-6 text-gray-700">{status}</p>
                <button
                    onClick={handleSetup}
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded font-semibold text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Processing..." : "Create Admin Account"}
                </button>
            </div>
        </div>
    );
}
