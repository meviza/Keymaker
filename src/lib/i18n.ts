/**
 * KEYMAKER — Internationalization (i18n)
 * Supports: Turkish (tr), English (en)
 */

export type Locale = "tr" | "en"

export const translations = {
  tr: {
    nav: { home: "Ana Sayfa", products: "Ürünler", download: "İndir", enterprise: "Kurumsal", about: "Hakkımızda", contact: "İletişim", beta: "Beta" },
    hero: {
      badge: "YENİ NESİL SİBER GÜVENLİK",
      title1: "AI Sürüleri ile",
      title2: "Siber Güvenliğin Geleceği",
      subtitle: "Kendini geliştiren yapay zeka, 7/24 otonom tehdit avı ve 37 MITRE ATT&CK kuralı ile kritik altyapınızı koruyun.",
      cta_download: "Ücretsiz İndir",
      cta_enterprise: "Kurumsal Demo",
    },
    stats: [
      { value: "120B", label: "AI Parametre (Nemotron)" },
      { value: "<10s", label: "Ortalama Müdahale Süresi" },
      { value: "37+", label: "MITRE ATT&CK Kuralı" },
      { value: "6", label: "Otonom AI Ajan" },
    ],
    products: {
      title: "Ürünlerimiz",
      defender: {
        name: "Keymaker Defender",
        desc: "Akıllı Antivirüs & Endpoint Koruma",
        features: ["AI destekli gerçek zamanlı tarama", "Otomatik zafiyet tespiti ve yama önerisi", "Ransomware ve cryptominer koruması", "Düşük sistem kaynağı kullanımı (3.4 MB agent)", "Windows, macOS, Linux, Android, iOS"],
      },
      sovereign: {
        name: "Keymaker Sovereign",
        desc: "Devlet & İstihbarat Çözümleri",
        features: ["Siber keşif ve gözetleme operasyonları", "OSINT ve dark web istihbaratı", "Hedef analiz ve tehdit profilleme", "Air-gapped dağıtım desteği", "İletişime geçin →"],
      },
    },
    download: {
      title: "Keymaker Defender'ı İndirin",
      subtitle: "Tek tıkla kurulum. 60 saniyede korunmaya başlayın.",
      windows: "Windows İndir",
      macos: "macOS İndir",
      linux: "Linux İndir",
      android: "Android (Yakında)",
      ios: "iOS (Yakında)",
      note: "v1.0.0 — 3.4 MB · Rust tabanlı · Sıfır bağımlılık",
    },
    enterprise: {
      title: "Kurumsal Çözümler",
      subtitle: "Bankacılık, enerji, havalimanı ve kritik altyapılar için özel siber güvenlik.",
      sectors: ["Bankacılık & Finans", "Enerji & Altyapı", "Havalimanı & Ulaşım", "Kamu & Devlet", "Sağlık", "Telekomünikasyon"],
      cta: "Beta Programına Katılın",
      contact: "Satış Ekibimize Ulaşın",
    },
    tech: {
      title: "Teknoloji",
      items: [
        { title: "AI Sürü Mimarisi", desc: "6 otonom ajan paralel çalışır — keşif, analiz, avlanma, savunma, istihbarat, evrim" },
        { title: "Kendini Geliştiren AI", desc: "AlphaGo tarzı adversarial self-play — her operasyondan öğrenir, her gün daha akıllı" },
        { title: "Prediktif İstihbarat", desc: "CVE exploit'unu 72 saat önceden tahmin eder — rakiplerden 3 gün önde" },
        { title: "Veri Egemenliği", desc: "AI tamamen lokal çalışır — verileriniz asla yurt dışına çıkmaz, KVKK tam uyumlu" },
      ],
    },
    comparison: {
      title: "Neden Keymaker?",
      headers: ["Özellik", "Keymaker", "Palo Alto", "CrowdStrike"],
    },
    footer: { copyright: "© 2026 Keymaker Siber Güvenlik. Tüm hakları saklıdır.", location: "Türkiye" },
  },
  en: {
    nav: { home: "Home", products: "Products", download: "Download", enterprise: "Enterprise", about: "About", contact: "Contact", beta: "Beta" },
    hero: {
      badge: "NEXT-GEN CYBERSECURITY",
      title1: "The Future of",
      title2: "Cybersecurity with AI Swarms",
      subtitle: "Self-improving AI, 24/7 autonomous threat hunting, and 37 MITRE ATT&CK detection rules to protect your critical infrastructure.",
      cta_download: "Free Download",
      cta_enterprise: "Enterprise Demo",
    },
    stats: [
      { value: "120B", label: "AI Parameters (Nemotron)" },
      { value: "<10s", label: "Average Response Time" },
      { value: "37+", label: "MITRE ATT&CK Rules" },
      { value: "6", label: "Autonomous AI Agents" },
    ],
    products: {
      title: "Our Products",
      defender: {
        name: "Keymaker Defender",
        desc: "Smart Antivirus & Endpoint Protection",
        features: ["AI-powered real-time scanning", "Automatic vulnerability detection & patch suggestions", "Ransomware & cryptominer protection", "Minimal resource usage (3.4 MB agent)", "Windows, macOS, Linux, Android, iOS"],
      },
      sovereign: {
        name: "Keymaker Sovereign",
        desc: "Government & Intelligence Solutions",
        features: ["Cyber reconnaissance & surveillance ops", "OSINT & dark web intelligence", "Target analysis & threat profiling", "Air-gapped deployment support", "Contact us →"],
      },
    },
    download: {
      title: "Download Keymaker Defender",
      subtitle: "One-click install. Protected in 60 seconds.",
      windows: "Download for Windows",
      macos: "Download for macOS",
      linux: "Download for Linux",
      android: "Android (Coming Soon)",
      ios: "iOS (Coming Soon)",
      note: "v1.0.0 — 3.4 MB · Rust-based · Zero dependencies",
    },
    enterprise: {
      title: "Enterprise Solutions",
      subtitle: "Custom cybersecurity for banking, energy, airports, and critical infrastructure.",
      sectors: ["Banking & Finance", "Energy & Infrastructure", "Airport & Transport", "Government & Defense", "Healthcare", "Telecommunications"],
      cta: "Join Beta Program",
      contact: "Contact Our Sales Team",
    },
    tech: {
      title: "Technology",
      items: [
        { title: "AI Swarm Architecture", desc: "6 autonomous agents work in parallel — scout, analyst, hunter, guardian, intelligence, evolution" },
        { title: "Self-Improving AI", desc: "AlphaGo-style adversarial self-play — learns from every operation, gets smarter every day" },
        { title: "Predictive Intelligence", desc: "Predicts CVE exploitation 72 hours in advance — 3 days ahead of competitors" },
        { title: "Data Sovereignty", desc: "AI runs entirely local — your data never leaves your premises, fully GDPR compliant" },
      ],
    },
    comparison: {
      title: "Why Keymaker?",
      headers: ["Feature", "Keymaker", "Palo Alto", "CrowdStrike"],
    },
    footer: { copyright: "© 2026 Keymaker Cybersecurity. All rights reserved.", location: "Türkiye" },
  },
} as const

export function t(locale: Locale) {
  return translations[locale]
}
