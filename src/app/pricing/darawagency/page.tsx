"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function DarawAgencyProposalPage() {
    const [currentYear, setCurrentYear] = useState<number>(2024);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());

        // Check for JWT token in URL or localStorage
        const urlToken = searchParams.get('token');
        const storedToken = typeof window !== "undefined" ? localStorage.getItem('auth_token') : null;
        const token = urlToken || storedToken;

        if (token) {
            setIsAuthorized(true);
            // Store token if it came from URL
            if (urlToken && typeof window !== "undefined") {
                localStorage.setItem('auth_token', urlToken);
            }
        } else {
            setIsAuthorized(false);
        }
    }, [searchParams]);

    const BRAND_COLOR = '#8CE232';

    if (!isAuthorized) {
        return (
            <div className="bg-slate-50 min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Access Denied</h1>
                    <p className="text-slate-600 mb-6">Please enter a valid access code to view this proposal.</p>
                    <a href="/otp" className="inline-block bg-[#8CE232] text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-[#7ab81d] transition">
                        Back to Access Portal
                    </a>
                </div>
            </div>
        );
    }
    
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
                    REAIV × DARAW Agency — Services Quotation
                </div>

                {/* Hero */}
                <section id="top" className="relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#8CE232]/20 via-white to-emerald-50"></div>
                    <div className="max-w-5xl mx-auto px-6 py-20 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                            Automation & Development Services for DARAW Agency
                        </h1>
                        <p className="mt-4 text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
                            <strong>Two service models</strong> to support your hospitality and FMCG client projects:
                            <strong> Custom Full-Stack Development</strong> for new builds, and <strong>Automation Services</strong> for existing systems.
                            Scalable, professional, and designed for your client success.
                        </p>
                        <ul className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
                            <li className="bg-white rounded-xl p-4 border border-slate-200 w-56">
                                <span className="block text-2xl font-bold">Custom Development</span>
                                <span className="text-slate-600">Build from Scratch</span>
                                <span className="block mt-2 text-xs text-[#8CE232] font-semibold">₱90K – ₱300K+ One-Time</span>
                            </li>
                            <li className="bg-white rounded-xl p-4 border border-slate-200 w-56">
                                <span className="block text-2xl font-bold">Automation Services</span>
                                <span className="text-slate-600">Automate Existing Tools</span>
                                <span className="block mt-2 text-xs text-[#8CE232] font-semibold">₱30K – ₱80K/Month</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Service Model Overview */}
                <section id="overview" className="py-16 bg-white border-t border-b border-slate-200">
                    <div className="max-w-5xl mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">Two Ways to Serve Your Clients</h2>
                        
                        <div className="mt-8 grid md:grid-cols-2 gap-6">
                            {/* Custom Development */}
                            <div className="text-left bg-white border-2 border-[#8CE232] rounded-xl p-6">
                                <h3 className="font-semibold text-[#8CE232] text-lg">Option 1: Custom Full-Stack Development</h3>
                                <p className="mt-2 text-sm text-slate-600">For clients who need new platforms built from scratch</p>
                                <ul className="mt-4 text-sm text-slate-700 space-y-2">
                                    <li>✓ Brand new booking systems, e-commerce platforms</li>
                                    <li>✓ Complete property management systems</li>
                                    <li>✓ Custom business operating systems</li>
                                    <li>✓ One-time project fee (₱90K – ₱300K+)</li>
                                    <li>✓ Client owns the code completely</li>
                                    <li>✓ 8-20 week build timeline</li>
                                </ul>
                                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
                                    <strong>Best for:</strong> New launches, platform replacements, custom requirements that can't be met with existing tools
                                </div>
                            </div>

                            {/* Automation Services */}
                            <div className="text-left bg-white border-2 border-blue-500 rounded-xl p-6">
                                <h3 className="font-semibold text-blue-600 text-lg">Option 2: Automation Services (Recurring)</h3>
                                <p className="mt-2 text-sm text-slate-600">For clients with existing websites/tools that need automation</p>
                                <ul className="mt-4 text-sm text-slate-700 space-y-2">
                                    <li>✓ Automate existing websites and tools</li>
                                    <li>✓ Replace expensive third-party platforms</li>
                                    <li>✓ Integrate disconnected systems</li>
                                    <li>✓ Monthly recurring (₱30K – ₱80K/month)</li>
                                    <li>✓ Bi-weekly payment option available</li>
                                    <li>✓ 2-6 week implementation</li>
                                </ul>
                                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
                                    <strong>Best for:</strong> Existing businesses, quick wins, clients who want automation without rebuilding everything
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-gradient-to-br from-[#8CE232]/10 to-emerald-50 border border-[#8CE232] rounded-xl p-6">
                            <h3 className="font-semibold text-slate-900 text-center">Why These Services?</h3>
                            <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#8CE232]">Comprehensive Solutions</div>
                                    <p className="mt-1 text-slate-600">Both one-time builds and ongoing automation to meet different client needs</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#8CE232]">Scalable Technology</div>
                                    <p className="mt-1 text-slate-600">Custom solutions that grow with your clients' businesses</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#8CE232]">Long-Term Value</div>
                                    <p className="mt-1 text-slate-600">Automation creates efficiency and reduces operational costs over time</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AUTOMATION SERVICES TIERS */}
                <section id="automation-pricing" className="py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">Automation Services — Recurring Monthly Model</h2>
                        <p className="mt-4 text-center text-slate-600 max-w-3xl mx-auto">
                            For clients with existing websites and tools. REAIV automates workflows, integrates systems, and replaces expensive third-party platforms with custom automation.
                        </p>

                        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <h3 className="font-semibold text-blue-900 text-center">Service Delivery Model</h3>
                            <p className="mt-2 text-sm text-slate-700 text-center max-w-3xl mx-auto">
                                REAIV handles all technical implementation, system integration, and ongoing optimization. 
                                All deliverables can be white-labeled for seamless client presentation.
                            </p>
                        </div>

                        {/* Automation Tier 1 */}
                        <h3 className="mt-12 text-xl font-bold text-slate-900">Monthly Automation Tiers</h3>
                        <div className="mt-6 grid lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Tier 1 — Essential",
                                    badge: "STARTER",
                                    price: "₱30,000/month",
                                    subprice: "₱15,000 bi-weekly option available",
                                    desc: "Basic automation for small properties and startups",
                                    features: [
                                        "Lead capture & CRM sync",
                                        "Basic email sequences (3 emails)",
                                        "Social media scheduling (15 posts/mo)",
                                        "Booking inquiry auto-responses",
                                        "Review aggregation dashboard",
                                        "Weekly automated reports"
                                    ],
                                    toolsReplaced: "Basic Zapier workflows (saves ₱3K-₱5K/month)",
                                    included: [
                                        "Up to 5 automation workflows",
                                        "3-5 tool integrations",
                                        "Monthly optimization review",
                                        "Business hours support",
                                        "Client-ready reports"
                                    ],
                                    details: { setup: "₱15,000", timeline: "2-3 weeks", best: "20-50 room properties, single restaurants, basic e-commerce" }
                                },
                                {
                                    title: "Tier 2 — Advanced",
                                    badge: "GROWTH",
                                    badgeColor: "bg-blue-100 px-2 py-1 rounded",
                                    price: "₱50,000/month",
                                    subprice: "₱25,000 bi-weekly option available",
                                    desc: "Complete automation for growing businesses",
                                    isFeatured: true,
                                    features: [
                                        "Multi-channel campaigns (email+SMS+push)",
                                        "A/B testing & optimization",
                                        "Behavioral segmentation",
                                        "Automated task assignments",
                                        "Custom dashboards per stakeholder",
                                        "Predictive analytics & forecasting",
                                        "Pre-arrival upsell automation"
                                    ],
                                    toolsReplaced: "Advanced automation tools (saves ₱8K-₱12K/month)",
                                    included: [
                                        "Up to 15 automation workflows",
                                        "6-10 tool integrations",
                                        "Bi-weekly strategy calls",
                                        "4-hour priority support",
                                        "Custom automation scripts",
                                        "Quarterly audit & recommendations"
                                    ],
                                    details: { setup: "₱25,000", timeline: "3-4 weeks", best: "50-150 room properties, multi-location groups, growing FMCG brands" }
                                },
                                {
                                    title: "Tier 3 — Enterprise",
                                    badge: "COMPLETE",
                                    price: "₱80,000/month",
                                    subprice: "₱40,000 bi-weekly option available",
                                    desc: "Full automation suite for enterprise operations",
                                    features: [
                                        "AI-powered chatbots (multi-channel)",
                                        "Custom API integrations (unlimited)",
                                        "Revenue optimization automation",
                                        "Full operations management",
                                        "Supply chain automation",
                                        "24/7 system monitoring",
                                        "Dedicated automation specialist"
                                    ],
                                    toolsReplaced: "Multiple enterprise tools (saves ₱30K-₱50K/month)",
                                    included: [
                                        "Unlimited automation workflows",
                                        "Unlimited tool integrations",
                                        "Weekly strategic calls",
                                        "24/7 priority support (1-hr response)",
                                        "Monthly innovation workshops",
                                        "White-label client portal"
                                    ],
                                    details: { setup: "₱40,000", timeline: "4-6 weeks", best: "150+ room properties, hotel chains, major FMCG brands" }
                                }
                            ].map((tier, idx) => (
                                <div key={idx} className={`rounded-2xl border-2 bg-white p-6 ${tier.isFeatured ? 'border-blue-500 shadow-lg relative' : 'border-slate-200 hover:border-blue-500 transition-colors'}`}>
                                    {tier.isFeatured && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                            MOST POPULAR
                                        </div>
                                    )}
                                    <div className="flex items-baseline justify-between">
                                        <h3 className="text-lg font-semibold">{tier.title}</h3>
                                        <span className={`text-xs ${tier.badgeColor || 'bg-slate-100'} px-2 py-1 rounded`}>{tier.badge}</span>
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-3xl font-bold text-blue-600">{tier.price}</div>
                                        <div className="text-sm text-slate-600 mt-1">{tier.subprice}</div>
                                    </div>
                                    <p className="mt-3 text-sm text-slate-600">{tier.desc}</p>
                                    
                                    <div className="mt-6">
                                        <h4 className="text-sm font-semibold text-slate-900">Core Automations:</h4>
                                        <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                            {tier.features.map((feature, i) => <li key={i}>• {feature}</li>)}
                                        </ul>
                                    </div>

                                    <div className="mt-4 p-3 bg-green-50 rounded-lg text-xs">
                                        <strong className="text-green-900">Tools Replaced:</strong>
                                        <p className="text-green-800 mt-1">{tier.toolsReplaced}</p>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-200">
                                        <h4 className="text-xs font-semibold text-slate-500">WHAT'S INCLUDED</h4>
                                        <ul className="mt-2 text-xs text-slate-600 space-y-1">
                                            {tier.included.map((item, i) => <li key={i}>✓ {item}</li>)}
                                        </ul>
                                    </div>

                                    <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs">
                                        <strong>Setup Fee:</strong> {tier.details.setup}<br />
                                        <strong>Implementation:</strong> {tier.details.timeline}<br />
                                        <strong>Best For:</strong> {tier.details.best}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Comparison Tables */}
                        <div className="mt-12">
                            <h3 className="text-xl font-bold text-slate-900 text-center">What Gets Automated at Each Tier</h3>
                            
                            {/* Hospitality Table */}
                            <div className="mt-8">
                                <h4 className="text-lg font-semibold text-slate-900">For Hospitality Clients</h4>
                                <div className="mt-4 overflow-x-auto">
                                    <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                                        <thead>
                                            <tr className="bg-slate-900 text-white">
                                                <th className="text-left p-4 text-sm font-semibold">Automation Feature</th>
                                                <th className="text-center p-4 text-sm font-semibold">Tier 1<br />₱30K/mo</th>
                                                <th className="text-center p-4 text-sm font-semibold">Tier 2<br />₱50K/mo</th>
                                                <th className="text-center p-4 text-sm font-semibold">Tier 3<br />₱80K/mo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { feature: "Booking Automation", t1: "Basic inquiry responses", t2: "OTA sync + direct booking", t3: "Full booking engine + revenue mgmt" },
                                                { feature: "Guest Communication", t1: "Welcome emails only", t2: "Pre-arrival + post-stay sequences", t3: "Full journey + AI chatbot" },
                                                { feature: "Operations", t1: "Basic task notifications", t2: "Automated task assignment", t3: "Full staff scheduling + operations" },
                                                { feature: "Analytics", t1: "Basic dashboard", t2: "Custom dashboards + ROI tracking", t3: "Predictive analytics + forecasting" },
                                                { feature: "Marketing", t1: "Email sequences (3)", t2: "Multi-channel + A/B testing", t3: "AI-powered personalization" },
                                                { feature: "Review Management", t1: "Aggregation only", t2: "Sentiment tracking", t3: "Auto-responses + reputation automation" }
                                            ].map((row, idx) => (
                                                <tr key={idx} className={idx % 2 === 0 ? '' : 'bg-slate-50'}>
                                                    <td className="p-4 font-medium">{row.feature}</td>
                                                    <td className="p-4 text-center text-xs">{row.t1}</td>
                                                    <td className="p-4 text-center text-xs">{row.t2}</td>
                                                    <td className="p-4 text-center text-xs">{row.t3}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* FMCG Table */}
                            <div className="mt-8">
                                <h4 className="text-lg font-semibold text-slate-900">For FMCG Clients</h4>
                                <div className="mt-4 overflow-x-auto">
                                    <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                                        <thead>
                                            <tr className="bg-slate-900 text-white">
                                                <th className="text-left p-4 text-sm font-semibold">Automation Feature</th>
                                                <th className="text-center p-4 text-sm font-semibold">Tier 1<br />₱30K/mo</th>
                                                <th className="text-center p-4 text-sm font-semibold">Tier 2<br />₱50K/mo</th>
                                                <th className="text-center p-4 text-sm font-semibold">Tier 3<br />₱80K/mo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { feature: "E-Commerce", t1: "Order notifications", t2: "Abandoned cart + reorder automation", t3: "Full marketplace sync + subscriptions" },
                                                { feature: "Inventory", t1: "Low-stock alerts", t2: "Real-time sync across channels", t3: "Demand forecasting + optimization" },
                                                { feature: "Marketing", t1: "Basic email campaigns", t2: "Segmented multi-channel campaigns", t3: "AI-powered recommendation engine" },
                                                { feature: "Customer Data", t1: "Basic CRM sync", t2: "Behavioral segmentation + LTV", t3: "Unified customer data platform" },
                                                { feature: "Analytics", t1: "Sales dashboard", t2: "Revenue tracking + competitive analysis", t3: "Predictive sales forecasting" },
                                                { feature: "Operations", t1: "Order status updates", t2: "Automated fulfillment workflows", t3: "Full supply chain automation" }
                                            ].map((row, idx) => (
                                                <tr key={idx} className={idx % 2 === 0 ? '' : 'bg-slate-50'}>
                                                    <td className="p-4 font-medium">{row.feature}</td>
                                                    <td className="p-4 text-center text-xs">{row.t1}</td>
                                                    <td className="p-4 text-center text-xs">{row.t2}</td>
                                                    <td className="p-4 text-center text-xs">{row.t3}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CUSTOM DEVELOPMENT TIERS */}
                <section id="custom-development" className="py-16 bg-white border-t border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">Custom Full-Stack Development — One-Time Projects</h2>
                        <p className="mt-4 text-center text-slate-600 max-w-3xl mx-auto">
                            For clients who need complete platforms built from scratch. Custom booking systems, e-commerce platforms, and property management systems.
                        </p>

                        {/* Hospitality Solutions */}
                        <h3 className="mt-12 text-xl font-bold text-slate-900">Hospitality Development</h3>
                        <div className="mt-6 grid lg:grid-cols-3 gap-6">
                            {[
                                { tier: "Tier 1 — Essential", badge: "ENTRY", price: "₱90,000 – ₱120,000", desc: "Core booking automation for single or small property operations.", features: ["Online booking & reservation system", "Payment gateway + automated e-receipts", "Basic digital menu / table reservation", "Real-time availability updates", "Guest inquiry automation"], benefits: ["Custom website (not WordPress)", "Full backend automation", "UI/UX design tailored to brand", "1-month free support post-launch", "Full source code ownership"], breakdown: ["Planning & flow mapping: ₱10,000", "UI/UX design: ₱15,000 – ₱20,000", "Automation development: ₱50,000 – ₱60,000", "Integration & testing: ₱10,000 – ₱15,000", "Deployment & support: ₱10,000 – ₱15,000"], timeline: "8–10 weeks" },
                                { tier: "Tier 2 — Advanced", badge: "BEST VALUE", badgeColor: "bg-green-100", price: "₱150,000 – ₱200,000", desc: "Full operational automation for multi-property portfolios.", isFeatured: true, features: ["Self check-in/check-out system", "Real-time availability sync", "Automated kitchen order routing", "Daily operations dashboard", "Staff task automation", "Guest communication workflows"], benefits: ["Fully custom backend/frontend", "Direct database integration", "Multi-branch scalability", "Intuitive operational UX", "1-month free support + training"], breakdown: ["Planning & architecture: ₱15,000 – ₱20,000", "UI/UX design: ₱20,000 – ₱30,000", "Feature development: ₱90,000 – ₱110,000", "Integration & testing: ₱15,000 – ₱25,000", "Deployment & support: ₱15,000 – ₱20,000"], timeline: "10–14 weeks" },
                                { tier: "Tier 3 — Enterprise", badge: "COMPLETE", badgeColor: "bg-purple-100", price: "₱250,000 – ₱300,000+", desc: "Complete ecosystem with AI-driven revenue optimization.", features: ["Dynamic pricing engine", "Full POS integration", "Inventory synchronization", "Pre-arrival & post-stay automation", "Advanced analytics & forecasting", "Multi-property management", "Channel manager integrations"], benefits: ["Complete custom ecosystem", "Deep POS & inventory integration", "End-to-end automation", "Premium UI/UX design", "1-month free support + priority access"], breakdown: ["Planning & solution design: ₱20,000 – ₱30,000", "UI/UX design: ₱30,000 – ₱40,000", "Development & integrations: ₱130,000 – ₱170,000", "Testing & QA: ₱30,000 – ₱40,000", "Deployment & support: ₱30,000+"], timeline: "14–20 weeks" }
                            ].map((item, idx) => (
                                <div key={idx} className={`rounded-2xl border-2 bg-white p-6 ${item.isFeatured ? `border-[#8CE232] shadow-lg relative` : 'border-slate-200 hover:border-[#8CE232] transition-colors'}`}>
                                    {item.isFeatured && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8CE232] text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                                            RECOMMENDED
                                        </div>
                                    )}
                                    <div className="flex items-baseline justify-between">
                                        <h3 className="text-lg font-semibold">{item.tier}</h3>
                                        <span className={`text-xs ${item.badgeColor || 'bg-slate-100'} px-2 py-1 rounded`}>{item.badge}</span>
                                    </div>
                                    <div className="mt-2 text-3xl font-bold text-[#8CE232]">{item.price}</div>
                                    <p className="mt-3 text-sm text-slate-600">{item.desc}</p>
                                    
                                    <div className="mt-6">
                                        <h4 className="text-sm font-semibold text-slate-900">Core Features:</h4>
                                        <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                            {item.features.map((feature, i) => <li key={i}>• {feature}</li>)}
                                        </ul>
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="text-sm font-semibold text-slate-900">What You Get:</h4>
                                        <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                            {item.benefits.map((benefit, i) => <li key={i}>✓ {benefit}</li>)}
                                        </ul>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-200">
                                        <h4 className="text-xs font-semibold text-slate-500">COST BREAKDOWN</h4>
                                        <ul className="mt-2 text-xs text-slate-600 space-y-1">
                                            {item.breakdown.map((cost, i) => <li key={i}>{cost}</li>)}
                                        </ul>
                                    </div>

                                    <div className="mt-4 text-xs text-slate-500">
                                        <strong>Timeline:</strong> {item.timeline} from kickoff to launch
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* FMCG E-Commerce */}
                        <h3 className="mt-16 text-xl font-bold text-slate-900">FMCG E-Commerce Development</h3>
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
                    </div>
                </section>

                {/* Payment Terms */}
                <section id="payment-terms" className="py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">Payment Terms</h2>
                        
                        <div className="mt-8 grid lg:grid-cols-2 gap-6">
                            {/* Automation Payment */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                <h3 className="text-lg font-semibold text-blue-600">Automation Services Payment</h3>
                                <div className="mt-4 space-y-4">
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <h4 className="font-semibold text-sm">Monthly Recurring Model</h4>
                                        <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                            <li>• <strong>Tier 1:</strong> ₱30,000/month (or ₱15,000 bi-weekly)</li>
                                            <li>• <strong>Tier 2:</strong> ₱50,000/month (or ₱25,000 bi-weekly)</li>
                                            <li>• <strong>Tier 3:</strong> ₱80,000/month (or ₱40,000 bi-weekly)</li>
                                            <li>• <strong>Setup Fee:</strong> 50% of first month (one-time)</li>
                                            <li>• <strong>Minimum Term:</strong> 3 months per engagement</li>
                                            <li>• <strong>Cancellation:</strong> 30-day notice required</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Custom Development Payment */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                <h3 className="text-lg font-semibold text-[#8CE232]">Custom Development Payment</h3>
                                <div className="mt-4 space-y-4">
                                    <div className="border-l-4 border-[#8CE232] pl-4">
                                        <h4 className="font-semibold text-sm">One-Time Project Payment</h4>
                                        <ul className="mt-2 text-sm text-slate-700 space-y-1">
                                            <li>• <strong>50% upon contract signing</strong> (setup & discovery)</li>
                                            <li>• <strong>25% upon design approval</strong> (prototyping complete)</li>
                                            <li>• <strong>15% upon UAT sign-off</strong> (development complete)</li>
                                            <li>• <strong>10% upon final deployment</strong> (go-live)</li>
                                            <li>• <strong>Payment Terms:</strong> Net-30 after each milestone</li>
                                            <li>• <strong>Early Payment Discount:</strong> 5% if paid upfront</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <section id="process" className="py-16 bg-white border-t border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">REAIV's 6-Step Proven Process</h2>
                        <p className="mt-4 text-center text-slate-600 max-w-3xl mx-auto">
                            Every project (automation or custom development) follows our structured methodology. No surprises, clear deliverables, full transparency.
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
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-16">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="bg-gradient-to-br from-[#8CE232]/10 to-emerald-50 border-2 border-[#8CE232] rounded-2xl p-8 text-center">
                            <h3 className="text-2xl font-bold text-slate-900">Ready to Get Started?</h3>
                            <p className="mt-2 text-slate-600">Contact us to discuss your project requirements and next steps.</p>
                            <div className="mt-6 space-y-2 text-sm">
                                <p><strong>REAIV Solutions</strong></p>
                                <p>Email: <a href="mailto:info@reaiv.biz" className="text-[#8CE232] underline">info@reaiv.biz</a></p>
                                <p>Website: <a href="https://www.reaiv.com" className="text-[#8CE232] underline">www.reaiv.com</a></p>
                            </div>
                            <div className="mt-6 grid md:grid-cols-2 gap-4 text-xs">
                                <div className="bg-white rounded-lg p-4 border border-slate-200">
                                    <p className="font-semibold text-slate-900">Next Steps</p>
                                    <p className="mt-2 text-slate-600">1. Review proposal<br />2. Schedule discovery call<br />3. Select service tier<br />4. Sign agreement & kickoff</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-slate-200">
                                    <p className="font-semibold text-slate-900">Proposal Validity</p>
                                    <p className="mt-2 text-slate-600">This proposal is valid for 30 days from issue date. Pricing and timelines subject to project scope confirmation.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 border-t border-slate-200 text-center text-sm text-slate-600">
                    <p className="font-semibold">REAIV × DARAW Agency Service Proposal</p>
                    <p className="mt-1">Automation and custom development services for hospitality and FMCG clients</p>
                    <p className="mt-4 text-xs text-slate-500">© {currentYear} REAIV — Automation & Software Development</p>
                    <p className="mt-1 text-xs text-slate-500">This document is confidential and prepared exclusively for DARAW Agency.</p>
                </footer>
            </div>
        </>
    );
}