"use client";

import { useState, useEffect } from "react";
import Container from "@/components/Container";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch user bookings and profile
    async function loadDashboard() {
      try {
        const res = await fetch("/api/client/dashboard");
        const data = await res.json();

        if (res.status === 401) {
          router.push("/login"); // Redirect if session expired
          return;
        }

        if (data.ok) {
          setBookings(data.bookings || []);
          setUserName(data.user?.fullName || "Client");
        }
      } catch (err) {
        console.error("DASHBOARD_LOAD_ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-black py-20 font-sans selection:bg-black selection:text-white">
      <Container>
        <div className="max-w-5xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-black/5 pb-10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">
                Welcome, {userName}
              </span>
              <h1 className="text-5xl md:text-6xl font-serif italic mt-2 tracking-tight">Oguchi Tracker </h1>
            </div>
            
            <div className="flex gap-4">
               <Link 
                href="/dashboard/chat"
                className="bg-black text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-neutral-800 transition flex items-center gap-3"
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Chat with a Assistant 
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Left Column: Appointments List */}
            <div className="lg:col-span-2 space-y-10">
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40">
                Active Fittings & Consultations
              </h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-32 w-full bg-neutral-50 animate-pulse rounded-[2rem]" />
                  ))}
                </div>
              ) : bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="group border-2 border-black p-8 rounded-[2.5rem] hover:bg-neutral-50 transition-all duration-500 flex justify-between items-center"
                    >
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          {booking.service}
                        </p>
                        <h3 className="text-3xl font-serif italic">
                          {new Date(booking.eventDate).toLocaleDateString('en-US', { 
                            weekday: 'long', month: 'long', day: 'numeric' 
                          })}
                        </h3>
                        <div className="flex items-center gap-4 pt-1">
                          <span className="text-sm font-bold tracking-tight">
                            {new Date(booking.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-[10px] uppercase tracking-widest font-black text-black/20">|</span>
                          <span className="text-[10px] uppercase tracking-widest font-black text-black">Atelier Brooklyn</span>
                        </div>
                      </div>
                      
                      <div className="hidden sm:block text-right">
                        <div className="inline-block px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                          Confirmed
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-black/10 py-20 rounded-[2.5rem] text-center">
                  <p className="text-sm text-neutral-400 italic mb-8">Your
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                   archives are currently empty.</p>
                  <Link 
                    href="/booking" 
                    className="inline-block text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:text-neutral-500 hover:border-neutral-500 transition"
                  >
                    Request a Consultation
                  </Link>
                </div>
              )}
            </div>

            {/* Right Column: Support & Details */}
            <div className="space-y-12">
              
              {/* Order Tracking Section */}
              <section className="bg-neutral-50 p-10 rounded-[2.5rem] border border-black/5">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8">Status of Order</h3>
                <div className="space-y-6">
                  <StatusItem label="Initial Inquiry" completed />
                  <StatusItem label="Consultation" completed />
                  <StatusItem label="Fabric Selection" />
                  <StatusItem label="First Fitting" />
                  <StatusItem label="Final Review" />
                </div>
                <p className="text-[9px] italic text-neutral-400 mt-10 leading-relaxed border-t border-black/5 pt-6 uppercase tracking-tighter">
                  Detailed production tracking is activated following your first in-person fitting at our Flatbush Atelier.
                </p>
              </section>

              {/* Direct Support Section */}
              <section className="p-10 border-2 border-black rounded-[2.5rem] space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Atelier Support</h3>
                <p className="text-[12px] leading-relaxed text-neutral-600 font-medium">
                  Have a question for our tailoring team or need to adjust your measurements? We are here to assist.
                </p>
                <div className="pt-4 flex flex-col gap-4">
                  <Link href="/dashboard/chat" className="text-[10px] font-black uppercase border-b-2 border-black pb-1 w-fit">
                    Message Tailoring Team
                  </Link>
                  <button onClick={() => window.print()} className="text-[10px] font-black uppercase border-b-2 border-black pb-1 w-fit opacity-40">
                    Export Design Profile
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function StatusItem({ label, completed = false }: { label: string; completed?: boolean }) {
  return (
    <div className={`flex justify-between items-center ${completed ? "opacity-100" : "opacity-20"}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      <div className={`w-3 h-3 rounded-full ${completed ? "bg-black" : "border border-black"}`} />
    </div>
  );
}