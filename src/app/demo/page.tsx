"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Key, CheckCircle, ChevronRight, Shield, Sun, Moon, Menu } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import { useLanguage } from "@/components/LanguageProvider"

const ROLES = ["CISO", "Red Team Lead", "Penetration Tester", "Security Analyst", "SOC Manager", "DevSecOps Engineer", "Other"]
const USE_CASES = ["Enterprise Red Teaming", "Automated Vulnerability Management", "CTI & Threat Hunting", "Compliance Testing (PCI, SOC2)", "Research & Development", "Other"]

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/#products", label: "Ürünler" },
  { href: "/pricing", label: "Fiyatlandırma" },
]

export default function DemoPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: "", company: "", role: "", email: "", useCase: "" })
  const [loading, setLoading] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const { locale, setLocale } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-cyber-black text-zinc-900 dark:text-white overflow-x-hidden">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 right-0 w-[min(500px,60vw)] h-[400px] bg-cyber-green/[0.05] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[min(400px,50vw)] h-[300px] bg-cyber-green/[0.04] blur-[100px] rounded-full" />
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

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-black/60 border border-cyber-green/30 mb-4"
              style={{ boxShadow: "0 0 30px rgba(0,255,157,0.15)" }}
            >
              <Key className="w-7 h-7 text-cyber-green" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Request a Demo</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Unlock access to the Keymaker War Room.</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-white/[0.02] p-8">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <CheckCircle className="w-14 h-14 text-cyber-green mx-auto mb-4" />
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Request Received</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
                  Our team will reach out within 24 hours to schedule your personalized demo of the Keymaker AI platform.
                </p>
                <Link href="/login">
                  <button className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-white/20 text-zinc-700 dark:text-white text-sm hover:bg-zinc-100 dark:hover:bg-white/5 transition">
                    Back to Sign-In
                  </button>
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: "name", label: "Full Name", placeholder: "Kerem Çelik", type: "text" },
                  { key: "company", label: "Company / Organization", placeholder: "Acme Security Corp", type: "text" },
                  { key: "email", label: "Work Email", placeholder: "you@company.com", type: "email" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5 font-medium">{label}</label>
                    <input
                      type={type} required placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-black/40 border border-zinc-300 dark:border-white/10 focus:border-cyber-green/40 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-colors"
                    />
                  </div>
                ))}

                {[
                  { key: "role", label: "Your Role", options: ROLES, placeholder: "Select your role" },
                  { key: "useCase", label: "Primary Use Case", options: USE_CASES, placeholder: "Select your use case" },
                ].map(({ key, label, options, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5 font-medium">{label}</label>
                    <select
                      required value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-black/40 border border-zinc-300 dark:border-white/10 focus:border-cyber-green/40 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none transition-colors"
                    >
                      <option value="" disabled className="bg-white dark:bg-zinc-900">{placeholder}</option>
                      {options.map((o) => <option key={o} value={o} className="bg-white dark:bg-zinc-900">{o}</option>)}
                    </select>
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyber-green hover:bg-cyber-green/90 text-black font-bold py-2.5 mt-2 rounded-lg flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(0,255,157,0.2)] disabled:opacity-60"
                >
                  {loading ? "Submitting…" : <><span>Request Access</span><ChevronRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-zinc-500 dark:text-zinc-600 text-xs mt-6">
            Already have access?{" "}
            <Link href="/login" className="text-cyber-green hover:text-cyber-green/80 transition-colors">Sign in →</Link>
          </p>
        </motion.div>
      </div>

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
            <Link href="/contact" className="hover:text-zinc-700 dark:hover:text-zinc-400 transition">İletişim</Link>
            <span className="text-cyber-green font-mono">Türkiye</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
