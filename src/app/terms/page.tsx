import { MarketingShell } from "@/components/marketing/MarketingShell";

export default function TermsPage() {
  return (
    <MarketingShell
      eyebrow="Terms"
      title="Site kullanim ve hizmet kosullari."
      intro="Bu sayfa, pazarlama sitesi ve demo basvuru akislarina yonelik ozet kosullari icerir."
    >
      <section className="mx-auto max-w-4xl space-y-6 px-6 py-8 text-sm leading-8 text-stone-300">
        <p>Site icerigi bilgilendirme amaclidir ve urun kapsami sozlesme, teklif ve teknik kesif sonucunda netlesir.</p>
        <p>Keymaker platformu, etik sinirlar, yetki kapsamı ve kurumsal politikalara tabi sekilde kullanilmak uzere tasarlanir.</p>
        <p>Yetkisiz kullanim, tersine muhendislik veya kotuye kullanima yonelik girisimler desteklenmez ve hizmete erisim kisitlanabilir.</p>
      </section>
    </MarketingShell>
  );
}
