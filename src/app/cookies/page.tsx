import { Shield, Cookie, BarChart2, Settings, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    icon: Shield,
    title: "Zorunlu Çerezler",
    body: "Oturum sürekliliği, güvenlik kontrolleri ve temel site işlevleri için kullanılabilir. Bunlar devre dışı bırakılamaz.",
  },
  {
    icon: BarChart2,
    title: "Ölçümleme Çerezleri",
    body: "Ölçümleme veya pazarlama amaçlı çerezler, gerekli yönetim paneli ve izin mekanizması eklenmeden varsayılan olarak aktif edilmez.",
  },
  {
    icon: Settings,
    title: "Tercih Yönetimi",
    body: "Kullanıcı tercihleri ve saklama süresi, yayın öncesi hukuki ve bölgesel uyumluluk gereksinimlerine göre ayarlanmalıdır.",
  },
  {
    icon: CheckCircle2,
    title: "KVKK Uyumu",
    body: "Çerez politikası KVKK ve GDPR gerekliliklerine uygun şekilde yapılandırılır. Sovereign dağıtımlarda çerez kullanımı minimumda tutulur.",
  },
];

export default function CookiesPage() {
  return (
    <div className="w-full min-h-screen bg-cyber-black text-white overflow-x-hidden">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(700px,100vw)] h-96 bg-cyber-green/[0.04] blur-[100px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-cyber-black/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 shrink-0">
              <div className="absolute inset-0 rounded-xl bg-cyber-green/20 border border-cyber-green/40 group-hover:bg-cyber-green/30 transition" />
              <Shield className="absolute inset-0 m-auto w-5 h-5 text-cyber-green" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-black tracking-widest text-white leading-none">KEYMAKER</div>
              <div className="text-[8px] tracking-[0.25em] text-zinc-600 uppercase">Cyber Security</div>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/contact" className="px-3 py-1.5 rounded-lg bg-cyber-green text-black text-xs font-bold hover:bg-cyber-green/90 transition">
              İletişim
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-10 px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-cyber-green/30 bg-cyber-green/5 text-cyber-green text-xs font-mono tracking-widest">
          <Cookie className="w-3.5 h-3.5" /> ÇEREZ POLİTİKASI
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
          Çerezler ve <span className="text-cyber-green">gizlilik tercihleri.</span>
        </h1>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
          Site; ileride analytics, form attribution ve oturum kolaylaştırma amaçlı sınırlı çerezler kullanabilir.
        </p>
      </section>

      {/* Cards */}
      <section className="relative z-10 px-4 sm:px-6 pb-20 sm:pb-32">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-4">
          {sections.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 hover:border-cyber-green/20 transition group">
              <div className="w-10 h-10 rounded-xl border border-cyber-green/20 bg-cyber-green/5 flex items-center justify-center mb-4 group-hover:border-cyber-green/40 transition">
                <Icon className="w-5 h-5 text-cyber-green" />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyber-green" />
            <span className="font-black tracking-widest text-xs">KEYMAKER</span>
            <span className="text-zinc-600 text-xs">© 2026 Keymaker Siber Güvenlik.</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <Link href="/privacy" className="hover:text-zinc-400 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-400 transition">Terms</Link>
            <Link href="/contact" className="hover:text-zinc-400 transition">İletişim</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
