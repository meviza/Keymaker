"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, Zap, Brain, Globe2, Lock, ChevronRight, Check, Sun, Moon, Menu } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import { useLanguage } from "@/components/LanguageProvider"

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/#products", label: "Ürünler" },
  { href: "/pricing", label: "Fiyatlandırma" },
]

export default function BetaPage() {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [sector, setSector] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const { locale, setLocale } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const features = [
    { icon: Brain, title: "AI Sürüsü", desc: "6 otonom AI ajan — 7/24 tehdit avı, savunma, istihbarat" },
    { icon: Zap, title: "Kendini Geliştiren AI", desc: "AlphaGo tarzı self-play — her operasyondan öğrenir" },
    { icon: Shield, title: "37 MITRE Kuralı", desc: "Windows, Linux, macOS — 37 MITRE ATT&CK detection rule" },
    { icon: Lock, title: "Veri Egemenliği", desc: "Nemotron 120B lokal çalışır — veriniz yurt dışına çıkmaz" },
    { icon: Globe2, title: "Çoklu Platform", desc: "Windows, Linux, macOS, Android, iOS — tek dashboard" },
  ]

  const sectors = ["Bankacılık & Finans", "Enerji & Altyapı", "Havalimanı & Ulaşım", "Kamu & Devlet", "Sağlık", "Telekomünikasyon"]

  return (
    <div className="w-full min-h-screen bg-white dark:bg-cyber-black text-zinc-900 dark:text-white overflow-x-hidden">

      {/* Ambient glow — visible in dark mode, subtle in light */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(900px,100vw)] h-[500px] bg-cyber-green/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/3 right-0 w-[min(400px,50vw)] h-[400px] bg-cyber-green/[0.03] blur-[100px] rounded-full" />
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
            <button
              onClick={() => setLocale(locale === "tr" ? "en" : "tr")}
              className="text-xs font-mono px-2 py-1 rounded border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
            >
              <span className={locale === "tr" ? "font-bold text-zinc-900 dark:text-white" : ""}>TR</span>
              <span className="text-zinc-400 dark:text-zinc-600 mx-0.5">|</span>
              <span className={locale === "en" ? "font-bold text-zinc-900 dark:text-white" : ""}>EN</span>
            </button>
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              href="/contact"
              className="px-3 sm:px-4 py-1.5 rounded-lg bg-cyber-green text-black text-xs sm:text-sm font-bold hover:bg-cyber-green/90 transition shadow-[0_0_20px_rgba(0,255,157,0.25)] whitespace-nowrap"
            >
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
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition py-1">{l.label}</Link>
            ))}
          </div>
        )}
      </nav>

      {submitted ? (
        /* Success screen */
        <div className="relative z-10 flex items-center justify-center min-h-[70vh] p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-zinc-200 dark:border-cyber-green/30 bg-white dark:bg-white/[0.03] p-12 text-center max-w-lg w-full"
          >
            <div className="w-16 h-16 bg-cyber-green/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyber-green/40">
              <Check className="w-8 h-8 text-cyber-green" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Beta Kaydınız Alındı</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
            <p className="text-cyber-green font-mono text-sm mt-4">{email}</p>
            <Link href="/"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-green text-black font-bold text-sm hover:bg-cyber-green/90 transition">
              Ana Sayfaya Dön <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      ) : (
        <>
          {/* Hero */}
          <section className="relative z-10 overflow-hidden">
            <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_top,_rgba(0,255,157,0.08),transparent_70%)] bg-[radial-gradient(ellipse_at_top,_rgba(0,255,157,0.04),transparent_70%)]" />
            <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyber-green/10 border border-cyber-green/30 rounded-full text-cyber-green text-sm font-mono mb-6">
                  <Shield className="w-4 h-4" /> BETA PROGRAMI AÇILDI
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-zinc-900 dark:text-white">
                  <span className="text-cyber-green">KEYMAKER</span>
                  <br />
                  <span>Siber Güvenliğin Geleceği</span>
                </h1>
                <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
                  AI sürüleri ile kritik altyapınızı koruyun.
                  Kendini geliştiren, 7/24 otonom avlayan, saldırgandan öğrenen yapay zeka.
                </p>
                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-zinc-400 dark:text-zinc-500">
                  <span>Palo Alto&apos;dan 2x daha akıllı</span>
                  <span className="text-cyber-green">•</span>
                  <span>CrowdStrike&apos;dan 3x daha hızlı</span>
                  <span className="text-cyber-green">•</span>
                  <span>Yarı fiyat</span>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-16">
                {features.map((f) => {
                  const Icon = f.icon
                  return (
                    <div
                      key={f.title}
                      className="bg-white dark:bg-white/[0.04] p-5 rounded-xl border border-zinc-200 dark:border-white/10 hover:border-cyber-green/30 transition-all text-center"
                    >
                      <Icon className="w-8 h-8 text-cyber-green mx-auto mb-3" />
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">{f.title}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">{f.desc}</p>
                    </div>
                  )
                })}
              </div>

              {/* Beta Form */}
              <div className="max-w-lg mx-auto">
                <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-black/50 p-8">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 text-center">Beta Programına Katılın</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Kurumsal E-posta</label>
                      <input
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:border-cyber-green/50 outline-none font-mono transition-colors placeholder-zinc-400 dark:placeholder-zinc-600"
                        placeholder="isim@kurum.com.tr"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Kurum Adı</label>
                      <input
                        type="text" required value={company} onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:border-cyber-green/50 outline-none transition-colors placeholder-zinc-400 dark:placeholder-zinc-600"
                        placeholder="Kurum adı"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Sektör</label>
                      <select
                        required value={sector} onChange={(e) => setSector(e.target.value)}
                        className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-white/10 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:border-cyber-green/50 outline-none transition-colors"
                      >
                        <option value="">Seçiniz...</option>
                        {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-cyber-green hover:bg-cyber-green/90 text-black font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 text-lg shadow-[0_0_20px_rgba(0,255,157,0.2)]"
                    >
                      Beta Erişimi Talep Et <ChevronRight className="w-5 h-5" />
                    </button>
                  </form>
                  <p className="text-xs text-zinc-400 dark:text-zinc-600 text-center mt-4">Sınırlı kontenjan — ilk 20 kurum</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200 dark:border-white/[0.06] py-8 px-4 sm:px-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Shield className="w-4 h-4 text-cyber-green shrink-0" />
            <span className="font-black tracking-widest text-xs sm:text-sm text-zinc-900 dark:text-white">KEYMAKER</span>
            <span className="text-zinc-500 dark:text-zinc-600 text-xs sm:text-sm">© 2026 Keymaker Siber Güvenlik.</span>
          </div>
          <div className="flex items-center gap-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-600">
            <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-400 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-400 transition">Terms</Link>
            <Link href="/contact" className="hover:text-zinc-700 dark:hover:text-zinc-400 transition">İletişim</Link>
            <span className="text-cyber-green font-mono">Türkiye</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
