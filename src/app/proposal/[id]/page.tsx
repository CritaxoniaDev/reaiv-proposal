"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Image from "next/image";
import { ProposalData } from "@/types/proposaldata";

export default function ProposalPage() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<ProposalData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProposal() {
            const res = await fetch(`/api/proposals?id=${id}`);
            if (!res.ok) {
                toast.error("Invalid or expired proposal link.");
                router.push("/");
                return;
            }
            const json = await res.json();
            setData(json);
            setLoading(false);
        }
        fetchProposal();
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Toaster richColors position="top-center" />
                <div className="flex flex-col items-center">
                    <svg
                        className="animate-spin h-10 w-10 text-[#8CE232] mb-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                    <span className="text-lg font-semibold text-slate-700 animate-pulse">
                        Loading proposal...
                    </span>
                </div>
            </div>
        );
    }

    const { otp, proposal } = data!;
    const hero = proposal.hero;
    const solutions = proposal.solutions;
    const migrationProcess = proposal.migration_process;

    return (
        <div className="bg-slate-50 text-slate-800 min-h-screen font-sans">
            <Toaster richColors position="top-center" />
            {/* Banner */}
            <div className="bg-black px-8 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-10">
                <div className="flex items-center gap-4">
                    <Image
                        src="/resources/images/reaiv-logo.png"
                        alt="Reaiv logo"
                        width={192}
                        height={48}
                        quality={100}
                        priority
                        className="h-12 w-auto"
                    />
                    <span className="text-md md:text-xl font-bold ml-[-10px] text-white">x</span>
                    {proposal.logo_base64 ? (
                        <img src={proposal.logo_base64} alt="Proposal Logo" className="h-9 w-auto" />
                    ) : (
                        <span className="text-slate-400">No logo</span>
                    )}
                </div>
            </div>

            {/* Hero Section */}
            <section id="top" className="relative overflow-hidden py-[70px]">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#8CE232]/20 via-white to-emerald-50"></div>
                <div className="max-w-5xl mx-auto px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                            <span className="text-[#8CE232]">Reaiv</span> x {proposal.client_name}
                        </h2>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                        {hero.headline}
                    </h1>
                    <p className="mt-4 text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
                        {hero.subtitle}
                    </p>
                    <ul className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16 text-sm">
                        {hero.highlights?.map((h, idx) => {
                            if (typeof h === "string") {
                                return (
                                    <li key={h + idx} className="bg-white rounded-xl p-4 border border-slate-200 w-[15rem] h-auto">
                                        <span className="block text-2xl font-bold">{h}</span>
                                    </li>
                                );
                            } else {
                                return (
                                    <li key={h.title + idx} className="bg-white rounded-xl p-4 border border-slate-200 w-[15rem] h-auto">
                                        <span className="block text-2xl font-bold">{h.title}</span>
                                        <span className="block mt-2 text-slate-600">{h.desc}</span>
                                    </li>
                                );
                            }
                        })}
                    </ul>
                </div>
            </section>

            {/* Overview Section */}
            <section id="overview" className="py-16 bg-white border-t border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Overview</h2>
                    <p className="mt-4 text-slate-600 leading-relaxed max-w-3xl mx-auto">
                        {proposal.overview}
                    </p>
                    {proposal.overview_details && (
                        <div className="mt-8 text-left bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <h3 className="font-semibold">{proposal.overview_details.title}</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                {proposal.overview_details.description}
                            </p>
                            <ul className="mt-2 text-sm text-slate-700 space-y-1 list-disc pl-4">
                                {proposal.overview_details.items.map((item, idx) => (
                                    <li key={idx}>
                                        <strong>{item.label}:</strong> {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>

            {/* Proposed Solutions Section */}
            <section id="services" className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                        Proposed Solutions
                    </h2>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {solutions.map((card, idx) => (
                            <div key={idx} className="card rounded-2xl border border-[#8CE232] bg-white p-6 hover:scale-[1.01] transition-transform">
                                <h3 className="text-lg font-semibold">{card.title}</h3>
                                <p className="mt-2 text-sm text-slate-600">{card.description}</p>
                                <ul className="mt-4 text-sm text-slate-700 space-y-1 list-disc pl-4">
                                    {card.bullets.map((b: string, i: number) => (
                                        <li key={i}>{b}</li>
                                    ))}
                                </ul>
                                {card.benefit && (
                                    <p className="mt-4 text-xs text-slate-500"><strong>Benefit:</strong> {card.benefit}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Migration Process / Timeline Section */}
            <section id="process" className="py-16 bg-white border-t border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Migration & Delivery Process</h2>
                    <div className="mt-8 grid lg:grid-cols-5 gap-6">
                        {migrationProcess.map((step, idx) => (
                            <div key={idx} className="rounded-2xl border border-slate-200 p-6 bg-white">
                                <span className="text-xs font-medium text-[#8CE232]">Step {idx + 1}</span>
                                <h3 className="mt-1 font-semibold">{step.step}</h3>
                                <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section id="timeline" className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Projected Timeline</h2>
                    <p className="mt-2 text-slate-600 text-sm">
                        Note: durations are estimates; we can compress or extend based on scope and feedback.
                    </p>
                    <div className="mt-10 grid md:grid-cols-3 gap-8">
                        {proposal.timelines?.map((timeline, idx) => (
                            <div key={idx} className="relative bg-white rounded-2xl border border-slate-200 p-6">
                                <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#8CE232] rounded"></div>
                                <h3 className="text-lg font-semibold mb-4 pl-4">{timeline.title}</h3>
                                <ol className="mt-3 text-sm text-slate-700 space-y-4 pl-4">
                                    {timeline.steps.map((step, sidx) => (
                                        <li key={sidx}>
                                            <div className="font-medium text-slate-900">{step.label}</div>
                                            <div className="text-slate-600">{step.desc}</div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>
                    <p className="mt-10 text-xs text-slate-500 text-center">
                        Total projected duration for core scope: ~6–8 weeks (parallelized where possible).
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-slate-200 text-center text-xs text-slate-500">
                © {new Date().getFullYear()} Reaiv — Automation & Software Development
            </footer>
        </div>
    );
}