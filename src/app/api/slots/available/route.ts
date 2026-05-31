import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const slots = await prisma.availabilitySlot.findMany({
      where: { 
        isBooked: false,
        // Only show slots from this moment forward
        startAt: { gte: new Date() } 
      },
      orderBy: { startAt: 'asc' },
      take: 20 // Shows the next 20 open opportunities in the Atelier
    });

    return NextResponse.json({ 
      ok: true, 
      slots 
    });
  } catch (error) {
    console.error("SLOT_FETCH_ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to sync with Maison Planner" }, 
      { status: 500 }
    );
  }
}