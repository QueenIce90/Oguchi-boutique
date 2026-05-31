import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: This allows the Booking Page to see the available dates
export async function GET() {
  try {
    const slots = await prisma.availabilitySlot.findMany({
      where: { 
        isBooked: false,
        startAt: { gte: new Date() } 
      },
      orderBy: { startAt: 'asc' },
    });
    return NextResponse.json({ ok: true, slots });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Fetch failed" }, { status: 500 });
  }
}

// POST: This allows your Admin Planner to SAVE the dates you pick
export async function POST(req: Request) {
  try {
    const { startAt, endAt } = await req.json();

    if (!startAt || !endAt) {
      return NextResponse.json({ ok: false, error: "Missing times" }, { status: 400 });
    }

    const newSlot = await prisma.availabilitySlot.create({
      data: {
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        isBooked: false,
      },
    });

    return NextResponse.json({ ok: true, slot: newSlot });
  } catch (error) {
    console.error("ADMIN_SLOT_ERROR:", error);
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
  }
}