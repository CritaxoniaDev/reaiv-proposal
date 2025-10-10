"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ProposalGeneratorPage() {
    const [currentYear, setCurrentYear] = useState<number>(2024);

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <>
            <Head>
                <title>Reaiv — Automation & Software Development | Proposal</title>
                <meta
                    name="description"
                    content="Proposal for Reaiv: automation with n8n & GHL, plus custom software development. Pricing tiers: Basic $600/month, Premium $1,500+/month."
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
                <link rel="shortcut icon" href="/resources/images/favicon.ico" type="image/x-icon" />
            </Head>

            <div className="bg-slate-50 text-slate-800 min-h-screen">
                <style jsx global>{`
                    :root {
                        --brand: #8CE232;
                        --ink: #0f172a;
                    }

                    html {
                        scroll-behavior: smooth;
                    }

                    body {
                        font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
                    }

                    .glass {
                        backdrop-filter: saturate(180%) blur(8px);
                        background: rgba(255, 255, 255, .65);
                    }

                    .price-highlight {
                        box-shadow: 0 10px 30px -12px rgba(140, 226, 50, .4);
                    }
                `}</style>

                {/* Company Name Banner */}
                <div className="bg-black px-8 py-3 flex items-center gap-3 fixed top-0 left-0 right-0 z-10">
                    <img src="/resources/images/reaiv-logo.png" alt="Reaiv logo" className="h-12 w-auto" />
                </div>

                {/* Hero */}
                <section id="top" className="relative overflow-hidden pt-[100px]">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#8CE232]/20 via-white to-emerald-50"></div>
                    <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                                Automation that ships. Software that scales.
                            </h1>
                            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
                                Reaiv designs and builds reliable <strong>n8n</strong> and <strong>GoHighLevel</strong> automations—and when you need more, we deliver bespoke, production-grade software.
                            </p>
                            <ul className="mt-8 grid sm:grid-cols-3 gap-4 text-sm">
                                <li className="bg-white rounded-xl p-4 border border-slate-200">
                                    <span className="block text-2xl font-bold">n8n</span>
                                    <span className="text-slate-600">Workflows & Integrations</span>
                                </li>
                                <li className="bg-white rounded-xl p-4 border border-slate-200">
                                    <span className="block text-2xl font-bold">GHL</span>
                                    <span className="text-slate-600">CRM & Marketing Automation</span>
                                </li>
                                <li className="bg-white rounded-xl p-4 border border-slate-200">
                                    <span className="block text-2xl font-bold">Custom</span>
                                    <span className="text-slate-600">APIs • Web Apps • Dashboards</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Overview */}
                <section id="overview" className="pb-16 pt-10">
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Overview</h2>
                            <p className="mt-4 text-slate-600 leading-relaxed">
                                Reaiv helps teams reduce manual work, improve speed, and connect systems. We start with your core processes, then craft reliable automations and—when needed—custom applications to support growth.
                            </p>
                            <div className="mt-6 grid sm:grid-cols-2 gap-4">
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <h3 className="font-semibold">Automation First</h3>
                                    <p className="mt-1 text-sm text-slate-600">
                                        n8n & GHL to orchestrate leads, ops, and marketing with clear logging and recovery.
                                    </p>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-xl p-5">
                                    <h3 className="font-semibold">Built for Production</h3>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Secure auth, API best-practices, and performance optimization when building software.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section id="services" className="py-16 bg-white border-t border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Services</h2>
                        <div className="mt-8 grid lg:grid-cols-3 gap-6">
                            <div className="rounded-2xl border border-slate-200 p-6">
                                <h3 className="text-lg font-semibold">n8n Automation</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    Workflows, webhooks, queues, retries, and observability. Connect SaaS and databases with confidence.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 p-6">
                                <h3 className="text-lg font-semibold">GoHighLevel (GHL)</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    CRM setup, pipelines, marketing automations, and 3rd-party integrations tailored to your funnel.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 p-6">
                                <h3 className="text-lg font-semibold">Custom Software</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    APIs, dashboards, and apps with secure auth, role-based access, and scalable architecture.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section id="pricing" className="py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-end justify-between flex-wrap gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Pricing</h2>
                                <p className="mt-2 text-slate-600">Simple, transparent tiers. Pick what fits today—scale when you need more.</p>
                            </div>
                            <span className="text-xs text-slate-500">PHP pricing • Taxes, 3rd-party fees not included</span>
                        </div>

                        <div className="mt-8 grid md:grid-cols-2 gap-6">
                            {/* Basic */}
                            <Link
                                href="/gen/n8n"
                                className="relative block rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg transition"
                                aria-label="View n8n projects"
                            >
                                <h3 className="text-lg font-semibold text-slate-900">Basic</h3>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold tracking-tight">₱15,000-₱20,000</span>
                                    <span className="text-sm text-slate-500">One time payment</span>
                                </div>
                                <ul className="mt-8 space-y-2 text-sm text-slate-700">
                                    <li>• Exclusive for <strong>n8n</strong> and <strong>GHL</strong> development only</li>
                                    <li>• Multiple projects accepted within a one-month timeframe</li>
                                    <li>• Defined timelines per project (not daily new projects)</li>
                                </ul>
                            </Link>
                    
                            {/* Premium */}
                            <a
                                href="https://www.reaiv.com/portfolio"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View Reaiv portfolio"
                                className="relative block rounded-2xl border border-[#8CE232] bg-gradient-to-br from-white to-[#8CE232]/10 p-6 price-highlight hover:shadow-lg transition"
                            >
                                <h3 className="text-lg font-semibold text-slate-900">Premium</h3>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold tracking-tight">₱30,000 - ₱50,000+</span>
                                    <span className="text-sm text-slate-500">One time payment</span>
                                </div>
                                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                                    <li>• Includes <strong>n8n</strong>, <strong>GHL</strong>, and full software development</li>
                                    <li>• Advanced/stacked automations</li>
                                    <li>• API & third-party integrations</li>
                                    <li>• Web app or dashboard components</li>
                                    <li>• Documentation & milestone demos</li>
                                    <li>• Final price varies by scope</li>
                                </ul>
                            </a>
                        </div>

                        <p className="mt-8 text-xs text-slate-500">
                            Note: Complex software features, additional integrations, and compliance requirements may adjust the final estimate after discovery. Maintenance fees are not included.
                        </p>
                        <div className="mt-8 bg-[#8CE232] p-6">
                            <p className="text-md text-center text-black">
                                You can explore our portfolio on our website{' '}
                                <span className="text-white">
                                    <a href="https://www.reaiv.com/portfolio">Click Here!</a>
                                </span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Process / Timeline */}
                <section id="process" className="py-16 bg-white border-t border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Delivery Process</h2>
                        <div className="mt-8 grid lg:grid-cols-5 gap-6">
                            <div className="rounded-2xl border border-slate-200 p-6">
                                <span className="text-xs font-medium text-[#8CE232]">Step 1</span>
                                <h3 className="mt-1 font-semibold">Discovery</h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    Clarify goals, systems, and success criteria. Define scope and pick a tier.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 p-6">
                                <span className="text-xs font-medium text-[#8CE232]">Step 2</span>
                                <h3 className="mt-1 font-semibold">Proposal</h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    After the discovery call, we prepare a tailored proposal with timelines, deliverables, and pricing confirmation.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 p-6">
                                <span className="text-xs font-medium text-[#8CE232]">Step 3</span>
                                <h3 className="mt-1 font-semibold">Build</h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    Implement workflows and/or software with security and reliability in mind.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 p-6">
                                <span className="text-xs font-medium text-[#8CE232]">Step 4</span>
                                <h3 className="mt-1 font-semibold">Test</h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    QA, performance checks, and user acceptance testing with demos.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 p-6">
                                <span className="text-xs font-medium text-[#8CE232]">Step 5</span>
                                <h3 className="mt-1 font-semibold">Launch & Handover</h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    Deploy, document, and hand off. Optional support and enhancements.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="py-8 border-t border-slate-200 text-center text-xs text-slate-500">
                    © {currentYear} Reaiv — Automation & Software Development
                </footer>
            </div>
        </>
    );
}