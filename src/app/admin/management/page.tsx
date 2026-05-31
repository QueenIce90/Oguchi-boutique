"use client";

import Container from "@/components/Container";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminManagementPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [financials, setFinancials] = useState({ totalRevenue: 0, pendingDeposits: 0, goalProgress: 0 });
  const [noteInput, setNoteInput] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Security Gate
  useEffect(() => {
    const access = sessionStorage.getItem("atelier_access");
    if (access !== "granted") {
      window.location.href = "/admin/login";
    }
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [bRes, fRes] = await Promise.all([
        fetch("/api/admin/bookings"),
        fetch("/api/admin/reports/summary")
      ]);
      const bData = await bRes.json();
      const fData = await fRes.json();

      setBookings(bData.bookings || []);
      if (fData.ok) setFinancials(fData.summary);
    } catch (e) {
      console.error("The Suite Sync Error:", e);
    }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  // CRM Actions
  async function toggleContact(id: string, field: string, current: boolean) {
    await fetch(`/api/admin/bookings/${id}/contact`, {
      method: 'PATCH',
      body: JSON.stringify({ [field]: !current })
    });
    loadData();
  }

  async function addNote(bookingId: string) {
    const content = noteInput[bookingId];
    if (!content) return;
    await fetch(`/api/admin/bookings/${bookingId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
    setNoteInput({ ...noteInput, [bookingId]: "" });
    loadData();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="text-center animate-pulse">
          <h2 className="text-xl font-serif italic text-white tracking-widest">Opening The Suite</h2>
          <p className="text-[9px] uppercase tracking-[0.5em] text-white/20 mt-4">Preparing......</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-14 text-black">
      <Container>
        {/* HEADER */}
        <div className="mb-12 border-b border-black/5 pb-10">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-serif italic tracking-tight text-black">The Suite</h1>
              <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 mt-3 font-bold">
                Command Center • The House of Oguchi
              </p>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-[10px] font-bold uppercase tracking-widest text-black/20">System Status</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-green-500 flex items-center gap-2 justify-end mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Operational
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACCESS NAVIGATION */}
        <div className="flex flex-wrap gap-4 mb-12">
          <button onClick={loadData} className="text-[9px] font-bold uppercase tracking-[0.2em] px-6 py-3 bg-black text-white rounded-full shadow-xl hover:bg-neutral-800 transition">Dashboard Home</button>
          <Link href="/admin/inventory" className="text-[9px] font-bold uppercase tracking-[0.2em] px-6 py-3 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all duration-500">Live Calendar</Link>
          <Link href="/admin/reports" className="text-[9px] font-bold uppercase tracking-[0.2em] px-6 py-3 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all duration-500">Financial Reports</Link>
          <button 
            onClick={() => { sessionStorage.removeItem("atelier_access"); window.location.href = "/admin/login"; }} 
            className="text-[9px] font-bold uppercase tracking-[0.2em] px-6 py-3 border border-red-100 text-red-400 rounded-full hover:bg-red-50 transition ml-auto"
          >
            Secure Logout
          </button>
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-8 border border-black/5 rounded-3xl bg-neutral-50">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">Monthly Revenue</span>
            <div className="text-3xl font-bold mt-2">${financials.totalRevenue.toLocaleString()}</div>
            <div className="mt-6 h-1 w-full bg-black/5 rounded-full overflow-hidden">
              <div className="h-full bg-black transition-all duration-1000" style={{ width: `${financials.goalProgress}%` }} />
            </div>
            <p className="text-[8px] uppercase font-bold mt-3 text-black/30">Goal Progress: {Math.round(financials.goalProgress)}% of $50k</p>
          </div>
          
          <div className="p-8 border border-black/5 rounded-3xl bg-neutral-50">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">Pending Deposits</span>
            <div className="text-3xl font-bold mt-2">{financials.pendingDeposits}</div>
            <p className="text-[8px] uppercase font-bold mt-3 text-red-500">Action Required</p>
          </div>

          <div className="p-8 border border-black/5 rounded-3xl bg-black text-white">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">The House Of Oguchi</span>
            <div className="text-3xl font-bold mt-2">{financials.goalProgress >= 100 ? "Scaling ✨" : "Taking Orders"}</div>
            <p className="text-[8px] uppercase font-bold mt-3 text-white/60">NYC / Global Operations</p>
          </div>
        </div>

        {/* CLIENT FEED */}
        <div className="space-y-6">
          {bookings.map((b) => (
            <div key={b.id} className="p-10 border border-black/5 rounded-[2rem] hover:shadow-2xl transition-all duration-700 bg-white">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1">
                  <h3 className="text-3xl font-serif italic">{b.fullName}</h3>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mt-2">{b.service} • {b.budget}</p>
                  
                  {/* Note Section */}
                  <div className="mt-8 p-6 bg-neutral-50 rounded-2xl">
                    <div className="space-y-3 mb-4">
                      {b.notes?.map((n: any) => (
                        <div key={n.id} className="text-[11px] border-b border-black/5 pb-2 flex justify-between">
                          <span>{n.content}</span>
                          <span className="text-[8px] text-black/20">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-white border border-black/5 rounded-full px-4 py-2 text-xs focus:outline-none" 
                        placeholder="Add client update..."
                        value={noteInput[b.id] || ""}
                        onChange={(e) => setNoteInput({...noteInput, [b.id]: e.target.value})}
                      />
                      <button onClick={() => addNote(b.id)} className="bg-black text-white px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest">Log</button>
                    </div>
                  </div>
                </div>

                {/* CRM Controls */}
                <div className="flex gap-4 border-l border-black/5 pl-8">
                  {['called', 'emailed', 'texted'].map((method) => (
                    <label key={method} className="flex flex-col items-center gap-2 cursor-pointer">
                      <span className="text-[8px] font-bold uppercase text-black/20">{method}</span>
                      <input 
                        type="checkbox" 
                        checked={b[method]} 
                        onChange={() => toggleContact(b.id, method, b[method])}
                        className="h-5 w-5 accent-black"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}