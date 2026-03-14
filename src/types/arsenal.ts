export interface Exploit {
  id: string
  name: string
  type: 'injection' | 'memory' | 'shellcode' | 'network'
  language: 'python' | 'c' | 'assembly' | 'javascript'
  complexity: 'low' | 'medium' | 'high' | 'critical'
  status: 'ready' | 'generating' | 'testing' | 'failed'
  description: string
  code: string
  aiGenerated: boolean
  successRate: number
  lastUsed?: string
}

export interface PayloadGeneration {
  name: string
  type: Exploit['type']
  language: Exploit['language']
  complexity: Exploit['complexity']
  description: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}
