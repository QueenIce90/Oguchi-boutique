import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        files: true,
      }
    });

    return NextResponse.json({ ok: true, bookings });
  } catch (error) {
    console.error("CRM Load Error:", error);
    return NextResponse.json({ ok: false, message: "Failed to load bookings" }, { status: 500 });
  }
}