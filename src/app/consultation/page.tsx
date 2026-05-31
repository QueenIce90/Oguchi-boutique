import Container from "@/components/Container";
import Button from "@/components/Button";

const consults = [
  {
    title: "Style Consultation (30 min)",
    desc: "Direction, budget alignment, silhouettes, and timeline.",
    price: "Consult Fee (set amount)",
  },
  {
    title: "Design Consultation (60 min)",
    desc: "Design planning + fabric approach + estimated quote range.",
    price: "Consult Fee (set amount)",
  },
  {
    title: "Bridal Atelier Consultation (90 min)",
    desc: "Couture bridal planning, fitting calendar, detail mapping.",
    price: "Consult Fee (set amount)",
  },
];

export default function ConsultationPage() {
  return (
    <div className="lux-gradient py-14">
      <Container>
        <h1 className="lux-title">Consultation</h1>
        <p className="lux-sub">
          Your luxury experience begins here. We’ll refine your vision and map a clear plan to execution.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {consults.map((c) => (
            <div key={c.title} className="lux-card p-7">
              <div className="text-lg font-semibold">{c.title}</div>
              <p className="mt-2 text-sm text-white/70">{c.desc}</p>
              <div className="mt-4 text-sm font-semibold text-amber-200">{c.price}</div>
              <div className="mt-6">
                <Button href="/booking" variant="gold">Book</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 lux-card p-7">
          <div className="text-lg font-semibold">What to bring</div>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-white/70">
            <li>Inspiration photos (3–10 images)</li>
            <li>Event date + venue vibe</li>
            <li>Preferred colors + fabric ideas</li>
            <li>Shoe height + undergarment plans</li>
          </ul>

          <div className="mt-6 text-sm text-white/60">
            Tip: You can apply the consultation fee toward your gown when you book within a set window (optional).
          </div>
        </div>
      </Container>
    </div>
  );
}