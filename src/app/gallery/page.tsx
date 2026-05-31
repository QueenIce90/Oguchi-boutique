"use client";

import Container from "@/components/Container";
import { categories, gallery } from "@/lib/gallery";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function GalleryPage() {
  const [active, setActive] = useState<(typeof categories)[number]["key"]>("All");

  const items = useMemo(() => {
    if (active === "All") return gallery;
    return gallery.filter((g) => g.category === active);
  }, [active]);

  return (
    <div className="lux-gradient py-14">
      <Container>
        <h1 className="lux-title">Collections</h1>
        <p className="lux-sub">Browse prom, bridal, evening, redesigns, and transformations.</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={`rounded-full px-4 py-2 text-sm border transition ${
                active === c.key
                  ? "border-amber-200 bg-amber-200/10 text-amber-200"
                  : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.id} className="lux-card overflow-hidden">
              <div className="relative aspect-[4/5] w-full bg-white/5">
                <Image
                  src={it.image}
                  alt={it.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-amber-200">{it.category}</div>
                    <div className="text-lg font-semibold">{it.title}</div>
                    <div className="mt-1 text-sm text-white/70">{it.priceHint}</div>
                  </div>
                  <Link
                    href="/booking"
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 lux-card p-6">
          <div className="text-sm text-white/70">
            Tip: Replace placeholders with your real dress images and AI model editorials in{" "}
            <span className="text-amber-200">/public/gallery</span>.
          </div>
        </div>
      </Container>
    </div>
  );
}