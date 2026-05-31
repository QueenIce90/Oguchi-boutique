"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import { useSession, signOut } from "next-auth/react";

export default function Nav() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/90 backdrop-blur-2xl">
      <Container>
        <div className="flex h-24 items-center justify-between">
          <Link href="/" className="group flex items-center gap-6">
            <div className="relative h-16 w-16 md:h-20 md:w-20 transition-all duration-700 ease-in-out group-hover:scale-105">
              <Image
                src="/gallery/logo.png" 
                alt="THE HOUSE OF OGUCHI"
                fill
                className="object-contain brightness-200 contrast-125"
                priority
              />
            </div>

            <div className="flex flex-col border-l border-white/10 pl-6 py-1">
              <span className="text-lg md:text-xl font-serif italic tracking-[0.15em] text-white">
                Oguchi
              </span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 mt-0.5 font-light">
                The Art of the Gown
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {["Collections", "Services", "Booking", "About"].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                className="group relative text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all duration-300"
              >
                {label}
                <span className="absolute -bottom-2 left-0 h-[1px] w-0 bg-white transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
            
            {/* Persists as long as the cookie is valid */}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="group relative text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:text-white transition-all duration-300"
              >
                My Portal
                <span className="absolute -bottom-2 left-0 h-[1px] w-full bg-white/40 transition-all duration-500 group-hover:bg-white" />
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6">
              {!isAuthenticated ? (
                <div className="flex items-center gap-5">
                  <Link href="/login" className="text-white/80 hover:text-white transition-all" title="Login">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </Link>
                  <Link href="/signup" className="text-white/80 hover:text-white transition-all" title="Create Account">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  {/* Subtle welcome for the logged in user */}
                  <span className="hidden xl:block text-[9px] uppercase tracking-[0.2em] text-white/20 italic">
                    Signed in as {session?.user?.name?.split(' ')[0]}
                  </span>
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 hover:text-white transition-all border-b border-transparent hover:border-white pb-1"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/booking"
              className="hidden sm:block rounded-full border border-white/80 bg-white/2 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all duration-700 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            >
              Book Now
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}