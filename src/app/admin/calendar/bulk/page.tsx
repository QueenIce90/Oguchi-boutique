"use client";

import { useState } from "react";
import Container from "@/components/Container";

export default function BulkSlotGenerator() {
  const [days, setDays] = useState<number[]>([]); // 1 for Mon, 3 for Wed, etc.
  const [time, setTime] = useState("10:00");
  const [year, setYear] = useState(2026);

  async function handleBulkCreate() {
    const res = await fetch("/api/admin/slots/bulk", {
      method: "POST",
      body: JSON.stringify({ days, time, year })
    });
    if (res.ok) alert("Slots for the year have been opened.");
  }

  return (
    <div className="lux-gradient min-h-screen py-14">
      <Container>
        <div className="lux-card p-10 bg-white">
          <h1 className="text-2xl font-serif italic mb-6">Open Yearly Availability</h1>
          <div className="grid gap-6">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(d => (
                <button 
                  key={d} 
                  onClick={() => setDays([...days, d])}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold border ${days.includes(d) ? 'bg-black text-white' : 'border-neutral-100'}`}
                >
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][d-1]}
                </button>
              ))}
            </div>
            <input type="time" className="input" onChange={(e) => setTime(e.target.value)} />
            <button onClick={handleBulkCreate} className="rounded-full bg-black py-4 text-[10px] font-bold uppercase tracking-widest text-white">
              Generate All Available Slots
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}