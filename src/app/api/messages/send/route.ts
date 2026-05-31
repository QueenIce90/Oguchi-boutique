import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, recipient, content } = await req.json();

    // 1. Validation
    if (!userId || !content) {
      return NextResponse.json(
        { ok: false, error: "Message content is required." }, 
        { status: 400 }
      );
    }

    // 2. Create the message record
    const newMessage = await prisma.message.create({
      data: {
        senderId: userId,
        recipient: recipient || "Customer Service",
        content: content,
      },
    });

    return NextResponse.json({ 
      ok: true, 
      message: "Your inquiry has been dispatched to the Atelier." 
    });
    
  } catch (error) {
    console.error("Concierge Error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send message." }, 
      { status: 500 }
    );
  }
}