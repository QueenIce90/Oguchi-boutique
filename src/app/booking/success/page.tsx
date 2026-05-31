"use client";

import { useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import Link from "next/link";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Guest";
  const service = searchParams.get("service") || "Consultation";
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  return (
    <div className="min-h-screen bg-white text-black py-24 animate-in fade-in duration-1000">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* ICON / LOGO */}
          <div className="mb-12 flex justify-center">
            <div className="w-16 h-16 rounded-full border border-black/5 flex items-center justify-center">
              <span className="text-2xl italic font-serif">O</span>
            </div>
          </div>

          <h1 className="text-4xl font-serif italic tracking-tight mb-6">
            Thank You, {name}.
          </h1>
          
          <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-bold mb-16 leading-relaxed">
            Your request for a bespoke {service} has been received. <br />
            Oguchi Boutique is preparing for your arrival.
          </p>

          {/* APPOINTMENT CARD */}
          <div className="bg-neutral-50 rounded-[2.5rem] p-12 border border-black/[0.03] mb-16 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <span className="text-[8px] uppercase tracking-widest text-black/30 font-bold">Consultation Date</span>
                <p className="text-lg font-serif italic mt-1">{date || "TBD"}</p>
              </div>
              <div>
                <span className="text-[8px] uppercase tracking-widest text-black/30 font-bold">Scheduled Time</span>
                <p className="text-lg font-serif italic mt-1">{time || "TBD"}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            <Link 
              href="/profile" 
              className="px-12 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-neutral-800 transition-all shadow-2xl"
            >
              Enter Your Client Portal
            </Link>
            
            <Link 
              href="/" 
              className="text-[9px] uppercase tracking-[0.3em] text-black/30 hover:text-black transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}