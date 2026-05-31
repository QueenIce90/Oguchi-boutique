"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/Container";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus({ type: 'error', msg: "Passwords do not match." });
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      setStatus({ type: 'success', msg: "Password updated. Redirecting to login..." });
      setTimeout(() => window.location.href = "/login", 2000);
    } else {
      setStatus({ type: 'error', msg: "Invalid or expired token." });
    }
  }

  return (
    <div className="max-w-md mx-auto lux-card p-12 bg-white">
      <h1 className="text-2xl font-serif italic text-center mb-8">New Atelier Password</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">New Password</label>
          <input 
            type="password" 
            className="input" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Confirm Password</label>
          <input 
            type="password" 
            className="input" 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
        </div>
        <button className="w-full rounded-full bg-black py-4 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-neutral-800 transition shadow-lg">
          Update Password
        </button>
        {status && (
          <p className={`text-center text-[10px] font-bold uppercase ${status.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
            {status.msg}
          </p>
        )}
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="lux-gradient min-h-screen flex items-center justify-center">
      <Container>
        <Suspense fallback={<div className="text-neutral-400">Loading Secure Portal...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </Container>
    </div>
  );
}