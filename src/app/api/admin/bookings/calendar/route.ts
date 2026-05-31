import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month") || "");
  const year = parseInt(searchParams.get("year") || "");

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const slots = await prisma.slot.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    // Include the client name if the slot is linked to a booking
    include: {
      booking: {
        select: { fullName: true }
      }
    },
    orderBy: { date: 'asc' }
  });

  // Map the data to a cleaner format for the calendar
  const formattedSlots = slots.map(s => ({
    ...s,
    clientName: s.booking?.fullName || null
  }));

  return NextResponse.json({ ok: true, slots: formattedSlots });
}