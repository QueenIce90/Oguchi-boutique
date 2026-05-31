import Container from "./Container";
import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <Container>
        <div className="py-10 grid gap-6 md:grid-cols-3">
          <div>
            {/* Changed from amber to white for the luxury look */}
            <div className="text-sm font-semibold tracking-[0.18em] text-white">
              {site.name.toUpperCase()}
            </div>
            <p className="mt-2 text-sm text-white/50 font-light">
              Luxury custom gowns and tailoring — designed with intention, crafted with precision.
            </p>
          </div>

          <div className="text-sm text-white/50">
            <div className="font-semibold text-white/90">Quick Links</div>
            <div className="mt-3 grid gap-2">
              <Link href="/gallery" className="hover:text-white transition-colors">Collections</Link>
              <Link href="/services" className="hover:text-white transition-colors">Services & Pricing</Link>
              <Link href="/consultation" className="hover:text-white transition-colors">Consultation</Link>
              <Link href="/policies" className="hover:text-white transition-colors">Policies</Link>
            </div>
          </div>

          <div className="text-sm text-white/50">
            <div className="font-semibold text-white/90">Contact</div>
            <div className="mt-3 grid gap-2">
              <span>NYC / Tri-State</span>
              <span>Email: hello@oguchi.com</span>
              <span>Instagram: @oguchiiboutique</span>
            </div>
          </div>
        </div>

        {/* Added 'pb-32' (bottom padding) to push the lock icon up. 
          This prevents the Floating 'Book Now' button from covering it.
        */}
        <div className="pb-32 flex justify-between items-center text-[10px] text-white/20 uppercase tracking-widest">
          <div>© {new Date().getFullYear()} {site.name}. All rights reserved.</div>
          
          <Link 
            href="/admin/login" 
            className="hover:text-white transition-all duration-500 opacity-50 hover:opacity-100 p-2" 
            aria-label="Admin Login"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-4 w-4"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </Link>
        </div>
      </Container>
    </footer>
  );
}