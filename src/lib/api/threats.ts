// Threat Intelligence API Service
import { Threat } from '@/types/threats'

// Mock threat data with Qdrant similarity and MITRE ATT&CK
export const mockThreats: Threat[] = [
  {
    id: 'thr-001',
    name: 'SQL Injection Vulnerability',
    type: 'vulnerability',
    severity: 'critical',
    status: 'active',
    source: 'External Scanner',
    target: 'webapp.example.com',
    discovered: '2024-02-20 10:30:00',
    description: 'Critical SQL injection vulnerability found in login endpoint allowing unauthorized database access.',
    impact: 'Complete database compromise possible',
    confidence: 95,
    affectedSystems: ['MySQL Server', 'Web Application'],
    qdrantSimilarity: 87.3,
    cvssScore: 9.8,
    mitreTactics: ['TA0001 - Initial Access', 'TA0002 - Execution'],
    mitreTechniques: ['T1190 - Exploit Public-Facing Application', 'T1055 - Injection']
  },
  {
    id: 'thr-002',
    name: 'Brute Force Attack Detected',
    type: 'network',
    severity: 'high',
    status: 'investigating',
    source: 'IDS/IPS',
    target: 'SSH Server (192.168.1.100)',
    discovered: '2024-02-20 09:45:00',
    description: 'Multiple failed login attempts detected from unknown IP addresses.',
    impact: 'Potential unauthorized access to critical systems',
    confidence: 88,
    affectedSystems: ['SSH Server', 'Firewall'],
    qdrantSimilarity: 92.1,
    cvssScore: 7.5,
    mitreTactics: ['TA0001 - Initial Access'],
    mitreTechniques: ['T1110 - Brute Force']
  },
  {
    id: 'thr-003',
    name: 'Ransomware Variant Detected',
    type: 'malware',
    severity: 'critical',
    status: 'mitigated',
    source: 'Endpoint Protection',
    target: 'File Server (10.0.0.50)',
    discovered: '2024-02-20 08:15:00',
    description: 'New ransomware variant detected and successfully contained.',
    impact: 'Data encryption and system disruption prevented',
    confidence: 92,
    affectedSystems: ['File Server', 'Backup Systems'],
    qdrantSimilarity: 94.7,
    cvssScore: 8.9,
    mitreTactics: ['TA0040 - Impact'],
    mitreTechniques: ['T1486 - Data Encrypted for Impact']
  },
  {
    id: 'thr-004',
    name: 'Outdated Software Vulnerability',
    type: 'vulnerability',
    severity: 'medium',
    status: 'active',
    source: 'Vulnerability Scanner',
    target: 'Internal Applications',
    discovered: '2024-02-20 07:30:00',
    description: 'Multiple applications running outdated versions with known CVEs.',
    impact: 'Potential exploitation of known vulnerabilities',
    confidence: 78,
    affectedSystems: ['Web Servers', 'Application Servers'],
    qdrantSimilarity: 65.2,
    cvssScore: 6.2,
    mitreTactics: ['TA0002 - Execution'],
    mitreTechniques: ['T1068 - Exploitation for Client Execution']
  },
  {
    id: 'thr-005',
    name: 'Privilege Escalation Attempt',
    type: 'exploit',
    severity: 'high',
    status: 'active',
    source: 'Internal Monitor',
    target: 'Database Server (192.168.1.200)',
    discovered: '2024-02-20 11:15:00',
    description: 'User attempting privilege escalation using sudo misconfiguration.',
    impact: 'Root access to critical database systems',
    confidence: 91,
    affectedSystems: ['Linux Server', 'PostgreSQL'],
    qdrantSimilarity: 88.9,
    cvssScore: 8.1,
    mitreTactics: ['TA0004 - Privilege Escalation'],
    mitreTechniques: ['T1548 - Abuse Elevation Control Mechanism']
  }
]

export const threatsApi = {
  async getThreats(): Promise<Threat[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockThreats
  },

  async getThreatById(id: string): Promise<Threat | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockThreats.find(threat => threat.id === id) || null
  },

  async updateThreatStatus(id: string, status: Threat['status']): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const threat = mockThreats.find(t => t.id === id)
    if (threat) {
      threat.status = status
    }
  },

  async getThreatStats(): Promise<{
    critical: number
    high: number
    medium: number
    low: number
    total: number
  }> {
    const stats = mockThreats.reduce((acc, threat) => {
      acc[threat.severity]++
      acc.total++
      return acc
    }, { critical: 0, high: 0, medium: 0, low: 0, total: 0 })

    return stats
  }
}
