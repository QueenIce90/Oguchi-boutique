import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ ok: false }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId },
      select: {
        orderNumber: true,
        totalPrice: true,
        depositPaid: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ ok: true, orders });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}