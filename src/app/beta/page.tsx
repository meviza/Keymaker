"use client"

import { useState } from "react"
import { Shield, Zap, Brain, Globe2, Lock, ChevronRight, Check } from "lucide-react"

export default function BetaPage() {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [sector, setSector] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const features = [
    { icon: Brain, title: "AI Sürüsü", desc: "6 otonom AI ajan — 7/24 tehdit avı, savunma, istihbarat" },
    { icon: Zap, title: "Kendini Geliştiren AI", desc: "AlphaGo tarzı self-play — her operasyondan öğrenir" },
    { icon: Shield, title: "37 MITRE Kuralı", desc: "Windows, Linux, macOS — 37 MITRE ATT&CK detection rule" },
    { icon: Lock, title: "Veri Egemenliği", desc: "Nemotron 120B lokal çalışır — veriniz yurt dışına çıkmaz" },
    { icon: Globe2, title: "Çoklu Platform", desc: "Windows, Linux, macOS, Android, iOS — tek dashboard" },
  ]

  const sectors = ["Bankacılık & Finans", "Enerji & Altyapı", "Havalimanı & Ulaşım", "Kamu & Devlet", "Sağlık", "Telekomünikasyon"]

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-black p-8">
        <div className="glass-panel rounded-2xl border border-cyber-green/30 p-12 text-center max-w-lg">
          <div className="w-16 h-16 bg-cyber-green/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyber-green/50">
            <Check className="w-8 h-8 text-cyber-green" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Beta Kaydınız Alındı</h2>
          <p className="text-zinc-400">Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
          <p className="text-cyber-green font-mono text-sm mt-4">{email}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-black text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,255,157,0.08),transparent_70%)]" />
        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyber-green/10 border border-cyber-green/30 rounded-full text-cyber-green text-sm font-mono mb-6">
              <Shield className="w-4 h-4" /> BETA PROGRAMI AÇILDI
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
              <span className="text-cyber-green">KEYMAKER</span>
              <br />
              <span className="text-white">Siber Güvenliğin Geleceği</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              AI sürüleri ile kritik altyapınızı koruyun.
              Kendini geliştiren, 7/24 otonom avlayan, saldırgandan öğrenen yapay zeka.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-zinc-500">
              <span>Palo Alto&apos;dan 2x daha akıllı</span>
              <span className="text-cyber-green">•</span>
              <span>CrowdStrike&apos;dan 3x daha hızlı</span>
              <span className="text-cyber-green">•</span>
              <span>Yarı fiyat</span>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-16">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="glass-panel p-5 rounded-xl border border-white/10 hover:border-cyber-green/30 transition-all text-center">
                  <Icon className="w-8 h-8 text-cyber-green mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-xs text-zinc-500">{f.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Beta Form */}
          <div className="max-w-lg mx-auto">
            <div className="glass-panel rounded-2xl border border-white/10 p-8">
              <h2 className="text-xl font-bold text-white mb-6 text-center">Beta Programına Katılın</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Kurumsal E-posta</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-green/50 outline-none font-mono"
                    placeholder="isim@kurum.com.tr" />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Kurum Adı</label>
                  <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-green/50 outline-none"
                    placeholder="Kurum adı" />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Sektör</label>
                  <select required value={sector} onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-green/50 outline-none">
                    <option value="">Seçiniz...</option>
                    {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button type="submit"
                  className="w-full bg-cyber-green/80 hover:bg-cyber-green text-black font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 text-lg">
                  Beta Erişimi Talep Et <ChevronRight className="w-5 h-5" />
                </button>
              </form>
              <p className="text-xs text-zinc-600 text-center mt-4">Sınırlı kontenjan — ilk 20 kurum</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
