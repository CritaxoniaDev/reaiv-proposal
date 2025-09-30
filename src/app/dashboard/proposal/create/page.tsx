"use client";

import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
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
        description: string;
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
    price?: string;
    price_basic?: string;
    price_premium?: string;
};

export default function CreateProposalPage() {
    const [showPrice, setShowPrice] = useState(false);
    const router = useRouter();

    // Check if the user is logged in
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
            price: "",
            price_basic: "",
            price_premium: "",
        },
    });

    // Get hero from react-hook-form
    const hero = form.watch("hero");
    const [newHighlight, setNewHighlight] = useState({ title: "", desc: "" });

    // Ensure hero.highlights is always an array
    const highlights = Array.isArray(hero?.highlights) ? hero.highlights : [];

    // Add highlight (max 3)
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

    // Remove highlight
    const handleRemoveHighlight = (idx: number) => {
        const newHighlights = highlights.filter((_, i) => i !== idx);
        form.setValue("hero.highlights", newHighlights);
    };

    // Update highlight title
    const handleHighlightTitleChange = (idx: number, value: string) => {
        const newHighlights = highlights.map((h, i) => {
            if (i === idx) {
                if (typeof h === "string") {
                    return value; // If it's a string, just replace with new string
                } else {
                    return { ...h, title: value };
                }
            }
            return h;
        });
        form.setValue("hero.highlights", newHighlights);
    };

    // Update highlight desc
    const handleHighlightDescChange = (idx: number, value: string) => {
        const newHighlights = highlights.map((h, i) => {
            if (i === idx) {
                if (typeof h === "string") {
                    return { title: h, desc: value }; // Convert string to object
                } else {
                    return { ...h, desc: value };
                }
            }
            return h;
        });
        form.setValue("hero.highlights", newHighlights);
    };

    const [solutions, setSolutions] = useState<ProposalFormValues["solutions"]>([]);

    const timelineSteps = solutions.map((sol) => ({
        label: sol.title,
        desc: "",
    }));

    // State for timelines (you can expand this for multiple timelines if needed)
    const [timelines, setTimelines] = useState<
        { title: string; steps: { label: string; desc: string }[] }[]
    >([]);


    // Sync solutions with react-hook-form
    useEffect(() => {
        form.setValue("solutions", solutions);
    }, [solutions]);

    useEffect(() => {
        setTimelines(
            solutions.map((sol, idx) => ({
                title: sol.title,
                steps: [{ label: "", desc: "" }],
            }))
        );
        form.setValue("timelines", timelines);
        // eslint-disable-next-line
    }, [solutions]);

    const [newSolution, setNewSolution] = useState({
        title: "",
        description: "",
        benefit: "",
        bullets: [""],
    });

    // Add new solution to solutions array
    const handleAddSolution = () => {
        // Check if title, description, and bullets are filled
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

        // Add the solution if all validations pass
        setSolutions(prev => [...prev, { ...newSolution }]);
        setNewSolution({ title: "", description: "", benefit: "", bullets: [""] });
        toast.success("Solution added successfully!");
    };

    // Handlers for new solution input
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
        setSolutions(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (data: ProposalFormValues) => {
        toast.dismiss();

        // Format the title before sending
        const formattedTitle = `Reaiv × ${data.client_name || "{client_name}"} | ${data.title || "{proposal_title}"}`;

        // Replace the title field with the formatted value
        const payload = { ...data, title: formattedTitle };

        try {
            const res = await fetch("/api/proposals/create", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                const result = await res.json();
                const otpCode = result.otp.code;
                toast.success("Proposal created successfully!");
                form.reset();
                router.push(`/dashboard/proposal/confirmation?otp=${otpCode}`);
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || "Failed to create proposal.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
            <Toaster richColors position="top-center" />
            <Card className="w-full max-w-4xl p-8 shadow-xl border border-slate-200 bg-white rounded-2xl">
                <h2 className="text-4xl tracking-tighter font-bold mb-6 text-center text-slate-900">Create a New Proposal</h2>
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

                        {/* New Solution Card */}
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

                        <Separator className="my-8" />

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
                        {solutions.length > 0 ? (
                            <div className="mb-8">
                                <FormLabel className="mb-2 block text-md">Timelines</FormLabel>
                                {timelines.map((timeline, timelineIdx) => (
                                    <Card key={timelineIdx} className="p-4 mb-8 border border-slate-200 rounded-xl bg-white/80">
                                        <div className="mb-2 font-bold text-[#8CE232]">{timeline.title || `Timeline ${timelineIdx + 1}`}</div>
                                        {timeline.steps.map((step, stepIdx) => (
                                            <div key={stepIdx} className="grid md:grid-cols-2 gap-4 mb-2 items-center">
                                                <FormItem>
                                                    <FormLabel>Step Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            value={step.label}
                                                            onChange={e => {
                                                                const newTimelines = [...timelines];
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
                                                                    const newTimelines = [...timelines];
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
                                                            const newTimelines = [...timelines];
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
                                                const newTimelines = [...timelines];
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

                        {/* Pricing Inputs */}
                        {showPrice && (
                            <div className="mb-8 grid md:grid-cols-2 gap-4">
                                <FormItem>
                                    <FormLabel>Basic Payment</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            {...form.register("price_basic")}
                                            placeholder="e.g. ₱15,000"
                                            className="bg-white/80"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Premium Payment</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            {...form.register("price_premium")}
                                            placeholder="e.g. ₱20,000"
                                            className="bg-white/80"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-[#8CE232] text-black font-bold py-6 rounded-lg hover:bg-[#8CE232]/90 transition-colors"
                        >
                            Create Proposal
                        </Button>
                    </form>
                </FormProvider>
            </Card>
        </div>
    );
}