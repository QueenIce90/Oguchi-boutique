import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ ok: true, messages });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Failed to fetch inbox" }, { status: 500 });
  }
}

// PATCH: Mark message as read
export async function PATCH(req: Request) {
  try {
    const { id, isRead } = await req.json();
    await prisma.message.update({
      where: { id },
      data: { isRead }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}