"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Key, Lock, Eye, EyeOff, ChevronRight, Shield, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { login, setOfflineDemoSession } from "@/lib/auth/authService"
import { resolvePostLoginPath } from "@/lib/auth/access"

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const nextPath = resolvePostLoginPath(searchParams.get("next"))

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await login(email, password)
            router.push(nextPath)
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Login failed"
            // Graceful fallback: if backend unreachable, allow demo access
            if (msg.toLowerCase().includes("fetch") || msg.toLowerCase().includes("failed to fetch")) {
                setOfflineDemoSession()
                router.push(nextPath)
            } else {
                setError(msg)
                setLoading(false)
            }
        }
    }

    return (
        <div className="min-h-screen bg-[#050608] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Ambient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-sm z-10"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black/60 border border-cyan-500/30 mb-4" style={{ boxShadow: "0 0 30px rgba(0,212,255,0.15)" }}>
                        <Key className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">KEYMAKER</h1>
                    <p className="text-zinc-500 text-sm mt-1">Autonomous Cyber Operations</p>
                </div>

                {/* Card */}
                <div className="glass-panel border border-white/10 rounded-2xl p-8" style={{ boxShadow: "0 0 60px rgba(0,0,0,0.6)" }}>
                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-cyan-500" />Operator Sign-In
                    </h2>

                    {error && (
                        <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-sm text-red-400">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Email</label>
                            <input
                                type="email" required value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="operator@keymaker.io"
                                className="w-full bg-black/40 border border-white/10 focus:border-cyan-500/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} required value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-black/40 border border-white/10 focus:border-cyan-500/50 rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-2.5 gap-2" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">Enter War Room <ChevronRight className="w-4 h-4" /></span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-5 pt-5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                        <div className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-emerald-500" />All access is logged</div>
                        <Link href="/demo" className="text-cyan-500 hover:text-cyan-400 transition-colors">Request Demo</Link>
                    </div>
                </div>

                <p className="text-center text-zinc-600 text-xs mt-6">
                    © 2026 Keymaker Autonomous Ops · <Link href="/landing" className="hover:text-zinc-400 transition-colors">Back to home</Link>
                </p>
            </motion.div>
        </div>
    )
}
