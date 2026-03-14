"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Key, CheckCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const ROLES = ["CISO", "Red Team Lead", "Penetration Tester", "Security Analyst", "SOC Manager", "DevSecOps Engineer", "Other"]
const USE_CASES = ["Enterprise Red Teaming", "Automated Vulnerability Management", "CTI & Threat Hunting", "Compliance Testing (PCI, SOC2)", "Research & Development", "Other"]

export default function DemoPage() {
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({ name: "", company: "", role: "", email: "", useCase: "" })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await new Promise((r) => setTimeout(r, 1000))
        setSubmitted(true)
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-[#050608] flex items-center justify-center px-4 py-16 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/3 right-0 w-[500px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black/60 border border-cyan-500/30 mb-4" style={{ boxShadow: "0 0 30px rgba(0,212,255,0.15)" }}>
                        <Key className="w-7 h-7 text-cyan-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Request a Demo</h1>
                    <p className="text-zinc-400 text-sm mt-1">Unlock access to the Keymaker War Room.</p>
                </div>

                <div className="glass-panel border border-white/10 rounded-2xl p-8">
                    {submitted ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                            <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-white mb-2">Request Received</h2>
                            <p className="text-zinc-400 text-sm mb-6">
                                Our team will reach out within 24 hours to schedule your personalized demo of the Anahtarcı AI platform.
                            </p>
                            <Link href="/login">
                                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                                    Back to Sign-In
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {[
                                { key: "name", label: "Full Name", placeholder: "Kerem Çelik", type: "text" },
                                { key: "company", label: "Company / Organization", placeholder: "Acme Security Corp", type: "text" },
                                { key: "email", label: "Work Email", placeholder: "you@company.com", type: "email" },
                            ].map(({ key, label, placeholder, type }) => (
                                <div key={key}>
                                    <label className="block text-xs text-zinc-400 mb-1.5 font-medium">{label}</label>
                                    <input
                                        type={type} required placeholder={placeholder}
                                        value={form[key as keyof typeof form]}
                                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 focus:border-cyan-500/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                                    />
                                </div>
                            ))}

                            {[
                                { key: "role", label: "Your Role", options: ROLES, placeholder: "Select your role" },
                                { key: "useCase", label: "Primary Use Case", options: USE_CASES, placeholder: "Select your use case" },
                            ].map(({ key, label, options, placeholder }) => (
                                <div key={key}>
                                    <label className="block text-xs text-zinc-400 mb-1.5 font-medium">{label}</label>
                                    <select
                                        required value={form[key as keyof typeof form]}
                                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 focus:border-cyan-500/50 rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-colors"
                                    >
                                        <option value="" disabled className="bg-zinc-900">{placeholder}</option>
                                        {options.map((o) => <option key={o} value={o} className="bg-zinc-900">{o}</option>)}
                                    </select>
                                </div>
                            ))}

                            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-2.5 mt-2 gap-2" disabled={loading}>
                                {loading ? "Submitting…" : <><span>Request Access</span><ChevronRight className="w-4 h-4" /></>}
                            </Button>
                        </form>
                    )}
                </div>

                <p className="text-center text-zinc-600 text-xs mt-6">
                    Already have access? <Link href="/login" className="text-cyan-500 hover:text-cyan-400 transition-colors">Sign in →</Link>
                </p>
            </motion.div>
        </div>
    )
}
