"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingBookingButton() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // 1. Hook must be called before any return statements
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // 2. NOW we check if we should hide it. 
  // This prevents the "Rendered fewer hooks" error.
  const isHiddenPage = pathname === "/booking" || pathname.startsWith("/admin");
  if (isHiddenPage) return null;

  return (
    <div
      className={`fixed bottom-8 left-8 z-50 transition-all duration-700 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      }`}
    >
      <Link
        href="/booking"
        className="flex items-center gap-3 rounded-full bg-black border border-white/10 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-white hover:text-black transition-all duration-500 active:scale-95"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
        Book Your Design
      </Link>
    </div>
  );
}