import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Binary,
  Bot,
  BrainCircuit,
  Bug,
  CloudCog,
  Code2,
  FileCode2,
  Fingerprint,
  Handshake,
  Layers3,
  LifeBuoy,
  LockKeyhole,
  Orbit,
  Radar,
  Scale,
  SearchCheck,
  ShieldCheck,
  ShieldEllipsis,
  TestTubeDiagonal,
  Workflow,
} from "lucide-react";

export type IconCard = {
  title: string;
  body: string;
  icon: LucideIcon;
};

export const differentiators: IconCard[] = [
  {
    title: "Diagnose + Fix",
    body: "Keymaker sadece sorun bulmaz; kod duzeltme onerileri, guvenlik sertlestirme adimlari ve refactoring backlog'u da uretir.",
    icon: Code2,
  },
  {
    title: "Agentic Security Fabric",
    body: "Analyst, recon, patching, testing ve governance agent'lari ayni olay grafiginde koordineli calisir.",
    icon: Bot,
  },
  {
    title: "Governed Autonomy",
    body: "Ethics, scope, approval ve evidence akisleri operasyon motorunun icine gomuludur.",
    icon: Scale,
  },
  {
    title: "Cloud-Scale Architecture",
    body: "Cok kiracili, event-driven ve bulut tabanli buyume icin servis, veri ve gozlemlenebilirlik sinirlari nettir.",
    icon: CloudCog,
  },
];

export const serviceCatalog: IconCard[] = [
  {
    title: "Saldiri Yuzeyi ve ASM",
    body: "Harici varlik envanteri, shadow IT, subdomain kesfi, internet maruziyeti ve surekli drift takibi.",
    icon: Radar,
  },
  {
    title: "Uygulama Guvenlik Analizi",
    body: "API, GraphQL, business logic, auth, input validation ve supply-chain kontrolleri.",
    icon: SearchCheck,
  },
  {
    title: "Kod Analizi ve Refactoring",
    body: "Guvenlik kokulari, bakim maliyeti, surdurulebilirlik ve teknik borc icin kod seviyesinde iyilestirme onerileri.",
    icon: FileCode2,
  },
  {
    title: "Test Otomasyonu",
    body: "Unit, integration, regression, security test ve risk odakli test uretimi.",
    icon: TestTubeDiagonal,
  },
  {
    title: "Tehdit Istihbarati ve RAG",
    body: "CVE, KEV, OTX, CTI akislar ve yerel kurumsal hafizayi ayni baglam katmaninda birlestirme.",
    icon: BrainCircuit,
  },
  {
    title: "Bulut ve Platform Sertlestirme",
    body: "IAM, secret hygiene, runtime policy, eBPF, SIEM/SOAR ve Kubernetes guvenlik entegrasyonlari.",
    icon: ShieldCheck,
  },
  {
    title: "Guvenli SDLC Altyapisi",
    body: "PR guardrails, code owners, branch policy, SBOM, policy-as-code ve release gates.",
    icon: Workflow,
  },
  {
    title: "Managed Support ve Advisory",
    body: "Yol haritasi, durum degerlendirmesi, CISO seviyesi raporlama ve teknik donusum danismanligi.",
    icon: Handshake,
  },
];

export const roadmapModules: IconCard[] = [
  {
    title: "Patch Orchestrator",
    body: "Bulunan aciklar icin dogrulanabilir patch set, PR onerisi ve rollback plani uretir.",
    icon: LockKeyhole,
  },
  {
    title: "Data Source Sanitizer",
    body: "Tehdit istihbarati ve tarama ciktilarindaki zararli payload, PII ve zehirli ornekleri ayristirir.",
    icon: Fingerprint,
  },
  {
    title: "Knowledge Mesh",
    body: "Kod deposu, runbook, incident postmortem ve CTI kaynaklarini tek sorgulanabilir bilgi katmaninda toplar.",
    icon: Layers3,
  },
  {
    title: "Autonomous QA Grid",
    body: "Kod degisikliklerinden sonra guvenlik ve davranis regresyonlarini agent destekli test agiyla dogrular.",
    icon: Orbit,
  },
  {
    title: "Exploit Evidence Lab",
    body: "Bulgu dogrulama, PoC izolasyonu ve delil uretimini kontrollu sandbox'larda yurutur.",
    icon: Bug,
  },
  {
    title: "Executive Trust Portal",
    body: "Sozlesme, denetim izi, SLA, risk trendi ve iyilestirme ROI'sini is birimlerine acar.",
    icon: BadgeCheck,
  },
];

export const aiAgents: IconCard[] = [
  {
    title: "Recon Agent",
    body: "Varlik kesfi, fingerprinting, hizmet haritalama ve onceliklendirme yapar.",
    icon: Radar,
  },
  {
    title: "Code Steward Agent",
    body: "Kod bakimini, refactoring onerilerini ve guvenli patch taslaklarini yonetir.",
    icon: Binary,
  },
  {
    title: "Validation Agent",
    body: "Duzeltmeleri test eder, regresyon riskini puanlar ve deploy readiness karari uretir.",
    icon: ShieldEllipsis,
  },
  {
    title: "Support Copilot",
    body: "Musteri talepleri, cozum onerileri ve teknik/yari teknik iletisimi standardize eder.",
    icon: LifeBuoy,
  },
];

export const pricingTiers = [
  {
    name: "Foundation",
    price: "Custom",
    summary: "Hizli gorunurluk ve guvenlik hijyeni programi.",
    bullets: ["Attack surface visibility", "Kod analizi ve raporlama", "Aylik risk review", "E-posta destek"],
  },
  {
    name: "Enterprise",
    price: "Contact Sales",
    summary: "Cok ekipli kurumlar icin agentic AppSec ve cloud security operasyonu.",
    bullets: ["Surekli tarama ve triage", "Patch guidance + refactor roadmap", "CTI/RAG entegrasyonu", "Ozel onboarding ve SLA"],
  },
  {
    name: "Sovereign",
    price: "Private Offer",
    summary: "Yuksek regulasyonlu kurumlar icin ozel dagitim ve kontrollu otomasyon.",
    bullets: ["Self-hosted veya sovereign cloud", "Custom agent policies", "Ozel veri kaynaklari", "Mimari danismanlik ve yonetilen program"],
  },
];
