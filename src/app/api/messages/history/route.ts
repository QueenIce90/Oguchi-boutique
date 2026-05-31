import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ ok: false, error: "User ID required" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        // This pulls all messages where the user is the sender OR the client recipient
        senderId: userId,
      },
      orderBy: {
        createdAt: "asc", // Order by time so the chat flows correctly
      },
    });

    return NextResponse.json({ ok: true, messages });
  } catch (error) {
    console.error("History Fetch Error:", error);
    return NextResponse.json({ ok: false, error: "Failed to load correspondence" }, { status: 500 });
  }
}