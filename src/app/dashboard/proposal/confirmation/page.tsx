"use client";

import { useSearchParams } from "next/navigation";

export default function ConfirmationPage() {
    const searchParams = useSearchParams();
    const otpCode = searchParams.get("otp");

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md p-8 shadow-xl border border-slate-200 bg-white rounded-2xl text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Proposal Created Successfully!</h2>
                <p className="text-lg text-slate-700 mb-6">
                    Your proposal has been created. Use the OTP code below to access it:
                </p>
                <div className="text-3xl font-bold text-[#8CE232] tracking-widest mb-6">
                    {otpCode || "N/A"}
                </div>
                <p className="text-sm text-slate-500">
                    Please save this OTP code for future reference.
                </p>
            </div>
        </div>
    );
}