import Container from "@/components/Container";

export default function PoliciesPage() {
  return (
    <div className="lux-gradient py-14">
      <Container>
        <h1 className="lux-title">Policies</h1>
        <p className="lux-sub">Clear expectations create a luxury experience for everyone.</p>

        <div className="mt-10 lux-card p-7 space-y-6 text-sm text-white/70">
          <div>
            <div className="text-white font-semibold">Deposits</div>
            <p className="mt-2">Custom gowns require a deposit to begin production. Deposits are non-refundable once work starts.</p>
          </div>
          <div>
            <div className="text-white font-semibold">Rescheduling</div>
            <p className="mt-2">Please reschedule at least 24–48 hours in advance to avoid fees (update your rule).</p>
          </div>
          <div>
            <div className="text-white font-semibold">Rush Services</div>
            <p className="mt-2">Rush timelines may require expedited fees (+20% to +60%) depending on complexity and deadline.</p>
          </div>
          <div>
            <div className="text-white font-semibold">Fittings</div>
            <p className="mt-2">Fittings are essential for perfect fit. Bring shoes and intended undergarments when possible.</p>
          </div>
        </div>
      </Container>
    </div>
  );
}