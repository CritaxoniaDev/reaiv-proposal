"use client";

import { useEffect, useState } from 'react';

export default function DarawAgencyProposalPage() {
    const [currentYear, setCurrentYear] = useState<number>(2024);

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    const BRAND_COLOR = '#8CE232';

    return (
        <>
            <style jsx global>{`
                :root {
                    --brand: ${BRAND_COLOR};
                    --ink: #0f172a;
                }
                
                html {
                    scroll-behavior: smooth;
                }
                
                body {
                    font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
                }
            `}</style>

            <div className="bg-slate-50 text-slate-800">
                {/* Banner */}
                <div className="bg-[#8CE232] text-slate-900 px-6 py-3 text-left font-bold text-lg">
                    REAIV × Orly — Hospitality & FMCG Automation
                </div>

                {/* Hero */}
                <section id="top" className="relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#8CE232]/20 via-white to-emerald-50"></div>
                    <div className="max-w-5xl mx-auto px-6 py-20 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                            Custom Automation Built for Your Workflow
                        </h1>
                        <p className="mt-4 text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
                            Transform your <strong>hospitality properties</strong> and <strong>FMCG business</strong> with custom-built automation systems—
                            featuring booking engines, property management, e-commerce platforms, and real-time analytics. No templates. No platform limitations. Full ownership.
                        </p>
                        <ul className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
                            <li className="bg-white rounded-xl p-4 border border-slate-200 w-40">
                                <span className="block text-2xl font-bold">Hospitality</span>
                                <span className="text-slate-600">Booking • PMS • Analytics</span>
                            </li>
                            <li className="bg-white rounded-xl p-4 border border-slate-200 w-40">
                                <span className="block text-2xl font-bold">E-Commerce</span>
                                <span className="text-slate-600">FMCG • Inventory • Orders</span>
                            </li>
                            <li className="bg-white rounded-xl p-4 border border-slate-200 w-40">
                                <span className="block text-2xl font-bold">Full-Stack</span>
                                <span className="text-slate-600">Custom • Scalable • Owned</span>
                            </li>
                        </ul>
                        <div className="mt-8 inline-block bg-slate-900 text-white px-6 py-2 rounded-lg text-sm">
                            <strong>Proposal Date:</strong> October 16, 2025 • <strong>Valid Until:</strong> November 15, 2025
                        </div>
                    </div>
                </section>

                {/* Overview */}
                <section id="overview" className="py-16 bg-white border-t border-b border-slate-200">
                    <div className="max-w-5xl mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">Discovery Meeting Summary</h2>
                        <p className="mt-4 text-slate-600 leading-relaxed max-w-3xl mx-auto text-center">
                            Following our October 15, 2025 discovery call, we've identified key automation opportunities across your business portfolio.
                            You manage multiple hospitality properties (1-4 star) and are transitioning your FMCG operations to e-commerce.
                            Your current challenge: platform limitations forcing you to adapt processes to tools, rather than tools adapting to your workflow.
                        </p>

                        <div className="mt-8 grid md:grid-cols-2 gap-6">
                            {/* Pain Points */}
                            <div className="text-left bg-white border border-slate-200 rounded-xl p-6">
                                <h3 className="font-semibold text-red-900">Current Challenges</h3>
                                <ul className="mt-3 text-sm text-slate-700 space-y-2">
                                    <li>• Manual booking and reservation processes</li>
                                    <li>• Limited property management system integration</li>
                                    <li>• Platform constraints (GHL, WordPress) forcing workflow compromises</li>
                                    <li>• Lack of real-time operational dashboards</li>
                                    <li>• API restrictions without enterprise plans</li>
                                    <li>• E-commerce transition needs for FMCG</li>
                                    <li>• After-sales automation gaps</li>
                                </ul>
                            </div>

                            {/* Our Solution */}
                            <div className="text-left bg-white border border-slate-200 rounded-xl p-6">
                                <h3 className="font-semibold text-green-900">REAIV's Custom Approach</h3>
                                <ul className="mt-3 text-sm text-slate-700 space-y-2">
                                    <li>✓ <strong>Workflow-first design</strong> — Built around YOUR processes</li>
                                    <li>✓ <strong>No platform limitations</strong> — Full control over features</li>
                                    <li>✓ <strong>Complete ownership</strong> — Your code, your data, your rules</li>
                                    <li>✓ <strong>Unlimited integrations</strong> — No API restrictions</li>
                                    <li>✓ <strong>Multi-property scalable</strong> — Grow without constraints</li>
                                    <li>✓ <strong>Real-time dashboards</strong> — Operational visibility</li>
                                    <li>✓ <strong>One-stop solution</strong> — Development + ongoing support</li>
                                </ul>
                            </div>
                        </div>

                        {/* Why Custom vs. Platform */}
                        <div className="mt-8 text-left bg-slate-50 border border-slate-200 rounded-xl p-6">
                            <h3 className="font-semibold text-slate-900">Why Custom-Built Solutions?</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                As you mentioned in our call: <em>"The challenge is adapting the business to the platform instead of the platform to the business."</em>
                            </p>
                            <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <h4 className="font-semibold text-slate-900">Custom Full-Stack (REAIV)</h4>
                                    <ul className="mt-2 text-slate-700 space-y-1">
                                        <li>✓ Built around your exact workflow</li>
                                        <li>✓ Unlimited customization & features</li>
                                        <li>✓ No monthly SaaS fees after build</li>
                                        <li>✓ Full API access without restrictions</li>
                                        <li>✓ True data ownership</li>
                                        <li>✓ Easy to modify and scale</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">Platform Solutions (GHL, WordPress)</h4>
                                    <ul className="mt-2 text-slate-700 space-y-1">
                                        <li>× Forced to adapt to platform constraints</li>
                                        <li>× Limited customization options</li>
                                        <li>× Ongoing monthly fees that compound</li>
                                        <li>× API limits without enterprise plans</li>
                                        <li>× Vendor lock-in</li>
                                        <li>× Generic features not tailored to you</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Investment Tiers */}
                <section id="pricing" className="py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">Investment Options</h2>
                        <p className="mt-4 text-center text-slate-600 max-w-3xl mx-auto">
                            Choose the right entry point for your business. All solutions are custom-built from scratch, fully owned by you, and include 1-month free support post-launch.
                        </p>

                        {/* Hospitality Solutions */}
                        <h3 className="mt-12 text-xl font-bold text-slate-900">Hospitality Automation</h3>
                        <div className="mt-6 grid lg:grid-cols-3 gap-6">
                            {/* Tier 1 */}
                            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 hover:border-[#8CE232] transition-colors">
                                <div className="flex items-baseline justify-between">
                                    <h3 className="text-lg font-semibold">Tier 1 — Essential</h3>
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">ENTRY</span>
                                </div>
                                <div className="mt-2 text-3xl font-bold text-[#8CE232]">₱90,000 – ₱120,000</div>
                                <p className="mt-3 text-sm text-slate-600">Core booking automation for single or small property operations.</p>
                                
                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold text-slate-900">Core Features:</h4>
                                    <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                        <li>• Online booking & reservation system</li>
                                        <li>• Payment gateway + automated e-receipts</li>
                                        <li>• Basic digital menu / table reservation</li>
                                        <li>• Real-time availability updates</li>
                                        <li>• Guest inquiry automation</li>
                                    </ul>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold text-slate-900">What You Get:</h4>
                                    <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                        <li>✓ Custom website (not WordPress)</li>
                                        <li>✓ Full backend automation</li>
                                        <li>✓ UI/UX design tailored to your brand</li>
                                        <li>✓ 1-month free support post-launch</li>
                                        <li>✓ Full source code ownership</li>
                                    </ul>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <h4 className="text-xs font-semibold text-slate-500">COST BREAKDOWN</h4>
                                    <ul className="mt-2 text-xs text-slate-600 space-y-1">
                                        <li>Planning & flow mapping: ₱10,000</li>
                                        <li>UI/UX design: ₱15,000 – ₱20,000</li>
                                        <li>Automation development: ₱50,000 – ₱60,000</li>
                                        <li>Integration & testing: ₱10,000 – ₱15,000</li>
                                        <li>Deployment & support: ₱10,000 – ₱15,000</li>
                                    </ul>
                                </div>

                                <div className="mt-4 text-xs text-slate-500">
                                    <strong>Timeline:</strong> 8–10 weeks from kickoff to launch
                                </div>
                            </div>

                            {/* Tier 2 - RECOMMENDED */}
                            <div className="rounded-2xl border-2 border-[#8CE232] bg-white p-6 shadow-lg relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8CE232] text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                                    RECOMMENDED
                                </div>
                                <div className="flex items-baseline justify-between">
                                    <h3 className="text-lg font-semibold">Tier 2 — Advanced</h3>
                                    <span className="text-xs bg-green-100 px-2 py-1 rounded">BEST VALUE</span>
                                </div>
                                <div className="mt-2 text-3xl font-bold text-[#8CE232]">₱150,000 – ₱200,000</div>
                                <p className="mt-3 text-sm text-slate-600">Full operational automation for multi-property portfolios.</p>
                                
                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold text-slate-900">All Tier 1 Features, Plus:</h4>
                                    <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                        <li>• Self check-in/check-out system</li>
                                        <li>• Real-time availability sync</li>
                                        <li>• Automated kitchen order routing</li>
                                        <li>• Daily operations dashboard</li>
                                        <li>• Staff task automation</li>
                                        <li>• Guest communication workflows</li>
                                    </ul>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold text-slate-900">What You Get:</h4>
                                    <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                        <li>✓ Fully custom backend/frontend</li>
                                        <li>✓ Direct database integration</li>
                                        <li>✓ Multi-branch scalability</li>
                                        <li>✓ Intuitive operational UX</li>
                                        <li>✓ 1-month free support + training</li>
                                    </ul>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <h4 className="text-xs font-semibold text-slate-500">COST BREAKDOWN</h4>
                                    <ul className="mt-2 text-xs text-slate-600 space-y-1">
                                        <li>Planning & architecture: ₱15,000 – ₱20,000</li>
                                        <li>UI/UX design: ₱20,000 – ₱30,000</li>
                                        <li>Feature development: ₱90,000 – ₱110,000</li>
                                        <li>Integration & testing: ₱15,000 – ₱25,000</li>
                                        <li>Deployment & support: ₱15,000 – ₱20,000</li>
                                    </ul>
                                </div>

                                <div className="mt-4 text-xs text-slate-500">
                                    <strong>Timeline:</strong> 10–14 weeks from kickoff to launch
                                </div>
                            </div>

                            {/* Tier 3 */}
                            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 hover:border-[#8CE232] transition-colors">
                                <div className="flex items-baseline justify-between">
                                    <h3 className="text-lg font-semibold">Tier 3 — Enterprise</h3>
                                    <span className="text-xs bg-purple-100 px-2 py-1 rounded">COMPLETE</span>
                                </div>
                                <div className="mt-2 text-3xl font-bold text-[#8CE232]">₱250,000 – ₱300,000+</div>
                                <p className="mt-3 text-sm text-slate-600">Complete ecosystem with AI-driven revenue optimization.</p>
                                
                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold text-slate-900">All Tier 2 Features, Plus:</h4>
                                    <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                        <li>• Dynamic pricing engine</li>
                                        <li>• Full POS integration</li>
                                        <li>• Inventory synchronization</li>
                                        <li>• Pre-arrival & post-stay automation</li>
                                        <li>• Advanced analytics & forecasting</li>
                                        <li>• Multi-property management</li>
                                        <li>• Channel manager integrations</li>
                                    </ul>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold text-slate-900">What You Get:</h4>
                                    <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                        <li>✓ Complete custom ecosystem</li>
                                        <li>✓ Deep POS & inventory integration</li>
                                        <li>✓ End-to-end automation</li>
                                        <li>✓ Premium UI/UX design</li>
                                        <li>✓ 1-month free support + priority access</li>
                                    </ul>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <h4 className="text-xs font-semibold text-slate-500">COST BREAKDOWN</h4>
                                    <ul className="mt-2 text-xs text-slate-600 space-y-1">
                                        <li>Planning & solution design: ₱20,000 – ₱30,000</li>
                                        <li>UI/UX design: ₱30,000 – ₱40,000</li>
                                        <li>Development & integrations: ₱130,000 – ₱170,000</li>
                                        <li>Testing & QA: ₱30,000 – ₱40,000</li>
                                        <li>Deployment & support: ₱30,000+</li>
                                    </ul>
                                </div>

                                <div className="mt-4 text-xs text-slate-500">
                                    <strong>Timeline:</strong> 14–20 weeks from kickoff to launch
                                </div>
                            </div>
                        </div>

                        {/* FMCG E-Commerce */}
                        <h3 className="mt-16 text-xl font-bold text-slate-900">FMCG E-Commerce Solution</h3>
                        <div className="mt-6 max-w-3xl">
                            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 hover:border-[#8CE232] transition-colors">
                                <div className="flex items-baseline justify-between">
                                    <h3 className="text-lg font-semibold">E-Commerce Standard Build</h3>
                                    <span className="text-xs bg-blue-100 px-2 py-1 rounded">ONLINE READY</span>
                                </div>
                                <div className="mt-2 text-3xl font-bold text-[#8CE232]">₱150,000 – ₱250,000</div>
                                <p className="mt-3 text-sm text-slate-600">Complete e-commerce platform for FMCG product sales and operations.</p>
                                
                                <div className="mt-6 grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900">Core Features:</h4>
                                        <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                            <li>• Custom e-commerce site</li>
                                            <li>• Product catalog with filters & search</li>
                                            <li>• Secure checkout & payment gateway</li>
                                            <li>• Order management dashboard</li>
                                            <li>• Inventory tracking system</li>
                                            <li>• Sales reports & analytics</li>
                                            <li>• Customer account management</li>
                                            <li>• Mobile-responsive design</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900">What You Get:</h4>
                                        <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                            <li>✓ Custom-built (not Shopify/WooCommerce)</li>
                                            <li>✓ Scalable product catalog</li>
                                            <li>✓ Payment & shipping integrations</li>
                                            <li>✓ Real-time inventory sync</li>
                                            <li>✓ Admin operations dashboard</li>
                                            <li>✓ 1-month free support post-launch</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <h4 className="text-xs font-semibold text-slate-500">COST BREAKDOWN</h4>
                                    <ul className="mt-2 text-xs text-slate-600 space-y-1">
                                        <li>Planning & architecture: ₱15,000 – ₱20,000</li>
                                        <li>UI/UX design: ₱25,000 – ₱35,000</li>
                                        <li>Core development: ₱80,000 – ₱120,000</li>
                                        <li>Payment & backend integration: ₱15,000 – ₱25,000</li>
                                        <li>Testing & support: ₱15,000 – ₱25,000</li>
                                    </ul>
                                </div>

                                <div className="mt-4 text-xs text-slate-500">
                                    <strong>Timeline:</strong> 10–14 weeks from kickoff to launch
                                </div>
                            </div>
                        </div>

                        {/* Bundle Option */}
                        <div className="mt-12 bg-gradient-to-br from-[#8CE232]/10 to-emerald-50 border-2 border-[#8CE232] rounded-2xl p-8">
                            <div className="text-center">
                                <span className="inline-block bg-[#8CE232] text-slate-900 px-4 py-1 rounded-full text-xs font-bold mb-4">
                                    BUNDLE & SAVE
                                </span>
                                <h3 className="text-2xl font-bold text-slate-900">Complete Business Automation Suite</h3>
                                <div className="mt-3 text-4xl font-bold text-slate-900">₱280,000 – ₱420,000</div>
                                <p className="mt-2 text-sm text-[#8CE232] font-semibold">Save ₱20,000 – ₱30,000 vs. separate purchases</p>
                            </div>

                            <div className="mt-8 grid md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-xl p-4 border border-slate-200">
                                    <h4 className="font-semibold text-slate-900">Includes</h4>
                                    <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                        <li>✓ Hospitality Tier 2 Solution</li>
                                        <li>✓ FMCG E-Commerce Solution</li>
                                        <li>✓ Unified analytics dashboard</li>
                                        <li>✓ Shared customer integration</li>
                                    </ul>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-slate-200">
                                    <h4 className="font-semibold text-slate-900">Bonus Benefits</h4>
                                    <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                        <li>✓ Priority support & maintenance</li>
                                        <li>✓ 2-month free support (vs. 1 month)</li>
                                        <li>✓ Single vendor relationship</li>
                                        <li>✓ Consistent design language</li>
                                    </ul>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-slate-200">
                                    <h4 className="font-semibold text-slate-900">Phased Rollout</h4>
                                    <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                        <li>Months 1–3: Hospitality launch</li>
                                        <li>Months 4–6: FMCG launch</li>
                                        <li>Month 7+: Optimization & scaling</li>
                                        <li>Long-term partnership roadmap</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* REAIV 6-Step Process */}
                <section id="process" className="py-16 bg-white border-t border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">Our 6-Step Proven Process</h2>
                        <p className="mt-4 text-center text-slate-600 max-w-3xl mx-auto">
                            Every project follows our structured methodology—from discovery to ongoing support. No surprises, clear deliverables, full transparency.
                        </p>
                        
                        <div className="mt-8 grid lg:grid-cols-6 gap-4">
                            {[
                                { step: "Step 1", title: "Discovery & Planning", desc: "Research, architecture, risk planning → spec doc, timeline", duration: "1–2 weeks" },
                                { step: "Step 2", title: "Design & Prototyping", desc: "UX/UI, prototypes, design system → interactive deliverables", duration: "2–3 weeks" },
                                { step: "Step 3", title: "Development & Integration", desc: "FE/BE dev, APIs, DB, security → documented, scalable code", duration: "4–12 weeks" },
                                { step: "Step 4", title: "Testing & QA", desc: "Auto/manual, perf, security, UAT → reports, fixes, sign-off", duration: "1–2 weeks" },
                                { step: "Step 5", title: "Deployment & Launch", desc: "CI/CD, monitoring, optimization → live system, launch KPIs", duration: "1 week" },
                                { step: "Step 6", title: "Support & Maintenance", desc: "Updates, scaling, enhancements → reports, SLAs, health logs", duration: "Ongoing" }
                            ].map((item) => (
                                <div key={item.step} className="rounded-2xl border border-slate-200 p-5 bg-white">
                                    <span className="text-xs font-medium text-[#8CE232]">{item.step}</span>
                                    <h3 className="mt-1 font-semibold text-sm">{item.title}</h3>
                                    <p className="mt-1 text-xs text-slate-600">{item.desc}</p>
                                    <div className="mt-2 text-xs text-slate-500">{item.duration}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-6">
                            <h3 className="font-semibold text-slate-900">What's Included in Every Solution</h3>
                            <div className="mt-4 grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900">During Development:</h4>
                                    <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                        <li>✓ Dedicated project manager & technical lead</li>
                                        <li>✓ Weekly progress updates & demos</li>
                                        <li>✓ Collaborative design sessions</li>
                                        <li>✓ Full documentation (technical + user guides)</li>
                                        <li>✓ UAT with your team</li>
                                        <li>✓ Staff training (up to 5 users)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900">Post-Launch (1–2 Months Free):</h4>
                                    <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                        <li>✓ Bug fixes & adjustments</li>
                                        <li>✓ Performance monitoring</li>
                                        <li>✓ User support & troubleshooting</li>
                                        <li>✓ Feature tweaks based on usage</li>
                                        <li>✓ System health reports</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why REAIV */}
                <section id="why-reaiv" className="py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">Why Choose REAIV?</h2>
                        <div className="mt-8 grid lg:grid-cols-4 gap-6">
                            {[
                                { title: "Custom-First Philosophy", desc: "No templates. No compromises. Every solution built from scratch around your exact workflow." },
                                { title: "6-Step Proven Process", desc: "Clear methodology with deliverables at every phase. No surprises, no scope creep." },
                                { title: "Full Ownership", desc: "You own the code, the data, and the entire system. No vendor lock-in." },
                                { title: "Long-Term Partnership", desc: "We don't build and disappear. Ongoing support, scaling, and optimization." }
                            ].map((item, idx) => (
                                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6">
                                    <h3 className="text-lg font-semibold">{item.title}</h3>
                                    <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Payment Terms & Timeline */}
                <section id="terms" className="py-16 bg-white border-t border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">Payment Terms & Timeline</h2>
                        
                        <div className="mt-8 grid lg:grid-cols-2 gap-6">
                            {/* Payment Structure */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                <h3 className="text-lg font-semibold">Payment Structure Per Project</h3>
                                <div className="mt-4 space-y-4">
                                    <div className="border-l-4 border-[#8CE232] pl-4">
                                        <h4 className="font-semibold text-sm">Each Project (Hospitality or FMCG)</h4>
                                        <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                            <li>• <strong>50% upon contract signing</strong> (setup fee – kickoff & discovery)</li>
                                            <li>• <strong>25% upon design approval</strong> (prototyping complete & UAT ready)</li>
                                            <li>• <strong>15% upon UAT sign-off</strong> (development complete & tested)</li>
                                            <li>• <strong>10% upon final deployment</strong> (go-live & handover)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Example */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                <h3 className="text-lg font-semibold">Example Timeline (Tier 2 Hospitality)</h3>
                                <div className="mt-4 space-y-3">
                                    {[
                                        { time: "Week 1–2", label: "Discovery & Planning", paid: "(50% paid)" },
                                        { time: "Week 3–5", label: "Design & Prototyping", paid: "" },
                                        { time: "Week 6–12", label: "Development & Integration", paid: "(25% upon design approval)" },
                                        { time: "Week 13–14", label: "Testing & QA", paid: "(15% upon UAT sign-off)" },
                                        { time: "Week 15", label: "Deployment & Launch", paid: "(10% final payment)" },
                                        { time: "Week 16–19", label: "Free Support & Optimization", paid: "" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <div className="text-xs font-semibold text-[#8CE232] w-16">{item.time}</div>
                                            <div className="text-sm text-slate-700">
                                                {item.label} {item.paid && <span className="text-xs text-slate-500">{item.paid}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Ongoing Support Options */}
                        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-6">
                            <h3 className="font-semibold text-slate-900">Ongoing Support Options (After Free Period)</h3>
                            <div className="mt-4 grid md:grid-cols-3 gap-4">
                                {[
                                    { title: "Basic Support", price: "₱15K – ₱25K/mo", items: ["Business hours support", "Bug fixes", "Performance monitoring"] },
                                    { title: "Premium Support", price: "₱35K – ₱50K/mo", items: ["24/7 support", "Priority response", "Monthly feature updates"] },
                                    { title: "Enterprise Support", price: "Custom Pricing", items: ["Dedicated team", "Continuous optimization", "Strategic consulting"] }
                                ].map((support, idx) => (
                                    <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200">
                                        <h4 className="font-semibold text-sm">{support.title}</h4>
                                        <div className="mt-1 text-xl font-bold text-[#8CE232]">{support.price}</div>
                                        <ul className="mt-2 text-xs text-slate-700 space-y-1">
                                            {support.items.map((item, i) => <li key={i}>• {item}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Next Steps */}
                <section id="next-steps" className="py-16">
                    <div className="max-w-5xl mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">Next Steps</h2>
                        <div className="mt-8 grid md:grid-cols-3 gap-6">
                            {[
                                { num: "1", title: "Review This Proposal", desc: "Share with stakeholders and decision-makers. Identify any questions or clarifications needed." },
                                { num: "2", title: "Select Your Path", desc: "Choose: Hospitality-first (Tier 1/2/3), FMCG-first, or Bundled Package (both)." },
                                { num: "3", title: "Schedule Follow-Up", desc: "Technical deep-dive, finalize scope, address concerns, and move to contracting." }
                            ].map((step) => (
                                <div key={step.num} className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                                    <div className="w-12 h-12 bg-[#8CE232] rounded-full flex items-center justify-center text-slate-900 font-bold text-xl mx-auto">
                                        {step.num}
                                    </div>
                                    <h3 className="mt-4 font-semibold">{step.title}</h3>
                                    <p className="mt-2 text-sm text-slate-600">{step.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 bg-gradient-to-br from-[#8CE232]/10 to-emerald-50 border-2 border-[#8CE232] rounded-2xl p-8 text-center">
                            <h3 className="text-xl font-bold text-slate-900">Ready to Get Started?</h3>
                            <p className="mt-2 text-slate-600">Contact us to schedule your technical deep-dive and finalize your custom solution.</p>
                            <div className="mt-6 space-y-2 text-sm">
                                <p><strong>REAIV Solutions</strong></p>
                                <p>Email: <a href="mailto:info@reaiv.biz" className="text-[#8CE232] underline">info@reaiv.biz</a></p>
                                <p>Website: <a href="https://www.reaiv.com" className="text-[#8CE232] underline">www.reaiv.com</a></p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Terms & Conditions */}
                <section id="terms-conditions" className="py-16 bg-white border-t border-slate-200">
                    <div className="max-w-5xl mx-auto px-6">
                        <h2 className="text-xl font-bold text-slate-900">Terms & Conditions</h2>
                        <div className="mt-4 text-sm text-slate-600 space-y-2">
                            <p>• Quotation valid for 30 days from date of issue (until November 15, 2025)</p>
                            <p>• Prices in Philippine Pesos (PHP)</p>
                            <p>• Final scope may be adjusted based on Discovery phase findings</p>
                            <p>• Timeline estimates may vary based on client feedback cycles</p>
                            <p>• Changes to approved scope will be quoted separately</p>
                            <p>• Payment terms as per selected option above</p>
                            <p>• All deliverables subject to Client sign-off at each phase</p>
                        </div>

                        <h3 className="mt-8 text-lg font-bold text-slate-900">Assumptions & Inclusions</h3>
                        <div className="mt-4 grid md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <h4 className="font-semibold text-slate-900">Included:</h4>
                                <ul className="mt-2 text-slate-700 space-y-1">
                                    <li>✓ Project management</li>
                                    <li>✓ Full source code ownership</li>
                                    <li>✓ Documentation (technical + user)</li>
                                    <li>✓ Staff training (up to 5 users)</li>
                                    <li>✓ 1–2 months free support</li>
                                    <li>✓ Bug fixes during development</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900">Not Included (Add-ons):</h4>
                                <ul className="mt-2 text-slate-700 space-y-1">
                                    <li>× Third-party API fees</li>
                                    <li>× Hosting costs (₱2K–₱5K/month)</li>
                                    <li>× Domain & SSL certificates</li>
                                    <li>× Content creation</li>
                                    <li>× Digital marketing & SEO</li>
                                    <li>× Support beyond free period</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 border-t border-slate-200 text-center text-sm text-slate-600">
                    <p className="font-semibold">Thank you for considering REAIV as your automation partner.</p>
                    <p className="mt-1">We're excited about the opportunity to transform your hospitality and FMCG operations.</p>
                    <p className="mt-4 text-xs text-slate-500">© {currentYear} REAIV — Automation & Software Development</p>
                    <p className="mt-1 text-xs text-slate-500">This document is confidential and prepared exclusively for Orly and team.</p>
                </footer>
            </div>
        </>
    );
}