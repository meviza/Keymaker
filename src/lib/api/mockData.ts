// Project Keymaker - Mock Data Service
// Clean Architecture: All data comes from service layer

export interface SystemStatus {
  status: 'operational' | 'warning' | 'critical'
  message: string
  uptime: string
  agents: { active: number; total: number }
}

export interface ThreatStat {
  label: string
  value: number
  change: number
  severity: 'critical' | 'high' | 'medium' | 'low'
}

export interface LiveFeedItem {
  id: string
  timestamp: string
  event: string
  severity: 'info' | 'warning' | 'critical'
  source: string
}

export interface Agent {
  id: string
  name: string
  type: 'recon' | 'exploit' | 'memory' | 'ethics'
  status: 'active' | 'idle' | 'busy'
  lastActivity: string
  successRate: number
}

export interface TargetSpec {
  id: string
  target: string
  scanType: 'recon' | 'vuln' | 'exploit'
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  startTime?: string
}

// Mock Data Generator
export const mockDataService = {
  // System Status
  async getSystemStatus(): Promise<SystemStatus> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      status: 'operational',
      message: 'All systems operational',
      uptime: '99.9%',
      agents: { active: 3, total: 5 }
    }
  },

  // Threat Statistics
  async getThreatStats(): Promise<ThreatStat[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [
      { label: 'Critical Threats', value: 7, change: -12, severity: 'critical' },
      { label: 'Active Exploits', value: 23, change: 5, severity: 'high' },
      { label: 'Scans Running', value: 142, change: 8, severity: 'medium' },
      { label: 'Vulnerabilities', value: 1847, change: -3, severity: 'low' }
    ]
  },

  // Live Feed
  async getLiveFeed(): Promise<LiveFeedItem[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    return [
      {
        id: '1',
        timestamp: '15:34:22',
        event: 'CVE-2024-1234: SQL Injection exploit matched with EXP-001',
        severity: 'warning',
        source: 'Exploit Agent'
      },
      {
        id: '2',
        timestamp: '15:33:45',
        event: 'Ethics Sentinel blocked unauthorized access to 8.8.8.8',
        severity: 'critical',
        source: 'Ethics Agent'
      },
      {
        id: '3',
        timestamp: '15:32:18',
        event: 'Port scan completed on 192.168.1.0/24: 23 hosts discovered',
        severity: 'info',
        source: 'Recon Agent'
      },
      {
        id: '4',
        timestamp: '15:31:03',
        event: 'Polymorphic payload generated: Signature evasion confirmed',
        severity: 'info',
        source: 'Exploit Agent'
      },
      {
        id: '5',
        timestamp: '15:30:47',
        event: 'AI recommendation: Best payload for CVE-2024-5678 available',
        severity: 'info',
        source: 'Memory Agent'
      }
    ]
  },

  // AI Agents Status
  async getAgents(): Promise<Agent[]> {
    await new Promise(resolve => setTimeout(resolve, 250))
    return [
      {
        id: 'recon-001',
        name: 'Recon Agent Alpha',
        type: 'recon',
        status: 'active',
        lastActivity: '2 min ago',
        successRate: 98.5
      },
      {
        id: 'exploit-002',
        name: 'Exploit Engine Beta',
        type: 'exploit',
        status: 'busy',
        lastActivity: '30 sec ago',
        successRate: 87.3
      },
      {
        id: 'memory-003',
        name: 'Memory Agent Gamma',
        type: 'memory',
        status: 'active',
        lastActivity: '1 min ago',
        successRate: 99.1
      },
      {
        id: 'ethics-004',
        name: 'Ethics Sentinel Delta',
        type: 'ethics',
        status: 'active',
        lastActivity: 'Live',
        successRate: 100
      },
      {
        id: 'recon-005',
        name: 'Recon Agent Epsilon',
        type: 'recon',
        status: 'idle',
        lastActivity: '5 min ago',
        successRate: 95.2
      }
    ]
  },

  // Target Specifications
  async getTargets(): Promise<TargetSpec[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [
      {
        id: 'target-001',
        target: '192.168.1.100',
        scanType: 'recon',
        status: 'completed',
        progress: 100,
        startTime: '15:20:00'
      },
      {
        id: 'target-002',
        target: 'webapp.example.com',
        scanType: 'vuln',
        status: 'running',
        progress: 67,
        startTime: '15:25:00'
      },
      {
        id: 'target-003',
        target: '10.0.0.50',
        scanType: 'exploit',
        status: 'pending',
        progress: 0
      }
    ]
  },

  // Real-time WebSocket simulation
  subscribeToLiveFeed(callback: (item: LiveFeedItem) => void): () => void {
    const events = [
      { event: 'New vulnerability detected in target system', severity: 'warning' as const, source: 'Recon Agent' },
      { event: 'Payload execution successful', severity: 'info' as const, source: 'Exploit Agent' },
      { event: 'Ethics guardrail activated: Unauthorized scan blocked', severity: 'critical' as const, source: 'Ethics Agent' },
      { event: 'Qdrant vector similarity match: 94.7%', severity: 'info' as const, source: 'Memory Agent' }
    ]

    let index = 0
    const interval = setInterval(() => {
      const event = events[index % events.length]
      callback({
        id: `live-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        ...event
      })
      index++
    }, 5000)

    return () => clearInterval(interval)
  }
}
