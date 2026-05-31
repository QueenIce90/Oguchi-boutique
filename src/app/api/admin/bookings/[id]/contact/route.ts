import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ ok: true, updated });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}