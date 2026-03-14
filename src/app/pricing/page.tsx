import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { pricingTiers } from "@/components/marketing/site-content";

export default function PricingPage() {
  return (
    <MarketingShell
      eyebrow="Pricing"
      title="Kurumsal olcekte lisanslama, hizmet ve ozel dagitim modelleri."
      intro="Keymaker fiyatlandirmasi sabit paket mantigindan cok; veri kaynaklari, agent sayisi, deployment modeli ve destek beklentisine gore sekillenir."
    >
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div key={tier.name} className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <div className="font-[family:var(--font-display)] text-3xl">{tier.name}</div>
              <div className="mt-3 text-2xl text-amber-200">{tier.price}</div>
              <p className="mt-4 text-sm leading-7 text-stone-400">{tier.summary}</p>
              <div className="mt-6 space-y-3">
                {tier.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3 text-sm text-stone-300">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-200" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-amber-200/20 bg-amber-200/10 p-8">
          <div className="font-[family:var(--font-display)] text-3xl">Neye gore fiyatlanir?</div>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-stone-300">
            Kod depo sayisi, bulut hesabi, veri kaynagi, self-hosted ihtiyaci, ozel policy motoru, destek SLA&apos;si, custom agent ve roadmap ortakligi.
          </p>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-stone-950">
            Fiyatlandirma gorusmesi baslat <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
