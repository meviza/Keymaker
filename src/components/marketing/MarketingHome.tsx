"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Check, X, Shield, ShieldCheck, Eye, Zap,
  Globe2, Download, Building2, Monitor, Laptop, Terminal,
  Smartphone, Server, ChevronRight, Lock, Cpu, Activity,
  Radio, Brain, Menu,
} from "lucide-react";
import { type Locale, t } from "@/lib/i18n";

// ── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// ── Comparison Data ───────────────────────────────────────────────────────────
const COMPARISON = [
  { feature: { tr: "Kendini Geliştiren AI", en: "Self-Improving AI" }, keymaker: true, paloalto: false, crowdstrike: false },
  { feature: { tr: "AI Sürü (6 Ajan)", en: "AI Swarm (6 Agents)" }, keymaker: true, paloalto: false, crowdstrike: false },
  { feature: { tr: "Adversarial Self-Play", en: "Adversarial Self-Play" }, keymaker: true, paloalto: false, crowdstrike: false },
  { feature: { tr: "Prediktif CVE Tahmini", en: "Predictive CVE Forecasting" }, keymaker: true, paloalto: false, crowdstrike: false },
  { feature: { tr: "Veri Egemenliği (Lokal AI)", en: "Data Sovereignty (Local AI)" }, keymaker: true, paloalto: false, crowdstrike: false },
  { feature: { tr: "AI Honeypot (Deception)", en: "AI Honeypot (Deception)" }, keymaker: true, paloalto: false, crowdstrike: false },
  { feature: { tr: "Supply Chain Tespiti", en: "Supply Chain Detection" }, keymaker: true, paloalto: "partial", crowdstrike: "partial" },
  { feature: { tr: "Endpoint Agent", en: "Endpoint Agent" }, keymaker: true, paloalto: true, crowdstrike: true },
  { feature: { tr: "MITRE ATT&CK Mapping", en: "MITRE ATT&CK Mapping" }, keymaker: true, paloalto: true, crowdstrike: true },
  { feature: { tr: "Mobil Koruma", en: "Mobile Protection" }, keymaker: "soon", paloalto: false, crowdstrike: false },
];

const TECH_STACK = [
  { icon: Brain,    label: "AI Sürü",          desc: "6 otonom ajan" },
  { icon: Lock,     label: "Self-Play",         desc: "AlphaGo yöntemi" },
  { icon: Cpu,      label: "Lokal AI",          desc: "Veri egemenliği" },
  { icon: Activity, label: "CVE Tahmini",       desc: "72s önceden" },
  { icon: Radio,    label: "Threat Hunt",       desc: "7/24 otonom" },
  { icon: Server,   label: "Air-Gap",           desc: "İzole ortam" },
];

