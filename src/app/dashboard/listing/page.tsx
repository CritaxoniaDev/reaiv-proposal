"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Copy, Plus, FileText, Receipt } from "lucide-react";
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

export default function DashboardListingPage() {
    const [proposals, setProposals] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [otps, setOtps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ id: string; otp_id: string; type: 'proposal' | 'invoice' } | null>(null);
    const [search, setSearch] = useState("");
    const [clientFilter, setClientFilter] = useState("all");
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Fetch proposals
                const proposalsRes = await fetch("/api/proposals/listing");
                const proposalsJson = await proposalsRes.json();
                setProposals(proposalsJson.proposals || []);
                
                // Fetch invoices
                const invoicesRes = await fetch("/api/invoices/listing");
                const invoicesJson = await invoicesRes.json();
                setInvoices(invoicesJson.invoices || []);
                
                // Fetch all OTPs
                const otpsRes = await fetch("/api/otps/listing");
                const otpsJson = await otpsRes.json();
                setOtps(otpsJson.otps || []);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setProposals([]);
                setInvoices([]);
                setOtps([]);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch("/api/auth/check", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                toast.error("You must be logged in to access this page.");
                router.push("/auth/2.0/login");
            }
        };

        checkAuth();
    }, [router]);

    // Unique client names for filter dropdown (from both proposals and invoices)
    const clientNames = useMemo(() => {
        const proposalClients = proposals.map(p => p.client_name).filter(Boolean);
        const invoiceClients = invoices.map(i => i.bill_to_name).filter(Boolean);
        const allClients = [...proposalClients, ...invoiceClients];
        return Array.from(new Set(allClients));
    }, [proposals, invoices]);

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

    // Filtered and searched invoices
    const filteredInvoices = useMemo(() => {
        let filtered = invoices;
        if (clientFilter !== "all") {
            filtered = filtered.filter(i => i.bill_to_name === clientFilter);
        }
        if (search.trim()) {
            const s = search.trim().toLowerCase();
            filtered = filtered.filter(
                i =>
                    i.invoice_number?.toLowerCase().includes(s) ||
                    i.bill_to_name?.toLowerCase().includes(s) ||
                    i.service_type?.toLowerCase().includes(s) ||
                    i.work_reference?.toLowerCase().includes(s)
            );
        }
        return filtered;
    }, [invoices, search, clientFilter]);

    const openDeleteDialog = (itemId: string, otpId: string, type: 'proposal' | 'invoice') => {
        setSelectedItem({ id: itemId, otp_id: otpId, type });
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
                router.push("/auth/2.0/login");
            } else {
                toast.error("Logout failed.");
            }
        } catch {
            toast.error("Network error.");
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;
        setDeletingId(selectedItem.id);
        try {
            const endpoint = selectedItem.type === 'proposal' ? '/api/proposals/delete' : '/api/invoices/delete';
            const res = await fetch(endpoint, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    [`${selectedItem.type}Id`]: selectedItem.id,
                    otpId: selectedItem.otp_id,
                }),
            });
            if (res.ok) {
                if (selectedItem.type === 'proposal') {
                    setProposals(proposals.filter(p => p.id !== selectedItem.id));
                } else {
                    setInvoices(invoices.filter(i => i.id !== selectedItem.id));
                }
            }
        } catch {
            // Optionally handle error
        }
        setDeletingId(null);
        setDialogOpen(false);
        setSelectedItem(null);
    };

    const formatCurrency = (amount: number, currency: string = 'PHP') => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#eaffd0] via-white to-[#8CE232]/10 px-4 py-10">
            <Toaster richColors position="top-center" />
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-black">
                        Dashboard <span className="text-[#8CE232]">Listing</span>
                    </h1>
                    <div className="flex gap-4">
                        <Button
                            className="bg-[#8CE232] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#8CE232]/90 transition-colors flex items-center gap-2"
                            onClick={() => router.push("/dashboard/proposal/create")}
                        >
                            <Plus size={16} />
                            Create Proposal
                        </Button>
                        <Button
                            className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            onClick={() => router.push("/dashboard/invoice/create")}
                        >
                            <Receipt size={16} />
                            Create Invoice
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

                {/* Search and Filter Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
                    <Input
                        type="text"
                        placeholder="Search proposals and invoices..."
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

                {/* Proposals Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="text-[#8CE232]" size={24} />
                        <h2 className="text-2xl font-bold text-black">
                            Proposals <span className="text-[#8CE232]">({filteredProposals.length})</span>
                        </h2>
                    </div>
                    
                    {loading ? (
                        <div className="text-center text-slate-500 py-20">Loading proposals...</div>
                    ) : filteredProposals.length === 0 ? (
                        <div className="text-center text-slate-500 py-20 bg-white rounded-xl border border-slate-200">
                            No proposals found.
                        </div>
                    ) : (
                        <Table className="bg-white rounded-xl border border-slate-200 shadow">
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
                                    const otp = otps.find(o => o.proposal_id === proposal.id);
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
                                                <Button
                                                    variant="secondary"
                                                    className="px-4 text-black border-[#8CE232] hover:bg-[#eaffd0]/60"
                                                    onClick={() => router.push(`/dashboard/proposal/edit/${proposal.id}`)}
                                                    aria-label="Edit Proposal"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="px-4"
                                                    disabled={deletingId === proposal.id}
                                                    onClick={() => openDeleteDialog(proposal.id, otp?.id, 'proposal')}
                                                >
                                                    {deletingId === proposal.id ? "Deleting..." : "Delete"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* Invoices Section */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <Receipt className="text-blue-600" size={24} />
                        <h2 className="text-2xl font-bold text-black">
                            Invoices <span className="text-blue-600">({filteredInvoices.length})</span>
                        </h2>
                    </div>
                    
                    {loading ? (
                        <div className="text-center text-slate-500 py-20">Loading invoices...</div>
                    ) : filteredInvoices.length === 0 ? (
                        <div className="text-center text-slate-500 py-20 bg-white rounded-xl border border-slate-200">
                            No invoices found.
                        </div>
                    ) : (
                        <Table className="bg-white rounded-xl border border-slate-200 shadow">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12 text-center">#</TableHead>
                                    <TableHead>Invoice Number</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>OTP</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInvoices.map((invoice, idx) => {
                                    const otp = otps.find(o => o.invoice_id === invoice.id);
                                    return (
                                        <TableRow key={invoice.id} className="hover:bg-[#eaffd0]/40 transition">
                                            <TableCell className="text-center font-semibold">{idx + 1}</TableCell>
                                            <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                                            <TableCell>{invoice.bill_to_name}</TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(invoice.total_amount, invoice.currency)}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    invoice.status === 'paid' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : invoice.status === 'overdue'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {invoice.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>{formatDate(invoice.due_date)}</TableCell>
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
                                                <Button
                                                    variant="secondary"
                                                    className="px-4 text-black border-[#8CE232] hover:bg-[#eaffd0]/60"
                                                    onClick={() => router.push(`/dashboard/invoice/edit/${invoice.id}`)}
                                                    aria-label="Edit Invoice"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="px-4"
                                                    disabled={deletingId === invoice.id}
                                                    onClick={() => openDeleteDialog(invoice.id, otp?.id, 'invoice')}
                                                >
                                                    {deletingId === invoice.id ? "Deleting..." : "Delete"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* Delete Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete {selectedItem?.type === 'proposal' ? 'Proposal' : 'Invoice'}</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this {selectedItem?.type} and its connected OTP? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={deletingId === selectedItem?.id}
                            >
                                {deletingId === selectedItem?.id ? "Deleting..." : "Delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}