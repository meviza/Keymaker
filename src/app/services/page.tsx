import { MarketingShell } from "@/components/marketing/MarketingShell";
import { aiAgents, roadmapModules, serviceCatalog } from "@/components/marketing/site-content";

export default function ServicesPage() {
  return (
    <MarketingShell
      eyebrow="Services"
      title="Bugun sundugumuz ve yarin urunlestirecegimiz tum guvenlik kapsami."
      intro="Urun, platform ve hizmet siniri bilincli olarak esnek tasarlaniyor. Bazi kabiliyetleri dogrudan platform olarak, bazilarini ise uzman destek ile devreye aliyoruz."
    >
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 md:grid-cols-2">
          {serviceCatalog.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-emerald-200" />
                  <div className="font-semibold text-stone-100">{item.title}</div>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-400">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-black/30 p-8">
            <div className="font-[family:var(--font-display)] text-3xl">AI agent programi</div>
            <div className="mt-6 space-y-5">
              {aiAgents.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-amber-200" />
                      <div className="font-semibold">{item.title}</div>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-stone-400">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-black/30 p-8">
            <div className="font-[family:var(--font-display)] text-3xl">Near-term roadmap</div>
            <div className="mt-6 space-y-5">
              {roadmapModules.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-emerald-200" />
                      <div className="font-semibold">{item.title}</div>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-stone-400">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
