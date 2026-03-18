"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, ArrowRight, Mail, Building2, Globe2,
  Phone, CheckCircle2, Menu,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/#products", label: "Ürünler" },
  { href: "/#download", label: "İndir" },
  { href: "/#enterprise", label: "Kurumsal" },
];

const CONTACT_REASONS = [
  "Demo Talebi",
  "Fiyatlandırma",
  "Kurumsal Lisans",
  "Sovereign Deployment",
  "Ortaklık / Entegrasyon",
  "Teknik Destek",
];

const INFO_CARDS = [
  {
    icon: Mail,
    title: "E-posta",
    value: "sales@keymaker.security",
    sub: "1 iş günü içinde yanıt",
  },
  {
    icon: Building2,
    title: "Kurumsal Satış",
    value: "enterprise@keymaker.security",
    sub: "Özel teklif ve SLA",
  },
  {
    icon: Globe2,
    title: "Bölge",
    value: "Türkiye & EMEA",
    sub: "Yerel destek ekibi",
  },
];

export default function ContactPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", reason: CONTACT_REASONS[0], message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="w-full min-h-screen bg-cyber-black text-white overflow-x-hidden">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(900px,100vw)] h-[500px] bg-cyber-green/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/3 right-0 w-[min(400px,50vw)] h-[400px] bg-cyber-blue/[0.03] blur-[100px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-cyber-black/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-9 h-9 shrink-0">
              <div className="absolute inset-0 rounded-xl bg-cyber-green/20 border border-cyber-green/40 group-hover:bg-cyber-green/30 transition" />
              <Shield className="absolute inset-0 m-auto w-5 h-5 text-cyber-green" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-black tracking-widest text-white leading-none">KEYMAKER</div>
              <div className="text-[8px] tracking-[0.25em] text-zinc-600 uppercase">Cyber Security</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/login" className="hidden sm:inline-flex px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition">
              Giriş Yap
            </Link>
            <a href="#form" className="px-3 sm:px-4 py-1.5 rounded-lg bg-cyber-green text-black text-xs sm:text-sm font-bold hover:bg-cyber-green/90 transition shadow-[0_0_20px_rgba(0,255,157,0.25)] whitespace-nowrap">
              Form Doldur
            </a>
            <button onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-zinc-400 hover:text-white transition">
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.06] px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="text-sm text-zinc-400 hover:text-white transition py-1">{l.label}</Link>
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
          <Phone className="w-3.5 h-3.5 shrink-0" />
          SATIŞ EKİBİ
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight mb-4"
        >
          Demo, fiyatlandırma veya<br className="hidden sm:block" />
          <span className="text-cyber-green" style={{ textShadow: "0 0 40px rgba(0,255,157,0.4)" }}> stratejik iş ortaklığı</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base"
        >
          Ekibiniz, altyapınız ve güvenlik hedefleriniz hakkında bilgi verin. 1 iş günü içinde dönüş yapıyoruz.
        </motion.p>
      </section>

      {/* Info Cards */}
      <section className="relative z-10 px-4 sm:px-6 pb-10 sm:pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {INFO_CARDS.map(({ icon: Icon, title, value, sub }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 sm:p-5 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-3"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-cyber-green/20 bg-cyber-green/5 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-cyber-green" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest mb-0.5">{title}</div>
                <div className="text-sm sm:text-base font-semibold text-white">{value}</div>
                <div className="text-[10px] sm:text-xs text-zinc-600 mt-0.5">{sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section id="form" className="relative z-10 px-4 sm:px-6 pb-20 sm:pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-10 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyber-green/40 to-transparent" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-cyber-green/[0.04] blur-3xl rounded-full pointer-events-none" />

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="relative flex flex-col items-center text-center py-10 gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-cyber-green" />
                </div>
                <h2 className="text-2xl font-black">Mesajınız alındı!</h2>
                <p className="text-zinc-400 max-w-sm text-sm">Satış ekibimiz 1 iş günü içinde <span className="text-white font-medium">{form.email}</span> adresine dönüş yapacak.</p>
                <Link href="/" className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-green text-black font-bold text-sm hover:bg-cyber-green/90 transition">
                  Ana Sayfaya Dön <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-zinc-400 font-medium tracking-wide">Ad Soyad</span>
                    <input
                      required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none focus:border-cyber-green/40 focus:ring-1 focus:ring-cyber-green/20 transition"
                      placeholder="İsim Soyisim"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-zinc-400 font-medium tracking-wide">Şirket</span>
                    <input
                      required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none focus:border-cyber-green/40 focus:ring-1 focus:ring-cyber-green/20 transition"
                      placeholder="Şirket adı"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-zinc-400 font-medium tracking-wide">İş E-postası</span>
                    <input
                      required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none focus:border-cyber-green/40 focus:ring-1 focus:ring-cyber-green/20 transition"
                      placeholder="security@company.com"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-zinc-400 font-medium tracking-wide">İletişim Nedeni</span>
                    <select
                      value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyber-green/40 focus:ring-1 focus:ring-cyber-green/20 transition"
                    >
                      {CONTACT_REASONS.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="text-xs text-zinc-400 font-medium tracking-wide">Mesaj</span>
                    <textarea
                      required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none focus:border-cyber-green/40 focus:ring-1 focus:ring-cyber-green/20 transition resize-none"
                      placeholder="Ekibiniz, altyapınız ve hedeflediğiniz güvenlik olgunluğu hakkında bilgi verin."
                    />
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl bg-cyber-green text-black font-bold text-sm hover:bg-cyber-green/90 transition shadow-[0_0_30px_rgba(0,255,157,0.25)]">
                    Gönder <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link href="/#download"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 text-zinc-300 font-medium text-sm hover:bg-white/5 hover:text-white transition">
                    Ücretsiz İndir
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Shield className="w-4 h-4 text-cyber-green shrink-0" />
            <span className="font-black tracking-widest text-xs sm:text-sm">KEYMAKER</span>
            <span className="text-zinc-600 text-xs sm:text-sm">© 2026 Keymaker Siber Güvenlik.</span>
          </div>
          <div className="flex items-center gap-4 text-xs sm:text-sm text-zinc-600">
            <Link href="/privacy" className="hover:text-zinc-400 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-400 transition">Terms</Link>
            <span className="text-cyber-green font-mono">Türkiye</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
