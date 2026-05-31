import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "gold" | "ghost";
};

export default function Button({ href, children, variant = "gold" }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black";
  const styles =
    variant === "gold"
      ? "bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-200 text-black hover:brightness-110 focus:ring-amber-200"
      : "border border-white/20 bg-white/5 text-white hover:bg-white/10 focus:ring-white/30";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}