"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Check, ArrowRight, Zap, Building2, Lock, Sun, Moon, Menu, Star } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { pricingTiers } from "@/components/marketing/site-content";

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/services", label: "Hizmetler" },
  { href: "/contact", label: "İletişim" },
];

const PRICING_FACTORS = [
  "Kod deposu sayısı",
  "Bulut hesabı ve veri kaynakları",
  "Self-hosted ihtiyacı",
  "Custom policy motoru",
  "Destek SLA seviyesi",
  "Roadmap ortaklığı",
];

const TIER_ICONS = [Zap, Building2, Lock];

export default function PricingPage() {
  const { theme, toggle } = useTheme();
  const { locale, setLocale } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-cyber-black text-zinc-900 dark:text-white overflow-x-hidden">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(900px,100vw)] h-[500px] bg-cyber-green/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/3 right-0 w-[min(400px,50vw)] h-[400px] bg-cyber-blue/[0.03] blur-[100px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-white/[0.06] bg-white/80 dark:bg-cyber-black/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-9 h-9 shrink-0">
              <div className="absolute inset-0 rounded-xl bg-cyber-green/20 border border-cyber-green/40 group-hover:bg-cyber-green/30 transition" />
              <Shield className="absolute inset-0 m-auto w-5 h-5 text-cyber-green" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-black tracking-widest text-zinc-900 dark:text-white leading-none">KEYMAKER</div>
              <div className="text-[8px] tracking-[0.25em] text-zinc-400 dark:text-zinc-600 uppercase">Cyber Security</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-zinc-900 dark:hover:text-white transition-colors">{l.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language toggle */}
            <button
              onClick={() => setLocale(locale === "tr" ? "en" : "tr")}
              className="text-xs font-mono px-2 py-1 rounded border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
            >
              <span className={locale === "tr" ? "font-bold text-zinc-900 dark:text-white" : ""}>TR</span>
              <span className="text-zinc-400 dark:text-zinc-600 mx-0.5">|</span>
              <span className={locale === "en" ? "font-bold text-zinc-900 dark:text-white" : ""}>EN</span>
            </button>
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/contact" className="px-3 sm:px-4 py-1.5 rounded-lg bg-cyber-green text-black text-xs sm:text-sm font-bold hover:bg-cyber-green/90 transition shadow-[0_0_20px_rgba(0,255,157,0.25)] whitespace-nowrap">
              Satış ile Görüş
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-white/[0.06] px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition py-1">{l.label}</Link>
            ))}
          </div>
        )}
      </nav>

      {/* Header */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-10 sm:pb-16 px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 mb-6 rounded-full border border-cyber-green/30 bg-cyber-green/5 text-cyber-green text-xs font-mono tracking-widest"
        >
          <Zap className="w-3.5 h-3.5 shrink-0" />
          FİYATLANDIRMA
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight mb-4 text-zinc-900 dark:text-white"
        >
          Kurumsal lisans ve{" "}
          <span className="text-cyber-green" style={{ textShadow: "0 0 40px rgba(0,255,157,0.4)" }}>
            esnek dağıtım modelleri.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-sm sm:text-base"
        >
          Keymaker fiyatlandırması; veri kaynakları, agent sayısı, deployment modeli ve destek beklentisine göre şekillenir. Sabit paket mantığı yok.
        </motion.p>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
            {pricingTiers.map((tier, idx) => {
              const isEnterprise = tier.name === "Enterprise";
              const Icon = TIER_ICONS[idx];

              return (
                <div key={tier.name} className="flex flex-col items-stretch">
                  {/* Popular badge — only shown for Enterprise, takes up space for others */}
                  <div className="h-7 flex items-center justify-center mb-2">
                    {isEnterprise && (
                      <span className="inline-flex items-center gap-1 bg-cyber-green text-black text-xs font-bold px-3 py-0.5 rounded-full">
                        <Star className="w-3 h-3" />
                        En Popüler
                      </span>
                    )}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
                    className={[
                      "relative rounded-2xl border p-6 sm:p-8 flex flex-col gap-5 h-full",
                      isEnterprise
                        ? "bg-cyber-green/5 border-cyber-green/30 dark:border-cyber-green/30"
                        : "bg-zinc-50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/[0.07]",
                    ].join(" ")}
                  >
                    {/* Top accent line for Enterprise */}
                    {isEnterprise && (
                      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyber-green/60 to-transparent rounded-t-2xl" />
                    )}

                    {/* Icon + tier name */}
                    <div className="flex items-center gap-3">
                      <div className={[
                        "w-9 h-9 rounded-xl border flex items-center justify-center shrink-0",
                        isEnterprise
                          ? "border-cyber-green/40 bg-cyber-green/10"
                          : "border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5",
                      ].join(" ")}>
                        <Icon className={["w-4 h-4", isEnterprise ? "text-cyber-green" : "text-zinc-500 dark:text-zinc-400"].join(" ")} />
                      </div>
                      <div className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">{tier.name}</div>
                    </div>

                    {/* Price */}
                    <div>
                      <div className="text-2xl font-black text-cyber-green" style={isEnterprise ? { textShadow: "0 0 20px rgba(0,255,157,0.3)" } : undefined}>
                        {tier.price}
                      </div>
                      <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{tier.summary}</p>
                    </div>

                    {/* Bullets */}
                    <ul className="flex flex-col gap-3 flex-1">
                      {tier.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                          <Check className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      href="/contact"
                      className={[
                        "mt-2 inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-sm font-bold transition",
                        isEnterprise
                          ? "bg-cyber-green text-black hover:bg-cyber-green/90 shadow-[0_0_24px_rgba(0,255,157,0.25)]"
                          : "border border-zinc-300 dark:border-white/15 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white",
                      ].join(" ")}
                    >
                      Satış ile Görüş <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fiyat Nasıl Hesaplanır? */}
      <section className="relative z-10 px-4 sm:px-6 pb-20 sm:pb-32">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-white/[0.02] p-6 sm:p-10 overflow-hidden relative"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyber-green/30 to-transparent" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl border border-cyber-green/30 bg-cyber-green/5 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-cyber-green" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">Fiyat Nasıl Hesaplanır?</h2>
            </div>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              Teklifler sabit değil; kurumunuzun ölçeği, teknik gereksinimleri ve destek beklentisine göre birlikte şekillenir.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {PRICING_FACTORS.map((factor) => (
                <span
                  key={factor}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  <Check className="w-3 h-3 text-cyber-green shrink-0" />
                  {factor}
                </span>
              ))}
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyber-green text-black font-bold text-sm hover:bg-cyber-green/90 transition shadow-[0_0_24px_rgba(0,255,157,0.2)]"
            >
              Fiyatlandırma görüşmesi başlat <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200 dark:border-white/[0.06] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Shield className="w-4 h-4 text-cyber-green shrink-0" />
            <span className="font-black tracking-widest text-xs sm:text-sm text-zinc-900 dark:text-white">KEYMAKER</span>
            <span className="text-zinc-500 dark:text-zinc-600 text-xs sm:text-sm">© 2026 Keymaker Siber Güvenlik.</span>
          </div>
          <div className="flex items-center gap-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-600">
            <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-400 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-400 transition">Terms</Link>
            <span className="text-cyber-green font-mono">Türkiye</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
