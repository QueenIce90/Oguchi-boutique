import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    // 1. Find user with valid, non-expired token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Update user and clear reset fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpiry: null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Reset failed." }, { status: 500 });
  }
}