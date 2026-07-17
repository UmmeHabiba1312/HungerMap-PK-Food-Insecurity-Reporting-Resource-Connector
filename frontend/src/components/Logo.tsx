import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Logo({
  href = "/",
  className = "",
  size = "md",
}: {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const box =
    size === "sm"
      ? "w-7 h-7 rounded-lg"
      : size === "lg"
      ? "w-11 h-11 rounded-xl"
      : "w-9 h-9 rounded-lg";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  const icon = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";

  return (
    <Link href={href} className={`flex items-center gap-2.5 group ${className}`}>
      <span className="relative inline-flex">
        <span className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[inherit] blur-md opacity-60 group-hover:opacity-90 transition-all duration-300 group-hover:blur-lg" />
        <span
          className={`relative ${box} bg-gradient-to-br from-emerald-500 via-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300`}
        >
          <Leaf className={`${icon} text-white`} />
        </span>
      </span>
      <span className="font-extrabold tracking-tight text-foreground">
        Hunger<span className="text-emerald-400">Map</span>
        <span className="text-emerald-500 font-bold">{size === "lg" ? " PK" : "PK"}</span>
      </span>
    </Link>
  );
}
