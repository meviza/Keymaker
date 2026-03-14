import { MarketingShell } from "@/components/marketing/MarketingShell";

export default function CookiesPage() {
  return (
    <MarketingShell
      eyebrow="Cookies"
      title="Cookie notice ve tercih yapisi."
      intro="Landing site, ileride analytics, form attribution ve oturum kolaylastirma amacli sinirli cerezler kullanabilir."
    >
      <section className="mx-auto max-w-4xl space-y-6 px-6 py-8 text-sm leading-8 text-stone-300">
        <p>Zorunlu cerezler; oturum surekliligi, guvenlik kontrolleri ve temel site islevleri icin kullanilabilir.</p>
        <p>Olcumleme veya pazarlama amacli cerezler, gerekli yonetim paneli ve izin mekanizmasi eklenmeden varsayilan olarak aktif edilmemelidir.</p>
        <p>Kullanici tercihleri ve saklama suresi, yayin oncesi hukuki ve bolgesel uyumluluk gereksinimlerine gore ayarlanmalidir.</p>
      </section>
    </MarketingShell>
  );
}
