"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function DashboardPage() {
  const { id } = useParams();
  const router = useRouter();
  const [otpRecord, setOtpRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOtp() {
      const { data, error } = await supabase
        .from("otps")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast.error("Invalid or expired dashboard link.");
        router.push("/");
        return;
      }
      setOtpRecord(data);
      setLoading(false);
    }
    fetchOtp();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Toaster richColors position="top-center" />
        <span className="text-lg font-semibold text-slate-700">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Toaster richColors position="top-center" />
      <div className="max-w-2xl mx-auto py-20 px-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to your Proposal Dashboard!</h1>
        <p className="mb-2 text-lg">
          <span className="font-semibold">Access Code:</span> <span className="font-mono bg-slate-100 px-2 py-1 rounded">{otpRecord.code}</span>
        </p>
        {/* Add more proposal details or sections here */}
        <div className="mt-8">
          <p className="text-slate-600">This is a secure dashboard. You can now view your proposal and related information.</p>
        </div>
      </div>
    </div>
  );
}