"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Copy, Plus, FileText, Receipt, Download, Mail } from "lucide-react";
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
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function DashboardListingPage() {
    const [data, setData] = useState<{
        proposals: any[];
        invoices: any[];
        otps: any[];
    }>({
        proposals: [],
        invoices: [],
        otps: []
    });
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ id: string; otp_id: string; type: 'proposal' | 'invoice' } | null>(null);
    const [search, setSearch] = useState("");
    const [clientFilter, setClientFilter] = useState("all");
    const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
    const router = useRouter();

    // Optimized data fetching with parallel requests and better error handling
    useEffect(() => {
        let isMounted = true; // Prevent state updates if component unmounts

        async function fetchAllData() {
            setLoading(true);

            try {
                // Parallel fetch all data at once
                const [proposalsRes, invoicesRes, otpsRes] = await Promise.all([
                    fetch("/api/proposals/listing", {
                        method: "GET",
                        cache: 'no-store', // Ensure fresh data
                        headers: {
                            'Cache-Control': 'no-cache',
                        }
                    }),
                    fetch("/api/invoices/listing", {
                        method: "GET",
                        cache: 'no-store',
                        headers: {
                            'Cache-Control': 'no-cache',
                        }
                    }),
                    fetch("/api/otps/listing", {
                        method: "GET",
                        cache: 'no-store',
                        headers: {
                            'Cache-Control': 'no-cache',
                        }
                    })
                ]);

                // Check if all requests were successful
                if (!proposalsRes.ok || !invoicesRes.ok || !otpsRes.ok) {
                    throw new Error('One or more API requests failed');
                }

                // Parse responses in parallel
                const [proposalsData, invoicesData, otpsData] = await Promise.all([
                    proposalsRes.json(),
                    invoicesRes.json(),
                    otpsRes.json()
                ]);

                // Only update state if component is still mounted
                if (isMounted) {
                    setData({
                        proposals: proposalsData.proposals || [],
                        invoices: invoicesData.invoices || [],
                        otps: otpsData.otps || []
                    });
                }
            } catch (err) {
                console.error("Failed to fetch data:", err);
                if (isMounted) {
                    setData({
                        proposals: [],
                        invoices: [],
                        otps: []
                    });
                    toast.error("Failed to load data. Please try again.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchAllData();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, []);

    // Optimized auth check with timeout
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                const res = await fetch("/api/auth/check", {
                    method: "GET",
                    credentials: "include",
                    signal: controller.signal,
                    cache: 'no-store'
                });

                clearTimeout(timeoutId);

                if (!res.ok) {
                    toast.error("You must be logged in to access this page.");
                    router.push("/auth/2.0/login");
                }
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    toast.error("Authentication check timed out.");
                } else {
                    toast.error("Authentication check failed.");
                }
                router.push("/auth/2.0/login");
            }
        };

        checkAuth();
    }, [router]);

    const sendInvoiceEmail = async (invoice: any) => {
        if (!invoice.bill_to_email) {
            toast.error('No email address found for this invoice.');
            return;
        }

        setSendingEmailId(invoice.id);

        try {
            const response = await fetch('/api/invoices/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    invoiceId: invoice.id,
                    recipientEmail: invoice.bill_to_email,
                    invoiceData: invoice,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(`Invoice email sent successfully to ${invoice.bill_to_email}!`);
            } else {
                toast.error(result.error || 'Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            toast.error('Failed to send email. Please try again.');
        } finally {
            setSendingEmailId(null);
        }
    };

    const updateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
        setUpdatingStatusId(invoiceId);

        try {
            const response = await fetch('/api/invoices/update-status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    invoiceId,
                    status: newStatus,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Optimistically update the UI
                setData(prevData => ({
                    ...prevData,
                    invoices: prevData.invoices.map(invoice =>
                        invoice.id === invoiceId
                            ? { ...invoice, status: newStatus }
                            : invoice
                    ),
                }));

                toast.success(`Invoice status updated to "${newStatus}"!`);
            } else {
                toast.error(result.error || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status. Please try again.');
        } finally {
            setUpdatingStatusId(null);
        }
    };

    // Memoized client names with better performance
    const clientNames = useMemo(() => {
        const proposalClients = data.proposals.map(p => p.client_name).filter(Boolean);
        const invoiceClients = data.invoices.map(i => i.bill_to_name).filter(Boolean);
        return [...new Set([...proposalClients, ...invoiceClients])];
    }, [data.proposals, data.invoices]);

    // Optimized filtering with early returns
    const filteredProposals = useMemo(() => {
        let filtered = data.proposals;

        // Early return if no filters applied
        if (clientFilter === "all" && !search.trim()) {
            return filtered;
        }

        // Apply client filter first (potentially smaller dataset)
        if (clientFilter !== "all") {
            filtered = filtered.filter(p => p.client_name === clientFilter);
        }

        // Apply search filter
        if (search.trim()) {
            const searchTerm = search.trim().toLowerCase();
            filtered = filtered.filter(p => {
                return (
                    p.title?.toLowerCase().includes(searchTerm) ||
                    p.client_name?.toLowerCase().includes(searchTerm) ||
                    p.overview?.toLowerCase().includes(searchTerm)
                );
            });
        }

        return filtered;
    }, [data.proposals, search, clientFilter]);

    // Optimized invoice filtering
    const filteredInvoices = useMemo(() => {
        let filtered = data.invoices;

        // Early return if no filters applied
        if (clientFilter === "all" && !search.trim()) {
            return filtered;
        }

        // Apply client filter first
        if (clientFilter !== "all") {
            filtered = filtered.filter(i => i.bill_to_name === clientFilter);
        }

        // Apply search filter
        if (search.trim()) {
            const searchTerm = search.trim().toLowerCase();
            filtered = filtered.filter(i => {
                return (
                    i.invoice_number?.toLowerCase().includes(searchTerm) ||
                    i.bill_to_name?.toLowerCase().includes(searchTerm) ||
                    i.service_type?.toLowerCase().includes(searchTerm) ||
                    i.work_reference?.toLowerCase().includes(searchTerm)
                );
            });
        }

        return filtered;
    }, [data.invoices, search, clientFilter]);

    // Create OTP lookup map for O(1) access instead of O(n) find operations
    const otpLookup = useMemo(() => {
        const lookup = new Map();
        data.otps.forEach(otp => {
            if (otp.proposal_id) {
                lookup.set(`proposal_${otp.proposal_id}`, otp);
            }
            if (otp.invoice_id) {
                lookup.set(`invoice_${otp.invoice_id}`, otp);
            }
        });
        return lookup;
    }, [data.otps]);

    const downloadInvoicePDF = async (invoice: any) => {
        setDownloadingId(invoice.id);

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);
            let yPosition = margin;

            // Helper functions
            const hexToRgb = (hex: string) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return { r, g, b };
            };

            const addText = (text: string, x: number = margin, fontSize: number = 10, isBold: boolean = false, color: string = '#000000', align: 'left' | 'center' | 'right' = 'left') => {
                pdf.setFontSize(fontSize);
                pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
                const rgb = hexToRgb(color);
                pdf.setTextColor(rgb.r, rgb.g, rgb.b);

                const lines = pdf.splitTextToSize(text, contentWidth);
                pdf.text(lines, x, yPosition, { align });
                yPosition += (lines.length * fontSize * 0.4) + 3;
                return lines.length;
            };

            // Dark header background (slate-700)
            pdf.setFillColor(51, 65, 85); // slate-700
            pdf.rect(0, 0, pageWidth, 80, 'F');

            // INVOICE badge (border + text)
            yPosition = 25;
            pdf.setDrawColor(145, 205, 73); // #91cd49
            pdf.setLineWidth(1);
            pdf.rect(margin, yPosition - 5, 30, 10, 'S');

            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(145, 205, 73);
            pdf.text('INVOICE', margin + 15, yPosition, { align: 'center' });

            yPosition += 15;

            // REAIV brand box (green background)
            pdf.setFillColor(145, 205, 73); // #91cd49
            pdf.rect(margin, yPosition - 5, 40, 15, 'F');

            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);
            pdf.text('REAIV', margin + 20, yPosition + 5, { align: 'center' });

            yPosition += 25;

            // Invoice details grid (2x2 layout)
            const leftColX = margin;
            const rightColX = pageWidth - margin - 60;

            // Row 1
            let detailY = yPosition;

            // Invoice Number (left)
            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(255, 255, 255, 0.7); // opacity effect
            pdf.text('INVOICE NUMBER', leftColX, detailY);

            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(145, 205, 73);
            pdf.text(invoice.invoice_number || 'N/A', leftColX, detailY + 5);

            // Issue Date (right)
            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(255, 255, 255, 0.7);
            pdf.text('ISSUE DATE', rightColX, detailY, { align: 'right' });

            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(145, 205, 73);
            pdf.text(new Date(invoice.issue_date).toLocaleDateString(), rightColX, detailY + 5, { align: 'right' });

            detailY += 15;

            // Work Reference (left)
            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(255, 255, 255, 0.7);
            pdf.text('WORK / REFERENCE', leftColX, detailY);

            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(145, 205, 73);
            const workRef = pdf.splitTextToSize(invoice.work_reference || 'N/A', 80);
            pdf.text(workRef, leftColX, detailY + 5);

            // Due Date (right)
            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(255, 255, 255, 0.7);
            pdf.text('DUE DATE', rightColX, detailY, { align: 'right' });

            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(145, 205, 73);
            pdf.text(new Date(invoice.due_date).toLocaleDateString(), rightColX, detailY + 5, { align: 'right' });

            yPosition = 90;

            // Amount Due Section (light green background)
            pdf.setFillColor(240, 253, 244); // green-50
            pdf.rect(0, yPosition, pageWidth, 40, 'F');

            // Green border at bottom
            pdf.setDrawColor(145, 205, 73);
            pdf.setLineWidth(2);
            pdf.line(0, yPosition + 40, pageWidth, yPosition + 40);

            yPosition += 10;

            // Amount Due label
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(107, 114, 128); // gray-600
            pdf.text(`AMOUNT DUE (${invoice.currency})`, pageWidth / 2, yPosition, { align: 'center' });

            yPosition += 8;

            // Large amount
            pdf.setFontSize(28);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(51, 65, 85); // slate-700
            pdf.text(formatCurrency(invoice.total_amount, invoice.currency), pageWidth / 2, yPosition, { align: 'center' });

            yPosition += 12;

            // Due date
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(107, 114, 128);
            pdf.text(`Due ${new Date(invoice.payment_due_date || invoice.due_date).toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });

            yPosition += 10;

            // Pay button (visual representation)
            pdf.setFillColor(145, 205, 73);
            pdf.rect(pageWidth / 2 - 30, yPosition - 5, 60, 12, 'F');

            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);
            pdf.text(`Pay ${formatCurrency(invoice.total_amount, invoice.currency)}`, pageWidth / 2, yPosition + 2, { align: 'center' });

            yPosition = 150;

            // Billing Information Section
            yPosition += 10;

            // BILLED TO (left column)
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(107, 114, 128);
            pdf.text('BILLED TO', margin, yPosition);

            yPosition += 8;

            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            pdf.text(invoice.bill_to_name || 'N/A', margin, yPosition);
            yPosition += 5;

            pdf.setFont('helvetica', 'normal');
            if (invoice.bill_to_title) {
                pdf.text(invoice.bill_to_title, margin, yPosition);
                yPosition += 5;
            }
            if (invoice.bill_to_address) {
                pdf.text(invoice.bill_to_address, margin, yPosition);
                yPosition += 5;
            }
            if (invoice.bill_to_email) {
                pdf.text(`Email: `, margin, yPosition);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(145, 205, 73);
                pdf.text(invoice.bill_to_email, margin + 15, yPosition);
                yPosition += 5;
            }
            if (invoice.bill_to_phone) {
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(0, 0, 0);
                pdf.text(`Phone: `, margin, yPosition);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(145, 205, 73);
                pdf.text(invoice.bill_to_phone, margin + 15, yPosition);
                yPosition += 5;
            }

            // SERVICE DETAILS (right column)
            const serviceY = 168;
            let currentServiceY = serviceY;

            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(107, 114, 128);
            pdf.text('SERVICE DETAILS', pageWidth / 2 + 10, currentServiceY);

            currentServiceY += 8;

            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);

            pdf.text('Service Type: ', pageWidth / 2 + 10, currentServiceY);
            pdf.setFont('helvetica', 'bold');
            pdf.text(invoice.service_type || 'N/A', pageWidth / 2 + 30, currentServiceY);
            currentServiceY += 5;

            if (invoice.projects) {
                pdf.setFont('helvetica', 'normal');
                pdf.text('Projects: ', pageWidth / 2 + 10, currentServiceY);
                pdf.setFont('helvetica', 'bold');
                pdf.text(invoice.projects, pageWidth / 2 + 25, currentServiceY);
                currentServiceY += 5;
            }

            if (invoice.billing_basis) {
                pdf.setFont('helvetica', 'normal');
                pdf.text('Billing Basis: ', pageWidth / 2 + 10, currentServiceY);
                pdf.setFont('helvetica', 'bold');
                pdf.text(invoice.billing_basis, pageWidth / 2 + 30, currentServiceY);
                currentServiceY += 5;
            }

            if (invoice.payment_method) {
                pdf.setFont('helvetica', 'normal');
                pdf.text('Payment Method: ', pageWidth / 2 + 10, currentServiceY);
                pdf.setFont('helvetica', 'bold');
                pdf.text(invoice.payment_method, pageWidth / 2 + 35, currentServiceY);
                currentServiceY += 5;
            }

            pdf.setFont('helvetica', 'normal');
            pdf.text('Currency: ', pageWidth / 2 + 10, currentServiceY);
            pdf.setFont('helvetica', 'bold');
            pdf.text(invoice.currency || 'PHP', pageWidth / 2 + 25, currentServiceY);

            yPosition = Math.max(yPosition, currentServiceY) + 20;

            // Invoice Items Section
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(51, 65, 85); // slate-700
            pdf.text('INVOICE ITEMS', margin, yPosition);

            // Underline
            pdf.setDrawColor(229, 231, 235); // gray-200
            pdf.setLineWidth(1);
            pdf.line(margin, yPosition + 3, pageWidth - margin, yPosition + 3);

            yPosition += 15;

            // Table headers (dark background)
            const tableStartY = yPosition;
            const headerHeight = 12;

            pdf.setFillColor(51, 65, 85); // slate-700
            pdf.rect(margin, yPosition, contentWidth, headerHeight, 'F');

            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);

            const descX = margin + 3;
            const qtyX = margin + (contentWidth * 0.55) + 5;
            const rateX = margin + (contentWidth * 0.7) + 5;
            const amountX = pageWidth - margin - 5;

            pdf.text('DESCRIPTION', descX, yPosition + 7);
            pdf.text('QTY', qtyX, yPosition + 7, { align: 'center' });
            pdf.text('RATE', rateX, yPosition + 7, { align: 'center' });
            pdf.text('AMOUNT', amountX, yPosition + 7, { align: 'right' });

            yPosition += headerHeight;

            pdf.setTextColor(0, 0, 0);
            pdf.setFont('helvetica', 'normal');

            // Safety check for invoice items
            const invoiceItems = invoice.items || [];

            if (invoiceItems.length === 0) {
                // If no items, show a default row
                const rowHeight = 15;

                pdf.setFillColor(255, 255, 255);
                pdf.rect(margin, yPosition, contentWidth, rowHeight, 'F');

                // Border
                pdf.setDrawColor(229, 231, 235);
                pdf.line(margin, yPosition + rowHeight, pageWidth - margin, yPosition + rowHeight);

                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(107, 114, 128); // gray text
                pdf.text('No items specified', descX, yPosition + 6);
                pdf.text('1', qtyX, yPosition + 6, { align: 'center' });
                pdf.text(formatCurrency(invoice.total_amount || 0, invoice.currency), rateX, yPosition + 6, { align: 'center' });
                pdf.text(formatCurrency(invoice.total_amount || 0, invoice.currency), amountX, yPosition + 6, { align: 'right' });

                yPosition += rowHeight;
            } else {
                // Process actual items
                invoiceItems.forEach((item: any, index: number) => {
                    const rowHeight = 15;

                    // Alternate row background
                    if (index % 2 === 0) {
                        pdf.setFillColor(255, 255, 255);
                    } else {
                        pdf.setFillColor(249, 250, 251);
                    }
                    pdf.rect(margin, yPosition, contentWidth, rowHeight, 'F');

                    // Border
                    pdf.setDrawColor(229, 231, 235);
                    pdf.line(margin, yPosition + rowHeight, pageWidth - margin, yPosition + rowHeight);

                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(51, 65, 85);
                    pdf.text(item.description || 'Service Item', descX, yPosition + 6);

                    if (item.detailed_description) {
                        pdf.setFontSize(8);
                        pdf.setFont('helvetica', 'normal');
                        pdf.setTextColor(107, 114, 128);
                        const detailLines = pdf.splitTextToSize(item.detailed_description, contentWidth * 0.5);
                        pdf.text(detailLines, descX, yPosition + 10);
                    }

                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(0, 0, 0);
                    pdf.text((item.quantity || 1).toString(), qtyX, yPosition + 6, { align: 'center' });
                    pdf.text(formatCurrency(item.rate || 0, invoice.currency), rateX, yPosition + 6, { align: 'center' });
                    pdf.text(formatCurrency(item.amount || 0, invoice.currency), amountX, yPosition + 6, { align: 'right' });

                    yPosition += rowHeight;
                });
            }

            // Subtotal row
            const summaryRowHeight = 10;
            pdf.setFillColor(249, 250, 251); // gray-50
            pdf.rect(margin, yPosition, contentWidth, summaryRowHeight, 'F');

            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            pdf.text('Subtotal', pageWidth - margin - 60, yPosition + 6);
            pdf.text(formatCurrency(invoice.subtotal || invoice.total_amount || 0, invoice.currency), amountX, yPosition + 6, { align: 'right' });
            yPosition += summaryRowHeight;

            // Tax row
            pdf.rect(margin, yPosition, contentWidth, summaryRowHeight, 'F');
            pdf.text('Taxes', pageWidth - margin - 60, yPosition + 6);
            pdf.text(invoice.tax_amount > 0 ? formatCurrency(invoice.tax_amount, invoice.currency) : '—', amountX, yPosition + 6, { align: 'right' });
            yPosition += summaryRowHeight;

            // Total row (dark background)
            pdf.setFillColor(51, 65, 85); // slate-700
            pdf.rect(margin, yPosition, contentWidth, summaryRowHeight + 2, 'F');

            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);
            pdf.text(`Amount Due (${invoice.currency})`, pageWidth - margin - 60, yPosition + 7);
            pdf.text(formatCurrency(invoice.total_amount, invoice.currency), amountX, yPosition + 7, { align: 'right' });

            yPosition += 25;

            // Payment Information Section
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(51, 65, 85);
            pdf.text('PAYMENT INFORMATION', margin, yPosition);

            pdf.setDrawColor(229, 231, 235);
            pdf.line(margin, yPosition + 3, pageWidth - margin, yPosition + 3);
            yPosition += 15;

            // Payment method box (amber background)
            pdf.setFillColor(255, 251, 235); // amber-50
            pdf.rect(margin, yPosition, contentWidth, 35, 'F');

            yPosition += 8;

            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(234, 88, 12); // orange-600
            pdf.text(invoice.payment_method || 'Bank Transfer', margin + 5, yPosition);

            yPosition += 8;

            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Payment Due: ${new Date(invoice.payment_due_date || invoice.due_date).toLocaleDateString()}`, margin + 5, yPosition);

            if (invoice.payment_reference) {
                yPosition += 6;
                pdf.text('Reference: ', margin + 5, yPosition);

                // Reference box
                pdf.setFillColor(220, 252, 231); // green-100
                pdf.rect(margin + 25, yPosition - 3, 40, 6, 'F');

                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(51, 65, 85);
                pdf.text(invoice.payment_reference, margin + 27, yPosition);
            }

            yPosition += 15;

            // Bank details (if available)
            if (invoice.bank_name || invoice.account_name || invoice.account_number) {
                pdf.setFillColor(255, 255, 255);
                pdf.setDrawColor(251, 146, 60); // orange-200
                pdf.rect(margin, yPosition, contentWidth, 25, 'F');
                pdf.rect(margin, yPosition, contentWidth, 25, 'S');

                yPosition += 6;

                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(51, 65, 85);
                pdf.text('Recipient Bank Details', margin + 5, yPosition);

                yPosition += 6;

                pdf.setFontSize(8);
                pdf.setFont('helvetica', 'normal');

                if (invoice.bank_name) {
                    pdf.text('Bank Name:', margin + 5, yPosition);
                    pdf.text(invoice.bank_name, margin + 25, yPosition);
                    yPosition += 4;
                }
                if (invoice.account_name) {
                    pdf.text('Account Name:', margin + 5, yPosition);
                    pdf.text(invoice.account_name, margin + 30, yPosition);
                    yPosition += 4;
                }
                if (invoice.account_number) {
                    pdf.text('Account Number:', margin + 5, yPosition);
                    pdf.text(invoice.account_number, margin + 35, yPosition);
                }
            }

            yPosition += 15;

            // Note section (blue background)
            pdf.setFillColor(239, 246, 255); // blue-50
            pdf.setDrawColor(96, 165, 250); // blue-400
            pdf.setLineWidth(2);
            pdf.line(margin, yPosition, margin, yPosition + 15);
            pdf.rect(margin + 2, yPosition, contentWidth - 2, 15, 'F');

            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            pdf.text('Note:', margin + 5, yPosition + 5);

            pdf.setFont('helvetica', 'normal');
            const noteText = 'This invoice is issued under the contingency schedule defined in the signed agreement. If the standard milestone schedule applies instead, please advise and a split invoice (USD demo + PHP final) will be issued accordingly.';
            const noteLines = pdf.splitTextToSize(noteText, contentWidth - 10);
            pdf.text(noteLines, margin + 15, yPosition + 5);

            // Footer (dark background like header)
            const footerY = pageHeight - 40;
            pdf.setFillColor(51, 65, 85); // slate-700
            pdf.rect(0, footerY, pageWidth, 40, 'F');

            pdf.setFontSize(20);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(145, 205, 73); // #91cd49
            pdf.text('reaiv', pageWidth / 2, footerY + 15, { align: 'center' });

            pdf.setFontSize(10);
            pdf.text('REAIV - Reimagine AI Ventures', pageWidth / 2, footerY + 22, { align: 'center' });

            pdf.setFontSize(8);
            pdf.setTextColor(255, 255, 255, 0.8);
            pdf.text('Think different. Build intelligent. Scale effortlessly.', pageWidth / 2, footerY + 28, { align: 'center' });

            pdf.setFontSize(6);
            pdf.setTextColor(255, 255, 255, 0.6);
            pdf.text('This invoice was generated using the REAIV template format.', pageWidth / 2, footerY + 35, { align: 'center' });

            // Download the PDF
            pdf.save(`Invoice_${invoice.invoice_number || invoice.id}.pdf`);
            toast.success('Invoice PDF downloaded successfully!');

        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    const openDeleteDialog = (itemId: string, otpId: string, type: 'proposal' | 'invoice') => {
        setSelectedItem({ id: itemId, otp_id: otpId, type });
        setDialogOpen(true);
    };

    const handleLogout = async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (res.ok) {
                toast.success("Logged out successfully!");
                router.push("/auth/2.0/login");
            } else {
                toast.error("Logout failed.");
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                toast.error("Logout request timed out.");
            } else {
                toast.error("Network error.");
            }
        }
    };

    // Optimized delete handler with better error handling
    const handleDelete = async () => {
        if (!selectedItem) return;

        setDeletingId(selectedItem.id);

        try {
            const endpoint = selectedItem.type === 'proposal' ? '/api/proposals/delete' : '/api/invoices/delete';
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const res = await fetch(endpoint, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    [`${selectedItem.type}Id`]: selectedItem.id,
                    otpId: selectedItem.otp_id,
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (res.ok) {
                // Optimistic update - immediately update UI
                setData(prevData => ({
                    ...prevData,
                    [selectedItem.type === 'proposal' ? 'proposals' : 'invoices']:
                        prevData[selectedItem.type === 'proposal' ? 'proposals' : 'invoices']
                            .filter(item => item.id !== selectedItem.id),
                    otps: prevData.otps.filter(otp => otp.id !== selectedItem.otp_id)
                }));
                toast.success(`${selectedItem.type === 'proposal' ? 'Proposal' : 'Invoice'} deleted successfully!`);
            } else {
                const errorData = await res.json().catch(() => ({}));
                toast.error(errorData.message || "Failed to delete item.");
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                toast.error("Delete request timed out.");
            } else {
                toast.error("Failed to delete item. Please try again.");
            }
        } finally {
            setDeletingId(null);
            setDialogOpen(false);
            setSelectedItem(null);
        }
    };

    // Memoized currency formatter to avoid recreation
    const formatCurrency = useMemo(() => {
        const formatters = new Map();
        return (amount: number, currency: string = 'PHP') => {
            if (!formatters.has(currency)) {
                formatters.set(currency, new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: currency,
                }));
            }
            return formatters.get(currency).format(amount);
        };
    }, []);

    // Memoized date formatter
    const formatDate = useMemo(() => {
        const formatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        return (dateString: string) => formatter.format(new Date(dateString));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-4 py-10">
            <Toaster richColors position="top-center" />
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-black">
                        Dashboard <span style={{ color: '#8CE232' }}>Listing</span>
                    </h1>
                    <div className="flex gap-4">
                        <Button
                            style={{ backgroundColor: '#8CE232', color: '#000000' }}
                            className="font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
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
                            style={{ borderColor: '#8CE232', color: '#8CE232' }}
                            className="font-bold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
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
                        style={{ borderColor: '#8CE232' }}
                        className="md:w-1/2 w-full bg-white/80 focus:border-green-400 focus:ring-green-300"
                    />
                    <Select value={clientFilter} onValueChange={setClientFilter}>
                        <SelectTrigger
                            style={{ borderColor: '#8CE232' }}
                            className="md:w-1/4 w-full bg-white/80 focus:border-green-400"
                        >
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
                        <FileText style={{ color: '#8CE232' }} size={24} />
                        <h2 className="text-2xl font-bold text-black">
                            Proposals <span style={{ color: '#8CE232' }}>({filteredProposals.length})</span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8CE232] mx-auto mb-4"></div>
                                <p className="text-slate-600">Loading...</p>
                            </div>
                        </div>
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
                                    const otp = otpLookup.get(`proposal_${proposal.id}`);
                                    return (
                                        <TableRow key={proposal.id} className="hover:bg-green-50 transition">
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
                                                            style={{ color: '#8CE232' }}
                                                            className="hover:bg-green-50"
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
                                                    style={{ borderColor: '#8CE232' }}
                                                    className="px-4 text-black hover:bg-green-50"
                                                    onClick={() => router.push(`/dashboard/proposal/edit/${proposal.id}`)}
                                                    aria-label="Edit Proposal"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="px-4"
                                                    disabled={deletingId === proposal.id}
                                                    onClick={() => openDeleteDialog(proposal.id, otp?.id || '', 'proposal')}
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

                {/* Invoices Section with PDF Download */}
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
                                    const otp = otpLookup.get(`invoice_${invoice.id}`);
                                    return (
                                        <TableRow key={invoice.id} className="hover:bg-green-50 transition">
                                            <TableCell className="text-center font-semibold">{idx + 1}</TableCell>
                                            <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                                            <TableCell>{invoice.bill_to_name}</TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(invoice.total_amount, invoice.currency)}
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={invoice.status}
                                                    onValueChange={(newStatus) => updateInvoiceStatus(invoice.id, newStatus)}
                                                    disabled={updatingStatusId === invoice.id}
                                                >
                                                    <SelectTrigger className="w-28 h-8 p-0 border-none bg-transparent">
                                                        <SelectValue asChild>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer ${invoice.status === 'paid'
                                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                    : invoice.status === 'overdue'
                                                                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                                                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                                }`}>
                                                                {updatingStatusId === invoice.id ? (
                                                                    <span className="flex items-center gap-1">
                                                                        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                                                                        Updating...
                                                                    </span>
                                                                ) : (
                                                                    invoice.status
                                                                )}
                                                            </span>
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">
                                                            <span className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                                Pending
                                                            </span>
                                                        </SelectItem>
                                                        <SelectItem value="paid">
                                                            <span className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                Paid
                                                            </span>
                                                        </SelectItem>
                                                        <SelectItem value="overdue">
                                                            <span className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                                Overdue
                                                            </span>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
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
                                                            style={{ color: '#8CE232' }}
                                                            className="hover:bg-green-50"
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
                                                {invoice.status !== 'paid' && (
                                                    <Button
                                                        variant="outline"
                                                        className="px-3 text-green-600 border-green-600 hover:bg-green-50"
                                                        disabled={sendingEmailId === invoice.id || !invoice.bill_to_email}
                                                        onClick={() => sendInvoiceEmail(invoice)}
                                                        aria-label="Send Invoice Email"
                                                        title={!invoice.bill_to_email ? 'No email address available' : 'Send invoice via email'}
                                                    >
                                                        {sendingEmailId === invoice.id ? (
                                                            "Sending..."
                                                        ) : (
                                                            <>
                                                                <Mail size={14} />
                                                                Send Email
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                                {/* <Button
                                                    variant="outline"
                                                    className="px-3 text-blue-600 border-blue-600 hover:bg-blue-50"
                                                    disabled={downloadingId === invoice.id}
                                                    onClick={() => downloadInvoicePDF(invoice)}
                                                    aria-label="Download Invoice PDF"
                                                >
                                                    {downloadingId === invoice.id ? (
                                                        "Generating..."
                                                    ) : (
                                                        <>
                                                            <Download size={14} />
                                                            PDF
                                                        </>
                                                    )}
                                                </Button> */}
                                                <Button
                                                    variant="secondary"
                                                    style={{ borderColor: '#8CE232' }}
                                                    className="px-4 text-black hover:bg-green-50"
                                                    onClick={() => router.push(`/dashboard/invoice/edit/${invoice.id}`)}
                                                    aria-label="Edit Invoice"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="px-4"
                                                    disabled={deletingId === invoice.id}
                                                    onClick={() => openDeleteDialog(invoice.id, otp?.id || '', 'invoice')}
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