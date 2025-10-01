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
            // Replace with your Supabase login logic
            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                toast.success("Login successful!");

                // Redirect to the dashboard listing page
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
            <Toaster richColors position="top-center" />
            <Card className="rounded-2xl shadow-xl p-0 w-full max-w-2xl border border-slate-200 bg-white flex flex-col md:flex-row overflow-hidden">
                {/* Left: Logo and content */}
                <div className="bg-black flex flex-col items-center justify-center px-8 py-10 md:w-1/2 w-full">
                    <Image
                        src="/resources/images/reaiv-logo.png"
                        alt="Reaiv logo"
                        width={180}
                        height={90}
                        className="mb-6"
                        priority
                    />
                    <h2 className="text-2xl font-bold text-[#8CE232] mb-2">Reaiv Proposals</h2>
                    <p className="text-slate-300 text-center mb-4">
                        Secure access to your proposal management system.<br />
                        Automation & Software Development for modern teams.
                    </p>
                    <div className="mt-4 text-xs text-slate-500 text-center">
                        &copy; {new Date().getFullYear()} Reaiv
                    </div>
                </div>
                {/* Right: Login Form */}
                <div className="flex flex-col justify-center px-8 py-10 md:w-1/2 w-full">
                    <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Login</h2>
                    <FormProvider {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleLogin)}
                            className="space-y-6"
                        >
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        {...form.register("email", { required: true })}
                                        disabled={loading}
                                        autoComplete="email"
                                        placeholder="example@email.com"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        {...form.register("password", { required: true })}
                                        disabled={loading}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#8CE232] cursor-pointer text-black font-bold py-2 rounded-lg hover:bg-[#8CE232]/90 transition-colors"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </FormProvider>
                </div>
            </Card>
        </div>
    );
}