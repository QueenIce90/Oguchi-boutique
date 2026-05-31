"use client";

import { useState } from "react";
import Container from "@/components/Container";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setMessage("If an account exists, a reset link has been sent to your email.");
  }

  return (
    <div className="lux-gradient min-h-screen flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto lux-card p-12 bg-white">
          <h1 className="text-2xl font-serif italic text-center mb-6">Recover Access</h1>
          <p className="text-[10px] text-center uppercase tracking-widest text-neutral-400 mb-8">
            Enter your email to receive a secure reset link.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Email Address</label>
              <input 
                type="email" 
                className="input" 
                required 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <button className="w-full rounded-full bg-black py-4 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-neutral-800 transition shadow-lg">
              Send Reset Link
            </button>
            {message && <p className="text-center text-xs font-bold text-black uppercase tracking-tighter">{message}</p>}
          </form>
        </div>
      </Container>
    </div>
  );
}