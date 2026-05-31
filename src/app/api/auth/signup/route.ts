import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 1. Destructure exactly what the frontend form sends
    const { fullName, email, phone, password } = await req.json();

    // 2. Validation: Ensure required Maison credentials are present
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { ok: false, error: "Please provide your name, email, and password." }, 
        { status: 400 }
      );
    }

    // 3. Check for existing account
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: "This email is already registered." }, 
        { status: 400 }
      );
    }

    // 4. Secure the password
    const hashedPassword = await hashPassword(password);

    // 5. Create the Atelier User
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        phone, 
      },
    });

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (error: any) {
    console.error("Maison Signup Error:", error);
    return NextResponse.json({ ok: false, error: "Registration failed." }, { status: 500 });
  }
}