import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    // Generate a secure 1-hour token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        resetToken: token, 
        resetExpiry: expiry 
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `THE HOUSE OF OGUCHI <${process.env.BOOKING_FROM_EMAIL}>`,
      to: email,
      subject: "Atelier Access: Password Reset Request",
      html: `
        <div style="font-family:serif; color:#000; padding:20px;">
          <h2>Secure Password Reset</h2>
          <p>You requested a password reset for your account at THE HOUSE OF OGUCHI.</p>
          <a href="${resetUrl}" style="display:inline-block; padding:12px 24px; background:#000; color:#fff; text-decoration:none; border-radius:50px; font-size:12px; font-weight:bold; letter-spacing:1px;">RESET PASSWORD</a>
          <p style="font-size:10px; color:#999; margin-top:20px;">This link expires in 1 hour.</p>
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true });
}