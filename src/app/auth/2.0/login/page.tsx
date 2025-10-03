"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Setup react-hook-form
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async (data: { email: string; password: string }) => {
        setLoading(true);
        toast.dismiss();

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                toast.success("Login successful!");
                router.push("/dashboard/listing");
            } else {
                toast.error("Invalid email or password.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 font-sans relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#8CE232]/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-black/10 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-[#8CE232]/10 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <Toaster richColors position="top-center" />
            <Card className="relative z-10 rounded-3xl shadow-2xl p-0 w-full max-w-3xl border border-slate-200 bg-white/90 flex flex-col md:flex-row overflow-hidden backdrop-blur-lg">
                {/* Left: Logo and content */}
                <div className="bg-gradient-to-br from-black via-slate-900 to-slate-800 flex flex-col items-center justify-center px-10 py-12 md:w-1/2 w-full">
                    <Image
                        src="/resources/images/reaiv-logo.png"
                        alt="Reaiv logo"
                        width={200}
                        height={100}
                        className="mb-8 drop-shadow-xl"
                        priority
                    />
                    <h2 className="text-3xl font-extrabold text-[#8CE232] mb-3 tracking-tight">Reaiv Proposals</h2>
                    <p className="text-slate-300 text-center mb-6 text-lg font-medium">
                        Secure access to your proposal management system.<br />
                        Automation & Software Development for modern teams.
                    </p>
                    <div className="mt-6 text-xs text-slate-500 text-center">
                        &copy; {new Date().getFullYear()} Reaiv. All rights reserved.
                    </div>
                </div>
                {/* Right: Login Form */}
                <div className="flex flex-col justify-center px-10 py-12 md:w-1/2 w-full bg-white/80">
                    <h2 className="text-3xl font-bold mb-8 text-center text-slate-900 tracking-tight">Sign in to your account</h2>
                    <FormProvider {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleLogin)}
                            className="space-y-8"
                        >
                            <FormItem>
                                <FormLabel className="text-slate-700 font-semibold">Email address</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        {...form.register("email", { required: true })}
                                        disabled={loading}
                                        autoComplete="email"
                                        placeholder="you@company.com"
                                        className="bg-slate-50 border-slate-300 focus:border-[#8CE232] focus:ring-[#8CE232] text-lg"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <FormItem>
                                <FormLabel className="text-slate-700 font-semibold">Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        {...form.register("password", { required: true })}
                                        disabled={loading}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="bg-slate-50 border-slate-300 focus:border-[#8CE232] focus:ring-[#8CE232] text-lg"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#8CE232] cursor-pointer text-black font-bold text-lg py-6 rounded-xl hover:bg-[#8CE232]/90 transition-all shadow-lg"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </FormProvider>
                    <div className="mt-8 text-center text-slate-500 text-sm">
                        <span>Forgot your password?</span>
                        <a href="#" className="ml-2 text-[#8CE232] font-semibold hover:underline">Reset here</a>
                    </div>
                    <div className="mt-4 text-center text-slate-400 text-xs">
                        By signing in, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
                    </div>
                </div>
            </Card>
        </div>
    );
}