import Container from "@/components/Container";
import { pricing } from "@/lib/pricing";

function PricingGrid({ title, items }: { title: string; items: { title: string; range: string; note?: string }[] }) {
  return (
    <section className="mt-16">
      <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400 mb-6">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it) => (
          <div key={it.title} className="lux-card p-8 border-neutral-100 hover:border-black transition-colors duration-500">
            <div className="flex items-baseline justify-between gap-4">
              <div className="text-xl font-medium tracking-tight text-black">{it.title}</div>
              <div className="text-sm font-bold text-black tracking-widest">{it.range}</div>
            </div>
            {it.note ? <p className="mt-3 text-sm text-neutral-500 leading-relaxed font-light">{it.note}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <div className="lux-gradient min-h-screen py-20">
      <Container>
        <div className="max-w-3xl">
          <h1 className="lux-title">Pricing</h1>
          <p className="lux-sub">
            Transparent investment ranges for one-of-a-kind creations. Final investment depends on fabric selection, 
            design complexity, and hand-finished detailing.
          </p>
        </div>

        <PricingGrid title="Custom Gowns" items={pricing.custom} />
        <PricingGrid title="Tailoring & Express Alterations" items={pricing.alterations} />
        <PricingGrid title="Luxury Details" items={pricing.addOns} />

        {/* The "Included" Section: Now styled as a professional footer block */}
        <div className="mt-20 lux-card p-10 border-neutral-200 bg-neutral-50/50">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-black">
            The Custom Experience Includes:
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <ul className="list-none space-y-4 text-sm text-neutral-600">
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-black" /> 
                Individual design & silhouette consultation
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-black" /> 
                Professional measurement & fit strategy
              </li>
            </ul>
            <ul className="list-none space-y-4 text-sm text-neutral-600">
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-black" /> 
                Master-level construction & premium finishing
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-black" /> 
                Final fitting reveal & precise adjustments
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}