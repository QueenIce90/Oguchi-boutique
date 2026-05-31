import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * UPDATE (PATCH): Edits the content of a specific note.
 * Useful for correcting typos or updating design decisions 
 * without losing the original entry timestamp.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required for update." },
        { status: 400 }
      );
    }

    const updatedNote = await prisma.note.update({
      where: { id: params.id },
      data: { content },
    });

    return NextResponse.json({ ok: true, note: updatedNote });
  } catch (error: any) {
    console.error("PATCH Note Error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update the log entry." },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Permanently removes a note from the client's history.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // We target the specific note ID passed in the URL
    await prisma.note.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ ok: true, message: "Log entry removed." });
  } catch (error: any) {
    console.error("DELETE Note Error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete the log entry." },
      { status: 500 }
    );
  }
}