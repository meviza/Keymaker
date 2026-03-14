"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

const PUBLIC_PATHS = [
  "/",
  "/landing",
  "/pricing",
  "/services",
  "/support",
  "/privacy",
  "/terms",
  "/cookies",
  "/contact",
  "/demo",
  "/login",
];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyber-dark via-cyber-black to-cyber-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-green/20 to-transparent z-50" />
        <div className="p-8">{children}</div>
      </main>
    </>
  );
}
