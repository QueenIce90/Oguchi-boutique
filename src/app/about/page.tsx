"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 border-b border-white/10">
        <Container>
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-8xl font-serif italic tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000">
              OGUCHI BOUTIQUE
            </h1>
            <p className="mt-8 text-[11px] uppercase tracking-[0.6em] text-white/40 font-light max-w-lg leading-relaxed">
              Show craftsmanship rooted in Nigerian heritage and perfected in the heart of Brooklyn.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Narrative Section */}
      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Storefront Image */}
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 group">
              <Image
                src="/store_front.png" 
                alt="THE HOUSE OF OGUCHI Storefront"
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl font-serif italic tracking-tight text-white">Helen</h2>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/60 font-bold">Founder & Creative Director</p>
              </div>

              <div className="space-y-8 text-sm leading-relaxed text-white/80 font-light">
                <p>
                  For over a decade, Helen has been a cornerstone of the Flatbush fashion landscape. 
                  A Nigerian visionary from Africa, she brings a rich cultural tapestry to the heart of 
                  Brooklyn, merging traditional aesthetics with modern couture.
                </p>
                <p>
                  At THE HOUSE OF OGUCHI, we believe perfection is the only standard. Every gown 
                  is an original masterpiece, constructed from scratch and meticulously tailored 
                  to the unique proportions of the wearer.
                </p>
                <p>
                  Helen’s true passion for fashion is woven into every stitch. Whether it is a 
                  breathtaking bridal ensemble or a high-voltage prom gown, her commitment to 
                  show excellence ensures that every client leaves with a piece of art that 
                  is made to size and made for history.
                </p>
              </div>

              {/* Location Details - Correcting the visual address */}
              <div className="pt-12 border-t border-white/10 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Visit the Boutique</span>
                <p className="text-2xl font-serif italic">853 Flatbush Ave, Brooklyn, NY 11226</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">Open by Appointment or Walk-In</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values Grid */}
      <section className="py-24 bg-white/[0.02] border-t border-b border-white/5">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="space-y-4">
              <span className="text-3xl">🇳🇬</span>
              <h3 className="text-[11px] font-black uppercase tracking-widest">Nigerian Roots</h3>
              <p className="text-[10px] text-white/40 uppercase leading-loose tracking-widest">Global perspective, African soul.</p>
            </div>
            <div className="space-y-4">
              <span className="text-3xl">✂️</span>
              <h3 className="text-[11px] font-black uppercase tracking-widest">Made to Size</h3>
              <p className="text-[10px] text-white/40 uppercase leading-loose tracking-widest">Zero compromise on the silhouette.</p>
            </div>
            <div className="space-y-4">
              <span className="text-3xl">📍</span>
              <h3 className="text-[11px] font-black uppercase tracking-widest">Flatbush Legacy</h3>
              <p className="text-[10px] text-white/40 uppercase leading-loose tracking-widest">Serving Brooklyn for over 10 years.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer CTA */}
      <section className="py-32">
        <Container>
          <div className="flex flex-col items-center text-center space-y-12">
            <h3 className="text-3xl md:text-5xl font-serif italic max-w-2xl leading-tight">
              Experience the perfection of Oguchi.
            </h3>
            <Link
              href="/booking"
              className="rounded-full border border-white px-16 py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-700 shadow-2xl"
            >
              Consult with Helen
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}