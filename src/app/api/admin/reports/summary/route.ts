import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const activeOrders = await prisma.order.findMany({
      where: { depositPaid: true }
    });

    const totalRevenue = activeOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingDeposits = await prisma.order.count({ where: { depositPaid: false } });
    
    // Calculate progress toward your 50k goal
    const goalProgress = (totalRevenue / 50000) * 100;

    return NextResponse.json({ 
      ok: true, 
      summary: { 
        totalRevenue, 
        pendingDeposits, 
        goalProgress: Math.min(goalProgress, 100) 
      } 
    });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}