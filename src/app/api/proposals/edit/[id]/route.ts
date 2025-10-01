import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: fetch a proposal by ID (for authenticated dashboard access)
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

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
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
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