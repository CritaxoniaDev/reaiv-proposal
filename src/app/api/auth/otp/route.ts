import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json({ error: "Missing code." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("otps")
    .select("id")
    .eq("code", code)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid code." }, { status: 401 });
  }

  return NextResponse.json({ success: true, id: data.id });
}