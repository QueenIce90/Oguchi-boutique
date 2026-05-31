import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ ok: true, orders });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}