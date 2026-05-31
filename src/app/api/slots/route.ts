import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET: Fetches all available (unbooked) slots for the client booking page.
 * Sorted by date to ensure the "Maison Planner" timeline flows naturally.
 */
export async function GET() {
  try {
    const slots = await prisma.availabilitySlot.findMany({
      where: {
        isBooked: false,
        // Optional: Only show slots in the future
        startAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        startAt: "asc",
      },
    });

    // We return 'slots' as the primary key so the frontend useEffect can find them immediately.
    return NextResponse.json({ 
      ok: true, 
      slots 
    });
  } catch (error) {
    console.error("MAISON_PLANNER_FETCH_ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to sync with the Atelier schedule." },
      { status: 500 }
    );
  }
}

/**
 * POST: Internal utility to allow quick slot creation if needed.
 * (Usually handled by your AdminSlotsPage)
 */
export async function POST(req: Request) {
  try {
    const { startAt, endAt } = await req.json();

    if (!startAt || !endAt) {
      return NextResponse.json(
        { ok: false, error: "Window Start and End times are required." },
        { status: 400 }
      );
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
    return NextResponse.json(
      { ok: false, error: "Database Write Failed" },
      { status: 500 }
    );
  }
}