import Container from "@/components/Container";
import Button from "@/components/Button";

export default function ContactPage() {
  return (
    <div className="lux-gradient py-14">
      <Container>
        <h1 className="lux-title">Contact</h1>
        <p className="lux-sub">Send an inquiry or book a consultation to begin.</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="lux-card p-7">
            <div className="text-lg font-semibold">Inquiry Form (placeholder)</div>
            <p className="mt-2 text-sm text-white/70">
              We can connect this to email or a CRM next. For now, use booking for fastest response.
            </p>

            <div className="mt-6 grid gap-3">
              <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm" placeholder="Name" />
              <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm" placeholder="Email" />
              <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm" placeholder="Event Date" />
              <textarea className="min-h-[140px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm" placeholder="Tell us what you're looking for..." />
              <div className="flex gap-3">
                <Button href="/booking" variant="gold">Book Instead</Button>
                <Button href="/policies" variant="ghost">View Policies</Button>
              </div>
            </div>
          </div>

          <div className="lux-card p-7">
            <div className="text-lg font-semibold">Studio Info</div>
            <div className="mt-4 text-sm text-white/70 grid gap-2">
              <div>Location: NYC / Tri-State (update)</div>
              <div>Email: hello@oguchi.com (update)</div>
              <div>Instagram: @oguchiiboutique</div>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              For urgent timelines, select <span className="text-amber-200 font-semibold">Rush</span> during booking.
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}