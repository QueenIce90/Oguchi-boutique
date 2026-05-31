"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";

function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Auto-capture data from the booking success redirect
  const prefillEmail = searchParams.get("email") || "";
  const prefillName = searchParams.get("name") || "";

  const [form, setForm] = useState({
    fullName: prefillName,
    email: prefillEmail,
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Signup failed");

      // Redirect to login or directly to the new dashboard
      router.push("/login?message=Account created. Please sign in to access your portal.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Field label="Full Name">
          <input
            required
            className="input-black"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Helen Alexander"
          />
        </Field>

        <Field label="Email Address">
          <input
            required
            type="email"
            className="input-black"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="client@example.com"
          />
        </Field>

        <Field label="Phone Number">
          <input
            type="tel"
            className="input-black"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="(000) 000-0000"
          />
        </Field>

        <Field label="Create Password">
          <input
            required
            type="password"
            className="input-black"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </Field>
      </div>

      {error && (
        <p className="text-[10px] font-black uppercase tracking-widest text-red-600 text-center bg-red-50 py-3 rounded-xl border border-red-100">
          {error}
        </p>
      )}

      <button
        disabled={loading}
        className="w-full bg-black text-white py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-neutral-800 transition disabled:opacity-50"
      >
        {loading ? "Creating Portal..." : "Activate Client Portal"}
      </button>
    </form>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white py-20 text-black font-sans">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif italic tracking-tight mb-4">Join the House of Oguchi</h1>
            <p className="text-[11px] uppercase tracking-[0.4em] text-neutral-400 font-black">
              Oguchi Boutique
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-[2.5rem] p-8 md:p-12 shadow-sm">
            <Suspense fallback={<p className="text-center animate-pulse text-[10px] font-black uppercase">Loading...</p>}>
              <SignupForm />
            </Suspense>

            <div className="mt-8 text-center border-t border-neutral-100 pt-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Already have a portal?{" "}
                <Link href="/login" className="text-black border-b border-black pb-0.5 ml-1">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>

      <style jsx global>{`
        .input-black {
          width: 100%;
          border-radius: 1.2rem;
          border: 2px solid rgba(0, 0, 0, 0.1);
          background: #fff;
          padding: 1.1rem 1.4rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: #000;
          outline: none;
          transition: all 0.2s ease;
        }
        .input-black:focus {
          border-color: #000;
        }
        .input-black::placeholder {
          color: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}