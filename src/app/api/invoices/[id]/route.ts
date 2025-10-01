import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
        return NextResponse.json({ error: "Invalid invoice ID format" }, { status: 400 });
    }

    try {
        // Fetch invoice
        const { data: invoice, error: invoiceError } = await supabase
            .from("invoices")
            .select("*")
            .eq("id", id)
            .single();

        if (invoiceError || !invoice) {
            console.error("Invoice fetch error:", invoiceError);
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        // Fetch invoice items
        const { data: items, error: itemsError } = await supabase
            .from("invoice_items")
            .select("*")
            .eq("invoice_id", id)
            .order("sort_order", { ascending: true });

        if (itemsError) {
            console.error("Invoice items fetch error:", itemsError);
            return NextResponse.json({ error: "Failed to fetch invoice items" }, { status: 500 });
        }

        return NextResponse.json({
            invoice: {
                ...invoice,
                items: items || []
            }
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}