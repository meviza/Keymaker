export interface EthicsRule {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'disabled'
}

export interface EthicsEvent {
  id: string
  timestamp: string
  action: string
  decision: 'allowed' | 'blocked' | 'review'
  reason: string
  actor: string
}
