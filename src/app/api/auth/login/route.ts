import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "default-secret-key";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Fetch user by email
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, password_hash")
    .eq("email", email)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  // Compare password
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  // Generate a JWT token for this user
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  // Set the token as a cookie
  const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  response.cookies.set("token", token, { httpOnly: true, secure: false, path: "/" }); // Use secure: false for local dev

  return response;
}