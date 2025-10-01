"use client";

import { useState, useEffect } from "react";
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
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, MinusCircle, Receipt, Calendar, DollarSign } from "lucide-react";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { Toaster, toast } from "sonner";

type InvoiceFormValues = {
    invoice_number: string;
    issue_date: string;
    due_date: string;
    work_reference: string;

    // Billing Information
    bill_to_name: string;
    bill_to_title?: string;
    bill_to_address?: string;
    bill_to_email?: string;
    bill_to_phone?: string;

    // Service Details
    service_type: string;
    projects?: string;
    billing_basis?: string;
    payment_method?: string;
    currency: string;
    service_notes?: string;

    // Financial
    subtotal: number;
    tax_amount: number;
    total_amount: number;

    // Payment Information
    payment_due_date?: string;
    payment_reference?: string;
    bank_name?: string;
    account_name?: string;
    account_number?: string;
    country?: string;

    // Status
    status: string;

    // Items
    items: {
        description: string;
        detailed_description?: string;
        quantity: number;
        rate: number;
        amount: number;
    }[];
};

export default function CreateInvoicePage() {
    const router = useRouter();
    const [items, setItems] = useState<InvoiceFormValues["items"]>([
        { description: "", detailed_description: "", quantity: 1, rate: 0, amount: 0 }
    ]);

    // Check if the user is logged in
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

    const form = useForm<InvoiceFormValues>({
        defaultValues: {
            invoice_number: "",
            issue_date: new Date().toISOString().split('T')[0],
            due_date: "",
            work_reference: "",
            bill_to_name: "",
            bill_to_title: "",
            bill_to_address: "",
            bill_to_email: "",
            bill_to_phone: "",
            service_type: "",
            projects: "",
            billing_basis: "",
            payment_method: "Bank Transfer",
            currency: "PHP",
            service_notes: "",
            subtotal: 0,
            tax_amount: 0,
            total_amount: 0,
            payment_due_date: "",
            payment_reference: "",
            bank_name: "",
            account_name: "",
            account_number: "",
            country: "Philippines",
            status: "pending",
            items: items,
        },
    });

    // Generate invoice number automatically
    useEffect(() => {
        const generateInvoiceNumber = () => {
            const year = new Date().getFullYear();
            const month = String(new Date().getMonth() + 1).padStart(2, '0');
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `REAIV-${year}-${month}-${random}`;
        };

        const generateWorkReference = () => {
            const year = new Date().getFullYear();
            const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
            const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
            return `WR-${year}-${timestamp}-${random}`;
        };

        if (!form.watch("invoice_number")) {
            form.setValue("invoice_number", generateInvoiceNumber());
        }

        if (!form.watch("work_reference")) {
            form.setValue("work_reference", generateWorkReference());
        }
    }, []);

    useEffect(() => {
        const paymentMethod = form.watch("payment_method");
        const invoiceNumber = form.watch("invoice_number");

        if (paymentMethod && invoiceNumber) {
            // Extract the payment method prefix (e.g., "Bank Transfer" -> "BT")
            const methodPrefix = paymentMethod
                .split(' ')
                .map(word => word.charAt(0).toUpperCase())
                .join('');

            // Extract the numeric part from invoice number
            const invoiceSuffix = invoiceNumber.split('-').pop() || '';

            // Generate a timestamp component (last 4 digits of current timestamp)
            const timestamp = Date.now().toString().slice(-4);

            // Create the payment reference
            const reference = `${methodPrefix}-${invoiceSuffix}-${timestamp}`;

            // Update the form
            form.setValue("payment_reference", reference);
        }
    }, [form.watch("payment_method"), form.watch("invoice_number")]);

    // Calculate totals when items change
    useEffect(() => {
        const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
        const taxAmount = form.watch("tax_amount") || 0;
        const total = subtotal + taxAmount;

        form.setValue("subtotal", subtotal);
        form.setValue("total_amount", total);
        form.setValue("items", items);
    }, [items, form.watch("tax_amount")]);

    // Set payment due date same as due date by default
    useEffect(() => {
        const dueDate = form.watch("due_date");
        if (dueDate && !form.watch("payment_due_date")) {
            form.setValue("payment_due_date", dueDate);
        }
    }, [form.watch("due_date")]);

    // Item management functions
    const addNewItem = () => {
        setItems(prev => [...prev, {
            description: "",
            detailed_description: "",
            quantity: 1,
            rate: 0,
            amount: 0
        }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(prev => prev.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index: number, field: keyof InvoiceFormValues["items"][0], value: any) => {
        setItems(prev => prev.map((item, i) => {
            if (i === index) {
                const updatedItem = { ...item, [field]: value };

                // Recalculate amount when quantity or rate changes
                if (field === 'quantity' || field === 'rate') {
                    updatedItem.amount = updatedItem.quantity * updatedItem.rate;
                }

                return updatedItem;
            }
            return item;
        }));
    };

    const handleSubmit = async (data: InvoiceFormValues) => {
        toast.dismiss();

        // Validation
        if (items.length === 0 || items.some(item => !item.description.trim())) {
            toast.error("Please add at least one item with a description.");
            return;
        }

        if (data.total_amount <= 0) {
            toast.error("Invoice total must be greater than zero.");
            return;
        }

        // Validate required payment information
        if (!data.payment_method) {
            toast.error("Payment method is required.");
            return;
        }

        if (!data.payment_due_date) {
            toast.error("Payment due date is required.");
            return;
        }

        if (!data.bank_name) {
            toast.error("Bank name is required.");
            return;
        }

        if (!data.account_name) {
            toast.error("Account name is required.");
            return;
        }

        if (!data.account_number) {
            toast.error("Account number is required.");
            return;
        }

        if (!data.country) {
            toast.error("Country is required.");
            return;
        }

        try {
            const res = await fetch("/api/invoices/create", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                const result = await res.json();
                const otpCode = result.otp?.code;
                toast.success("Invoice created successfully!");
                form.reset();
                if (otpCode) {
                    router.push(`/dashboard/invoice/confirmation?otp=${otpCode}`);
                } else {
                    router.push("/dashboard/listing");
                }
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || "Failed to create invoice.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "Not set";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number, currency?: string) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: currency || form.watch("currency") || 'PHP',
        }).format(amount || 0);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
            <Toaster richColors position="top-center" />
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Form */}
                <Card className="p-8 shadow-xl border border-slate-200 bg-white rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Receipt className="text-[#8CE232]" size={32} />
                        <h2 className="text-3xl tracking-tighter font-bold text-slate-900">Create Invoice</h2>
                    </div>

                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            {/* Invoice Header Information */}
                            <Card className="p-6 border border-slate-300 rounded-xl bg-gradient-to-br from-[#8CE232]/5 to-transparent">
                                <h3 className="text-lg font-semibold mb-4 text-[#8CE232] flex items-center gap-2">
                                    <Receipt size={20} />
                                    Invoice Details
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormItem>
                                        <div className="flex items-center gap-1">
                                            <FormLabel>Invoice Number (Auto Generated)</FormLabel>
                                            <span className="text-red-500 text-sm font-semibold">*</span>
                                        </div>
                                        <FormControl>
                                            <Input
                                                {...form.register("invoice_number", { required: true })}
                                                placeholder="REAIV-2025-001" disabled
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    <FormItem>
                                        <div className="flex items-center gap-1">
                                            <FormLabel>Work Reference (Auto Generated)</FormLabel>
                                            <span className="text-red-500 text-sm font-semibold">*</span>
                                        </div>
                                        <FormControl>
                                            <Input
                                                {...form.register("work_reference", { required: true })}
                                                placeholder="Project reference or contract ID" disabled
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    <FormItem>
                                        <div className="flex items-center gap-1">
                                            <FormLabel>Issue Date</FormLabel>
                                            <span className="text-red-500 text-sm font-semibold">*</span>
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...form.register("issue_date", { required: true })}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    <FormItem>
                                        <div className="flex items-center gap-1">
                                            <FormLabel>Due Date</FormLabel>
                                            <span className="text-red-500 text-sm font-semibold">*</span>
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...form.register("due_date", { required: true })}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </div>
                            </Card>

                            {/* Billing Information */}
                            <Card className="p-6 border border-slate-300 rounded-xl bg-white">
                                <h3 className="text-lg font-semibold mb-4 text-[#8CE232]">Billing Information</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormItem className="md:col-span-2">
                                        <div className="flex items-center gap-1">
                                            <FormLabel>Client Name</FormLabel>
                                            <span className="text-red-500 text-sm font-semibold">*</span>
                                        </div>
                                        <FormControl>
                                            <Input
                                                {...form.register("bill_to_name", { required: true })}
                                                placeholder="Client or company name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel>Title/Position</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register("bill_to_title")}
                                                placeholder="Job title or position"
                                            />
                                        </FormControl>
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                {...form.register("bill_to_email")}
                                                placeholder="client@example.com"
                                            />
                                        </FormControl>
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register("bill_to_phone")}
                                                placeholder="+63 XXX XXX XXXX"
                                            />
                                        </FormControl>
                                    </FormItem>
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...form.register("bill_to_address")}
                                                placeholder="Complete billing address"
                                                rows={3}
                                            />
                                        </FormControl>
                                    </FormItem>
                                </div>
                            </Card>

                            {/* Service Details */}
                            <Card className="p-6 border border-slate-300 rounded-xl bg-white">
                                <h3 className="text-lg font-semibold mb-4 text-[#8CE232]">Service Details</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormItem>
                                        <div className="flex items-center gap-1">
                                            <FormLabel>Service Type</FormLabel>
                                            <span className="text-red-500 text-sm font-semibold">*</span>
                                        </div>
                                        <FormControl>
                                            <Input
                                                {...form.register("service_type", { required: true })}
                                                placeholder="e.g., Software Development Services"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel>Projects</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register("projects")}
                                                placeholder="Project names or descriptions"
                                            />
                                        </FormControl>
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel>Billing Basis</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={(value) => form.setValue("billing_basis", value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select billing basis" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Fixed Price">Fixed Price</SelectItem>
                                                    <SelectItem value="Hourly Rate">Hourly Rate</SelectItem>
                                                    <SelectItem value="Milestone Based">Milestone Based</SelectItem>
                                                    <SelectItem value="Contingency Provision">Contingency Provision</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <FormControl>
                                            <Select
                                                defaultValue="PHP"
                                                onValueChange={(value) => form.setValue("currency", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PHP">PHP</SelectItem>
                                                    <SelectItem value="USD">USD</SelectItem>
                                                    <SelectItem value="EUR">EUR</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Service Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...form.register("service_notes")}
                                                placeholder="Additional notes about the services provided"
                                                rows={3}
                                            />
                                        </FormControl>
                                    </FormItem>
                                </div>
                            </Card>

                            {/* Invoice Items */}
                            <Card className="p-6 border border-slate-300 rounded-xl bg-white">
                                <h3 className="text-lg font-semibold mb-4 text-[#8CE232] flex items-center gap-2">
                                    <DollarSign size={20} />
                                    Invoice Items
                                </h3>

                                <div className="space-y-4">
                                    {items.map((item, index) => (
                                        <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="font-semibold text-sm text-slate-600">Item #{index + 1}</span>
                                                <Button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:bg-red-100"
                                                    disabled={items.length === 1}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-3">
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel>Description *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            value={item.description}
                                                            onChange={(e) => updateItem(index, "description", e.target.value)}
                                                            placeholder="Item description"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                                <FormItem>
                                                    <FormLabel>Quantity</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                                <FormItem>
                                                    <FormLabel>Rate</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={item.rate}
                                                            onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
                                                            placeholder="0.00"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                                <FormItem>
                                                    <FormLabel>Amount</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            value={formatCurrency(item.amount)}
                                                            disabled
                                                            className="bg-gray-100"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel>Detailed Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            value={item.detailed_description || ""}
                                                            onChange={(e) => updateItem(index, "detailed_description", e.target.value)}
                                                            placeholder="Optional detailed description"
                                                            rows={2}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    type="button"
                                    onClick={addNewItem}
                                    variant="outline"
                                    className="mt-4 w-full border-[#8CE232] text-[#8CE232] hover:bg-[#8CE232]/10"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Add Item
                                </Button>
                            </Card>

                            {/* Financial Summary */}
                            <Card className="p-6 border border-slate-300 rounded-xl bg-gradient-to-br from-green-50 to-transparent">
                                <h3 className="text-lg font-semibold mb-4 text-[#8CE232]">Financial Summary</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <FormItem>
                                        <FormLabel>Subtotal</FormLabel>
                                        <FormControl>
                                            <Input
                                                value={formatCurrency(form.watch("subtotal"))}
                                                disabled
                                                className="bg-gray-100 font-semibold"
                                            />
                                        </FormControl>
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel>Tax Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                {...form.register("tax_amount", { valueAsNumber: true })}
                                                placeholder="0.00"
                                            />
                                        </FormControl>
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel>Total Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                value={formatCurrency(form.watch("total_amount"))}
                                                disabled
                                                className="bg-[#8CE232]/20 font-bold text-lg"
                                            />
                                        </FormControl>
                                    </FormItem>
                                </div>
                            </Card>

                            {/* Payment Information */}
                            <Card className="p-6 border border-slate-300 rounded-xl bg-white">
                                <h3 className="text-lg font-semibold mb-4 text-[#8CE232]">Payment Information</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormItem>
                                        <div className="flex items-center gap-1">
                                            <FormLabel>Payment Method</FormLabel>
                                            <span className="text-red-500 text-sm font-semibold">*</span>
                                        </div>
                                        <FormControl>
                                            <Select onValueChange={(value) => form.setValue("payment_method", value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select payment method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                                    <SelectItem value="Bank Transfer (Wise)">Bank Transfer (Wise)</SelectItem>
                                                    <SelectItem value="PayPal">PayPal</SelectItem>
                                                    <SelectItem value="GCash">GCash</SelectItem>
                                                    <SelectItem value="Cash">Cash</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    <FormItem>
                                        <div className="flex items-center gap-1">
                                            <FormLabel>Payment Due Date</FormLabel>
                                            <span className="text-red-500 text-sm font-semibold">*</span>
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...form.register("payment_due_date", { required: true })}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Payment Reference</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register("payment_reference")}
                                                placeholder="Auto-generated reference"
                                                className="bg-gray-50"
                                                disabled
                                            />
                                        </FormControl>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Auto-generated based on payment method and invoice number
                                        </p>
                                    </FormItem>
                                    <FormItem>
                                        <div className="flex items-center gap-1">
                                            <FormLabel>Bank Name</FormLabel>
                                            <span className="text-red-500 text-sm font-semibold">*</span>
                                        </div>
                                        <FormControl>
                                            <Input
                                                {...form.register("bank_name", { required: true })}
                                                placeholder="e.g., BPI, BDO, Wise Pilipinas Inc."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    <FormItem>
                                        <div className="flex items-center gap-1">
                                            <FormLabel>Account Name</FormLabel>
                                            <span className="text-red-500 text-sm font-semibold">*</span>
                                        </div>
                                        <FormControl>
                                            <Input
                                                {...form.register("account_name", { required: true })}
                                                placeholder="Account holder name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    <FormItem>
                                        <div className="flex items-center gap-1">
                                            <FormLabel>Account Number</FormLabel>
                                            <span className="text-red-500 text-sm font-semibold">*</span>
                                        </div>
                                        <FormControl>
                                            <Input
                                                {...form.register("account_number", { required: true })}
                                                placeholder="Bank account number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    <FormItem>
                                        <div className="flex items-center gap-1">
                                            <FormLabel>Country</FormLabel>
                                            <span className="text-red-500 text-sm font-semibold">*</span>
                                        </div>
                                        <FormControl>
                                            <Input
                                                {...form.register("country", { required: true })}
                                                placeholder="Philippines"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </div>
                            </Card>

                            {/* Invoice Status */}
                            <Card className="p-6 border border-slate-300 rounded-xl bg-white">
                                <h3 className="text-lg font-semibold mb-4 text-[#8CE232]">Invoice Status</h3>
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            defaultValue="pending"
                                            onValueChange={(value) => form.setValue("status", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="paid">Paid</SelectItem>
                                                <SelectItem value="overdue">Overdue</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            </Card>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-[#8CE232] text-black font-bold py-6 rounded-lg hover:bg-[#8CE232]/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <Receipt size={20} />
                                Create Invoice
                            </Button>
                        </form>
                    </FormProvider>
                </Card>

                {/* Right: Live Preview - Exact 1:1 Design */}
                <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-xl">
                    <div className="max-w-4xl mx-auto bg-white shadow-lg h-full">
                        {/* Header */}
                        <div className="bg-slate-700 text-white p-6 justify-between items-start">
                            <div>
                                <div className="mb-6 border-2 border-[#91cd49] text-[#91cd49] text-center px-5 py-2 rounded font-semibold uppercase tracking-widest text-xs">
                                    INVOICE
                                </div>
                                <div className="inline-block bg-[#91cd49] text-white px-6 py-3 rounded-lg text-2xl font-bold lowercase tracking-wide">
                                    reaiv
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="text-left">
                                        <div className="text-xs uppercase tracking-wide opacity-70 mb-1">Invoice Number</div>
                                        <div className="text-sm text-[#91cd49] font-semibold">
                                            {form.watch("invoice_number") || "REAIV-XXXX-XXX"}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs uppercase tracking-wide opacity-70 mb-1">Issue Date</div>
                                        <div className="text-sm text-[#91cd49] font-semibold">
                                            {form.watch("issue_date") ? formatDate(form.watch("issue_date")) : "Not set"}
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs uppercase tracking-wide opacity-70 mb-1">Work / Reference</div>
                                        <div className="text-sm text-[#91cd49] font-semibold">
                                            {form.watch("work_reference") || "Work Reference"}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs uppercase tracking-wide opacity-70 mb-1">Due Date</div>
                                        <div className="text-sm text-[#91cd49] font-semibold">
                                            {form.watch("due_date") ? formatDate(form.watch("due_date")) : "Not set"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Amount Due Section */}
                        <div className="bg-green-50 p-6 text-center border-b-4 border-[#91cd49]">
                            <div className="text-xs text-gray-600 uppercase tracking-widest mb-2">
                                Amount Due ({form.watch("currency") || "PHP"})
                            </div>
                            <div className="text-3xl text-slate-700 font-bold my-2">
                                {formatCurrency(form.watch("total_amount") || 0)}
                            </div>
                            <div className="text-sm text-gray-600 mt-2">
                                Due {form.watch("payment_due_date") ? formatDate(form.watch("payment_due_date")) :
                                    form.watch("due_date") ? formatDate(form.watch("due_date")) : "Not set"}
                            </div>
                            <button className="bg-[#91cd49] hover:bg-[#7ab33a] text-white px-6 py-2 rounded text-sm font-semibold mt-3 transition-colors">
                                Pay {formatCurrency(form.watch("total_amount") || 0)}
                            </button>
                        </div>

                        {/* Invoice Body */}
                        <div className="p-6">
                            {/* Billing Information */}
                            <div className="mb-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-600 mb-3">BILLED TO</h3>
                                        <p className="font-bold mb-1 text-sm">
                                            {form.watch("bill_to_name") || "Client Name"}
                                        </p>
                                        {form.watch("bill_to_title") && (
                                            <p className="mb-1 text-sm">{form.watch("bill_to_title")}</p>
                                        )}
                                        {form.watch("bill_to_address") && (
                                            <p className="mb-1 text-sm">{form.watch("bill_to_address")}</p>
                                        )}
                                        {form.watch("bill_to_email") && (
                                            <p className="mb-1 text-sm">
                                                Email: <span className="text-[#91cd49] font-semibold">{form.watch("bill_to_email")}</span>
                                            </p>
                                        )}
                                        {form.watch("bill_to_phone") && (
                                            <p className="mb-1 text-sm">
                                                Phone: <span className="text-[#91cd49] font-semibold">{form.watch("bill_to_phone")}</span>
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-600 mb-3">SERVICE DETAILS</h3>
                                        <p className="mb-1 text-sm">
                                            <strong>Service Type:</strong> {form.watch("service_type") || "Service Type"}
                                        </p>
                                        {form.watch("projects") && (
                                            <p className="mb-1 text-sm"><strong>Projects:</strong> {form.watch("projects")}</p>
                                        )}
                                        {form.watch("billing_basis") && (
                                            <p className="mb-1 text-sm"><strong>Billing Basis:</strong> {form.watch("billing_basis")}</p>
                                        )}
                                        {form.watch("payment_method") && (
                                            <p className="mb-1 text-sm"><strong>Payment Method:</strong> {form.watch("payment_method")}</p>
                                        )}
                                        <p className="mb-1 text-sm">
                                            <strong>Currency:</strong> {form.watch("currency") || "PHP"}
                                        </p>
                                        {form.watch("service_notes") && (
                                            <p className="mt-2 text-xs italic text-gray-600">{form.watch("service_notes")}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Invoice Items */}
                            <div className="mb-6">
                                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3 pb-2 border-b-2 border-gray-100">
                                    Invoice Items
                                </h2>
                                <table className="w-full border-collapse mt-3 text-xs">
                                    <thead>
                                        <tr>
                                            <th className="bg-slate-700 text-white p-2 text-left font-semibold uppercase text-xs tracking-wide">
                                                Description
                                            </th>
                                            <th className="bg-slate-700 text-white p-2 text-center font-semibold uppercase text-xs tracking-wide">
                                                Qty
                                            </th>
                                            <th className="bg-slate-700 text-white p-2 text-center font-semibold uppercase text-xs tracking-wide">
                                                Rate
                                            </th>
                                            <th className="bg-slate-700 text-white p-2 text-right font-semibold uppercase text-xs tracking-wide">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.length > 0 ? items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="p-2 border-b border-gray-100 align-top">
                                                    <div className="font-semibold text-slate-700 mb-1 text-xs">
                                                        {item.description || `Item ${index + 1}`}
                                                    </div>
                                                    {item.detailed_description && (
                                                        <div className="text-xs text-gray-600 leading-relaxed">
                                                            {item.detailed_description}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-2 border-b border-gray-100 text-center text-xs">{item.quantity}</td>
                                                <td className="p-2 border-b border-gray-100 text-center text-xs">
                                                    {formatCurrency(item.rate)}
                                                </td>
                                                <td className="p-2 border-b border-gray-100 text-right text-xs">
                                                    {formatCurrency(item.amount)}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="p-4 text-center text-gray-500 text-xs">
                                                    No items added yet
                                                </td>
                                            </tr>
                                        )}
                                        <tr className="bg-gray-50">
                                            <td colSpan={3} className="p-2 text-right font-semibold text-xs">Subtotal</td>
                                            <td className="p-2 text-right font-semibold text-xs">
                                                {formatCurrency(form.watch("subtotal") || 0)}
                                            </td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td colSpan={3} className="p-2 text-right font-semibold text-xs">Taxes</td>
                                            <td className="p-2 text-right font-semibold text-xs">
                                                {form.watch("tax_amount") > 0 ? formatCurrency(form.watch("tax_amount")) : '—'}
                                            </td>
                                        </tr>
                                        <tr className="bg-slate-700 text-white font-bold">
                                            <td colSpan={3} className="p-2 text-right text-xs">
                                                Amount Due ({form.watch("currency") || "PHP"})
                                            </td>
                                            <td className="p-2 text-right text-xs">{formatCurrency(form.watch("total_amount") || 0)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Payment Information */}
                            <div className="mb-6">
                                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3 pb-2 border-b-2 border-gray-100">
                                    Payment Information
                                </h2>
                                <div className="bg-amber-50 p-4 rounded-lg">
                                    <h3 className="text-orange-600 mb-3 text-sm font-semibold">
                                        {form.watch("payment_method") || "Payment Method"}
                                    </h3>
                                    <p className="mb-1 text-xs">
                                        <strong>Payment Due:</strong>{' '}
                                        {form.watch("payment_due_date") ? formatDate(form.watch("payment_due_date")) :
                                            form.watch("due_date") ? formatDate(form.watch("due_date")) : "Not set"}
                                    </p>
                                    {form.watch("payment_reference") && (
                                        <p className="mb-2 text-xs">
                                            <strong>Reference:</strong>{' '}
                                            <span className="bg-green-100 px-2 py-1 rounded font-mono font-semibold text-slate-700 text-xs">
                                                {form.watch("payment_reference")}
                                            </span>
                                        </p>
                                    )}
                                    {(form.watch("bank_name") || form.watch("account_name") || form.watch("account_number")) && (
                                        <div className="bg-white p-3 rounded-lg mt-2 border border-orange-200">
                                            <h4 className="text-slate-700 mb-2 text-xs font-semibold">Recipient Bank Details</h4>
                                            <div className="space-y-1 text-xs">
                                                {form.watch("bank_name") && (
                                                    <div className="flex">
                                                        <span className="font-semibold text-gray-600 w-20">Bank:</span>
                                                        <span>{form.watch("bank_name")}</span>
                                                    </div>
                                                )}
                                                {form.watch("account_name") && (
                                                    <div className="flex">
                                                        <span className="font-semibold text-gray-600 w-20">Account:</span>
                                                        <span>{form.watch("account_name")}</span>
                                                    </div>
                                                )}
                                                {form.watch("account_number") && (
                                                    <div className="flex">
                                                        <span className="font-semibold text-gray-600 w-20">Number:</span>
                                                        <span>{form.watch("account_number")}</span>
                                                    </div>
                                                )}
                                                {form.watch("country") && (
                                                    <div className="flex">
                                                        <span className="font-semibold text-gray-600 w-20">Country:</span>
                                                        <span>{form.watch("country")}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-blue-50 p-3 border-l-4 border-blue-400 rounded-md mt-3 text-xs leading-relaxed">
                                    <strong>Note:</strong> This invoice is issued under the contingency schedule defined in the signed agreement.
                                    If the standard milestone schedule applies instead, please advise and a split invoice (USD demo + PHP final)
                                    will be issued accordingly.
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-700 text-white p-6 text-center">
                            <div className="text-2xl font-bold text-[#91cd49] mb-2">reaiv</div>
                            <div className="text-sm text-[#91cd49] mb-2">REAIV - Reimagine AI Ventures</div>
                            <div className="text-xs opacity-80 tracking-wide">Think different. Build intelligent. Scale effortlessly.</div>
                            <div className="text-xs opacity-60 mt-3">This invoice was generated using the REAIV template format.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}