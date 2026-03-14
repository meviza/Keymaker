"use client";

import { useState, useEffect } from "react";
import { Settings, Brain, Cpu, Key, Save, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type AIProvider = "ollama" | "gemini" | "openai" | "mock";

interface AIProviderConfig {
    provider: AIProvider;
    model: string;
    apiKey?: string;
    endpoint?: string;
}

const PROVIDER_META: Record<AIProvider, { label: string; color: string; models: string[]; needsKey: boolean; needsEndpoint: boolean }> = {
    ollama: { label: "Ollama (Local)", color: "cyber-green", models: ["llama3", "llama3.1", "mistral", "gemma2", "codellama"], needsKey: false, needsEndpoint: true },
    gemini: { label: "Gemini (Google)", color: "cyber-blue", models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash"], needsKey: true, needsEndpoint: false },
    openai: { label: "OpenAI", color: "cyber-yellow", models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "o1-preview"], needsKey: true, needsEndpoint: false },
    mock: { label: "Mock (No LLM)", color: "gray-400", models: ["mock-llm"], needsKey: false, needsEndpoint: false },
};

const DEFAULTS: AIProviderConfig = { provider: "ollama", model: "llama3", endpoint: "http://localhost:11434" };

function ProviderCard({ provider, selected, onClick }: { provider: AIProvider; selected: boolean; onClick: () => void }) {
    const meta = PROVIDER_META[provider];
    const colorClass = selected
        ? `bg-${meta.color}/10 border-${meta.color}/60`
        : "bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/5";

    return (
        <button onClick={onClick} className={`p-4 rounded-xl border text-left transition-all w-full ${colorClass}`}>
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${selected ? `bg-${meta.color}` : "bg-zinc-700"} transition-all`} />
                <span className={`font-bold text-sm ${selected ? `text-${meta.color}` : "text-zinc-300"}`}>{meta.label}</span>
                {selected && <CheckCircle className={`w-4 h-4 ml-auto text-${meta.color}`} />}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1 ml-6">
                {meta.models.slice(0, 3).join(" · ")}
                {meta.models.length > 3 && ` +${meta.models.length - 3} more`}
            </p>
        </button>
    );
}

export default function SettingsPage() {
    const [config, setConfig] = useState<AIProviderConfig>(DEFAULTS);
    const [saved, setSaved] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<"ok" | "fail" | null>(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("keymaker_ai_config");
            if (raw) setConfig(JSON.parse(raw));
        } catch { /* ignore */ }
    }, []);

    const meta = PROVIDER_META[config.provider];

    const handleSave = () => {
        localStorage.setItem("keymaker_ai_config", JSON.stringify(config));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleTest = async () => {
        setTesting(true);
        setTestResult(null);
        try {
            const res = await fetch("/api/v1/ai/ping", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            });
            setTestResult(res.ok ? "ok" : "fail");
        } catch {
            setTestResult("fail");
        } finally {
            setTesting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight uppercase text-glow-green flex items-center gap-3">
                    <Settings className="w-9 h-9 text-cyber-green" />Settings
                </h1>
                <p className="text-gray-400 mt-2">
                    <span className="text-cyber-green font-mono">Keymaker</span> — Configuration &amp; AI Provider
                </p>
            </div>

            {/* AI Provider */}
            <div className="glass-panel p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-5">
                    <Brain className="w-5 h-5 text-cyber-green" />
                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">AI Brain Provider</h2>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    {(Object.keys(PROVIDER_META) as AIProvider[]).map(p => (
                        <ProviderCard
                            key={p}
                            provider={p}
                            selected={config.provider === p}
                            onClick={() => setConfig(prev => ({ ...prev, provider: p, model: PROVIDER_META[p].models[0] }))}
                        />
                    ))}
                </div>

                <div className="mb-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Model</label>
                    <select
                        value={config.model}
                        onChange={e => setConfig(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 rounded-md py-2.5 px-3 text-white focus:border-cyber-green/50 focus:outline-none font-mono text-sm"
                    >
                        {meta.models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {meta.needsEndpoint && (
                    <div className="mb-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block flex items-center gap-1">
                            <Cpu className="w-3.5 h-3.5" /> Endpoint URL
                        </label>
                        <input
                            type="text"
                            value={config.endpoint || ""}
                            onChange={e => setConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                            className="w-full bg-black/50 border border-white/10 rounded-md py-2.5 px-3 text-white focus:border-cyber-green/50 focus:outline-none font-mono text-sm"
                            placeholder="http://localhost:11434"
                        />
                    </div>
                )}

                {meta.needsKey && (
                    <div className="mb-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block flex items-center gap-1">
                            <Key className="w-3.5 h-3.5" /> API Key
                        </label>
                        <input
                            type="password"
                            value={config.apiKey || ""}
                            onChange={e => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                            className="w-full bg-black/50 border border-white/10 rounded-md py-2.5 px-3 text-white focus:border-cyber-green/50 focus:outline-none font-mono text-sm"
                            placeholder="sk-…"
                        />
                    </div>
                )}

                <div className="flex gap-3 mt-2 flex-wrap items-center">
                    <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-cyber-green/80 hover:bg-cyber-green text-black font-bold rounded-lg transition-all text-sm">
                        {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saved ? "Saved!" : "Save Config"}
                    </button>
                    <button onClick={handleTest} disabled={testing} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-lg transition-all text-sm disabled:opacity-50">
                        {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                        Test Connection
                    </button>
                    {testResult === "ok" && <span className="flex items-center gap-1 text-cyber-green text-sm"><CheckCircle className="w-4 h-4" /> Connected</span>}
                    {testResult === "fail" && <span className="flex items-center gap-1 text-red-400 text-sm"><AlertCircle className="w-4 h-4" /> Failed</span>}
                </div>
            </div>

            {/* System Info */}
            <div className="glass-panel p-6 rounded-xl border border-white/10">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyber-blue" /> System Information
                </h2>
                <div className="grid grid-cols-2 gap-3 text-sm font-mono">
                    {[
                        ["Platform", "Keymaker Enterprise v3.0.0"],
                        ["AI Engine", `${meta.label} / ${config.model}`],
                        ["Backend", "FastAPI — localhost:8000"],
                        ["Frontend", "Next.js — localhost:3000"],
                        ["eBPF Telemetry", "ACTIVE (simulated)"],
                        ["Kafka Broker", "localhost:29092"],
                    ].map(([k, v]) => (
                        <div key={k} className="flex flex-col gap-0.5 p-3 bg-black/30 rounded-lg border border-white/5">
                            <span className="text-zinc-500 text-[10px] uppercase tracking-widest">{k}</span>
                            <span className="text-white">{v}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
