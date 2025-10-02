"use client";

import { useState, useEffect, Fragment } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, MinusCircle } from "lucide-react";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";
import { Toaster, toast } from "sonner";

type ProposalFormValues = {
    title: string;
    client_name: string;
    overview: string;
    overview_details?: {
        title: string;
        description: string;
        items: { label: string; text: string }[];
    };
    hero: {
        headline: string;
        subtitle: string;
        highlights: ({ title: string; desc: string } | string)[];
    };
    solutions: {
        title: string;
        description?: string;
        bullets: string[];
        benefit?: string;
    }[];
    migration_process: {
        step: string;
        description: string;
    }[];
    timelines: {
        title: string;
        steps: { label: string; desc: string }[];
    }[];
    logo_base64?: string;
    pricing: {
        name: string;
        price: string;
        description: string;
        features: string[];
        highlighted: boolean;
    }[];
};

export default function EditProposalPage() {
    const router = useRouter();
    const params = useParams();
    const proposalId = params?.id as string;

    const [showPrice, setShowPrice] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pricingTiers, setPricingTiers] = useState<ProposalFormValues["pricing"]>([]);

    // Add state to track the original title format
    const [originalTitle, setOriginalTitle] = useState("");

    // Add state for new pricing tier
    const [newPricingTier, setNewPricingTier] = useState({
        name: "",
        price: "",
        description: "One time payment",
        features: [""],
        highlighted: false
    });

    const form = useForm<ProposalFormValues>({
        defaultValues: {
            title: "",
            client_name: "",
            overview: "",
            overview_details: {
                title: "",
                description: "",
                items: [{ label: "", text: "" }],
            },
            hero: {
                headline: "",
                subtitle: "",
                highlights: [],
            },
            solutions: [],
            migration_process: [{ step: "", description: "" }],
            timelines: [{ title: "", steps: [{ label: "", desc: "" }] }],
            logo_base64: "",
            pricing: [],
        },
    });

    // Sync pricing tiers with react-hook-form
    useEffect(() => {
        form.setValue("pricing", pricingTiers);
    }, [pricingTiers, form]);

    // Add new pricing tier
    const handleAddPricingTier = () => {
        if (!newPricingTier.name.trim()) {
            toast.error("Pricing tier name is required.");
            return;
        }
        if (!newPricingTier.price.trim()) {
            toast.error("Price is required.");
            return;
        }
        if (newPricingTier.features.some(feature => !feature.trim())) {
            toast.error("All features must be filled.");
            return;
        }

        setPricingTiers(prev => [...prev, { ...newPricingTier }]);
        setNewPricingTier({
            name: "",
            price: "",
            description: "One time payment",
            features: [""],
            highlighted: false
        });
        toast.success("Pricing tier added successfully!");
    };

    // Remove pricing tier
    const removePricingTier = (idx: number) => {
        setPricingTiers(prev => prev.filter((_, i) => i !== idx));
    };

    // Handle new pricing tier changes
    const handleNewPricingTierChange = (field: keyof typeof newPricingTier, value: any) => {
        setNewPricingTier(prev => ({ ...prev, [field]: value }));
    };

    const handleNewFeatureChange = (idx: number, value: string) => {
        setNewPricingTier(prev => ({
            ...prev,
            features: prev.features.map((f, i) => i === idx ? value : f)
        }));
    };

    const addNewFeature = () => {
        setNewPricingTier(prev => ({ ...prev, features: [...prev.features, ""] }));
    };

    const removeNewFeature = (idx: number) => {
        setNewPricingTier(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== idx)
        }));
    };

    // Fetch proposal data and populate form
    useEffect(() => {
        const fetchProposal = async () => {
            setLoading(true);
            const res = await fetch(`/api/proposals/edit/${proposalId}`);
            console.log("Fetching proposal:", proposalId, "Status:", res.status);
            if (res.ok) {
                const { proposal } = await res.json();
                console.log("Fetched proposal data:", proposal);
                if (proposal) {
                    // Store the original title for later use
                    setOriginalTitle(proposal.title);
                    
                    // Extract raw title from formatted title for display in form
                    let rawTitle = proposal.title;
                    const expectedPrefix = `Reaiv × ${proposal.client_name} | `;
                    if (rawTitle && rawTitle.startsWith(expectedPrefix)) {
                        rawTitle = rawTitle.replace(expectedPrefix, "");
                    }

                    // Process pricing data
                    const existingPricing = proposal.pricing || [];
                    setPricingTiers(existingPricing);

                    form.reset({
                        ...proposal,
                        title: rawTitle, // Use extracted raw title for form input
                        overview_details: proposal.overview_details || {
                            title: "",
                            description: "",
                            items: [{ label: "", text: "" }],
                        },
                        hero: proposal.hero || {
                            headline: "",
                            subtitle: "",
                            highlights: [],
                        },
                        solutions: proposal.solutions || [],
                        migration_process: proposal.migration_process || [{ step: "", description: "" }],
                        timelines: proposal.timelines || [{ title: "", steps: [{ label: "", desc: "" }] }],
                        logo_base64: proposal.logo_base64 || "",
                        pricing: existingPricing,
                    });
                    setShowPrice(existingPricing.length > 0);
                }
            } else {
                console.error("Failed to load proposal data. Status:", res.status);
                const errorData = await res.json().catch(() => ({}));
                console.error("Error response:", errorData);
                toast.error("Failed to load proposal data.");
            }
            setLoading(false);
        };

        fetchProposal();
    }, [proposalId, form]);

    // ... (keep all existing hero, solutions, timelines logic the same) ...

    // Auth check
    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch("/api/auth/check", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                toast.error("You must be logged in to access this page.");
                router.push("/auth/2.0/proposal/login");
            }
        };

        checkAuth();
    }, [router]);

    // Highlight logic (keep existing code)
    const hero = form.watch("hero");
    const [newHighlight, setNewHighlight] = useState({ title: "", desc: "" });
    const highlights = Array.isArray(hero?.highlights) ? hero.highlights : [];

    const handleAddHighlight = () => {
        if (!newHighlight.title.trim()) {
            toast.error("Highlight title is required.");
            return;
        }
        if (!newHighlight.desc.trim()) {
            toast.error("Highlight description is required.");
            return;
        }
        if (highlights.length >= 3) {
            toast.error("Maximum of 3 highlights allowed.");
            return;
        }
        form.setValue("hero.highlights", [...highlights, { ...newHighlight }]);
        setNewHighlight({ title: "", desc: "" });
        toast.success("Highlight added!");
    };

    const handleRemoveHighlight = (idx: number) => {
        const newHighlights = highlights.filter((_, i) => i !== idx);
        form.setValue("hero.highlights", newHighlights);
    };

    const handleHighlightTitleChange = (idx: number, value: string) => {
        const newHighlights = highlights.map((h, i) => {
            if (i === idx) {
                if (typeof h === "string") {
                    return value;
                } else {
                    return { ...h, title: value };
                }
            }
            return h;
        });
        form.setValue("hero.highlights", newHighlights);
    };

    const handleHighlightDescChange = (idx: number, value: string) => {
        const newHighlights = highlights.map((h, i) => {
            if (i === idx) {
                if (typeof h === "string") {
                    return { title: h, desc: value };
                } else {
                    return { ...h, desc: value };
                }
            }
            return h;
        });
        form.setValue("hero.highlights", newHighlights);
    };

    // Solutions logic (keep existing code)
    const [solutions, setSolutions] = useState<ProposalFormValues["solutions"]>([]);
    useEffect(() => {
        setSolutions(form.watch("solutions") || []);
    }, [form.watch("solutions")]);

    const timelineSteps = solutions.map((sol) => ({
        label: sol.title,
        desc: "",
    }));

    const [timelines, setTimelines] = useState<
        { title: string; steps: { label: string; desc: string }[] }[]
    >([]);

    useEffect(() => {
        setTimelines(form.watch("timelines") || []);
        form.setValue("timelines", timelines);
    }, [solutions]);

    const [newSolution, setNewSolution] = useState({
        title: "",
        description: "",
        benefit: "",
        bullets: [""],
    });

    const handleAddSolution = () => {
        if (!newSolution.title.trim()) {
            toast.error("Solution title is required.");
            return;
        }
        if (!newSolution.description.trim()) {
            toast.error("Solution description is required.");
            return;
        }
        if (newSolution.bullets.some(bullet => !bullet.trim())) {
            toast.error("All bullet points must be filled.");
            return;
        }
        setSolutions(prev => [...prev, { ...newSolution }]);
        form.setValue("solutions", [...solutions, { ...newSolution }]);
        setNewSolution({ title: "", description: "", benefit: "", bullets: [""] });
        toast.success("Solution added successfully!");
    };

    const handleNewSolutionChange = (field: keyof typeof newSolution, value: string) => {
        setNewSolution(prev => ({ ...prev, [field]: value }));
    };

    const handleNewBulletChange = (idx: number, value: string) => {
        setNewSolution(prev => ({
            ...prev,
            bullets: prev.bullets.map((b, i) => i === idx ? value : b)
        }));
    };

    const addNewBullet = () => {
        setNewSolution(prev => ({ ...prev, bullets: [...prev.bullets, ""] }));
    };

    const removeNewBullet = (idx: number) => {
        setNewSolution(prev => ({
            ...prev,
            bullets: prev.bullets.filter((_, i) => i !== idx)
        }));
    };

    const removeSolution = (idx: number) => {
        const newSolutions = solutions.filter((_, i) => i !== idx);
        setSolutions(newSolutions);
        form.setValue("solutions", newSolutions);
    };

    const handleSubmit = async (data: ProposalFormValues) => {
        toast.dismiss();

        // Get the current form title value
        const currentFormTitle = data.title.trim();
        
        // Extract the raw title from the original stored title
        let originalRawTitle = originalTitle;
        const expectedPrefix = `Reaiv × ${data.client_name} | `;
        if (originalRawTitle && originalRawTitle.startsWith(expectedPrefix)) {
            originalRawTitle = originalRawTitle.replace(expectedPrefix, "");
        }

        // Determine which title to use
        let finalTitle;
        if (currentFormTitle === originalRawTitle || currentFormTitle === "") {
            // No change made to title, use original formatted title
            finalTitle = originalTitle;
        } else {
            // Title was changed, format the new title
            finalTitle = `Reaiv × ${data.client_name || "{client_name}"} | ${currentFormTitle || "{proposal_title}"}`;
        }

        const updatedFields = { ...data, title: finalTitle };

        try {
            // Fetch the current proposal data
            const currentRes = await fetch(`/api/proposals/edit/${proposalId}`);
            const currentData = currentRes.ok ? await currentRes.json() : {};

            // Merge current proposal with updated fields
            const payload = { ...currentData.proposal, ...updatedFields };

            const res = await fetch(`/api/proposals/edit/${proposalId}`, {
                method: "PUT",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                toast.success("Proposal updated successfully!");
                router.push("/dashboard/proposal/listing");
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || "Failed to update proposal.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Toaster richColors position="top-center" />
                <span className="text-lg text-slate-500">Loading proposal...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
            <Toaster richColors position="top-center" />
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 shadow-xl border border-slate-200 bg-white rounded-2xl">
                    <h2 className="text-4xl tracking-tighter font-bold mb-6 text-center text-slate-900">Edit Proposal</h2>
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            {/* Formatted Proposal Title Preview */}
                            <div className="mb-4 text-xl font-bold text-[#8CE232] text-center">
                                Reaiv × {form.watch("client_name") || "{client_name}"} | {form.watch("title") || "{proposal_title}"}
                            </div>

                            {/* Title */}
                            <FormItem>
                                <div className="flex items-center gap-1">
                                    <FormLabel className="text-md">Proposal Title</FormLabel>
                                    <span className="text-red-500 text-sm font-semibold">*</span>
                                </div>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...form.register("title", { required: true })}
                                        placeholder="Enter proposal title"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                            {/* Client Name */}
                            <FormItem>
                                <div className="flex items-center gap-1">
                                    <FormLabel className="text-md">Client Name</FormLabel>
                                    <span className="text-red-500 text-sm font-semibold">*</span>
                                </div>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...form.register("client_name", { required: true })}
                                        placeholder="Enter client name"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <div className="flex items-center gap-1">
                                <FormLabel className="text-md">Logo (Image)</FormLabel>
                                <span className="text-red-500 text-sm font-semibold">*</span>
                            </div>
                            <FormControl>
                                <div
                                    className="relative flex flex-col items-center justify-center border-2 border-dashed border-[#8CE232] rounded-lg bg-white/80 p-6 cursor-pointer transition hover:border-[#6bbf1c]"
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={e => {
                                        e.preventDefault();
                                        const file = e.dataTransfer.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            const base64 = reader.result as string;
                                            form.setValue("logo_base64", base64);
                                        };
                                        reader.readAsDataURL(file);
                                    }}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const reader = new FileReader();
                                            reader.onload = () => {
                                                const base64 = reader.result as string;
                                                form.setValue("logo_base64", base64);
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        style={{ height: "100%", width: "100%" }}
                                    />
                                    <div className="flex flex-col items-center justify-center pointer-events-none">
                                        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#8CE232" strokeWidth="1.5" className="mb-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V8a2 2 0 012-2h14a2 2 0 012 2v8.5M3 16.5l4.5-4.5a2 2 0 012.8 0l2.2 2.2a2 2 0 002.8 0l4.5-4.5M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5" />
                                        </svg>
                                        <span className="text-[#8CE232] font-semibold">Browse or Drag & Drop</span>
                                        <span className="text-xs text-slate-500 mt-1">PNG, JPG, JPEG, SVG up to 2MB</span>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                            {/* Preview */}
                            {form.watch("logo_base64") && (
                                <div className="mt-4 flex flex-col items-center">
                                    <img
                                        src={form.watch("logo_base64")}
                                        alt="Logo Preview"
                                        className="max-h-32 rounded-lg border border-slate-200 shadow"
                                    />
                                    <span className="text-xs text-slate-500 mt-2">Logo Preview</span>
                                    <Button
                                        type="button"
                                        onClick={() => form.setValue("logo_base64", "")}
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 text-red-500 border-red-300 hover:bg-red-50"
                                    >
                                        Remove Image
                                    </Button>
                                </div>
                            )}
                            <Card className="p-6 border border-slate-300 rounded-xl bg-white mb-8">
                                <h3 className="text-lg font-semibold mb-4 text-[#8CE232]">Hero Section</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormItem>
                                        <FormLabel>Headline</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                {...form.register("hero.headline")}
                                                placeholder="Hero headline"
                                                className="bg-white/80"
                                            />
                                        </FormControl>
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel>Subtitle</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                {...form.register("hero.subtitle")}
                                                placeholder="Hero subtitle"
                                                className="bg-white/80"
                                            />
                                        </FormControl>
                                    </FormItem>
                                </div>
                                <div className="mt-6">
                                    <FormLabel className="mb-2 block">Add Highlight</FormLabel>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    value={newHighlight.title}
                                                    onChange={e => setNewHighlight(h => ({ ...h, title: e.target.value }))}
                                                    placeholder="Highlight title"
                                                    className="bg-white/80"
                                                    disabled={highlights.length >= 3}
                                                />
                                            </FormControl>
                                        </FormItem>
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    value={newHighlight.desc}
                                                    onChange={e => setNewHighlight(h => ({ ...h, desc: e.target.value }))}
                                                    placeholder="Highlight description"
                                                    className="bg-white/80"
                                                    disabled={highlights.length >= 3}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    </div>
                                    <div className="text-right">
                                        <Button
                                            type="button"
                                            onClick={handleAddHighlight}
                                            className="bg-[#8CE232] text-black px-6 py-2 rounded-lg hover:bg-[#8CE232]/90 transition-colors"
                                            disabled={highlights.length >= 3}
                                        >
                                            Add Highlight
                                        </Button>
                                    </div>
                                    {highlights.length >= 3 && (
                                        <div className="text-xs text-red-500 mt-2">Maximum of 3 highlights allowed.</div>
                                    )}
                                </div>

                                {/* Highlights Table */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4 text-[#8CE232]">Highlights Added</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12 text-center">No.</TableHead>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead className="text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {highlights.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                                                        No highlights added.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                highlights.map((h, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell className="text-center font-semibold">{idx + 1}</TableCell>
                                                        <TableCell>{typeof h === "string" ? h : h.title}</TableCell>
                                                        <TableCell>{typeof h === "string" ? "" : h.desc}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Button
                                                                type="button"
                                                                onClick={() => handleRemoveHighlight(idx)}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-500 hover:bg-red-100"
                                                                aria-label="Delete Highlight"
                                                            >
                                                                <Trash2 size={20} />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Card>

                            {/* Overview */}
                            <FormItem>
                                <div className="flex items-center gap-1">
                                    <FormLabel className="text-md">Overview</FormLabel>
                                    <span className="text-red-500 text-sm font-semibold">*</span>
                                </div>
                                <FormControl>
                                    <Textarea
                                        {...form.register("overview", { required: true })}
                                        placeholder="Write a brief overview of the proposal"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                            {/* Solutions Section */}
                            <div className="mb-8">
                                <Card className="p-6 border border-slate-300 rounded-xl bg-white">
                                    <div className="flex items-center gap-1">
                                        <h3 className="text-lg font-semibold mb-4 text-[#8CE232]">Add Solution</h3>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    value={newSolution.title}
                                                    onChange={e => handleNewSolutionChange("title", e.target.value)}
                                                    placeholder="Solution title"
                                                    className="bg-white/80"
                                                />
                                            </FormControl>
                                        </FormItem>
                                        <FormItem>
                                            <FormLabel>Benefit</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    value={newSolution.benefit}
                                                    onChange={e => handleNewSolutionChange("benefit", e.target.value)}
                                                    placeholder="Benefit (optional)"
                                                    className="bg-white/80"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    </div>
                                    <FormItem className="mt-4">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                value={newSolution.description}
                                                onChange={e => handleNewSolutionChange("description", e.target.value)}
                                                placeholder="Describe the solution"
                                                className="bg-white/80"
                                            />
                                        </FormControl>
                                    </FormItem>
                                    <FormItem className="mt-4">
                                        <FormLabel>Bullets</FormLabel>
                                        <div className="space-y-2">
                                            {newSolution.bullets.map((bullet, bIdx) => (
                                                <div key={bIdx} className="flex gap-2 items-center">
                                                    <Input
                                                        type="text"
                                                        value={bullet}
                                                        onChange={e => handleNewBulletChange(bIdx, e.target.value)}
                                                        placeholder={`Bullet ${bIdx + 1}`}
                                                        className="bg-white/80"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeNewBullet(bIdx)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-400 hover:bg-red-100"
                                                        disabled={newSolution.bullets.length === 1}
                                                        aria-label="Remove Bullet"
                                                    >
                                                        <MinusCircle size={18} />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                onClick={addNewBullet}
                                                variant="outline"
                                                size="sm"
                                                className="mt-2 flex gap-1 items-center bg-[#eaffd0] text-[#8CE232] border-[#8CE232] hover:bg-[#8CE232]/10"
                                            >
                                                <Plus size={16} />
                                                Add Bullet
                                            </Button>
                                        </div>
                                    </FormItem>
                                    <div className="mt-6 text-right">
                                        <Button
                                            type="button"
                                            onClick={handleAddSolution}
                                            className="bg-[#8CE232] text-black px-6 py-2 rounded-lg hover:bg-[#8CE232]/90 transition-colors"
                                        >
                                            Add Solution
                                        </Button>
                                    </div>

                                    <Separator className="my-4" />

                                    {/* Solutions Table */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 text-[#8CE232]">Solutions Added</h3>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12 text-center">No.</TableHead>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Description</TableHead>
                                                    <TableHead>Benefit</TableHead>
                                                    <TableHead>Bullets</TableHead>
                                                    <TableHead className="text-center">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {solutions.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                                                            No solutions created.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    solutions.map((sol, idx) => (
                                                        <TableRow key={idx}>
                                                            <TableCell className="text-center font-semibold">{idx + 1}</TableCell>
                                                            <TableCell>{sol.title}</TableCell>
                                                            <TableCell>{sol.description}</TableCell>
                                                            <TableCell>{sol.benefit}</TableCell>
                                                            <TableCell>
                                                                <ul className="list-disc pl-4">
                                                                    {sol.bullets.map((b, bIdx) => (
                                                                        <li key={bIdx}>{b}</li>
                                                                    ))}
                                                                </ul>
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => removeSolution(idx)}
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-red-500 hover:bg-red-100"
                                                                    aria-label="Delete Solution"
                                                                >
                                                                    <Trash2 size={20} />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Card>
                            </div>

                            <Separator className="my-6" />

                            {/* Migration Process */}
                            <div className="mb-8">
                                <div className="flex items-center gap-1">
                                    <FormLabel className="mb-2 block text-lg">Migration Process</FormLabel>
                                    <span className="text-red-500 text-sm font-semibold">*</span>
                                </div>
                                {[...Array(5)].map((_, idx) => (
                                    <Fragment key={idx}>
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <FormItem>
                                                <FormLabel>Step {idx + 1} Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        {...form.register(`migration_process.${idx}.step`)}
                                                        placeholder={`Step ${idx + 1} name`}
                                                        className="bg-white/80"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                            <FormItem>
                                                <FormLabel>Step {idx + 1} Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...form.register(`migration_process.${idx}.description`)}
                                                        placeholder={`Describe step ${idx + 1}`}
                                                        className="bg-white/80"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        </div>
                                        {idx < 4 && <Separator className="my-2" />}
                                    </Fragment>
                                ))}
                            </div>

                            {/* Timelines */}
                            {(form.watch("solutions") ?? []).length > 0 ? (
                                <div className="mb-8">
                                    <FormLabel className="mb-2 block text-md">Timelines</FormLabel>
                                    {(form.watch("timelines") ?? []).map((timeline, timelineIdx) => (
                                        <Card key={timelineIdx} className="p-4 mb-8 border border-slate-200 rounded-xl bg-white/80">
                                            <div className="mb-2 font-bold text-[#8CE232]">{timeline.title || `Timeline ${timelineIdx + 1}`}</div>
                                            {(timeline.steps ?? []).map((step, stepIdx) => (
                                                <div key={stepIdx} className="grid md:grid-cols-2 gap-4 mb-2 items-center">
                                                    <FormItem>
                                                        <FormLabel>Step Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                value={step.label}
                                                                onChange={e => {
                                                                    const newTimelines = [...form.watch("timelines")];
                                                                    newTimelines[timelineIdx].steps[stepIdx].label = e.target.value;
                                                                    setTimelines(newTimelines);
                                                                    form.setValue("timelines", newTimelines);
                                                                }}
                                                                placeholder="Timeline step name"
                                                                className="bg-white"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                    <div className="flex items-center gap-2">
                                                        <FormItem className="flex-1">
                                                            <FormLabel>Step Description</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    value={step.desc}
                                                                    onChange={e => {
                                                                        const newTimelines = [...form.watch("timelines")];
                                                                        newTimelines[timelineIdx].steps[stepIdx].desc = e.target.value;
                                                                        setTimelines(newTimelines);
                                                                        form.setValue("timelines", newTimelines);
                                                                    }}
                                                                    placeholder="Add timeline details"
                                                                    className="bg-white"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-400 hover:bg-red-100"
                                                            disabled={timeline.steps.length === 1}
                                                            onClick={() => {
                                                                const newTimelines = [...form.watch("timelines")];
                                                                newTimelines[timelineIdx].steps = newTimelines[timelineIdx].steps.filter((_, i) => i !== stepIdx);
                                                                setTimelines(newTimelines);
                                                                form.setValue("timelines", newTimelines);
                                                            }}
                                                            aria-label="Remove Step"
                                                        >
                                                            <MinusCircle size={18} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-2 flex gap-1 items-center bg-[#eaffd0] text-[#8CE232] border-[#8CE232] hover:bg-[#8CE232]/10"
                                                onClick={() => {
                                                    const newTimelines = [...form.watch("timelines")];
                                                    newTimelines[timelineIdx].steps.push({ label: "", desc: "" });
                                                    setTimelines(newTimelines);
                                                    form.setValue("timelines", newTimelines);
                                                }}
                                            >
                                                <Plus size={16} />
                                                Add Step
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <FormLabel className="mb-2 block">Timelines</FormLabel>
                                    <div className="mb-8 text-center text-slate-500">
                                        No timelines available. Please add a solution first.
                                    </div>
                                </>
                            )}

                            {/* Toggle Price Section */}
                            <div className="mb-8 flex items-center gap-4">
                                <Switch
                                    checked={showPrice}
                                    onCheckedChange={setShowPrice}
                                    id="toggle-price"
                                />
                                <FormLabel htmlFor="toggle-price" className="text-md font-semibold">
                                    Include Pricing in Proposal
                                </FormLabel>
                            </div>

                            {/* Updated Pricing Section */}
                            {showPrice && (
                                <div className="mb-8">
                                    <Card className="p-6 border border-slate-300 rounded-xl bg-white">
                                        <h3 className="text-lg font-semibold mb-4 text-[#8CE232]">Add Pricing Tier</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <FormItem>
                                                <FormLabel>Tier Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        value={newPricingTier.name}
                                                        onChange={e => handleNewPricingTierChange("name", e.target.value)}
                                                        placeholder="e.g., Basic, Premium, Enterprise"
                                                        className="bg-white/80"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        value={newPricingTier.price}
                                                        onChange={e => handleNewPricingTierChange("price", e.target.value)}
                                                        placeholder="e.g., ₱15,000"
                                                        className="bg-white/80"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        </div>
                                        <FormItem className="mt-4">
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    value={newPricingTier.description}
                                                    onChange={e => handleNewPricingTierChange("description", e.target.value)}
                                                    placeholder="e.g., One time payment, Monthly subscription"
                                                    className="bg-white/80"
                                                />
                                            </FormControl>
                                        </FormItem>
                                        <FormItem className="mt-4">
                                            <FormLabel>Features</FormLabel>
                                            <div className="space-y-2">
                                                {newPricingTier.features.map((feature, fIdx) => (
                                                    <div key={fIdx} className="flex gap-2 items-center">
                                                        <Input
                                                            type="text"
                                                            value={feature}
                                                            onChange={e => handleNewFeatureChange(fIdx, e.target.value)}
                                                            placeholder={`Feature ${fIdx + 1}`}
                                                            className="bg-white/80"
                                                        />
                                                        <Button
                                                            type="button"
                                                            onClick={() => removeNewFeature(fIdx)}
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-400 hover:bg-red-100"
                                                            disabled={newPricingTier.features.length === 1}
                                                            aria-label="Remove Feature"
                                                        >
                                                            <MinusCircle size={18} />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button
                                                    type="button"
                                                    onClick={addNewFeature}
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2 flex gap-1 items-center bg-[#eaffd0] text-[#8CE232] border-[#8CE232] hover:bg-[#8CE232]/10"
                                                >
                                                    <Plus size={16} />
                                                    Add Feature
                                                </Button>
                                            </div>
                                        </FormItem>
                                        <div className="mt-4 flex items-center gap-2">
                                            <Switch
                                                checked={newPricingTier.highlighted}
                                                onCheckedChange={(checked) => handleNewPricingTierChange("highlighted", checked)}
                                                id="highlight-tier"
                                            />
                                            <FormLabel htmlFor="highlight-tier" className="text-sm">
                                                Highlight this tier (recommended/popular)
                                            </FormLabel>
                                        </div>
                                        <div className="mt-6 text-right">
                                            <Button
                                                type="button"
                                                onClick={handleAddPricingTier}
                                                className="bg-[#8CE232] text-black px-6 py-2 rounded-lg hover:bg-[#8CE232]/90 transition-colors"
                                            >
                                                Add Pricing Tier
                                            </Button>
                                        </div>

                                        <Separator className="my-4" />

                                        {/* Pricing Tiers Table */}
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-[#8CE232]">Pricing Tiers Added</h3>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-12 text-center">No.</TableHead>
                                                        <TableHead>Name</TableHead>
                                                        <TableHead>Price</TableHead>
                                                        <TableHead>Description</TableHead>
                                                        <TableHead>Features</TableHead>
                                                        <TableHead>Highlighted</TableHead>
                                                        <TableHead className="text-center">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {pricingTiers.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                                                                No pricing tiers added.
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        pricingTiers.map((tier, idx) => (
                                                            <TableRow key={idx}>
                                                                <TableCell className="text-center font-semibold">{idx + 1}</TableCell>
                                                                <TableCell className="font-semibold">{tier.name}</TableCell>
                                                                <TableCell className="font-bold text-[#8CE232]">{tier.price}</TableCell>
                                                                <TableCell>{tier.description}</TableCell>
                                                                <TableCell>
                                                                    <ul className="list-disc pl-4">
                                                                        {tier.features.map((feature, fIdx) => (
                                                                            <li key={fIdx} className="text-sm">{feature}</li>
                                                                        ))}
                                                                    </ul>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {tier.highlighted ? (
                                                                        <span className="bg-[#8CE232] text-black px-2 py-1 rounded text-xs font-semibold">
                                                                            ⭐ Highlighted
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-slate-400 text-xs">No</span>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <Button
                                                                        type="button"
                                                                        onClick={() => removePricingTier(idx)}
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-red-500 hover:bg-red-100"
                                                                        aria-label="Delete Pricing Tier"
                                                                    >
                                                                        <Trash2 size={20} />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-[#8CE232] text-black font-bold py-6 rounded-lg hover:bg-[#8CE232]/90 transition-colors"
                            >
                                Update Proposal
                            </Button>
                        </form>
                    </FormProvider>
                </Card>

                {/* Right: Live Preview */}
                <div className="bg-slate-50 text-slate-800 font-sans rounded-2xl border border-slate-200 shadow-xl p-0 overflow-y-auto">
                    {/* Banner */}
                    <div className="bg-black px-8 py-3 flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <img
                                src="/resources/images/reaiv-logo.png"
                                alt="Reaiv logo"
                                width={192}
                                height={48}
                                className="h-12 w-auto"
                            />
                            <span className="text-md md:text-xl font-bold ml-[-10px] text-white">x</span>
                            {form.watch("logo_base64") ? (
                                <img src={form.watch("logo_base64")} alt="Proposal Logo" className="h-9 w-auto" />
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
                                    <span className="text-[#8CE232]">Reaiv</span> x {form.watch("client_name")}
                                </h2>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                                {form.watch("hero.headline")}
                            </h1>
                            <p className="mt-4 text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
                                {form.watch("hero.subtitle")}
                            </p>
                            <ul className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16 text-sm">
                                {(form.watch("hero.highlights") || []).map((h: any, idx: number) => {
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
                                {form.watch("overview")}
                            </p>
                            {form.watch("overview_details.title")?.trim() && form.watch("overview_details.description")?.trim() && (
                                <div className="mt-8 text-left bg-slate-50 border border-slate-200 rounded-xl p-5">
                                    <h3 className="font-semibold">{form.watch("overview_details.title")}</h3>
                                    <p className="mt-2 text-sm text-slate-600">
                                        {form.watch("overview_details.description")}
                                    </p>
                                    {form.watch("overview_details.items")?.length > 0 && (
                                        <ul className="mt-2 text-sm text-slate-700 space-y-1 list-disc pl-4">
                                            {form.watch("overview_details.items").map((item: any, idx: number) => (
                                                <li key={idx}>
                                                    <strong>{item.label}:</strong> {item.text}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
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
                                {(form.watch("solutions") || []).map((card: any, idx: number) => (
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
                    {pricingTiers.length > 0 && (
                        <section id="pricing" className="py-20 bg-white border-t border-b border-slate-200">
                            <div className="max-w-7xl mx-auto px-6">
                                <div className="flex items-end justify-between flex-wrap gap-4">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Pricing</h2>
                                        <p className="mt-2 text-slate-600">
                                            Simple, transparent tiers. Pick what fits today—scale when you need more.
                                        </p>
                                    </div>
                                    <span className="text-xs text-slate-500">
                                        PHP pricing • Taxes, 3rd-party fees not included
                                    </span>
                                </div>

                                {/* Dynamic Grid Layout based on number of tiers */}
                                <div className={`mt-8 grid gap-6 ${pricingTiers.length === 1
                                    ? 'grid-cols-1 max-w-sm mx-auto'
                                    : pricingTiers.length === 2
                                        ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                                        : pricingTiers.length === 3
                                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                            : pricingTiers.length === 4
                                                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                                                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                                    }`}>
                                    {pricingTiers.map((tier, idx) => (
                                        <div
                                            key={idx}
                                            className={`relative block rounded-2xl border p-6 hover:shadow-lg transition-all duration-200 ${tier.highlighted
                                                ? 'border-[#8CE232] bg-gradient-to-br from-white to-[#8CE232]/10 shadow-lg scale-105'
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                                } ${pricingTiers.length === 1 ? 'min-h-[400px]' : 'min-h-[350px]'
                                                }`}
                                            aria-label={`${tier.name} Pricing`}
                                        >
                                            {tier.highlighted && (
                                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                                                    <span className="bg-[#8CE232] text-black px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                                        ⭐ POPULAR
                                                    </span>
                                                </div>
                                            )}

                                            <div className="text-center">
                                                <h3 className={`font-semibold text-slate-900 ${pricingTiers.length === 1 ? 'text-xl' : 'text-lg'
                                                    }`}>
                                                    {tier.name}
                                                </h3>

                                                <div className="mt-4 flex items-baseline justify-center gap-1">
                                                    <span className={`font-extrabold tracking-tight text-slate-900 ${pricingTiers.length === 1 ? 'text-5xl' : 'text-4xl'
                                                        }`}>
                                                        {tier.price}
                                                    </span>
                                                </div>

                                                <p className={`text-slate-500 mt-2 ${pricingTiers.length === 1 ? 'text-base' : 'text-sm'
                                                    }`}>
                                                    {tier.description}
                                                </p>
                                            </div>

                                            <div className="mt-6">
                                                <ul className={`space-y-2 text-slate-700 ${pricingTiers.length === 1 ? 'text-base' : 'text-sm'
                                                    }`}>
                                                    {tier.features.map((feature, fIdx) => (
                                                        <li key={fIdx} className="flex items-start gap-2">
                                                            <span className="text-[#8CE232] mt-1 flex-shrink-0">✓</span>
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {pricingTiers.length === 1 && (
                                                <div className="mt-8 text-center">
                                                    <button className="w-full bg-[#8CE232] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#7ab33a] transition-colors">
                                                        Get Started
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 space-y-4">
                                    <p className="text-xs text-slate-500 text-center">
                                        Note: Complex software features, additional integrations, and compliance requirements may adjust the final
                                        estimate after discovery. Maintenance fees are not included.
                                    </p>

                                    <div className="bg-[#8CE232] rounded-lg p-6">
                                        <p className="text-base text-center text-black font-medium">
                                            You can explore our portfolio on our website{" "}
                                            <span className="text-white font-semibold">
                                                <a
                                                    href="https://www.reaiv.com/portfolio"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline hover:no-underline transition-all"
                                                >
                                                    Click Here!
                                                </a>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                    {/* Migration Process Section */}
                    <section id="process" className="py-16">
                        <div className="max-w-7xl mx-auto px-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Migration & Delivery Process</h2>
                            <div className="mt-8 grid lg:grid-cols-5 gap-6">
                                {(form.watch("migration_process") || []).map((step: any, idx: number) => (
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
                    {(form.watch("solutions") ?? []).length > 0 && (
                        <section id="timeline" className="py-16 bg-white border-t border-b border-slate-200">
                            <div className="max-w-7xl mx-auto px-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Projected Timeline</h2>
                                <p className="mt-2 text-slate-600 text-sm">
                                    Note: durations are estimates; we can compress or extend based on scope and feedback.
                                </p>
                                <div className="mt-10 grid md:grid-cols-3 gap-8">
                                    {(form.watch("timelines") ?? []).length > 0 ? (
                                        (form.watch("timelines") ?? []).map((timeline: any, idx: number) => (
                                            <div key={idx} className="relative bg-white rounded-2xl border border-slate-200 p-6">
                                                <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#8CE232] rounded"></div>
                                                <h3 className="text-lg font-semibold mb-4 pl-4">
                                                    {timeline.title?.trim() ? timeline.title : `Timeline ${idx + 1}`}
                                                </h3>
                                                <ol className="mt-3 text-sm text-slate-700 space-y-4 pl-4">
                                                    {(timeline.steps ?? []).length > 0 ? (
                                                        timeline.steps.map((step: any, sidx: number) => (
                                                            <li key={sidx}>
                                                                <div className="font-medium text-slate-900">
                                                                    {step.label?.trim() ? step.label : `Step ${sidx + 1}`}
                                                                </div>
                                                                <div className="text-slate-600">{step.desc}</div>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="text-slate-400">No steps added.</li>
                                                    )}
                                                </ol>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-3 text-center text-slate-500 py-8">
                                            No timelines available. Please add a solution first.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}
                    {/* Footer */}
                    <footer className="py-8 border-t border-slate-200 text-center text-xs text-slate-500">
                        © {new Date().getFullYear()} Reaiv — Automation & Software Development
                    </footer>
                </div>
            </div>
        </div>
    );
}