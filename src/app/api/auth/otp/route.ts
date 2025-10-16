import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import jwt from "jsonwebtoken";

// Generate a secure random 8-character code
function generateCustomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate JWT token
function generateJWT(data: Record<string, any>): string {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return jwt.sign(data, secret, { expiresIn: "24h" });
}

export async function POST(request: Request) {
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json({ error: "Missing code." }, { status: 400 });
  }

  // Check for custom hardcoded code for DARAW Agency
  const CUSTOM_DARAW_CODE = process.env.CUSTOM_DARAW_CODE || " "; // Set in .env

  if (code === CUSTOM_DARAW_CODE) {
    // Generate JWT token for custom code access
    const token = generateJWT({
      type: "custom",
      access: "daraw_agency_proposal"
    });

    return NextResponse.json({
      success: true,
      type: "custom",
      token: token,
      message: "Custom code verified - DARAW Agency access granted"
    });
  }

  // Regular OTP verification from database
  const { data, error } = await supabase
    .from("otps")
    .select("id, proposal_id, invoice_id, expires_at")
    .eq("code", code)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid code." }, { status: 401 });
  }

  // Check if OTP has expired
  const now = new Date();
  const expiresAt = new Date(data.expires_at);

  if (now > expiresAt) {
    // Delete expired OTP
    await supabase
      .from("otps")
      .delete()
      .eq("id", data.id);

    return NextResponse.json({ error: "Code has expired." }, { status: 410 });
  }

  // Generate JWT token for regular OTP
  let tokenData: any = { type: "proposal" };
  let tokenType = "proposal";

  if (data.proposal_id) {
    tokenData = { type: "proposal", id: data.proposal_id };
    tokenType = "proposal";
  } else if (data.invoice_id) {
    tokenData = { type: "invoice", id: data.invoice_id };
    tokenType = "invoice";
  }

  const token = generateJWT(tokenData);

  // Optionally delete used OTP
  await supabase
    .from("otps")
    .delete()
    .eq("id", data.id);

  return NextResponse.json({
    success: true,
    type: tokenType,
    id: data.proposal_id || data.invoice_id,
    token: token
  });
}