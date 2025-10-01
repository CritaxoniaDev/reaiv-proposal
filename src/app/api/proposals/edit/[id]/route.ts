import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Next.js expects context.params to be a Promise for dynamic routes
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json({ error: "Missing proposal id" }, { status: 400 });
    }

    const { data: proposal, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !proposal) {
        return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    return NextResponse.json({ proposal });
}

// PUT: update a proposal by ID (for authenticated dashboard access)
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const body = await request.json();

    const { error } = await supabase
        .from("proposals")
        .update(body)
        .eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}