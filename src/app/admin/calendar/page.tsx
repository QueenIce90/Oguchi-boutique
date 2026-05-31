"use client";

import { useState, useEffect } from "react";
import Container from "@/components/Container";

export default function YearlyCalendarManager() {
  const [viewDate, setViewDate] = useState(new Date());
  const [slots, setSlots] = useState<any[]>([]);

  // Fetches all slots for the selected month/year
  async function fetchCalendarData() {
    const month = viewDate.getMonth() + 1;
    const year = viewDate.getFullYear();
    const res = await fetch(`/api/admin/calendar?month=${month}&year=${year}`);
    const data = await res.json();
    if (data.ok) setSlots(data.slots);
  }

  useEffect(() => { fetchCalendarData(); }, [viewDate]);

  return (
    <div className="lux-gradient min-h-screen py-14 text-black">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="lux-title">Atelier Availability</h1>
            <p className="lux-sub">Manage your multi-year booking schedule.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="lux-btn-outline">Previous</button>
            <span className="font-bold uppercase tracking-widest">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="lux-btn-outline">Next</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-neutral-100 border border-neutral-100 rounded-2xl overflow-hidden shadow-2xl">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-neutral-50 p-4 text-[10px] font-bold uppercase tracking-widest text-center text-neutral-400">{day}</div>
          ))}
          {/* Calendar Day Logic Here */}
          {Array.from({ length: 31 }).map((_, i) => {
            const daySlots = slots.filter(s => new Date(s.date).getDate() === i + 1);
            return (
              <div key={i} className="bg-white min-h-[120px] p-4 group hover:bg-neutral-50 transition">
                <span className="text-xs font-bold text-neutral-300 group-hover:text-black">{i + 1}</span>
                <div className="mt-2 space-y-1">
                  {daySlots.map(slot => (
                    <div key={slot.id} className={`text-[8px] p-1 rounded font-bold uppercase tracking-tighter ${slot.isBooked ? 'bg-black text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                      {slot.time} {slot.isBooked ? `— ${slot.clientName}` : '(Open)'}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}