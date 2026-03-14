"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileDiff,
  Globe2,
  ShieldCheck,
  Sparkles,
  TowerControl,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { aiAgents, differentiators, roadmapModules, serviceCatalog } from "@/components/marketing/site-content";

const stats = [
  { value: "24/7", label: "Surekli analiz ve izleme" },
  { value: "Code to Cloud", label: "Kaynak koddan runtime'a kadar gorunurluk" },
  { value: "AI + Human", label: "Teknik ve yari teknik karar destek modeli" },
  { value: "Policy First", label: "Onay, etik ve uyum kontrollu otomasyon" },
];

const phases = [
  {
    name: "Bugun",
    text: "Mevcut kod tabani; backend servisleri, CTI/RAG, ajan donguleri, gorev motoru ve operasyon arayuzu ile erken urunlesmis platform asamasinda.",
  },
  {
    name: "Sonraki Adim",
    text: "Bulgu uretiminden dogrulanabilir duzeltmeye gecis: patch orchestration, guvenlikli refactor ve test otomasyonu.",
  },
  {
    name: "Hedef Durum",
    text: "Bulut tabanli, cok kiracili, self-service ama policy-governed enterprise guvenlik isletim sistemi.",
  },
];

export function MarketingHome() {
  const [email, setEmail] = useState("");
  const highlightedServices = useMemo(() => serviceCatalog.slice(0, 6), []);

  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-24">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-emerald-100">
              Enterprise Agentic Security Platform
            </div>
            <h1 className="mt-6 max-w-5xl font-[family:var(--font-display)] text-6xl leading-[0.94] text-stone-50 md:text-8xl">
              Sadece acigi gosteren degil,
              <span className="block text-amber-200">onu kapatmayi da yoneten</span>
              guvenlik isletim sistemi.
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-stone-300 md:text-xl">
              Keymaker; saldiri yuzeyini, kod risklerini, bulut yanlis yapilandirmalarini ve operasyonel zafiyetleri tek ekranda
              toplar. Sonra bunu durdurmaz: duzeltme onerisi, refactoring plani, test kapsami ve guvenli release akisi uretir.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/demo" className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-200 px-6 py-3 text-sm font-semibold text-stone-950">
                Demo Talep Et <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/services" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-stone-100">
                Hizmetleri Incele <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-stone-400">
              <div className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-200" /> Palo Alto ve CrowdStrike kategorilerini tek akista birlestiren daha butunlesik bir yaklasim
              </div>
              <div className="inline-flex items-center gap-2">
                <FileDiff className="h-4 w-4 text-amber-200" /> Diagnose, advise, patch, validate
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-sm uppercase tracking-[0.24em] text-stone-500">Boardroom Snapshot</div>
                <div className="mt-1 font-[family:var(--font-display)] text-2xl">Security posture with actionability</div>
              </div>
              <Sparkles className="h-5 w-5 text-amber-200" />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="font-[family:var(--font-display)] text-3xl text-emerald-100">{item.value}</div>
                  <div className="mt-2 text-sm leading-6 text-stone-400">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-amber-200/20 bg-amber-200/10 p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-amber-100">Why this matters</div>
              <p className="mt-3 text-sm leading-7 text-stone-200">
                Enterprise ekipler artik sadece gorunurluk degil, guvenli kapatma kapasitesi istiyor. Keymaker bu boslugu doldurmak
                icin tasarlaniyor: tespit, dogrulama, duzeltme ve sureklilik.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {phases.map((phase) => (
            <div key={phase.name} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="text-xs uppercase tracking-[0.24em] text-stone-500">{phase.name}</div>
              <div className="mt-3 font-[family:var(--font-display)] text-2xl">
                {phase.name === "Bugun" ? "Platformlasma" : phase.name === "Sonraki Adim" ? "Autofix" : "Cloud Scale"}
              </div>
              <p className="mt-4 text-sm leading-7 text-stone-400">{phase.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {differentiators.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-black/30 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-5 font-[family:var(--font-display)] text-2xl">{item.title}</div>
                <p className="mt-3 text-sm leading-7 text-stone-400">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-stone-500">What we do now</div>
            <h2 className="mt-3 font-[family:var(--font-display)] text-4xl md:text-5xl">Sundugumuz ve genislettigimiz hizmetler</h2>
          </div>
          <Link href="/services" className="hidden text-sm text-amber-200 md:inline-flex">
            Tum katalog <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {highlightedServices.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-amber-200" />
                  <div className="font-semibold text-stone-100">{item.title}</div>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-400">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-[#0b1512] p-8">
            <div className="text-xs uppercase tracking-[0.24em] text-stone-500">Next wave</div>
            <h2 className="mt-4 font-[family:var(--font-display)] text-4xl">Gelistirilecek moduller ve yenilikci fikirler</h2>
            <div className="mt-8 space-y-5">
              {roadmapModules.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-emerald-200" />
                      <div className="font-semibold text-stone-100">{item.title}</div>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-stone-400">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/30 p-8">
            <div className="text-xs uppercase tracking-[0.24em] text-stone-500">Multi-agent fabric</div>
            <h2 className="mt-4 font-[family:var(--font-display)] text-4xl">Entegre calisacak AI agent katmani</h2>
            <div className="mt-8 space-y-5">
              {aiAgents.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-amber-200" />
                      <div className="font-semibold text-stone-100">{item.title}</div>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-stone-400">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-stone-500">Commercial</div>
            <h2 className="mt-3 font-[family:var(--font-display)] text-4xl md:text-5xl">Fiyatlandirma ve demo gorusmesi</h2>
            <p className="mt-6 text-base leading-8 text-stone-400">
              Burayi daha da gelistirecegiz. Rakipleri surekli analiz edip ozellik setini genisletecegiz; bu yuzden fiyatlama sabit paket yerine
              ihtiyac ve entegrasyon yogunluguna gore yapilandiriliyor.
            </p>
            <div className="mt-8 space-y-3 text-sm text-stone-300">
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-200" /> Demo, mimari kesif ve uygunluk degerlendirmesi
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-200" /> Yonetilen hizmet veya urun lisansi secenekleri
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-200" /> Kurum ici, private cloud veya sovereign deployment senaryolari
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm text-stone-300">
                Ad Soyad
                <input className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" placeholder="Isim Soyisim" />
              </label>
              <label className="text-sm text-stone-300">
                Sirket
                <input className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" placeholder="Sirket adi" />
              </label>
              <label className="text-sm text-stone-300">
                Is e-postasi
                <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" placeholder="security@company.com" />
              </label>
              <label className="text-sm text-stone-300">
                Ilgilendiginiz alan
                <select className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none">
                  <option>Autonomous AppSec</option>
                  <option>Cloud Security</option>
                  <option>Managed Program</option>
                  <option>Sovereign Deployment</option>
                </select>
              </label>
              <label className="text-sm text-stone-300 md:col-span-2">
                Mesaj
                <textarea className="mt-2 min-h-32 w-full rounded-[1.5rem] border border-white/10 bg-black/30 px-4 py-3 outline-none" placeholder="Hangi ekipler, hangi altyapi ve hangi oncelikler icin gorusmek istediginizi yazin." />
              </label>
            </div>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Link href={email ? `/demo?email=${encodeURIComponent(email)}` : "/demo"} className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-200 px-6 py-3 text-sm font-semibold text-stone-950">
                Gorusme Baslat <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-stone-100">
                Fiyatlandirma Detayi
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <TowerControl className="h-6 w-6 text-amber-200" />
            <div className="mt-4 font-[family:var(--font-display)] text-2xl">Teknik reklam dili</div>
            <p className="mt-3 text-sm leading-7 text-stone-400">
              Event-driven servisler, agent orchestration, RAG hafiza, patch onerisi, guvenlik test otomasyonu ve kanit zinciri.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <Globe2 className="h-6 w-6 text-emerald-200" />
            <div className="mt-4 font-[family:var(--font-display)] text-2xl">Yari teknik reklam dili</div>
            <p className="mt-3 text-sm leading-7 text-stone-400">
              Ekiplerinize sadece risk listesi degil, oncelik, iyilestirme plani ve guvenli buyume icin isletilebilir yol haritasi sunuyoruz.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <CheckCircle2 className="h-6 w-6 text-amber-200" />
            <div className="mt-4 font-[family:var(--font-display)] text-2xl">Surekli gelisim vaadi</div>
            <p className="mt-3 text-sm leading-7 text-stone-400">
              Su anda baslamadiysak ilgili altyapiyi baslatiriz; basladiysak urunlestirip kurumsal olcekte nihayete erdiririz.
            </p>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
