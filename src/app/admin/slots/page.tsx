"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";

type Slot = { id: string; startAt: string; endAt: string; isBooked: boolean };

export default function AdminSlotsPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  const loadSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/slots");
      if (!res.ok) throw new Error("Could not sync with Maison Planner");
      const data = await res.json();
      if (data.ok) setSlots(data.slots || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSlot = async () => {
    if (!startAt || !endAt) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startAt, endAt }),
      });
      const data = await res.json();
      
      if (!res.ok || !data.ok) throw new Error(data?.error || "Failed to create slot");
      
      setStartAt("");
      setEndAt("");
      await loadSlots();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSlot = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/slots?id=${id}`, { method: "DELETE" });
      if (res.ok) await loadSlots();
    } catch (err) {
      setError("Deletion failed");
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  // Group slots by date for the grid view
  const grouped = slots.reduce((acc: any, slot) => {
    const date = new Date(slot.startAt).toLocaleDateString('en-US', { 
      weekday: 'short', month: 'short', day: 'numeric' 
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white py-14 text-black">
      <Container>
        {/* HEADER */}
        <div className="mb-12 border-b border-black/5 pb-10">
          <h1 className="text-4xl font-serif italic tracking-tight text-black">Maison Planner</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 mt-3 font-bold">
            Inventory & Availability Management
          </p>
        </div>

        {/* CREATE SLOT SECTION */}
        <div className="mb-16 p-10 bg-neutral-50 rounded-[2.5rem] border border-black/5 max-w-2xl">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6">Open New Time Window</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[8px] uppercase tracking-widest text-black/40 ml-4 font-bold">Window Start</label>
              <input 
                type="datetime-local" 
                className="w-full bg-white border border-black/10 rounded-full px-6 py-4 text-xs focus:outline-none focus:border-black transition-all"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] uppercase tracking-widest text-black/40 ml-4 font-bold">Window End</label>
              <input 
                type="datetime-local" 
                className="w-full bg-white border border-black/10 rounded-full px-6 py-4 text-xs focus:outline-none focus:border-black transition-all"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
              />
            </div>
          </div>
          
          {/* THE UPDATED BUTTON */}
          <button 
            onClick={createSlot}
            disabled={loading}
            className="w-full mt-6 bg-black text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition shadow-xl disabled:opacity-50"
          >
            {loading ? "Syncing with Oguchi..." : "Confirm Availability"}
          </button>
          
          {error && (
            <p className="mt-4 text-[9px] text-red-500 uppercase tracking-widest text-center animate-pulse">
              {error}
            </p>
          )}
        </div>

        {/* PLANNER GRID VIEW */}
        <div className="space-y-12">
          {Object.keys(grouped).length === 0 && !loading && (
            <p className="text-xs uppercase tracking-[0.2em] text-black/20 italic">No windows currently open.</p>
          )}

          {Object.keys(grouped).map(date => (
            <div key={date} className="group">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-black/20 group-hover:text-black transition-colors mb-6">
                {date}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {grouped[date].map((slot: Slot) => (
                  <div 
                    key={slot.id} 
                    className={`p-6 rounded-3xl border transition-all ${
                      slot.isBooked 
                        ? 'bg-black text-white border-black shadow-lg' 
                        : 'bg-white border-black/5 hover:border-black/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                        {slot.isBooked ? 'Reserved' : 'Available'}
                      </div>
                      {!slot.isBooked && (
                        <button 
                          onClick={() => deleteSlot(slot.id)} 
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="text-lg font-serif italic mt-3">
                      {new Date(slot.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}