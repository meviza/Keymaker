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
    body: "Keymaker sadece sorun bulmaz; kod düzeltme önerileri, güvenlik sertleştirme adımları ve refactoring backlog'u da üretir.",
    icon: Code2,
  },
  {
    title: "Agentic Security Fabric",
    body: "Analyst, recon, patching, testing ve governance agent'ları aynı olay grafiğinde koordineli çalışır.",
    icon: Bot,
  },
  {
    title: "Governed Autonomy",
    body: "Ethics, scope, approval ve evidence akışları operasyon motorunun içine gömülüdür.",
    icon: Scale,
  },
  {
    title: "Cloud-Scale Architecture",
    body: "Çok kiracılı, event-driven ve bulut tabanlı büyüme için servis, veri ve gözlemlenebilirlik sınırları nettir.",
    icon: CloudCog,
  },
];

export const serviceCatalog: IconCard[] = [
  {
    title: "Saldırı Yüzeyi ve ASM",
    body: "Harici varlık envanteri, shadow IT, subdomain keşfi, internet maruziyeti ve sürekli drift takibi.",
    icon: Radar,
  },
  {
    title: "Uygulama Güvenlik Analizi",
    body: "API, GraphQL, business logic, auth, input validation ve supply-chain kontrolleri.",
    icon: SearchCheck,
  },
  {
    title: "Kod Analizi ve Refactoring",
    body: "Güvenlik kokuları, bakım maliyeti, sürdürülebilirlik ve teknik borç için kod seviyesinde iyileştirme önerileri.",
    icon: FileCode2,
  },
  {
    title: "Test Otomasyonu",
    body: "Unit, integration, regression, security test ve risk odaklı test üretimi.",
    icon: TestTubeDiagonal,
  },
  {
    title: "Tehdit İstihbaratı ve RAG",
    body: "CVE, KEV, OTX, CTI akışlar ve yerel kurumsal hafızayı aynı bağlam katmanında birleştirme.",
    icon: BrainCircuit,
  },
  {
    title: "Bulut ve Platform Sertleştirme",
    body: "IAM, secret hygiene, runtime policy, eBPF, SIEM/SOAR ve Kubernetes güvenlik entegrasyonları.",
    icon: ShieldCheck,
  },
  {
    title: "Güvenli SDLC Altyapısı",
    body: "PR guardrails, code owners, branch policy, SBOM, policy-as-code ve release gates.",
    icon: Workflow,
  },
  {
    title: "Managed Support ve Danışmanlık",
    body: "Yol haritası, durum değerlendirmesi, CISO seviyesi raporlama ve teknik dönüşüm danışmanlığı.",
    icon: Handshake,
  },
];

export const roadmapModules: IconCard[] = [
  {
    title: "Patch Orchestrator",
    body: "Bulunan açıklar için doğrulanabilir patch set, PR önerisi ve rollback planı üretir.",
    icon: LockKeyhole,
  },
  {
    title: "Data Source Sanitizer",
    body: "Tehdit istihbaratı ve tarama çıktılarındaki zararlı payload, PII ve zehirli örnekleri ayıştırır.",
    icon: Fingerprint,
  },
  {
    title: "Knowledge Mesh",
    body: "Kod deposu, runbook, incident postmortem ve CTI kaynaklarını tek sorgulanabilir bilgi katmanında toplar.",
    icon: Layers3,
  },
  {
    title: "Autonomous QA Grid",
    body: "Kod değişikliklerinden sonra güvenlik ve davranış regresyonlarını agent destekli test ağıyla doğrular.",
    icon: Orbit,
  },
  {
    title: "Exploit Evidence Lab",
    body: "Bulgu doğrulama, PoC izolasyonu ve delil üretimini kontrollü sandbox'larda yürütür.",
    icon: Bug,
  },
  {
    title: "Executive Trust Portal",
    body: "Sözleşme, denetim izi, SLA, risk trendi ve iyileştirme ROI'sini iş birimlerine açar.",
    icon: BadgeCheck,
  },
];

export const aiAgents: IconCard[] = [
  {
    title: "Recon Agent",
    body: "Varlık keşfi, fingerprinting, hizmet haritalama ve önceliklendirme yapar.",
    icon: Radar,
  },
  {
    title: "Code Steward Agent",
    body: "Kod bakımını, refactoring önerilerini ve güvenli patch taslaklarını yönetir.",
    icon: Binary,
  },
  {
    title: "Validation Agent",
    body: "Düzeltmeleri test eder, regresyon riskini puanlar ve deploy readiness kararı üretir.",
    icon: ShieldEllipsis,
  },
  {
    title: "Support Copilot",
    body: "Müşteri talepleri, çözüm önerileri ve teknik/yarı teknik iletişimi standardize eder.",
    icon: LifeBuoy,
  },
];

export const pricingTiers = [
  {
    name: "Foundation",
    price: "Custom",
    summary: "Hızlı görünürlük ve güvenlik hijyeni programı.",
    bullets: ["Attack surface visibility", "Kod analizi ve raporlama", "Aylık risk review", "E-posta destek"],
  },
  {
    name: "Enterprise",
    price: "Contact Sales",
    summary: "Çok ekipli kurumlar için agentic AppSec ve cloud security operasyonu.",
    bullets: ["Sürekli tarama ve triage", "Patch guidance + refactor roadmap", "CTI/RAG entegrasyonu", "Özel onboarding ve SLA"],
  },
  {
    name: "Sovereign",
    price: "Private Offer",
    summary: "Yüksek regülasyonlu kurumlar için özel dağıtım ve kontrollü otomasyon.",
    bullets: ["Self-hosted veya sovereign cloud", "Custom agent policies", "Özel veri kaynakları", "Mimari danışmanlık ve yönetilen program"],
  },
];
