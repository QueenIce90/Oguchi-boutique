"use client";

import { useState } from "react";
import { signIn } from "next-auth/react"; // Use NextAuth helper
import Container from "@/components/Container";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // NextAuth handles the session cookie automatically
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevents page reload so we can handle errors
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    } else {
      // Success: Redirect to dashboard/profile
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <Container>
        <div className="max-w-[320px] mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl font-serif italic tracking-wide mb-3 text-white">Welcome Back</h1>
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-light">
              Enter the House of Oguchi Boutique
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <input 
                type="email" 
                required
                placeholder="EMAIL ADDRESS"
                className="w-full bg-transparent border-b border-white/10 py-4 text-[10px] text-center uppercase tracking-[0.2em] focus:outline-none focus:border-white transition-all duration-500 placeholder:text-white/20"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="password" 
                required
                placeholder="PASSWORD"
                className="w-full bg-transparent border-b border-white/10 py-4 text-[10px] text-center uppercase tracking-[0.2em] focus:outline-none focus:border-white transition-all duration-500 placeholder:text-white/20"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-[8px] text-center text-red-400 uppercase tracking-widest animate-pulse">
                {error}
              </p>
            )}

            <button 
              disabled={loading}
              className="w-full py-4 rounded-full border border-white/10 bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all duration-700 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>

          <div className="mt-12 flex flex-col items-center gap-4">
            <Link href="/signup" className="text-[9px] uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors">
              Request Access / Sign Up
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}