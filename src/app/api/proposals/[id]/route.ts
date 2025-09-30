import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    // Fetch proposal by ID
    const { data: proposal, error: proposalError } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", id)
        .single();

    // Fetch all OTPs for this proposal (in case there are multiple, but usually one)
    const { data: otps, error: otpError } = await supabase
        .from("otps")
        .select("*")
        .eq("proposal_id", id);

    if (proposalError) {
        return NextResponse.json({ error: proposalError.message }, { status: 404 });
    }

    return NextResponse.json({ proposal, otps });
}