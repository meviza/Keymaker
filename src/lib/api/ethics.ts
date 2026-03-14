import type { EthicsEvent, EthicsRule } from '@/types/ethics'

const mockRules: EthicsRule[] = [
  {
    id: 'rule-001',
    title: 'No Unauthorized Scans',
    description: 'Blocks scans targeting public IPs unless explicitly approved.',
    severity: 'critical',
    status: 'active'
  },
  {
    id: 'rule-002',
    title: 'Sensitive Target Guard',
    description: 'Requires manual review for government / healthcare domains.',
    severity: 'high',
    status: 'active'
  },
  {
    id: 'rule-003',
    title: 'Payload Safety Envelope',
    description: 'Disallows destructive payload flags in non-lab environments.',
    severity: 'high',
    status: 'active'
  }
]

const mockEvents: EthicsEvent[] = [
  {
    id: 'evt-001',
    timestamp: '2024-02-20 15:33:45',
    action: 'Outbound scan request: 8.8.8.8',
    decision: 'blocked',
    reason: 'Public IP target requires explicit approval.',
    actor: 'Ethics Sentinel Delta'
  },
  {
    id: 'evt-002',
    timestamp: '2024-02-20 15:31:12',
    action: 'Recon job: internal subnet 192.168.1.0/24',
    decision: 'allowed',
    reason: 'Internal scope validated.',
    actor: 'Ethics Sentinel Delta'
  },
  {
    id: 'evt-003',
    timestamp: '2024-02-20 15:29:01',
    action: 'Exploit payload generation request',
    decision: 'review',
    reason: 'Payload includes high-risk primitives; manual review required.',
    actor: 'Ethics Sentinel Delta'
  }
]

export const ethicsApi = {
  async getRules(): Promise<EthicsRule[]> {
    await new Promise(resolve => setTimeout(resolve, 250))
    return mockRules
  },

  async getEvents(): Promise<EthicsEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockEvents
  }
}
