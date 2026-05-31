"use client";

import Container from "@/components/Container";
import { useState, useEffect } from "react";

const services = ["Prom Gown", "Wedding Dress", "Evening Gown", "Alterations", "Custom Redesign"] as const;

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "Prom Gown" as (typeof services)[number],
    eventDate: "",
    preferredDate: "",
    preferredTime: "",
    budget: "",
    height: "",
    bust: "",
    waist: "",
    hips: "",
    dressSize: "",
    shoeSize: "",
    inspoLinks: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/admin/slots")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          let rawSlots = Array.isArray(data.slots) ? data.slots : 
                         data.groupedSlots ? Object.values(data.groupedSlots).flat() : [];
          setAvailableSlots(rawSlots);
        }
      })
      .catch(() => setError("Schedule is fully booked."));
  }, []);

  const onChange = (key: keyof typeof form) => (e: any) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const nextStep = () => setStep((p) => p + 1);
  const prevStep = () => setStep((p) => p - 1);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      
      if (!selectedSlotId) throw new Error("Please select a specific consultation time on Step 3.");
      fd.append("slotId", selectedSlotId);
      files.forEach((f) => fd.append("files", f));

      const res = await fetch("/api/booking", { method: "POST", body: fd });
      const data = await res.json();
      
      if (!res.ok || !data.ok) throw new Error(data?.error || "Submission failed.");

      // Success Redirect
      window.location.href = `/booking/success?name=${encodeURIComponent(form.fullName)}&service=${encodeURIComponent(form.service)}&date=${encodeURIComponent(form.preferredDate)}&time=${encodeURIComponent(form.preferredTime)}`;
      
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white py-20 text-black font-sans">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif italic tracking-tight mb-4 text-black">Book Your Consultation</h1>
            <p className="text-[11px] font-black uppercase tracking-[0.4em]">Oguchi Boutique Bespoke Service</p>
          </div>

          <div className="bg-white border-2 border-black rounded-[2.5rem] relative overflow-hidden min-h-[550px] flex flex-col shadow-sm">
            <div className="h-2 w-full bg-neutral-100">
              <div className="h-full bg-black transition-all duration-700" style={{ width: `${(step / 3) * 100}%` }} />
            </div>

            <form onSubmit={submit} className="p-8 md:p-12 flex-grow flex flex-col">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="label-black text-[11px] font-black uppercase">Step 01 — Personal Details</h2>
                  <Field label="Full Name">
                    <input className="input-black" value={form.fullName} onChange={onChange("fullName")} required placeholder="First and Last Name" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Email Address">
                      <input type="email" className="input-black" value={form.email} onChange={onChange("email")} required placeholder="email@example.com" />
                    </Field>
                    <Field label="Phone Number">
                      <input className="input-black" value={form.phone} onChange={onChange("phone")} placeholder="(000) 000-0000" />
                    </Field>
                  </div>
                  <Field label="Service Interest">
                    <select className="input-black appearance-none bg-white" value={form.service} onChange={onChange("service")}>
                      {services.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="label-black text-[11px] font-black uppercase">Step 02 — Measurements</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Height">
                      <input className="input-black" placeholder='e.g. 5"7' value={form.height} onChange={onChange("height")} />
                    </Field>
                    <Field label="Standard Dress Size">
                      <input className="input-black" placeholder="e.g. 6 / M" value={form.dressSize} onChange={onChange("dressSize")} />
                    </Field>
                    <Field label="Bust (inches)">
                      <input className="input-black" placeholder="e.g. 34" value={form.bust} onChange={onChange("bust")} />
                    </Field>
                    <Field label="Waist (inches)">
                      <input className="input-black" placeholder="e.g. 26" value={form.waist} onChange={onChange("waist")} />
                    </Field>
                    <Field label="Hips (inches)">
                      <input className="input-black" placeholder="e.g. 36" value={form.hips} onChange={onChange("hips")} />
                    </Field>
                    <Field label="Shoe Size">
                      <input className="input-black" placeholder="e.g. 8" value={form.shoeSize} onChange={onChange("shoeSize")} />
                    </Field>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="label-black text-[11px] font-black uppercase">Step 03 — Appointment & Vision</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Event Date">
                      <input type="date" className="input-black font-bold" value={form.eventDate} onChange={onChange("eventDate")} required />
                    </Field>
                    <Field label="Expected Budget">
                      <input className="input-black" placeholder="e.g. $1,500+" value={form.budget} onChange={onChange("budget")} required />
                    </Field>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-black ml-1">Select Available Consultation Time</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availableSlots.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setSelectedSlotId(s.id);
                            setForm(p => ({
                              ...p,
                              preferredDate: new Date(s.startAt).toLocaleDateString(),
                              preferredTime: new Date(s.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }));
                          }}
                          className={`p-4 text-[11px] font-black rounded-xl border-2 transition-all text-center ${
                            selectedSlotId === s.id ? "border-black bg-black text-white shadow-xl scale-[1.03]" : "border-black/20 bg-white text-black hover:border-black"
                          }`}
                        >
                          {new Date(s.startAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}<br />
                          <span className="font-bold">{new Date(s.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Field label="Reference Images">
                     <input type="file" multiple className="input-black file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-black file:text-white cursor-pointer" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
                  </Field>

                  <Field label="Design Notes">
                    <textarea className="input-black min-h-[100px] resize-none" value={form.notes} onChange={onChange("notes")} placeholder="Details on silhouette, fabric, or vision..." />
                  </Field>
                </div>
              )}

              <div className="mt-auto pt-10 flex items-center justify-between">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="text-[11px] font-black uppercase border-b-2 border-black pb-1 hover:opacity-50 transition">Back</button>
                ) : <div />}
                {step < 3 ? (
                  <button type="button" onClick={nextStep} className="rounded-full bg-black px-14 py-5 text-[11px] font-black uppercase text-white hover:bg-neutral-800 transition shadow-2xl">Next Step</button>
                ) : (
                  <button disabled={loading} className="rounded-full bg-black px-14 py-5 text-[11px] font-black uppercase text-white hover:bg-neutral-800 transition shadow-2xl disabled:opacity-50">
                    {loading ? "Processing..." : "Finalize Booking"}
                  </button>
                )}
              </div>
              {error && <div className="mt-6 p-4 bg-red-50 border-2 border-red-500 rounded-2xl text-[11px] text-red-600 text-center font-black uppercase tracking-widest">{error}</div>}
            </form>
          </div>
        </div>

        <style jsx global>{`
          .input-black {
            width: 100%; border-radius: 1.2rem; border: 2px solid rgba(0,0,0,0.2);
            background: #fff; padding: 1.2rem 1.5rem; font-size: 0.95rem; font-weight: 700;
            color: #000; outline: none; transition: all 0.2s ease;
          }
          .input-black:focus { border-color: #000; box-shadow: 0 0 0 1px #000; }
        `}</style>
      </Container>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <label className="text-[11px] font-black uppercase tracking-widest text-black ml-1">{label}</label>
      {children}
    </div>
  );
}