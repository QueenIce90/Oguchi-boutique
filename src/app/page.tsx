import Container from "@/components/Container";
import Button from "@/components/Button";
import Link from "next/link";
import { site } from "@/lib/site";
import HeroSlideshow from "@/components/HeroSlideshow";

const features = [
  { 
    title: "Global Shipping", 
    desc: "Shipping exclusively throughout the United States and Overseas." 
  },
  { 
    title: "Dress Rentals", 
    desc: "Luxury archives available for rentals, delivered anywhere." 
  },
  { 
    title: "One-of-a-Kind", 
    desc: "Exclusive pieces and express tailoring built for your silhouette." 
  },
];

export default function HomePage() {
  return (
    <div className="lux-gradient min-h-screen">
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              {/* Shipping Badge - Black text for visibility */}
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-black">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                </span>
                Now Shipping Worldwide & Overseas
              </div>

              <h1 className="lux-title mt-8 text-black">
                Uniquely Yours. <br />
                <span className="opacity-60">Created with Speed.</span>
              </h1>
              
              <p className="lux-sub text-black font-medium">
                Specializing in one of a kind custom gowns, professional rentals, and 
                expert tailoring delivered in record time. We bring your vision to life worldwide.
              </p>

               <div className="mt-10 flex flex-wrap gap-4">
                {/* PRIMARY: SOLID BLACK BUBBLE WITH WHITE TEXT */}
              <Link 
                href="/booking" 
                className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-neutral-800 transition shadow-xl"
                >
                {site.ctaPrimary}
                </Link>

                {/* SECONDARY: WHITE BUBBLE WITH BLACK BORDER & BLACK TEXT */}
                <Link 
                href="/gallery" 
                className="border-2 border-black bg-white text-black px-10 py-4 rounded-full font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-black hover:text-white transition shadow-sm"
                >
                {site.ctaSecondary}
                </Link>
              </div>

              {/* Feature Cards */}
              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {features.map((f) => (
                  <div key={f.title} className="lux-card p-6 border-black/10 bg-white/50 backdrop-blur-sm">
                    <div className="text-xs font-bold uppercase tracking-widest text-black">{f.title}</div>
                    <div className="mt-2 text-[13px] text-black/80 leading-relaxed font-medium">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Slideshow */}
            <div className="lux-card p-4 shadow-2xl border-black/5 bg-white">
              <HeroSlideshow />
              <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-black">
                <span>Oguchi Boutique</span>
                <span>Custom Made | Made to Size</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Service Categories - Grid of 4 to include Rentals */}
      <section className="pb-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { title: "Prom Dress", desc: "Original designs no one else will have." },
              { title: "Bridal Dress", desc: "Exclusive couture for your sacred day." },
              { title: "Evening Gown | Dress Rentals", desc: "High-end archives for your events and evening gowns for the night. " },
              { title: "Tailoring", desc: "High-speed professional alterations." },
            ].map((c) => (
              <div key={c.title} className="lux-card p-8 group border-black/10 hover:border-black hover:bg-black transition-all duration-500" >
                <div className="text-xl font-bold tracking-tight text-black group-hover:text-white transition-colors">
                  {c.title}
                </div>
                <p className="mt-3 text-black text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                  {c.desc}
                </p>
                <div className="mt-6">
                  <Link href="/gallery" className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-4 text-black group-hover:text-white">
                    Explore Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}