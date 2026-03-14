import Link from "next/link";
import { LifeBuoy, Mail, ShieldCheck, TimerReset } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export default function SupportPage() {
  return (
    <MarketingShell
      eyebrow="Support"
      title="Operasyonel destek, onboarding ve enterprise hizmet seviyesi."
      intro="Platform ne kadar iyi olursa olsun, kurumsal guvenlikte guvenilir destek modeli zorunludur. Keymaker support yapisi bu nedenle urunun parcasi olarak tasarlaniyor."
    >
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-3">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <LifeBuoy className="h-6 w-6 text-emerald-200" />
          <div className="mt-4 font-[family:var(--font-display)] text-2xl">Technical Support</div>
          <p className="mt-3 text-sm leading-7 text-stone-400">Urun kullanimi, entegrasyon, ajan davranisi ve olay triage destek akisi.</p>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <ShieldCheck className="h-6 w-6 text-amber-200" />
          <div className="mt-4 font-[family:var(--font-display)] text-2xl">Security Advisory</div>
          <p className="mt-3 text-sm leading-7 text-stone-400">Bulgu yorumlama, hardening planlari, patch siralama ve yonetici seviyesinde ozetleme.</p>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <TimerReset className="h-6 w-6 text-emerald-200" />
          <div className="mt-4 font-[family:var(--font-display)] text-2xl">Response Targets</div>
          <p className="mt-3 text-sm leading-7 text-stone-400">Foundation, Enterprise ve Sovereign seviyelerine gore farklilasan SLA hedefleri.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2rem] border border-amber-200/20 bg-amber-200/10 p-8">
          <div className="font-[family:var(--font-display)] text-3xl">Destek kanallari</div>
          <div className="mt-6 flex flex-col gap-4 text-sm text-stone-300">
            <div className="inline-flex items-center gap-3"><Mail className="h-4 w-4 text-emerald-200" /> support@keymaker.security</div>
            <div>Onboarding, incident coordination, architecture review ve periodic QBR oturumlari sozlesme kapsaminda sunulabilir.</div>
          </div>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-stone-950">
            Support ekibiyle iletisime gec
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
