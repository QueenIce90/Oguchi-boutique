import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Configuration for file uploads
const MAX_FILES = 5;
const MAX_FILE_MB = 8;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // 1. Extract and Sanitize Fields
    const fullName = String(form.get("fullName") || "").trim();
    const email = String(form.get("email") || "").trim();
    const slotId = String(form.get("slotId") || "").trim();
    const service = String(form.get("service") || "").trim();

    // 2. Defensive Validation
    if (!fullName || !email || !slotId || slotId === "undefined") {
      return NextResponse.json(
        { ok: false, error: "Required details missing. Please ensure a time slot is selected." },
        { status: 400 }
      );
    }

    // 3. Database Transaction: Save Booking & Lock Slot
    // We do this first so the data is safe even if the email fails.
    const result = await prisma.$transaction(async (tx) => {
      const slot = await tx.availabilitySlot.findUnique({ where: { id: slotId } });

      if (!slot) throw new Error("The selected time slot no longer exists.");
      if (slot.isBooked) throw new Error("This time slot has already been reserved.");

      const booking = await tx.booking.create({
        data: {
          fullName,
          email,
          phone: String(form.get("phone") || "").trim(),
          service,
          eventDate: slot.startAt, // Uses the exact date from the planner
          budget: String(form.get("budget") || "").trim(),
          height: String(form.get("height") || "").trim(),
          bust: String(form.get("bust") || "").trim(),
          waist: String(form.get("waist") || "").trim(),
          hips: String(form.get("hips") || "").trim(),
          dressSize: String(form.get("dressSize") || "").trim(),
          shoeSize: String(form.get("shoeSize") || "").trim(),
          notes: String(form.get("notes") || "").trim(),
          slotId: slot.id,
          // userId remains null for guests; linked automatically on signup
        },
      });

      const updatedSlot = await tx.availabilitySlot.update({
        where: { id: slot.id },
        data: { isBooked: true },
      });

      return { booking, slot: updatedSlot };
    });

    // 4. Background Email Dispatch
    // Wrapped in its own try/catch so Bad Credentials won't trigger a 500 error for the user.
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS, // Your App Password: osoqcjqkcxifsxf
        },
      });

      const timeString = result.slot.startAt.toLocaleString('en-US', { 
        weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      });

      const portalLink = `${process.env.NEXT_PUBLIC_BASE_URL}/signup?email=${encodeURIComponent(email)}&name=${encodeURIComponent(fullName)}`;

      await transporter.sendMail({
        from: `"THE HOUSE OF OGUCHI" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Consultation Confirmed — THE HOUSE OF OGUCHI",
        html: `
          <div style="font-family: serif; color: #000; padding: 40px; border: 1px solid #eee;">
            <h1 style="font-style: italic; border-bottom: 2px solid #000; padding-bottom: 10px;">The House of Oguchi</h1>
            <p>Hi ${fullName},</p>
            <p>Your bespoke consultation for <b>${service}</b> is confirmed.</p>
            <p><b>Date:</b> ${timeString}</p>
            <p><b>Location:</b> 853 Flatbush Ave, Brooklyn, NY 11226</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p>To collaborate with our tailoring team and track your design journey, please activate your portal:</p>
            <a href="${portalLink}" style="background: #000; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">ACTIVATE CLIENT PORTAL</a>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("GMAIL_AUTH_ERROR: Booking saved, but email failed.", mailError);
      // We do not return an error to the frontend here.
    }

    return NextResponse.json({ ok: true, bookingId: result.booking.id });

  } catch (err: any) {
    console.error("CRITICAL_BOOKING_FAILURE:", err.message);
    return NextResponse.json(
      { ok: false, error: err.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}