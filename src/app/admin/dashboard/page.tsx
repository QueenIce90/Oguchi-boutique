"use client";

import Container from "@/components/Container";
import { useEffect, useState } from "react";

const stages = [
  { id: "designing", label: "Consultation" },
  { id: "fabric_sourced", label: "Material Sourced" },
  { id: "construction", label: "Hand-Stitching" },
  { id: "fitting", label: "Ready for Fitting (Sends SMS)" },
  { id: "ready", label: "Completed / Shipped" }
];

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadData() {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    if (data.ok) setBookings(data.bookings);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function toggleContact(id: string, field: string, currentVal: boolean) {
    await fetch(`/api/admin/bookings/${id}/contact`, {
      method: "PATCH",
      body: JSON.stringify({ [field]: !currentVal }),
    });
    loadData();
  }

  async function updateStage(orderId: string, newStatus: string) {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setIsModalOpen(false);
      loadData();
    }
  }

  if (loading) return <div className="lux-gradient min-h-screen flex items-center justify-center text-neutral-400">Loading Atelier Data...</div>;

  return (
    <div className="lux-gradient min-h-screen py-14 text-black">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="lux-title !text-4xl">Atelier Command Center</h1>
            <p className="lux-sub">Manage custom inventory and industry-leading turnaround times.</p>
          </div>
        </div>

        <div className="grid gap-6">
          {bookings.map((b) => (
            <div key={b.id} className="lux-card p-8 border-neutral-100 hover:border-black/10 transition-all">
              <div className="flex flex-wrap justify-between items-start gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-neutral-100 px-2 py-1 rounded">
                      {b.service}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold pt-2">{b.fullName}</h3>
                  <p className="text-sm font-medium text-neutral-500">{b.email} • {b.phone || "No Phone"}</p>
                </div>

                <div className="flex gap-6 border-l border-neutral-100 pl-6">
                  {['called', 'emailed', 'texted'].map((method) => (
                    <label key={method} className="flex flex-col items-center gap-2 cursor-pointer group">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 group-hover:text-black transition">{method}</span>
                      <input 
                        type="checkbox" 
                        checked={b[method]} 
                        onChange={() => toggleContact(b.id, method, b[method])}
                        className="h-5 w-5 rounded-full accent-black cursor-pointer" 
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-neutral-400 block">Production Phase</span>
                  <span className="text-sm font-bold italic font-serif">
                    {b.order?.status ? stages.find(s => s.id === b.order.status)?.label : "Inquiry Pending"}
                  </span>
                </div>
                
                {b.order && (
                  <button 
                    onClick={() => { setSelectedOrder(b.order); setIsModalOpen(true); }}
                    className="rounded-full bg-black px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-neutral-800 transition shadow-lg"
                  >
                    Update Stage
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="lux-card w-full max-w-md p-10 animate-in zoom-in-95 duration-300">
              <h2 className="text-xl font-bold mb-2">Transition Phase</h2>
              <div className="space-y-3 mt-8">
                {stages.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => updateStage(selectedOrder.id, stage.id)}
                    className={`w-full p-4 rounded-xl text-left text-[11px] font-bold uppercase tracking-widest transition-all border ${
                      selectedOrder.status === stage.id ? "bg-black text-white" : "bg-neutral-50 text-neutral-400 hover:bg-neutral-100"
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setIsModalOpen(false)} className="mt-8 w-full text-[10px] font-bold uppercase tracking-widest text-neutral-300">Cancel</button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}