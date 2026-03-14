export interface Threat {
  id: string
  name: string
  type: 'vulnerability' | 'exploit' | 'malware' | 'network'
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'active' | 'mitigated' | 'investigating'
  source: string
  target: string
  discovered: string
  description: string
  impact: string
  confidence: number
  affectedSystems: string[]
  qdrantSimilarity?: number
  cvssScore?: number
  mitreTactics?: string[]
  mitreTechniques?: string[]
}
