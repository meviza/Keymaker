"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight, Check, ChevronRight, Download, Globe2, Lock,
  Monitor, Laptop, Terminal, Smartphone, Shield, ShieldCheck,
  Brain, Zap, Eye, Radio, X, Building2, Server
} from "lucide-react"
import { type Locale, t } from "@/lib/i18n"

// ── Comparison Data ──────────────────────────────────────────────────────────

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
]

// ── Cell renderer ────────────────────────────────────────────────────────────

function Cell({ val }: { val: boolean | string }) {
  if (val === true) return <Check className="w-5 h-5 text-cyber-green mx-auto" />
  if (val === false) return <X className="w-5 h-5 text-zinc-600 mx-auto" />
  if (val === "partial") return <span className="text-amber-400 text-xs font-bold">Kısıtlı</span>
  if (val === "soon") return <span className="text-blue-400 text-xs font-bold">Yakında</span>
  return null
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>("tr")
  const i = t(locale)

  return (
    <div className="min-h-screen bg-cyber-black text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-cyber-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyber-green/20 rounded-lg flex items-center justify-center border border-cyber-green/50">
              <Shield className="w-5 h-5 text-cyber-green" />
            </div>
            <span className="text-xl font-black tracking-wider">KEYMAKER</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <a href="#products" className="hover:text-white transition">{i.nav.products}</a>
            <a href="#download" className="hover:text-white transition">{i.nav.download}</a>
            <a href="#enterprise" className="hover:text-white transition">{i.nav.enterprise}</a>
            <a href="#tech" className="hover:text-white transition">{i.nav.about}</a>
            <Link href="/login" className="px-4 py-1.5 bg-cyber-green/10 border border-cyber-green/30 text-cyber-green rounded-lg hover:bg-cyber-green/20 transition">Dashboard</Link>
          </div>
          <button onClick={() => setLocale(locale === "tr" ? "en" : "tr")}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-lg text-sm text-zinc-400 hover:text-white transition">
            <Globe2 className="w-4 h-4" /> {locale === "tr" ? "EN" : "TR"}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,255,157,0.06),transparent_60%)]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyber-green/10 border border-cyber-green/30 rounded-full text-cyber-green text-sm font-mono mb-8">
            <Zap className="w-4 h-4" /> {i.hero.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
            {i.hero.title1}<br />
            <span className="text-cyber-green">{i.hero.title2}</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">{i.hero.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#download" className="px-8 py-4 bg-cyber-green text-black font-bold rounded-xl text-lg flex items-center gap-2 hover:bg-cyber-green/90 transition shadow-[0_0_30px_rgba(0,255,157,0.3)]">
              <Download className="w-5 h-5" /> {i.hero.cta_download}
            </a>
            <a href="#enterprise" className="px-8 py-4 border border-white/20 text-white font-bold rounded-xl text-lg flex items-center gap-2 hover:bg-white/5 transition">
              <Building2 className="w-5 h-5" /> {i.hero.cta_enterprise}
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {i.stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-black text-cyber-green">{s.value}</div>
              <div className="text-sm text-zinc-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16">{i.products.title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Defender */}
            <div className="glass-panel rounded-2xl border border-cyber-green/20 p-8 hover:border-cyber-green/40 transition relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyber-green" />
              <ShieldCheck className="w-12 h-12 text-cyber-green mb-4" />
              <h3 className="text-2xl font-bold">{i.products.defender.name}</h3>
              <p className="text-zinc-400 mt-2 mb-6">{i.products.defender.desc}</p>
              {i.products.defender.features.map((f) => (
                <div key={f} className="flex items-start gap-2 mb-2">
                  <Check className="w-4 h-4 text-cyber-green mt-0.5 shrink-0" />
                  <span className="text-sm text-zinc-300">{f}</span>
                </div>
              ))}
              <a href="#download" className="mt-6 inline-flex items-center gap-2 text-cyber-green font-bold hover:underline">
                {i.hero.cta_download} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            {/* Sovereign */}
            <div className="glass-panel rounded-2xl border border-amber-500/20 p-8 hover:border-amber-500/40 transition relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
              <Eye className="w-12 h-12 text-amber-400 mb-4" />
              <h3 className="text-2xl font-bold">{i.products.sovereign.name}</h3>
              <p className="text-zinc-400 mt-2 mb-6">{i.products.sovereign.desc}</p>
              {i.products.sovereign.features.map((f) => (
                <div key={f} className="flex items-start gap-2 mb-2">
                  <Check className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-zinc-300">{f}</span>
                </div>
              ))}
              <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-amber-400 font-bold hover:underline">
                {i.enterprise.contact} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="py-20 px-6 bg-[radial-gradient(ellipse_at_bottom,_rgba(0,255,157,0.04),transparent_60%)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">{i.download.title}</h2>
          <p className="text-zinc-400 mb-10">{i.download.subtitle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: Monitor, label: i.download.windows, active: true, href: "#" },
              { icon: Laptop, label: i.download.macos, active: true, href: "#" },
              { icon: Terminal, label: i.download.linux, active: true, href: "#" },
            ].map((p) => (
              <a key={p.label} href={p.href}
                className="glass-panel p-6 rounded-xl border border-white/10 hover:border-cyber-green/40 transition flex flex-col items-center gap-3 group">
                <p.icon className="w-10 h-10 text-zinc-400 group-hover:text-cyber-green transition" />
                <span className="font-bold text-white group-hover:text-cyber-green transition">{p.label}</span>
                <Download className="w-4 h-4 text-zinc-600 group-hover:text-cyber-green transition" />
              </a>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
            {[
              { icon: Smartphone, label: i.download.android, disabled: true },
              { icon: Smartphone, label: i.download.ios, disabled: true },
            ].map((p) => (
              <div key={p.label} className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2 opacity-50">
                <p.icon className="w-8 h-8 text-zinc-600" />
                <span className="text-sm text-zinc-500">{p.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-600 font-mono">{i.download.note}</p>
        </div>
      </section>

      {/* Technology */}
      <section id="tech" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16">{i.tech.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {i.tech.items.map((item) => (
              <div key={item.title} className="glass-panel p-6 rounded-xl border border-white/10 hover:border-cyber-green/20 transition">
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">{i.comparison.title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-zinc-500 font-normal">{i.comparison.headers[0]}</th>
                  <th className="py-3 px-4 text-cyber-green font-bold">{i.comparison.headers[1]}</th>
                  <th className="py-3 px-4 text-zinc-400">{i.comparison.headers[2]}</th>
                  <th className="py-3 px-4 text-zinc-400">{i.comparison.headers[3]}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature.en} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 px-4 text-zinc-300">{row.feature[locale]}</td>
                    <td className="py-3 px-4 text-center"><Cell val={row.keymaker} /></td>
                    <td className="py-3 px-4 text-center"><Cell val={row.paloalto} /></td>
                    <td className="py-3 px-4 text-center"><Cell val={row.crowdstrike} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section id="enterprise" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">{i.enterprise.title}</h2>
          <p className="text-zinc-400 mb-10">{i.enterprise.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {i.enterprise.sectors.map((s) => (
              <span key={s} className="px-4 py-2 glass-panel border border-white/10 rounded-full text-sm text-zinc-300">
                <Server className="w-3.5 h-3.5 inline mr-1.5 text-cyber-green" />{s}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/beta" className="px-8 py-4 bg-cyber-green text-black font-bold rounded-xl text-lg hover:bg-cyber-green/90 transition">
              {i.enterprise.cta}
            </Link>
            <Link href="/contact" className="px-8 py-4 border border-white/20 text-white font-bold rounded-xl text-lg hover:bg-white/5 transition">
              {i.enterprise.contact}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4 text-sm text-zinc-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyber-green" />
            <span className="font-bold text-zinc-400">KEYMAKER</span>
            <span>{i.footer.copyright}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-zinc-400 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-400 transition">Terms</Link>
            <span className="text-cyber-green">{i.footer.location}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
