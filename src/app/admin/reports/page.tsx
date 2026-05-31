"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";

export default function ReportsPage() {
  const [stats, setStats] = useState({ totalRevenue: 0, pendingDeposits: 0, completedOrders: 0 });
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/admin/reports/summary");
      const data = await res.json();
      if (data.ok) {
        setStats(data.summary);
        setRevenueData(data.monthlyBreakdown);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="lux-gradient min-h-screen py-14 text-black">
      <Container>
        <h1 className="lux-title">Financial Intelligence</h1>
        <p className="lux-sub">Tracking growth for The House of Oguchi and RelievHer™.</p>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <MetricCard label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} detail="Last 30 Days" />
          <MetricCard label="Pending Deposits" value={stats.pendingDeposits} detail="Invoiced but unpaid" />
          <MetricCard label="Production Volume" value={stats.completedOrders} detail="Active Gowns" />
        </div>

        {/* MONTHLY BREAKDOWN TABLE */}
        <div className="mt-12 lux-card p-10 bg-white shadow-xl">
          <h2 className="text-xl font-bold mb-8">Revenue Breakdown</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Month</th>
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Services</th>
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((row, idx) => (
                <tr key={idx} className="border-b border-neutral-50 last:border-none">
                  <td className="py-6 text-sm font-bold">{row.month}</td>
                  <td className="py-6 text-sm text-neutral-500">{row.count} Orders</td>
                  <td className="py-6 text-sm font-bold text-right text-emerald-600">${row.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: any; detail: string }) {
  return (
    <div className="lux-card p-8 bg-white border-neutral-100">
      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{label}</span>
      <div className="text-3xl font-bold mt-2 mb-1">{value}</div>
      <span className="text-[10px] italic text-neutral-300">{detail}</span>
    </div>
  );
}