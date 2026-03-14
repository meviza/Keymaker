import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export default function ContactPage() {
  return (
    <MarketingShell
      eyebrow="Contact"
      title="Demo, fiyatlandirma veya stratejik is ortakligi icin iletisime gecin."
      intro="Bu alan kurumsal gorusme toplamak icin tasarlandi. Form backend entegrasyonu eklenene kadar demo sayfasina yonlenir."
    >
      <section className="mx-auto max-w-5xl px-6 py-8">
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
              <input className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" placeholder="security@company.com" />
            </label>
            <label className="text-sm text-stone-300">
              Iletisim nedeni
              <select className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none">
                <option>Demo</option>
                <option>Pricing</option>
                <option>Partnerlik</option>
                <option>Sovereign deployment</option>
              </select>
            </label>
            <label className="text-sm text-stone-300 md:col-span-2">
              Mesaj
              <textarea className="mt-2 min-h-36 w-full rounded-[1.5rem] border border-white/10 bg-black/30 px-4 py-3 outline-none" placeholder="Ekibiniz, altyapiniz ve hedeflediginiz guvenlik olgunlugu hakkinda bilgi verin." />
            </label>
          </div>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-stone-950">
              Demo formuna git <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="inline-flex items-center rounded-full border border-white/10 px-5 py-3 text-sm text-stone-300">
              sales@keymaker.security
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
