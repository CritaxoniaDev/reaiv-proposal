"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth/2.0/login');
    }, 2000); // 2 second delay for welcome message

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center space-y-12 px-8">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Image
            src="/resources/images/reaiv-logo.png"
            alt="Reaiv logo"
            width={180}
            height={90}
            className="animate-pulse"
            priority
          />
        </div>
        
        {/* Welcome Message */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-slate-800 animate-fade-in">
            Welcome to <span className="text-[#8CE232]">Reaiv</span>
          </h1>
          <p className="text-xl text-slate-600 animate-fade-in-delay">
            Professional Proposal Management Platform
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center items-center space-x-3 mt-12">
          <div className="w-3 h-3 bg-[#8CE232] rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-[#8CE232] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-3 h-3 bg-[#8CE232] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
        
        <p className="text-lg text-slate-500 animate-pulse">
          Initializing your workspace...
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
}