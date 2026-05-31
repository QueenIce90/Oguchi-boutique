import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Temporary in-memory store for the recovery code
// In production, you'd use a database, but this works for a private admin tool
export let currentRecoveryCode: string | null = null;

export async function POST() {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    currentRecoveryCode = code; // Store the code

    await resend.emails.send({
      from: 'The Suite <security@resend.dev>', // Use resend.dev for testing if domain isn't verified
      to: process.env.ADMIN_EMAIL!,
      subject: 'Oguchi Boutique',
      html: `<h1 style="font-family:serif;">Your Suite Access Code: ${code}</h1>`
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}