import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"; // Assuming you use NextAuth

export async function GET() {
  const session = await getServerSession(); // Secure the route
  if (!session?.user?.email) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { sender: { email: session.user.email } },
          { recipientId: session.user.id } // Replies from Admin
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ ok: true, messages });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Failed to load thread." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const { content, bookingId } = await req.json();
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });

    if (!user) throw new Error("User not found");

    const message = await prisma.message.create({
      data: {
        content,
        senderId: user.id,
        bookingId: bookingId || null,
        recipientId: "ADMIN", // Sent to the tailoring team queue
      },
    });

    return NextResponse.json({ ok: true, message });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}