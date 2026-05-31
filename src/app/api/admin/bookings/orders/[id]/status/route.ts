import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const fullName = String(form.get("fullName") || "").trim();
    const email = String(form.get("email") || "").trim();
    const slotId = String(form.get("slotId") || "").trim();

    // 1. ATOMIC TRANSACTION (Database first)
    const result = await prisma.$transaction(async (tx) => {
      const slot = await tx.availabilitySlot.findUnique({ where: { id: slotId } });
      if (!slot) throw new Error("Slot not found.");
      if (slot.isBooked) throw new Error("This slot was just reserved.");

      const booking = await tx.booking.create({
        data: {
          fullName,
          email,
          phone: String(form.get("phone") || ""),
          service: String(form.get("service") || ""),
          eventDate: slot.startAt,
          budget: String(form.get("budget") || ""),
          height: String(form.get("height") || ""),
          bust: String(form.get("bust") || ""),
          waist: String(form.get("waist") || ""),
          hips: String(form.get("hips") || ""),
          dressSize: String(form.get("dressSize") || ""),
          shoeSize: String(form.get("shoeSize") || ""),
          notes: String(form.get("notes") || ""),
          slotId: slot.id,
        },
      });

      await tx.availabilitySlot.update({
        where: { id: slot.id },
        data: { isBooked: true },
      });

      return { booking, slot };
    });

    // 2. RESILIENT EMAIL DISPATCH (Try/Catch wrapper)
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS, // Your App Password: osoqcjqkcxifsxf
        },
      });

      await transporter.sendMail({
        from: `"THE HOUSE OF OGUCHI" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Consultation Confirmed — THE HOUSE OF OGUCHI",
        html: `<p>Hi ${fullName}, your bespoke consultation is confirmed for ${result.slot.startAt.toLocaleString()}. 🖤</p>`,
      });
    } catch (emailError) {
      // LOG THE ERROR BUT DON'T CRASH THE CLIENT
      console.error("GMAIL_AUTH_FAIL: Booking saved but email notification failed.", emailError);
    }

    return NextResponse.json({ ok: true, bookingId: result.booking.id });

  } catch (err: any) {
    console.error("BOOKING_POST_ERROR:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}