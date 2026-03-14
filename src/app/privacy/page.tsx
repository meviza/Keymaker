import { MarketingShell } from "@/components/marketing/MarketingShell";

export default function PrivacyPage() {
  return (
    <MarketingShell
      eyebrow="Privacy"
      title="Privacy policy ozet sayfasi."
      intro="Bu metin landing site icin hukuki iskelet gorevi gorur. Uretim ortaminda avukat incelemesiyle son haline getirilmelidir."
    >
      <section className="mx-auto max-w-4xl space-y-6 px-6 py-8 text-sm leading-8 text-stone-300">
        <p>Keymaker; demo taleplerinde saglanan isim, kurum, is e-postasi ve iletisim notlarini gorusme planlama, urun uygunlugu ve destek amaciyla isleyebilir.</p>
        <p>Log, tanilama ve guvenlik kayitlari hizmet kalitesi, denetim izi ve kotuye kullanimin onlenmesi amaciyla tutulabilir.</p>
        <p>Kurum verileri, sozlesme ve dagitim modeline bagli olarak self-hosted, private cloud veya yonetilen altyapida saklanabilir.</p>
      </section>
    </MarketingShell>
  );
}
