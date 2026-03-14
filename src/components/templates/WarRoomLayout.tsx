import React from 'react'
import { Shield, Activity, Database } from 'lucide-react'
import { StatCard } from '@/components/molecules/StatCard'
import { TargetEngagement } from '@/components/organisms/TargetEngagement'
import { LiveFeed } from '@/components/organisms/LiveFeed'

interface WarRoomLayoutProps {
  className?: string
}

export const WarRoomLayout: React.FC<WarRoomLayoutProps> = ({ className }) => {
  const [currentTime, setCurrentTime] = React.useState(new Date())
  const [systemStatus] = React.useState({
    status: 'operational' as const,
    agents: { active: 3, total: 5 }
  })

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 ${className}`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative z-10">
        {/* Top Bar */}
        <header className="glass-panel border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">KEYMAKER</h1>
                <p className="text-xs text-gray-400 font-mono">War Room Command Center</p>
              </div>
            </div>

            {/* System Status */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm font-mono text-cyan-400">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-xs text-gray-400">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
              
              <div className="glass-panel px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    systemStatus.status === 'operational' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                  }`} />
                  <span className="text-sm font-mono text-green-400">
                    {systemStatus.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {systemStatus.agents.active}/{systemStatus.agents.total} Agents
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="p-6 max-w-[1920px] mx-auto">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Critical Threats"
              value={7}
              change={-12}
              icon={Shield}
              trend="down"
            />
            <StatCard
              title="Active Scans"
              value={23}
              change={5}
              icon={Activity}
              trend="up"
            />
            <StatCard
              title="Qdrant Status"
              value="ONLINE"
              icon={Database}
            />
            <StatCard
              title="Memory Usage"
              value="2.1GB"
              change={8}
              icon={Database}
              trend="up"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Target Engagement Module */}
            <TargetEngagement />
            
            {/* Live Feed */}
            <LiveFeed />
          </div>
        </main>
      </div>
    </div>
  )
}
