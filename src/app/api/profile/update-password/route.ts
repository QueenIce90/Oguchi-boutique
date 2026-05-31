import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { userId, currentPassword, newPassword } = await req.json();

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json({ ok: false, error: "All fields are required." }, { status: 400 });
    }

    // 1. Fetch the user to check the current password
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
    }

    // 2. Hash the provided current password and compare it
    const hashedCurrent = await hashPassword(currentPassword);
    if (hashedCurrent !== user.password) {
      return NextResponse.json({ ok: false, error: "Current password is incorrect." }, { status: 401 });
    }

    // 3. Hash the new password and update the database
    const hashedNew = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNew },
    });

    return NextResponse.json({ ok: true, message: "Credentials updated successfully." });
  } catch (error) {
    console.error("Password Update Error:", error);
    return NextResponse.json({ ok: false, error: "Failed to update password." }, { status: 500 });
  }
}