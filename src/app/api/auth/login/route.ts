import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Credentials required." }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Find user by email and password
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: hashedPassword,
      },
    });

    if (!user) {
      return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    }

    return NextResponse.json({ 
      ok: true, 
      user: { id: user.id, fullName: user.fullName, email: user.email } 
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Login failed." }, { status: 500 });
  }
}