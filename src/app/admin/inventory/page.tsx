"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";

export default function AdminInventoryPage() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  const loadSlots = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/slots");
    const data = await res.json();
    if (data.ok) setSlots(data.slots);
    setLoading(false);
  };

  const createSlot = async () => {
    if (!startAt || !endAt) return;
    const res = await fetch("/api/admin/slots", {
      method: "POST",
      body: JSON.stringify({ startAt, endAt }),
    });
    if (res.ok) {
      setStartAt(""); setEndAt("");
      loadSlots();
    }
  };

  const deleteSlot = async (id: string) => {
    const res = await fetch(`/api/admin/slots?id=${id}`, { method: "DELETE" });
    if (res.ok) loadSlots();
  };

  useEffect(() => { loadSlots(); }, []);

  // Grouping for the "Planner" view
  const grouped = slots.reduce((acc: any, slot) => {
    const date = new Date(slot.startAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white py-14 text-black">
      <Container>
        <div className="mb-12 border-b border-black/5 pb-10">
          <h1 className="text-4xl font-serif italic">Schedule Planner</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 mt-3 font-bold">Inventory & Availability Management</p>
        </div>

        {/* Create New Slot */}
        <div className="mb-16 p-10 bg-neutral-50 rounded-[2.5rem] border border-black/5 max-w-2xl">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6">Open New Time Window</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              type="datetime-local" 
              className="bg-white border border-black/10 rounded-full px-6 py-4 text-xs focus:outline-none focus:border-black transition-all"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
            <input 
              type="datetime-local" 
              className="bg-white border border-black/10 rounded-full px-6 py-4 text-xs focus:outline-none focus:border-black transition-all"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </div>
          <button 
            onClick={createSlot}
            className="w-full mt-6 bg-black text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition shadow-xl"
          >
            Confirm Availability
          </button>
        </div>

        {/* Planner View */}
        <div className="space-y-12">
          {Object.keys(grouped).map(date => (
            <div key={date} className="group">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-black/20 group-hover:text-black transition-colors mb-6">{date}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {grouped[date].map((slot: any) => (
                  <div key={slot.id} className={`p-6 rounded-3xl border transition-all ${slot.isBooked ? 'bg-black text-white border-black' : 'bg-white border-black/5 hover:border-black/20'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                      {slot.isBooked ? 'Reserved' : 'Available'}
                    </div>
                    <div className="text-lg font-serif italic mt-2">
                      {new Date(slot.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {!slot.isBooked && (
                      <button 
                        onClick={() => deleteSlot(slot.id)}
                        className="mt-4 text-[8px] uppercase tracking-widest text-red-500 hover:text-red-700 font-bold"
                      >
                        Remove Slot
                      </button>
                    )}
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