"use client";

import Container from "@/components/Container";
import { useEffect, useState } from "react";

type Booking = any;

export default function AdminBookingsPage() {
  const [token, setToken] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    const res = await fetch("/api/admin/bookings", {
      headers: { "x-admin-token": token },
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data?.error || "Failed to load");
      return;
    }
    setBookings(data.bookings || []);
  }

  async function setStatus(id: string, status: "confirmed" | "cancelled" | "new") {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data?.error || "Failed to update");
      return;
    }
    await load();
  }

  return (
    <div className="lux-gradient min-h-screen py-14">
      <Container>
        <h1 className="lux-title">Bookings With Oguchi</h1>
        <p className="lux-sub text-neutral-500">Manage client requests and consultations.</p>

        {/* Security / Token Section */}
        <div className="mt-10 lux-card p-8 border-neutral-200">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <input
              className="input"
              placeholder="ENTER ADMIN ACCESS TOKEN"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button
              onClick={load}
              className="rounded-full bg-black px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-neutral-800 transition shadow-md"
            >
              Load Requests
            </button>
          </div>
          {error && <div className="mt-4 text-sm font-medium text-red-600">Error: {error}</div>}
        </div>

        {/* Bookings List */}
        <div className="mt-12 grid gap-6">
          {bookings.length === 0 && !error && (
            <div className="text-center py-20 text-neutral-400 font-serif italic text-xl">
              Waiting for access...
            </div>
          )}

          {bookings.map((b) => (
            <div key={b.id} className="lux-card p-8 border-neutral-100 hover:border-black/10 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black bg-neutral-100 px-2 py-1 rounded">
                      {b.service}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                      b.status === 'confirmed' ? 'text-emerald-700 bg-emerald-50' : 
                      b.status === 'cancelled' ? 'text-red-700 bg-red-50' : 
                      'text-neutral-500 bg-neutral-100'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-semibold tracking-tight text-black pt-2">{b.fullName}</h3>
                  <p className="text-sm font-medium text-neutral-600">{b.email} • {b.phone || "No Phone"}</p>

                  <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 border-t border-neutral-100 pt-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-neutral-400 block">Investment Budget</span>
                      <span className="text-sm font-semibold text-black">{b.budget}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-neutral-400 block">Event Date</span>
                      <span className="text-sm font-semibold text-black">{new Date(b.eventDate).toDateString()}</span>
                    </div>
                    {b.slot?.startAt && (
                      <div className="col-span-2 mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-neutral-400 block">Appointment Slot</span>
                        <span className="text-sm font-semibold text-black">
                          {new Date(b.slot.startAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setStatus(b.id, "confirmed")}
                    className="rounded-full bg-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-neutral-800 transition"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => setStatus(b.id, "cancelled")}
                    className="rounded-full bg-white border border-red-100 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition"
                  >
                    Cancel Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <style jsx global>{`
          .input {
            width: 100%;
            border-radius: 9999px;
            border: 1px solid #e5e5e5;
            background: #ffffff;
            color: #000000;
            padding: 0.85rem 1.5rem;
            font-size: 0.875rem;
            outline: none;
            transition: border-color 0.2s;
          }
          .input:focus {
            border-color: #000000;
          }
        `}</style>
      </Container>
    </div>
  );
}