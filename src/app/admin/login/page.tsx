"use client";

import { useState } from "react";
import Container from "@/components/Container";

export default function AdminLoginPage() {
  // State for Login
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for Recovery Flow
  const [isRecovering, setIsRecovering] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryStatus, setRecoveryStatus] = useState<"idle" | "sent" | "verified">("idle");

  // Handle Standard Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    if (password === process.env.NEXT_PUBLIC_ADMIN_KEY) {
      sessionStorage.setItem("atelier_access", "granted");
      window.location.href = "/admin/management";
    } else {
      setTimeout(() => {
        setError(true);
        setLoading(false);
      }, 600);
    }
  };

  // Handle Requesting Verification Code
  const handleRequestRecovery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/recover", { method: "POST" });
      if (res.ok) {
        setRecoveryStatus("sent");
        setIsRecovering(true);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <Container>
        <div className="max-w-[300px] mx-auto text-center">
          
          {/* THE SUITE BRANDING */}
          <div className="mb-16">
            <h1 className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 mb-3">
              The House of Oguchi
            </h1>
            <h2 className="text-2xl font-serif italic tracking-widest text-white">
              {isRecovering ? "Access Recovery" : "The Suite"}
            </h2>
            <div className="mt-4 flex justify-center">
              <div className="h-[1px] w-8 bg-white/20"></div>
            </div>
          </div>

          {!isRecovering ? (
            /* STANDARD LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="relative group">
                <input 
                  type="password" 
                  required
                  autoFocus
                  placeholder="ENTER PASSCODE"
                  className="w-full bg-transparent border-b border-white/10 py-4 text-[10px] text-center uppercase tracking-[0.4em] text-white focus:outline-none focus:border-white transition-all duration-700 placeholder:text-white/10"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-[9px] text-red-500 uppercase tracking-[0.2em] font-medium animate-pulse">
                  Access Denied • Unauthorized
                </p>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 rounded-full border border-white/10 bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all duration-700 active:scale-95 disabled:opacity-20"
              >
                {loading ? "Authorizing..." : "Enter The Suite"}
              </button>

              <div className="mt-6">
                <button 
                  type="button"
                  onClick={handleRequestRecovery}
                  className="text-[8px] uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors underline underline-offset-4"
                >
                  Forgot Passcode?
                </button>
              </div>
            </form>
          ) : (
            /* RECOVERY CODE ENTRY FORM */
            <div className="space-y-8">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 leading-relaxed">
                A 6-digit Maison Code has been dispatched to your registered email.
              </p>
              
              <input 
                type="text" 
                maxLength={6}
                placeholder="000000"
                className="w-full bg-transparent border-b border-white/10 py-4 text-2xl text-center tracking-[0.5em] text-white focus:outline-none focus:border-white transition-all duration-700 placeholder:text-white/10"
                onChange={(e) => setVerificationCode(e.target.value)}
              />

              <button 
                onClick={() => {
                  /* Here you would call a second API to verify the code */
                  window.location.reload(); // Temporary fallback
                }}
                className="w-full py-4 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-200 transition-all duration-700"
              >
                Verify Code
              </button>

              <button 
                onClick={() => setIsRecovering(false)}
                className="block w-full text-[8px] uppercase tracking-[0.2em] text-white/20 hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}

          {/* BACK TO PUBLIC SITE */}
          {!isRecovering && (
            <div className="mt-16">
              <button 
                type="button"
                onClick={() => window.location.href = "/"}
                className="text-[9px] uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors duration-500 font-light"
              >
                Return to Collections
              </button>
            </div>
          )}

        </div>
      </Container>
    </div>
  );
}