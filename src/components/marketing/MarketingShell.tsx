"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Shield } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/services", label: "Hizmetler" },
  { href: "/pricing", label: "Fiyatlandirma" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Iletisim" },
];

const LEGAL_ITEMS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/cookies", label: "Cookies" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link href={href} className={`text-sm transition-colors ${active ? "text-white" : "text-stone-400 hover:text-stone-100"}`}>
      {label}
    </Link>
  );
}

export function MarketingShell({
  children,
  title,
  eyebrow,
  intro,
}: {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
  intro?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#12322b_0%,#08110f_28%,#050505_65%)] text-stone-100">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(180deg,rgba(250,204,21,0.08),transparent)]" />
        <div className="absolute -left-16 top-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07100d]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-300/10">
              <Shield className="h-5 w-5 text-emerald-200" />
            </div>
            <div>
              <div className="font-[family:var(--font-display)] text-xl tracking-tight">Keymaker</div>
              <div className="text-xs uppercase tracking-[0.24em] text-stone-500">Enterprise Security Operating System</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="text-sm text-stone-400 transition-colors hover:text-white">
              Operator Login
            </Link>
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-200 px-4 py-2 text-sm font-medium text-stone-950">
              Demo Talep Et <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button onClick={() => setOpen((value) => !value)} className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-stone-200 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {open && (
          <div className="border-t border-white/10 px-6 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}
              <NavLink href="/login" label="Operator Login" />
              <NavLink href="/demo" label="Demo Talep Et" />
            </div>
          </div>
        )}
      </header>

      <div className="relative z-10">
        {(title || eyebrow || intro) && (
          <section className="mx-auto max-w-7xl px-6 pt-16 pb-10">
            {eyebrow && (
              <div className="mb-4 inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-emerald-100">
                {eyebrow}
              </div>
            )}
            {title && <h1 className="max-w-4xl font-[family:var(--font-display)] text-5xl leading-none text-stone-50 md:text-7xl">{title}</h1>}
            {intro && <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-300">{intro}</p>}
          </section>
        )}

        <main>{children}</main>

        <footer className="mt-24 border-t border-white/10 bg-black/30">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <div className="font-[family:var(--font-display)] text-2xl">Keymaker</div>
              <p className="mt-4 max-w-md text-sm leading-7 text-stone-400">
                Agentic AppSec, cloud security ve guvenli yazilim yasam dongusunu tek bir isletim katmaninda birlestiren platform.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-200">Company</div>
              <div className="mt-4 flex flex-col gap-3">
                {NAV_ITEMS.map((item) => (
                  <NavLink key={item.href} href={item.href} label={item.label} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-200">Legal</div>
              <div className="mt-4 flex flex-col gap-3">
                {LEGAL_ITEMS.map((item) => (
                  <NavLink key={item.href} href={item.href} label={item.label} />
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
