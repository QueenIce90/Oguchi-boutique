// components/NewBookingAlert.tsx
"use client";
import { useEffect, useState } from "react";

export default function NewBookingAlert() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    // This logic would ideally use a WebSocket (like Pusher) 
    // to trigger when a new row hits the DB
    const checkNew = setInterval(async () => {
      const res = await fetch("/api/admin/bookings/latest");
      const data = await res.json();
      if (data.isNew) {
        setName(data.name);
        setShow(true);
        setTimeout(() => setShow(false), 5000);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkNew);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right-8">
      <div className="lux-card bg-black text-white p-6 shadow-2xl border-none flex items-center gap-4">
        <div className="text-2xl">✨</div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">New Inquiry</div>
          <div className="text-sm font-semibold">{name} has requested a consultation.</div>
        </div>
      </div>
    </div>
  );
}