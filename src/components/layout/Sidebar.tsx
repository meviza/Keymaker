"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, Terminal, FileText, Scale, Database, LayoutDashboard, Activity, Settings, Key, Zap } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Anahtarcı", href: "/command", icon: LayoutDashboard },
  { name: "Observatory", href: "/observatory", icon: Activity },
  { name: "ARTi Engine", href: "/arti", icon: Zap },
  { name: "Threat Intel", href: "/threats", icon: ShieldAlert },
  { name: "Arsenal", href: "/arsenal", icon: Terminal },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Ethics Sentinel", href: "/ethics", icon: Scale },
  { name: "CTI Database", href: "/cti", icon: Database },
  { name: "Settings", href: "/settings", icon: Settings },
];

const PUBLIC_PATHS = ["/", "/landing", "/pricing", "/services", "/support", "/privacy", "/terms", "/cookies", "/contact", "/login", "/demo"];

export function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on public/auth routes
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="w-64 glass-panel border-r border-white/10 h-screen flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 flex items-center space-x-3 border-b border-white/10">
        <div className="w-10 h-10 bg-cyber-green/20 rounded-md flex items-center justify-center border border-cyber-green/50 shadow-[0_0_15px_rgba(0,255,157,0.3)]">
          <Key className="w-6 h-6 text-cyber-green" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-wider">KEYMAKER</h1>
          <p className="text-xs text-cyber-green/80 text-glow-green">Anahtarcı — OPS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 ml-2">
          Command Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-cyber-green/10 text-cyber-green border border-cyber-green/30 shadow-[inset_0_0_10px_rgba(0,255,157,0.1)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={clsx("w-5 h-5 flex-shrink-0", isActive && "animate-neon-pulse")} />
              <span className="font-medium text-sm">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyber-green shadow-[0_0_5px_#00ff9d] flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer: Settings + Status */}
      <div className="p-4 border-t border-white/10 space-y-2">
        {/* AI Status mini-widget */}
        <div className="glass-panel px-3 py-2 rounded-md flex items-center gap-2 bg-black/20 border border-white/5">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="text-xs flex-1 min-w-0">
            <p className="text-zinc-400 truncate font-mono">Anahtarcı: <span className="text-red-400 font-semibold">HUNTER</span></p>
          </div>
        </div>

        {/* Settings */}
        <Link href="/settings" className={clsx(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm",
          pathname === "/settings"
            ? "bg-cyber-green/10 text-cyber-green border border-cyber-green/30"
            : "text-zinc-500 hover:text-white hover:bg-white/5"
        )}>
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>

        {/* System status */}
        <div className="glass-panel p-3 rounded-md flex items-center space-x-3 bg-black/40">
          <div className="w-3 h-3 rounded-full bg-cyber-green animate-pulse shadow-[0_0_5px_#00ff9d]"></div>
          <div className="text-sm">
            <p className="text-white font-semibold">System Online</p>
            <p className="text-xs text-gray-400">Backend: Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
