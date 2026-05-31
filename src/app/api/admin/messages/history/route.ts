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
        senderId: userId,
      },
      orderBy: {
        createdAt: "asc", // Shows the conversation in chronological order
      },
    });

    return NextResponse.json({ ok: true, messages });
  } catch (error) {
    console.error("History Fetch Error:", error);
    return NextResponse.json({ ok: false, error: "Failed to load conversation" }, { status: 500 });
  }
}