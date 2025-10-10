"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Type definitions
interface Project {
    id: number;
    title: string;
    description: string;
    tags: string[];
    image: string;
    tools: Record<string, string[]>;
    setup: string[];
}

export default function N8nProjectsPage() {
    const [currentYear, setCurrentYear] = useState<number>(2024);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalImageSrc, setModalImageSrc] = useState<string>('');

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    // Modal functions
    const openImage = (src: string) => {
        setModalImageSrc(src);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeImage = () => {
        setModalImageSrc('');
        setIsModalOpen(false);
        document.body.style.overflow = '';
    };

    // Close modal on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeImage();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Project data with proper typing
    const projects: Project[] = [
        {
            id: 1,
            title: "Clinic Assistant Automation",
            description: "A medical clinic automation system using Vapi, Make, and Airtable for handling appointments.",
            tags: ["Vapi", "Make", "Airtable"],
            image: "/resources/assets/1.png",
            tools: {
                Vapi: ["Tools: pepa_set_appointment"],
                Make: ["This workflow starts by sending a trigger into Make that processes appointment data and forwards it to Vapi/Airtable."]
            },
            setup: [
                "Create accounts: Set up Airtable, ChatGPT, and Vapi accounts.",
                "Prepare triggers & modules: Replace credentials in each node accordingly.",
                "Configure data flow: Ensure modules are set to fetch and map the correct data fields as outlined in the guide.",
                "Test the workflow: Run the scenario manually to confirm data is fetched, processed, and stored correctly."
            ]
        },
        {
            id: 2,
            title: "Automotive Assistant Automation",
            description: "Automates email, call, and Telegram inquiries, plus appointment scheduling for a car mechanic garage.",
            tags: ["Vapi", "n8n", "Google Sheets"],
            image: "/resources/assets/2.png",
            tools: {
                Vapi: ["Tools: rapidFixAutoGarage"],
                n8n: [
                    "Main workflow: Car Mechanic Main - n8n",
                    "Sub-workflows:",
                    "• Car Mechanic Is User Exist - n8n",
                    "• Car Mechanic Set Appointment - n8n", 
                    "• Car Mechanic Check Availability - n8n",
                    "• Car Mechanic Inquiry - n8n",
                    "• Car Mechanic Last Ids - n8n",
                    "• Car Mechanic Thread Emails - n8n",
                    "DB: Fake Car Mechanic CRM (Google Sheets)"
                ]
            },
            setup: [
                "Create accounts: ChatGPT, Vapi, Telegram, Google Calendar, Gmail.",
                "Prepare triggers & modules: Replace credentials in each node accordingly.",
                "Configure data flow: Ensure modules fetch and map the correct fields (contacts, timeslots, messages).",
                "Test the workflow: Run the main scenario and each sub-workflow manually to validate end-to-end behavior and retries."
            ]
        },
        {
            id: 3,
            title: "Reel Analyst and Suggestion",
            description: "Automates Instagram reel analysis and sends analyzed data via email.",
            tags: ["n8n", "Apify", "Airtable", "Gmail"],
            image: "/resources/assets/3.png",
            tools: {
                n8n: [
                    "Workflow: Reel Analysis and Suggestions - n8n",
                    "Sub-workflows:",
                    "• Reel Analysis and Suggestion - analyze_reels - n8n"
                ]
            },
            setup: [
                "Create accounts: Airtable, Gmail, ChatGPT, Apify, Telegram.",
                "Prepare triggers & modules: Replace credentials in each node accordingly.",
                "Configure data flow: Ensure modules fetch and map the correct fields (user, reel url, video metadata).",
                "Test the workflow: Run the scenario manually to confirm extraction, analysis, and email delivery."
            ]
        },
        {
            id: 4,
            title: "Event Knowledge Based AI",
            description: "Telegram bot that analyzes and answers questions, with broadcast & scheduled messages.",
            tags: ["n8n", "Telegram", "Google Sheets", "Google Docs"],
            image: "/resources/assets/4.png",
            tools: {
                n8n: ["Main workflow: Event Knowledge Based AI - n8n"]
            },
            setup: [
                "Create accounts: Telegram, Gmail, ChatGPT, Google Docs & Google Sheets.",
                "Prepare triggers & modules: Add Telegram trigger, document/sheet readers, and replace credentials in each node.",
                "Configure data flow: Ensure the bot reads the correct sheet/doc fields, maps Q&A pairs, and routes broadcast/schedule messages.",
                "Test the workflow: Run intents, broadcasts, and scheduled messages manually to verify responses and delivery."
            ]
        },
        {
            id: 5,
            title: "Automated Interview Scheduling (Google Calendar Chat Bot)",
            description: "Chat-triggered workflow that checks Google Calendar availability and schedules events.",
            tags: ["n8n", "Google Calendar", "ChatGPT", "Gmail"],
            image: "/resources/assets/6.png",
            tools: {
                n8n: [
                    "Main workflow: Automated Interview Scheduling Google Calendar Chat Bot - n8n",
                    "Sub-workflows:",
                    "• Automated Interview Scheduling Google Calendar Chat Bot - Get Availability - n8n",
                    "• Automated Interview Scheduling Google Calendar Chat Bot - Check Day Name - n8n"
                ]
            },
            setup: [
                "Create accounts: ChatGPT, Google Calendar, Gmail (service account or OAuth as required).",
                "Prepare triggers & modules: Add chat trigger, Calendar modules, and any helper workflows (Get Availability, Check Day Name).",
                "Replace credentials: Provide API keys / OAuth tokens in each node and test authentication.",
                "Configure data flow: Ensure the flow maps requester info, date ranges, and generated timeslots to the calendar event payload.",
                "Test the workflow: Run the main scenario and sub-workflows manually to validate availability, timeslot generation, event creation, and user responses."
            ]
        },
        {
            id: 6,
            title: "AI Data Analyst Chatbot",
            description: "Chat-triggered chatbot that analyzes Google Sheets and answers using a calculator node.",
            tags: ["n8n", "Google Sheets", "ChatGPT"],
            image: "/resources/assets/7.png",
            tools: {
                n8n: [
                    "Main workflow: AI Data Analyst Chatbot - n8n",
                    "Sub-workflows:",
                    "• AI Data Analyst Chatbot_RecordsByDate - n8n",
                    "Data: Sales - Mock data (Google Sheets)"
                ]
            },
            setup: [
                "Create accounts: ChatGPT, Google Sheets.",
                "Prepare triggers & modules: Add chat trigger, Google Sheets reader, and calculator node; replace credentials in each node.",
                "Configure data flow: Map sheet columns to calculator inputs and ensure correct types/formatting.",
                "Test the workflow: Run sample queries, validate calculated outputs, and verify chat responses are accurate."
            ]
        },
        {
            id: 7,
            title: "Chat-triggered Answer Search",
            description: "Search documents, scrape websites and answer questions via an n8n chat trigger.",
            tags: ["n8n", "Google Sheets", "ChatGPT"],
            image: "/resources/assets/8.png",
            tools: {
                n8n: [
                    "Main workflow: Chat-triggered Answer Search - n8n",
                    "Data: Chat-triggered Answer Search (Google Sheets)"
                ]
            },
            setup: [
                "Create accounts: ChatGPT, Google Sheets.",
                "Prepare triggers & modules: Add chat trigger, scrapers/parsers, sheet indexer and QA modules; replace credentials.",
                "Configure data flow: Ensure documents/webpages are indexed into the sheet and search queries map correctly.",
                "Test the workflow: Run sample searches, validate results accuracy and response formatting."
            ]
        },
        {
            id: 8,
            title: "Voice Agent Assistant",
            description: "Voice-interactive assistant using Vapi AI; full-stack with Supabase for auth & DB.",
            tags: ["Vapi", "n8n", "Supabase", "Gmail"],
            image: "/resources/assets/9.png",
            tools: {
                Overview: [
                    "Voice-interactive web app powered by Vapi AI for real-time voice communication.",
                    "Full-stack built with Supabase for authentication and database.",
                    "Integrated AI agent connects to Gmail, Google Calendar, Google Tasks, Notion, and more.",
                    "Supports robust CRUD operations and automated email sending."
                ]
            },
            setup: [
                "Create accounts: Vapi, Supabase, Gmail, Google Calendar, Notion.",
                "Integrate APIs: Configure OAuth/API keys and service accounts for each integration.",
                "Backend: Deploy Supabase schema, rules, and ensure secure storage of credentials.",
                "Validate: Test voice flows, CRUD operations, integrations, and email delivery."
            ]
        }
    ];

    // Filter projects based on search
    const filteredProjects = projects.filter((project: Project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head>
                <title>Reaiv — n8n Projects</title>
                <meta name="description" content="List of n8n and automation projects by Reaiv." />
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

                    .details-content {
                        max-height: 0;
                        overflow: hidden;
                        opacity: 0;
                        transform: translateY(-8px);
                        transition: max-height .32s ease, opacity .22s ease, transform .32s ease;
                    }

                    details[open] .details-content {
                        max-height: 1200px;
                        opacity: 1;
                        transform: translateY(0);
                    }
                `}</style>

                {/* Header */}
                <div className="bg-black px-8 py-3 flex items-center gap-3 fixed top-0 left-0 right-0 z-10">
                    <img src="/resources/images/reaiv-logo.png" alt="Reaiv logo" className="h-12 w-auto" />
                </div>

                {/* Main Content */}
                <main className="max-w-4xl mx-auto px-6 py-[100px]">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">n8n Automation Projects</h1>
                        <Link href="/gen" className="text-sm text-[#8CE232] hover:underline">
                            ← Back to proposal
                        </Link>
                    </div>

                    <div className="mb-6">
                        <input
                            type="search"
                            placeholder="Search projects..."
                            className="w-full rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#8CE232]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Projects */}
                    <div className="space-y-4">
                        {filteredProjects.map((project: Project) => (
                            <details key={project.id} className="group bg-white rounded-2xl border border-slate-200 p-5 glass">
                                <summary className="flex items-center justify-between cursor-pointer">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">{project.title}</h2>
                                        <p className="text-sm text-slate-600">{project.description}</p>
                                        <div className="mt-2 flex gap-2 text-xs text-slate-500">
                                            {project.tags.map((tag: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className={`px-2 py-1 rounded-full ${
                                                        ['Vapi', 'n8n'].includes(tag)
                                                            ? 'bg-[#8CE232]/10 text-[#8CE232]'
                                                            : 'bg-slate-100'
                                                    }`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="ml-4 text-sm text-slate-500 group-open:rotate-180 transition-transform">▼</div>
                                </summary>

                                <div className="details-content mt-4 text-sm text-slate-700 space-y-4">
                                    <div className="grid md:grid-cols-3 gap-4 items-start">
                                        <div className="md:col-span-1">
                                            <img
                                                src={project.image}
                                                alt="workflow preview"
                                                className="rounded-lg border border-slate-200 w-full object-cover shadow-sm cursor-pointer"
                                                onClick={() => openImage(project.image)}
                                            />
                                            <p className="mt-2 text-xs text-slate-500">Click to enlarge</p>
                                        </div>

                                        <div className="md:col-span-2 space-y-3">
                                            {Object.entries(project.tools).map(([toolName, details]: [string, string[]]) => (
                                                <div key={toolName}>
                                                    <p><strong>{toolName}</strong></p>
                                                    <ul className="list-disc pl-5 text-slate-600">
                                                        {details.map((detail: string, index: number) => (
                                                            <li key={index}>
                                                                {detail.startsWith('•') ? (
                                                                    <ul className="list-disc pl-5">
                                                                        <li>{detail.substring(2)}</li>
                                                                    </ul>
                                                                ) : (
                                                                    detail.includes(':') ? (
                                                                        <>
                                                                            <strong>{detail.split(':')[0]}:</strong>
                                                                            {detail.split(':')[1]}
                                                                        </>
                                                                    ) : detail
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100">
                                        <h4 className="font-medium text-slate-900">SET UP</h4>
                                        <ol className="list-decimal pl-5 text-slate-600 space-y-2">
                                            {project.setup.map((step: string, index: number) => (
                                                <li key={index}>
                                                    {step.includes(':') ? (
                                                        <>
                                                            <strong>{step.split(':')[0]}:</strong>
                                                            {step.split(':').slice(1).join(':')}
                                                        </>
                                                    ) : step}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            </details>
                        ))}
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-8 border-t border-slate-200 text-center text-xs text-slate-500">
                    © {currentYear} Reaiv — Automation & Software Development
                </footer>

                {/* Image Modal */}
                {isModalOpen && (
                    <div 
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                closeImage();
                            }
                        }}
                    >
                        <div className="relative max-w-4xl w-full">
                            <button
                                aria-label="Close image"
                                onClick={closeImage}
                                className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                            >
                                ✕
                            </button>
                            <img
                                src={modalImageSrc}
                                alt="Preview"
                                className="w-full h-[80vh] object-contain rounded-md shadow-lg bg-white"
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}