function Cell({ val }: { val: boolean | string }) {
  if (val === true) return (
    <div className="flex justify-center">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyber-green/10">
        <Check className="w-3.5 h-3.5 text-cyber-green" />
      </span>
    </div>
  );
  if (val === false) return <div className="flex justify-center"><X className="w-4 h-4 text-zinc-700" /></div>;
  if (val === "partial") return <div className="text-center text-xs font-semibold text-amber-400">Kısıtlı</div>;
  if (val === "soon") return <div className="text-center text-xs font-semibold text-cyber-blue">Yakında</div>;
  return null;
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function MarketingHome() {
  const [locale, setLocale] = useState<Locale>("tr");
  const [mobileOpen, setMobileOpen] = useState(false);
  const i = t(locale);

  const navLinks = [
    { href: "#products", label: i.nav.products },
    { href: "#download", label: i.nav.download },
    { href: "#enterprise", label: i.nav.enterprise },
    { href: "#compare", label: "Karşılaştır" },
  ];

  return (
    // KEY FIX: w-full so it fills the flex body correctly
    <div className="w-full min-h-screen bg-cyber-black text-white overflow-x-hidden">

      {/* Ambient glow — fixed, pointer-events-none */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(900px,100vw)] h-[500px] bg-cyber-green/[0.04] blur-[120px] rounded-full" />
        <div className="absolute top-1/3 right-0 w-[min(400px,50vw)] h-[400px] bg-cyber-blue/[0.03] blur-[100px] rounded-full" />
        <div className="absolute bottom-1/3 left-0 w-[min(400px,50vw)] h-[400px] bg-cyber-purple/[0.03] blur-[100px] rounded-full" />
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-cyber-black/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-9 h-9 shrink-0">
              <div className="absolute inset-0 rounded-xl bg-cyber-green/20 border border-cyber-green/40 group-hover:bg-cyber-green/30 transition" />
              <Shield className="absolute inset-0 m-auto w-5 h-5 text-cyber-green" />
            </div>
            <div className="hidden xs:block">
              <div className="text-sm font-black tracking-widest text-white leading-none">KEYMAKER</div>
              <div className="text-[8px] tracking-[0.25em] text-zinc-600 uppercase">Cyber Security</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-zinc-400">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-white transition-colors whitespace-nowrap">{l.label}</a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setLocale(locale === "tr" ? "en" : "tr")}
              className="flex items-center gap-1 px-2.5 py-1.5 border border-white/10 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 hover:border-white/20 transition"
            >
              <Globe2 className="w-3 h-3" />
              <span>{locale === "tr" ? "EN" : "TR"}</span>
            </button>
            <Link href="/login" className="hidden sm:inline-flex px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition whitespace-nowrap">
              Giriş Yap
            </Link>
            <a href="#enterprise" className="px-3 sm:px-4 py-1.5 rounded-lg bg-cyber-green text-black text-xs sm:text-sm font-bold hover:bg-cyber-green/90 transition shadow-[0_0_20px_rgba(0,255,157,0.25)] whitespace-nowrap">
              Demo Al
            </a>
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-zinc-400 hover:text-white transition"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/[0.06] overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                    className="text-sm text-zinc-400 hover:text-white transition py-1">{l.label}</a>
                ))}
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="text-sm text-zinc-400 hover:text-white transition py-1">Giriş Yap</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 rounded-full border border-cyber-green/30 bg-cyber-green/5 text-cyber-green text-[10px] sm:text-xs font-mono tracking-widest"
          >
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">{i.hero.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-4 sm:mb-6"
          >
            {i.hero.title1}
            <br />
            <span className="text-cyber-green" style={{ textShadow: "0 0 40px rgba(0,255,157,0.4)" }}>
              {i.hero.title2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2"
          >
            {i.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-2"
          >
            <a href="#download"
              className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-cyber-green text-black font-bold text-sm sm:text-base hover:bg-cyber-green/90 transition shadow-[0_0_40px_rgba(0,255,157,0.3)]">
              <Download className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              {i.hero.cta_download}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </a>
            <a href="#enterprise"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border border-white/15 text-white font-bold text-sm sm:text-base hover:bg-white/5 hover:border-white/25 transition">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              {i.hero.cta_enterprise}
            </a>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto"
          >
            {i.stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp}
                className="glass-panel rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/[0.07] hover:border-cyber-green/20 transition">
                <div className="text-2xl sm:text-3xl font-black text-cyber-green mb-1">{s.value}</div>
                <div className="text-[10px] sm:text-xs text-zinc-500 leading-tight">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Tech Stack Bar ───────────────────────────────────────────── */}
      <section className="relative z-10 py-8 sm:py-12 border-y border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {TECH_STACK.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 sm:gap-2 text-center group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center group-hover:border-cyber-green/30 group-hover:bg-cyber-green/5 transition">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 group-hover:text-cyber-green transition" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-zinc-300 leading-tight">{label}</div>
                <div className="text-[9px] sm:text-[10px] text-zinc-600 hidden sm:block">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────────────── */}
      <section id="products" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="text-xs font-mono text-cyber-green tracking-widest mb-3">ÜRÜNLER</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">{i.products.title}</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Defender */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="relative group rounded-2xl border border-cyber-green/20 bg-gradient-to-b from-cyber-green/[0.05] to-transparent p-6 sm:p-8 hover:border-cyber-green/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyber-green/60 to-transparent" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-cyber-green/[0.04] blur-3xl rounded-full" />
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-cyber-green/30 bg-cyber-green/10 flex items-center justify-center mb-5 sm:mb-6">
                  <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-cyber-green" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black mb-2">{i.products.defender.name}</h3>
                <p className="text-zinc-400 mb-5 sm:mb-6 text-sm">{i.products.defender.desc}</p>
                <div className="space-y-2 sm:space-y-2.5 mb-6 sm:mb-8">
                  {i.products.defender.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 sm:gap-3">
                      <Check className="w-4 h-4 text-cyber-green mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm text-zinc-300">{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#download" className="inline-flex items-center gap-2 text-sm font-bold text-cyber-green hover:underline group/link">
                  İndir <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>

            {/* Sovereign */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              className="relative group rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.05] to-transparent p-6 sm:p-8 hover:border-amber-500/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-500/[0.04] blur-3xl rounded-full" />
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center mb-5 sm:mb-6">
                  <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black mb-2">{i.products.sovereign.name}</h3>
                <p className="text-zinc-400 mb-5 sm:mb-6 text-sm">{i.products.sovereign.desc}</p>
                <div className="space-y-2 sm:space-y-2.5 mb-6 sm:mb-8">
                  {i.products.sovereign.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 sm:gap-3">
                      <Check className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm text-zinc-300">{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:underline group/link">
                  {i.enterprise.contact} <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Download ─────────────────────────────────────────────────── */}
      <section id="download" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-[radial-gradient(ellipse_at_center,rgba(0,255,157,0.04),transparent_70%)]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs font-mono text-cyber-green tracking-widest mb-3">İNDİR</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4">{i.download.title}</h2>
          <p className="text-zinc-400 mb-8 sm:mb-12 text-sm sm:text-base">{i.download.subtitle}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
            {[
              { icon: Monitor, label: i.download.windows },
              { icon: Laptop, label: i.download.macos },
              { icon: Terminal, label: i.download.linux },
            ].map(({ icon: Icon, label }) => (
              <a key={label} href="#"
                className="group relative rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 flex flex-row sm:flex-col items-center gap-3 hover:border-cyber-green/40 hover:bg-cyber-green/[0.04] transition-all duration-300">
                <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-500 group-hover:text-cyber-green transition-colors shrink-0" />
                <span className="font-bold text-zinc-300 group-hover:text-white transition-colors text-sm sm:text-base">{label}</span>
                <Download className="w-4 h-4 text-zinc-700 group-hover:text-cyber-green transition-colors shrink-0 sm:mt-0 ml-auto sm:ml-0" />
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyber-green/0 to-transparent group-hover:via-cyber-green/50 transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xs mx-auto mb-6 sm:mb-8">
            {[i.download.android, i.download.ios].map((label) => (
              <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col items-center gap-2 opacity-40 cursor-not-allowed">
                <Smartphone className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-600" />
                <span className="text-[10px] sm:text-xs text-zinc-600 text-center">{label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-zinc-700 font-mono">{i.download.note}</p>
        </div>
      </section>

      {/* ── Technology ───────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="text-xs font-mono text-cyber-green tracking-widest mb-3">TEKNOLOJİ</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">{i.tech.title}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {i.tech.items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-xl sm:rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6 hover:border-cyber-green/25 hover:bg-cyber-green/[0.02] transition-all duration-300 overflow-hidden"
              >
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyber-green/[0.04] rounded-full blur-2xl group-hover:bg-cyber-green/[0.08] transition" />
                <h3 className="text-base sm:text-lg font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ───────────────────────────────────────────────── */}
      <section id="compare" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="text-xs font-mono text-cyber-green tracking-widest mb-3">KARŞILAŞTIRMA</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">{i.comparison.title}</h2>
          </div>

          {/* overflow-x-auto for mobile scroll */}
          <div className="rounded-2xl border border-white/[0.08] overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-zinc-500 font-medium">{i.comparison.headers[0]}</th>
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 text-cyber-green font-bold whitespace-nowrap">
                      <Shield className="w-3.5 h-3.5 shrink-0" /> {i.comparison.headers[1]}
                    </span>
                  </th>
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-center text-zinc-500 font-medium whitespace-nowrap">{i.comparison.headers[2]}</th>
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-center text-zinc-500 font-medium whitespace-nowrap">{i.comparison.headers[3]}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, idx) => (
                  <tr key={row.feature.en} className={`border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors ${idx % 2 !== 0 ? "bg-white/[0.01]" : ""}`}>
                    <td className="py-3 px-3 sm:px-6 text-zinc-300 font-medium">{row.feature[locale]}</td>
                    <td className="py-3 px-2 sm:px-4"><Cell val={row.keymaker} /></td>
                    <td className="py-3 px-2 sm:px-4"><Cell val={row.paloalto} /></td>
                    <td className="py-3 px-2 sm:px-4"><Cell val={row.crowdstrike} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Enterprise CTA ───────────────────────────────────────────── */}
      <section id="enterprise" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl border border-cyber-green/20 bg-gradient-to-b from-cyber-green/[0.06] to-transparent p-8 sm:p-12 text-center overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyber-green/50 to-transparent" />
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyber-green/[0.06] blur-3xl rounded-full pointer-events-none" />
            <div className="relative">
              <div className="text-xs font-mono text-cyber-green tracking-widest mb-3">KURUMSAL</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4">{i.enterprise.title}</h2>
              <p className="text-zinc-400 mb-8 sm:mb-10 max-w-xl mx-auto text-sm sm:text-base">{i.enterprise.subtitle}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto mb-8 sm:mb-10">
                {i.enterprise.sectors.map((s) => (
                  <span key={s} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-xs sm:text-sm text-zinc-300 text-center">
                    <ChevronRight className="w-3 h-3 text-cyber-green shrink-0" />
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <Link href="/beta"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-cyber-green text-black font-bold text-sm sm:text-base hover:bg-cyber-green/90 transition shadow-[0_0_40px_rgba(0,255,157,0.3)]">
                  {i.enterprise.cta} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border border-white/20 text-white font-bold text-sm sm:text-base hover:bg-white/5 transition">
                  {i.enterprise.contact}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyber-green shrink-0" />
            <span className="font-black tracking-widest text-xs sm:text-sm">KEYMAKER</span>
            <span className="text-zinc-600 text-xs sm:text-sm">{i.footer.copyright}</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-zinc-600 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-zinc-400 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-400 transition">Terms</Link>
            <Link href="/cookies" className="hover:text-zinc-400 transition">Cookies</Link>
            <span className="text-cyber-green font-mono">{i.footer.location}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
