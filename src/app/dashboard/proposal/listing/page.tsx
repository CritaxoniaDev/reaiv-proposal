"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Copy } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export default function ProposalListingPage() {
    const [proposals, setProposals] = useState<any[]>([]);
    const [otps, setOtps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState<{ id: string; otp_id: string } | null>(null);
    const [search, setSearch] = useState("");
    const [clientFilter, setClientFilter] = useState("all");
    const router = useRouter();

    useEffect(() => {
        async function fetchProposals() {
            setLoading(true);
            try {
                const res = await fetch("/api/proposals/listing");
                const json = await res.json();
                setProposals(json.proposals || []);
                setOtps(json.otps || []);
            } catch (err) {
                setProposals([]);
                setOtps([]);
            }
            setLoading(false);
        }
        fetchProposals();
    }, []);

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

    // Unique client names for filter dropdown
    const clientNames = useMemo(() => {
        const names = proposals.map(p => p.client_name).filter(Boolean);
        return Array.from(new Set(names));
    }, [proposals]);

    // Filtered and searched proposals
    const filteredProposals = useMemo(() => {
        let filtered = proposals;
        if (clientFilter !== "all") {
            filtered = filtered.filter(p => p.client_name === clientFilter);
        }
        if (search.trim()) {
            const s = search.trim().toLowerCase();
            filtered = filtered.filter(
                p =>
                    p.title?.toLowerCase().includes(s) ||
                    p.client_name?.toLowerCase().includes(s) ||
                    p.overview?.toLowerCase().includes(s)
            );
        }
        return filtered;
    }, [proposals, search, clientFilter]);

    const openDeleteDialog = (proposalId: string, otpId: string) => {
        setSelectedProposal({ id: proposalId, otp_id: otpId });
        setDialogOpen(true);
    };

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                toast.success("Logged out successfully!");
                router.push("/auth/2.0/proposal/login");
            } else {
                toast.error("Logout failed.");
            }
        } catch {
            toast.error("Network error.");
        }
    };

    const handleDelete = async () => {
        if (!selectedProposal) return;
        setDeletingId(selectedProposal.id);
        try {
            const res = await fetch("/api/proposals/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proposalId: selectedProposal.id,
                    otpId: selectedProposal.otp_id,
                }),
            });
            if (res.ok) {
                setProposals(proposals.filter(p => p.id !== selectedProposal.id));
            }
        } catch {
            // Optionally handle error
        }
        setDeletingId(null);
        setDialogOpen(false);
        setSelectedProposal(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#eaffd0] via-white to-[#8CE232]/10 px-4 py-10">
            <Toaster richColors position="top-center" />
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-black">
                        Proposals <span className="text-[#8CE232]">Listing</span>
                    </h1>
                    <div className="flex gap-4">
                        <Button
                            className="bg-[#8CE232] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#8CE232]/90 transition-colors"
                            onClick={() => router.push("/dashboard/proposal/create")}
                        >
                            + Create Proposal
                        </Button>
                        <Button
                            variant="outline"
                            className="border-[#8CE232] text-[#8CE232] font-bold px-6 py-3 rounded-lg hover:bg-[#8CE232]/10 transition-colors"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
                    <Input
                        type="text"
                        placeholder="Search by title, client, or overview..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="md:w-1/2 w-full bg-white/80 border-[#8CE232] focus:border-[#8CE232] focus:ring-[#8CE232]/30"
                    />
                    <Select value={clientFilter} onValueChange={setClientFilter}>
                        <SelectTrigger className="md:w-1/4 w-full bg-white/80 border-[#8CE232] focus:border-[#8CE232]">
                            {clientFilter === "all" ? "All Clients" : clientFilter}
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Clients</SelectItem>
                            {clientNames.map(name => (
                                <SelectItem key={name} value={name}>{name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {loading ? (
                    <div className="text-center text-slate-500 py-20">Loading proposals...</div>
                ) : filteredProposals.length === 0 ? (
                    <div className="text-center text-slate-500 py-20">No proposals found.</div>
                ) : (
                    <>
                        <Table className="bg-white rounded-xl border border-slate-200 shadow">
                            <TableCaption>All proposals in the system</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12 text-center">#</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Overview</TableHead>
                                    <TableHead>OTP</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProposals.map((proposal, idx) => {
                                    const otp = proposal.otps || otps.find(o => o.proposal_id === proposal.id);
                                    return (
                                        <TableRow key={proposal.id} className="hover:bg-[#eaffd0]/40 transition">
                                            <TableCell className="text-center font-semibold">{idx + 1}</TableCell>
                                            <TableCell className="font-medium">{proposal.title}</TableCell>
                                            <TableCell>{proposal.client_name}</TableCell>
                                            <TableCell className="max-w-[300px] truncate">{proposal.overview}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                                                        {otp?.code || <span className="text-slate-400">No OTP</span>}
                                                    </span>
                                                    {otp?.code && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-[#8CE232] hover:bg-[#eaffd0]/60"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(otp.code);
                                                                toast.success("OTP copied!");
                                                            }}
                                                            aria-label="Copy OTP"
                                                        >
                                                            <Copy size={16} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center flex gap-2 justify-center">
                                                {/* <Button
                                                    variant="outline"
                                                    className="text-[#8CE232] border-[#8CE232] hover:bg-[#8CE232]/10"
                                                    disabled={!otp?.code}
                                                    title={!otp?.code ? "No OTP code for this proposal" : ""}
                                                    onClick={async () => {
                                                        const otpCode = otp?.code;
                                                        if (!otpCode) return;
                                                        const res = await fetch("/api/auth/otp", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ code: otpCode }),
                                                        });
                                                        const data = await res.json();
                                                        if (data.success && data.id) {
                                                            window.location.href = `/proposal/${proposal.id}`;
                                                        } else {
                                                            alert("Invalid or missing OTP code for this proposal.");
                                                        }
                                                    }}
                                                >
                                                    View
                                                </Button> */}
                                                {/* Edit Button */}
                                                <Button
                                                    variant="secondary"
                                                    className="px-4 text-black border-[#8CE232] hover:bg-[#eaffd0]/60"
                                                    onClick={() => router.push(`/dashboard/proposal/edit/${proposal.id}`)}
                                                    aria-label="Edit Proposal"
                                                >
                                                    Edit
                                                </Button>
                                                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            className="px-4"
                                                            disabled={deletingId === proposal.id}
                                                            onClick={() => openDeleteDialog(proposal.id, otp?.id)}
                                                        >
                                                            {deletingId === proposal.id ? "Deleting..." : "Delete"}
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Delete Proposal</DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you want to delete this proposal and its connected OTP? This action cannot be undone.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <DialogClose asChild>
                                                                <Button variant="outline">Cancel</Button>
                                                            </DialogClose>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={handleDelete}
                                                                disabled={deletingId === selectedProposal?.id}
                                                            >
                                                                {deletingId === selectedProposal?.id ? "Deleting..." : "Delete"}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </>
                )}
            </div>
        </div>
    );
}