"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";

const collections = [
  {
    title: "Prom Delight",
    year: "2026",
    image: "/gallery/6.png", 
    description: "Architectural silhouettes met with fluid silk organza.",
    link: "/collections/prom-delight",
  },
  {
    title: "Glitter Love",
    year: "2025",
    image: "/gallery/9.png",
    description: "A celebration of hand-sewn lace and celestial detailing.",
    link: "/collections/glitter-love",
  },
  {
    title: "The Gala Suite",
    year: "2025",
    image: "/gallery/8.png",
    description: "High-voltage glamour for the modern icon.",
    link: "/collections/gala-suite",
  },
  {
    title: "Noir Heritage",
    year: "2024",
    image: "/gallery/13.png",
    description: "Rooted in tradition, redefined for the future.",
    link: "/collections/noir-heritage",
  },
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      
      {/* Cinematic Local Video Hero */}
      <section className="relative h-[65vh] w-full overflow-hidden flex items-center border-b border-white/10">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        >
          {/* Path points to public/Luxury.mp4 */}
          <source src="/Luxury.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Gradient Overlay for solid text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

        <Container className="relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000 text-white">
              Collections
            </h1>
            <p className="mt-6 text-[9px] uppercase tracking-[0.5em] text-white/60 font-light max-w-md leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
              Explore the evolving archives of the House. <br />
              A dialogue between fabric and form.
            </p>
          </div>
        </Container>
      </section>

      {/* Collections Grid */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {collections.map((item, index) => (
              <Link 
                key={item.title} 
                href={item.link} 
                className="group block space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 border border-white/5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Badge */}
                  <div className="absolute top-6 left-6 px-4 py-1.5 border border-white/10 backdrop-blur-md bg-black/20">
                    <span className="text-[9px] font-bold tracking-[0.3em] uppercase">{item.year}</span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex justify-between items-start border-b border-white/5 pb-6">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-serif italic tracking-tight group-hover:pl-3 transition-all duration-700">
                      {item.title}
                    </h2>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 group-hover:text-white transition-colors duration-500">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-2">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1} 
                      stroke="currentColor" 
                      className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-700"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Footer CTA */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <Container>
          <div className="flex flex-col items-center text-center space-y-8">
            <h3 className="text-2xl font-serif italic text-white/80">Your journey into bespoke luxury starts here.</h3>
            <Link
              href="/booking"
              className="rounded-full border border-white px-12 py-5 text-[9px] font-bold uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-700"
            >
              Commission a Custom Piece
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}