import "./globals.css";
import type { Metadata } from "next";
import Layout from "@/components/Layout";
import FloatingBookingButton from "@/components/FloatingBookingButton";

export const metadata: Metadata = {
  title: "THE HOUSE OF OGUCHI — Custom Couture",
  description: "Luxury custom prom, bridal, and evening gowns with expert tailoring.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 1. Added suppressHydrationWarning here to handle minor attribute mismatches 
    // from browser extensions or layout shifts.
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Layout>
          {children}
        </Layout>
        
        <FloatingBookingButton />
      </body>
    </html>
  );
}