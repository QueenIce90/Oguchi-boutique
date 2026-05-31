import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const note = await prisma.note.findUnique({ where: { id: params.id } });
    
    const updatedNote = await prisma.note.update({
      where: { id: params.id },
      data: { isPinned: !note?.isPinned },
    });

    return NextResponse.json({ ok: true, note: updatedNote });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}