import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const MONTHLY_GOAL = 50000;

    // 1. Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 2. Fetch all orders with deposits paid this month
    const confirmedOrders = await prisma.order.findMany({
      where: {
        depositPaid: true,
        createdAt: { gte: startOfMonth }
      },
      select: {
        totalPrice: true
      }
    });

    // 3. Fetch count of pending deposits (Unpaid inquiries)
    const pendingCount = await prisma.order.count({
      where: {
        depositPaid: false
      }
    });

    // 4. Calculate Revenue
    const totalRevenue = confirmedOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
    const goalProgress = (totalRevenue / MONTHLY_GOAL) * 100;

    return NextResponse.json({
      ok: true,
      summary: {
        totalRevenue: totalRevenue,
        pendingDeposits: pendingCount,
        goalProgress: Math.min(goalProgress, 100), // Cap at 100 for the progress bar
      }
    });
  } catch (error) {
    console.error("Financial Sync Error:", error);
    return NextResponse.json({ ok: false, message: "Could not sync revenue" }, { status: 500 });
  }
}