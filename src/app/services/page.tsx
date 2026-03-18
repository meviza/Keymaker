"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, ArrowRight, Radar, SearchCheck, FileCode2, TestTubeDiagonal,
  BrainCircuit, ShieldCheck, Workflow, Handshake, LockKeyhole, Fingerprint,
  Layers3, Orbit, Bug, BadgeCheck, Binary, ShieldEllipsis, LifeBuoy, Bot,
  Sun, Moon, Menu,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { serviceCatalog, aiAgents, roadmapModules } from "@/components/marketing/site-content";

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/#products", label: "Ürünler" },
  { href: "/pricing", label: "Fiyatlandırma" },
  { href: "/contact", label: "İletişim" },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function ServicesPage() {
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
              İletişim
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
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition py-1"
              >
                {l.label}
              </Link>
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
          <Bot className="w-3.5 h-3.5 shrink-0" />
          HİZMETLER
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight mb-4 text-zinc-900 dark:text-white"
        >
          Güvenlik kapsamı ve{" "}
          <span className="text-cyber-green" style={{ textShadow: "0 0 40px rgba(0,255,157,0.4)" }}>
            platform servisleri.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto text-sm sm:text-base"
        >
          Ürün, platform ve hizmet sınırı bilinçli olarak esnek tasarlanıyor. Bazı kabiliyetleri doğrudan platform olarak, bazılarını ise uzman destek ile devreye alıyoruz.
        </motion.p>
      </section>

      {/* Service Catalog */}
      <section className="relative z-10 px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-1">Ne Sunuyoruz?</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Platform ve hizmet kataloğu</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {serviceCatalog.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-white/[0.02] p-5 sm:p-6 hover:border-cyber-green/30 transition group"
              >
                <div className="w-10 h-10 rounded-xl border border-cyber-green/20 bg-cyber-green/5 flex items-center justify-center mb-4 group-hover:border-cyber-green/40 transition shrink-0">
                  <Icon className="w-5 h-5 text-cyber-green" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white mb-2 text-sm sm:text-base">{title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents */}
      <section className="relative z-10 px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-1">AI Ajan Programı</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Koordineli çalışan otonom güvenlik ajanları</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {aiAgents.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-white/[0.02] p-5 hover:border-cyber-green/30 transition group"
              >
                <div className="w-10 h-10 rounded-xl border border-cyber-green/20 bg-cyber-green/5 flex items-center justify-center mb-4 group-hover:border-cyber-green/40 transition">
                  <Icon className="w-5 h-5 text-cyber-green" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white mb-2 text-sm">{title}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="relative z-10 px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-1">Yakında Geliyor</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Yakın vadeli yol haritası modülleri</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {roadmapModules.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-white/[0.02] p-5 sm:p-6 hover:border-cyber-green/30 transition group"
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl border border-cyber-green/20 bg-cyber-green/5 flex items-center justify-center group-hover:border-cyber-green/40 transition shrink-0">
                    <Icon className="w-5 h-5 text-cyber-green" />
                  </div>
                  <span className="bg-cyber-blue/10 text-cyber-blue text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0">
                    Roadmap
                  </span>
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white mb-2 text-sm sm:text-base">{title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 sm:px-6 pb-20 sm:pb-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...fadeUp}
            className="relative rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.02] p-8 sm:p-12 text-center overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyber-green/40 to-transparent" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-cyber-green/[0.04] blur-3xl rounded-full pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4 leading-tight">
                Demo veya fiyat görüşmesi için
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm sm:text-base mb-8">
                Ekibiniz ve güvenlik hedefleriniz hakkında bilgi verin. Satış ekibimiz en kısa sürede dönüş yapar.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl bg-cyber-green text-black font-bold text-sm hover:bg-cyber-green/90 transition shadow-[0_0_30px_rgba(0,255,157,0.25)]"
                >
                  Bize Ulaşın <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-zinc-200 dark:border-white/15 text-zinc-500 dark:text-zinc-300 font-medium text-sm hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition"
                >
                  Fiyatlandırma
                </Link>
              </div>
            </div>
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
