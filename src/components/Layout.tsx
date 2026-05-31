import { ReactNode } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import Providers from "./Providers"; // Import the provider we just made

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="min-h-dvh bg-black text-white selection:bg-white selection:text-black">
        <Nav />
        <main>{children}</main>
        <Footer />
      </div>
    </Providers>
  );
}