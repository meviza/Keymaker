"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  BrainCircuit,
  CheckCircle2,
  CloudCog,
  GitBranch,
  KeyRound,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { apiService, type AuthorizedTargetRecord, type DefensiveEvaluationRecord, type DefensivePackRecord, type DefensiveReplayRecord, type DefensiveRuntimeRecord, type EnvironmentReadiness, type FederatedIdentityRecord, type IdentityProviderRecord, type IntegrationReadiness, type PatchJobRecord, type PullRequestHandoffRecord, type RepositoryIntegrationRecord } from "@/lib/api/services";

type ProviderForm = {
  tenant_id: string;
  provider_type: string;
  issuer: string;
  client_id: string;
  audience: string;
  discovery_url: string;
  jwks_uri: string;
  claim_role: string;
};

type RepositoryForm = {
  tenant_id: string;
  provider: string;
  repo_slug: string;
  default_branch: string;
  ci_provider: string;
  secret_ref: string;
  webhook_secret_ref: string;
  api_base_url: string;
  project_id: string;
};

type AuthorizedTargetForm = {
  tenant_id: string;
  repository_id: string;
  target_id: string;
  target_type: string;
  authorization_mode: string;
  evidence_reference: string;
  allowed_operations: string;
  constraints: string;
};

const DEFAULT_PROVIDER: ProviderForm = {
  tenant_id: "default-enterprise",
  provider_type: "oidc",
  issuer: "",
  client_id: "",
  audience: "keymaker-api",
  discovery_url: "",
  jwks_uri: "",
  claim_role: "role",
};

const DEFAULT_REPOSITORY: RepositoryForm = {
  tenant_id: "default-enterprise",
  provider: "github",
  repo_slug: "",
  default_branch: "main",
  ci_provider: "github-actions",
  secret_ref: "GITHUB_TOKEN",
  webhook_secret_ref: "GITHUB_WEBHOOK_SECRET",
  api_base_url: "",
  project_id: "",
};

const DEFAULT_AUTHORIZED_TARGET: AuthorizedTargetForm = {
  tenant_id: "default-enterprise",
  repository_id: "",
  target_id: "",
  target_type: "repository",
  authorization_mode: "explicit-written-scope",
  evidence_reference: "",
  allowed_operations: "validation,staging-verification",
  constraints: "Operate only within documented scope;Respect rate limits",
};

const AUTHORIZED_TARGET_PRESETS = [
  {
    label: "Staging Repo",
    description: "Repository-bound staging verification profile.",
    values: {
      target_type: "repository",
      authorization_mode: "explicit-written-scope",
      evidence_reference: "staging-scope-doc",
      allowed_operations: "validation,staging-verification,configuration-review",
      constraints: "Operate only on approved repository workflows;Respect CI and rate limits",
    },
  },
  {
    label: "Internal Lab",
    description: "Controlled lab for replay and runtime validation.",
    values: {
      target_type: "lab",
      authorization_mode: "internal-staging-approval",
      evidence_reference: "lab-approval-record",
      allowed_operations: "validation,sandbox-verification,replay-drill",
      constraints: "No outbound pivoting;Stay inside lab subnets",
    },
  },
  {
    label: "Bounty Scope",
    description: "Open program verification profile with explicit constraints.",
    values: {
      target_type: "staging",
      authorization_mode: "bug-bounty-scope",
      evidence_reference: "bounty-scope-reference",
      allowed_operations: "validation,configuration-review",
      constraints: "Follow published program rules;Respect rate limits and disclosure terms",
    },
  },
] as const;

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
        ok
          ? "border-cyber-green/40 bg-cyber-green/10 text-cyber-green"
          : "border-red-500/30 bg-red-500/10 text-red-300"
      }`}
    >
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: typeof ShieldCheck; children: React.ReactNode }) {
  return (
    <section className="glass-panel rounded-2xl border border-white/10 p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl border border-cyber-green/30 bg-cyber-green/10 p-2">
          <Icon className="h-5 w-5 text-cyber-green" />
        </div>
        <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-cyber-green/50 ${props.className ?? ""}`}
    />
  );
}

export default function SettingsPage() {
  const [tenantId, setTenantId] = useState("default-enterprise");
  const [environment, setEnvironment] = useState<EnvironmentReadiness | null>(null);
  const [providers, setProviders] = useState<IdentityProviderRecord[]>([]);
  const [repositories, setRepositories] = useState<RepositoryIntegrationRecord[]>([]);
  const [providerReadiness, setProviderReadiness] = useState<Record<string, unknown> | null>(null);
  const [repositoryReadiness, setRepositoryReadiness] = useState<IntegrationReadiness | null>(null);
  const [operatingModel, setOperatingModel] = useState<Record<string, unknown> | null>(null);
  const [executiveSnapshot, setExecutiveSnapshot] = useState<Record<string, unknown> | null>(null);
  const [verifiedIdentity, setVerifiedIdentity] = useState<FederatedIdentityRecord | null>(null);
  const [patchJobs, setPatchJobs] = useState<PatchJobRecord[]>([]);
  const [handoffs, setHandoffs] = useState<PullRequestHandoffRecord[]>([]);
  const [authorizedTargets, setAuthorizedTargets] = useState<AuthorizedTargetRecord[]>([]);
  const [defensivePack, setDefensivePack] = useState<DefensivePackRecord | null>(null);
  const [defensiveReplays, setDefensiveReplays] = useState<DefensiveReplayRecord[]>([]);
  const [defensiveRuntime, setDefensiveRuntime] = useState<DefensiveRuntimeRecord | null>(null);
  const [defensiveEvaluation, setDefensiveEvaluation] = useState<DefensiveEvaluationRecord | null>(null);
  const [candidateOutput, setCandidateOutput] = useState(
    "Reference the selected finding, require unit-regression and security-regression, perform policy-review before rollout, and keep rollback steps ready to restore the previous safe state."
  );
  const [providerForm, setProviderForm] = useState<ProviderForm>(DEFAULT_PROVIDER);
  const [repositoryForm, setRepositoryForm] = useState<RepositoryForm>(DEFAULT_REPOSITORY);
  const [authorizedTargetForm, setAuthorizedTargetForm] = useState<AuthorizedTargetForm>(DEFAULT_AUTHORIZED_TARGET);
  const [federatedToken, setFederatedToken] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [selectedRepositoryId, setSelectedRepositoryId] = useState("");
  const [selectedPatchJobId, setSelectedPatchJobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadData = async (currentTenantId: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const [env, providerList, repoList, operating, executive, patchJobList] = await Promise.all([
        apiService.getEnvironmentReadiness(),
        apiService.listIdentityProviders(currentTenantId),
        apiService.listRepositories(currentTenantId),
        apiService.getOperatingModel(currentTenantId),
        apiService.getExecutiveSnapshot(currentTenantId),
        apiService.listPatchJobs(),
      ]);
      const replayList = await apiService.listDefensiveReplays({ tenant_id: currentTenantId });
      const targetList = await apiService.listAuthorizedTargets(currentTenantId);
      setEnvironment(env);
      setProviders(providerList);
      setRepositories(repoList);
      setOperatingModel(operating);
      setExecutiveSnapshot(executive);
      setPatchJobs(patchJobList);
      setAuthorizedTargets(targetList);
      setDefensiveReplays(replayList);
      if (providerList[0]) setSelectedProviderId((prev) => prev || providerList[0].id);
      if (repoList[0]) setSelectedRepositoryId((prev) => prev || repoList[0].id);
      if (patchJobList[0]) setSelectedPatchJobId((prev) => prev || patchJobList[0].id);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Live data could not be loaded");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(tenantId);
  }, [tenantId]);

  useEffect(() => {
    setProviderForm((prev) => ({ ...prev, tenant_id: tenantId }));
    setRepositoryForm((prev) => ({ ...prev, tenant_id: tenantId }));
    setAuthorizedTargetForm((prev) => ({ ...prev, tenant_id: tenantId }));
  }, [tenantId]);

  const submitProvider = async () => {
    try {
      await apiService.registerIdentityProvider({
        ...providerForm,
        claim_mapping: { role: providerForm.claim_role },
      });
      await loadData(tenantId);
      setMessage("Identity provider registered")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Provider registration failed")
    }
  };

  const submitRepository = async () => {
    try {
      await apiService.registerRepository(repositoryForm);
      await loadData(tenantId);
      setMessage("Repository integration registered")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Repository registration failed")
    }
  };

  const submitAuthorizedTarget = async () => {
    try {
      await apiService.upsertAuthorizedTarget({
        tenant_id: authorizedTargetForm.tenant_id,
        repository_id: authorizedTargetForm.repository_id || undefined,
        target_id: authorizedTargetForm.target_id,
        target_type: authorizedTargetForm.target_type,
        authorization_mode: authorizedTargetForm.authorization_mode,
        evidence_reference: authorizedTargetForm.evidence_reference,
        allowed_operations: authorizedTargetForm.allowed_operations.split(",").map((item) => item.trim()).filter(Boolean),
        constraints: authorizedTargetForm.constraints.split(";").map((item) => item.trim()).filter(Boolean),
      });
      const targetList = await apiService.listAuthorizedTargets(tenantId);
      setAuthorizedTargets(targetList);
      setMessage("Authorized target saved");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authorized target save failed");
    }
  };

  const applyAuthorizedTargetPreset = (preset: (typeof AUTHORIZED_TARGET_PRESETS)[number]) => {
    const selectedRepository = repositories.find((item) => item.id === selectedRepositoryId);
    setAuthorizedTargetForm((prev) => ({
      ...prev,
      tenant_id: tenantId,
      repository_id: selectedRepositoryId || prev.repository_id,
      target_id: selectedRepository?.repo_slug || prev.target_id,
      target_type: preset.values.target_type,
      authorization_mode: preset.values.authorization_mode,
      evidence_reference: preset.values.evidence_reference,
      allowed_operations: preset.values.allowed_operations,
      constraints: preset.values.constraints,
    }));
    setMessage(`${preset.label} preset loaded`);
  };

  const savePresetAndRefresh = async (preset: (typeof AUTHORIZED_TARGET_PRESETS)[number]) => {
    applyAuthorizedTargetPreset(preset);
    const selectedRepository = repositories.find((item) => item.id === selectedRepositoryId);
    try {
      await apiService.upsertAuthorizedTarget({
        tenant_id: tenantId,
        repository_id: selectedRepositoryId || undefined,
        target_id: selectedRepository?.repo_slug || authorizedTargetForm.target_id || "authorized-lab",
        target_type: preset.values.target_type,
        authorization_mode: preset.values.authorization_mode,
        evidence_reference: preset.values.evidence_reference,
        allowed_operations: preset.values.allowed_operations.split(",").map((item) => item.trim()).filter(Boolean),
        constraints: preset.values.constraints.split(";").map((item) => item.trim()).filter(Boolean),
      });
      const targetList = await apiService.listAuthorizedTargets(tenantId);
      setAuthorizedTargets(targetList);
      setMessage(`${preset.label} preset saved`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Preset save failed");
    }
  };

  const runAuthorizedPresetFlow = async (preset: (typeof AUTHORIZED_TARGET_PRESETS)[number]) => {
    const selectedRepository = repositories.find((item) => item.id === selectedRepositoryId);
    const repositoryId = selectedRepositoryId || selectedRepository?.id;
    const targetId = selectedRepository?.repo_slug || authorizedTargetForm.target_id || "authorized-lab";

    try {
      await apiService.upsertAuthorizedTarget({
        tenant_id: tenantId,
        repository_id: repositoryId || undefined,
        target_id: targetId,
        target_type: preset.values.target_type,
        authorization_mode: preset.values.authorization_mode,
        evidence_reference: preset.values.evidence_reference,
        allowed_operations: preset.values.allowed_operations.split(",").map((item) => item.trim()).filter(Boolean),
        constraints: preset.values.constraints.split(";").map((item) => item.trim()).filter(Boolean),
      });

      const targetList = await apiService.listAuthorizedTargets(tenantId);
      setAuthorizedTargets(targetList);

      const handoffId = handoffs.find((item) => item.repository_id === repositoryId)?.id ?? handoffs[0]?.id;
      const findings = patchJobs.slice(0, 1).map((job) => ({
        id: job.id,
        title: job.pr_artifact?.title ?? "Patch job",
        severity: job.status === "pr-ready" ? "HIGH" : "MEDIUM",
        summary: job.rollback_reference ?? "Rollback reference unavailable",
      }));

      const runtime = await apiService.prepareDefensiveRuntime({
        tenant_id: tenantId,
        repository_id: repositoryId || undefined,
        handoff_id: handoffId,
        findings,
      });
      setDefensiveRuntime(runtime);
      setDefensivePack(runtime.pack);

      if (runtime.blocked) {
        setMessage(runtime.halt_reasons?.join(" ") ?? `${preset.label} flow blocked`);
        return;
      }

      const draft = await apiService.generateDefensiveDraft({
        pack: runtime.pack as unknown as Record<string, unknown>,
        findings,
        repository_context: (runtime.repository_context ?? {}) as Record<string, unknown>,
      });

      if (draft.blocked) {
        setMessage(draft.halt_reasons?.join(" ") ?? `${preset.label} draft blocked`);
        return;
      }

      setCandidateOutput(draft.candidate_output);
      const evaluation = await apiService.evaluateAndStoreDefensiveCandidate({
        candidate_output: draft.candidate_output,
        pack: runtime.pack as unknown as Record<string, unknown>,
        tenant_id: tenantId,
        repository_id: repositoryId || undefined,
        findings,
      });
      setDefensiveEvaluation(evaluation);

      const replayList = await apiService.listDefensiveReplays({ tenant_id: tenantId, repository_id: repositoryId || undefined });
      setDefensiveReplays(replayList);
      setMessage(
        evaluation.blocked
          ? (evaluation.halt_reasons?.join(" ") ?? `${preset.label} flow blocked during evaluation`)
          : `${preset.label} flow completed`
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authorized preset flow failed");
    }
  };

  const checkProviderReadiness = async () => {
    if (!selectedProviderId) return;
    try {
      setProviderReadiness(await apiService.getProviderReadiness(selectedProviderId));
      setMessage("Provider readiness refreshed");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Provider readiness failed");
    }
  };

  const checkRepositoryReadiness = async () => {
    if (!selectedRepositoryId) return;
    try {
      setRepositoryReadiness(await apiService.getRepositoryReadiness(selectedRepositoryId));
      setMessage("Repository readiness refreshed");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Repository readiness failed");
    }
  };

  const createHandoff = async () => {
    if (!selectedRepositoryId || !selectedPatchJobId) return;
    try {
      const patchJob = await apiService.getPatchJob(selectedPatchJobId);
      await apiService.createPrHandoff({
        tenant_id: tenantId,
        patch_job: patchJob,
        repository_id: selectedRepositoryId,
      });
      const nextHandoffs = await apiService.listPrHandoffs(selectedRepositoryId, selectedPatchJobId);
      setHandoffs(nextHandoffs);
      setMessage("PR handoff created");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "PR handoff creation failed");
    }
  };

  const refreshHandoffs = useCallback(async () => {
    try {
      const nextHandoffs = await apiService.listPrHandoffs(selectedRepositoryId || undefined, selectedPatchJobId || undefined);
      setHandoffs(nextHandoffs);
      setMessage("PR handoffs refreshed");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "PR handoff refresh failed");
    }
  }, [selectedPatchJobId, selectedRepositoryId]);

  const publishHandoff = async (handoffId: string) => {
    try {
      await apiService.publishPr(handoffId);
      await refreshHandoffs();
      setMessage("PR publish attempted");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "PR publish failed");
    }
  };

  const syncHandoff = async (handoffId: string) => {
    try {
      await apiService.syncPr(handoffId);
      await refreshHandoffs();
      setMessage("PR state synced");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "PR sync failed");
    }
  };

  const verifyToken = async () => {
    if (!selectedProviderId || !federatedToken.trim()) return;
    try {
      setVerifiedIdentity(await apiService.verifyFederatedToken(selectedProviderId, federatedToken.trim()));
      setMessage("Federated identity verified");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Federated verification failed");
    }
  };

  const loadDefensivePack = useCallback(async () => {
    try {
      const handoffId = handoffs.find((item) => item.repository_id === selectedRepositoryId)?.id ?? handoffs[0]?.id;
      const repository = repositories.find((item) => item.id === selectedRepositoryId);
      const pack = await apiService.getDefensivePack({
        tenant_id: tenantId,
        repository_id: selectedRepositoryId || undefined,
        handoff_id: handoffId,
        top_k: 5,
        findings: patchJobs.slice(0, 1).map((job) => ({
          id: job.id,
          title: job.pr_artifact?.title ?? "Patch job",
          severity: job.status === "pr-ready" ? "HIGH" : "MEDIUM",
          summary: job.rollback_reference ?? "Rollback reference unavailable",
        })),
        target_profile: {
          target_id: repository?.repo_slug ?? "authorized-lab",
          target_type: repository ? "repository" : "lab",
          authorization_mode: "explicit-written-scope",
          evidence_reference: repository?.id ?? "scope-required",
          allowed_operations: ["validation", "configuration-review", "staging-verification"],
        },
      });
      setDefensivePack(pack);
      setMessage("Defensive AI pack refreshed");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Defensive AI pack failed");
    }
  }, [handoffs, patchJobs, repositories, selectedRepositoryId, tenantId]);

  const prepareRuntime = async () => {
    try {
      const handoffId = handoffs.find((item) => item.repository_id === selectedRepositoryId)?.id ?? handoffs[0]?.id;
      const runtime = await apiService.prepareDefensiveRuntime({
        tenant_id: tenantId,
        repository_id: selectedRepositoryId || undefined,
        handoff_id: handoffId,
        findings: patchJobs.slice(0, 1).map((job) => ({
          id: job.id,
          title: job.pr_artifact?.title ?? "Patch job",
          severity: job.status === "pr-ready" ? "HIGH" : "MEDIUM",
          summary: job.rollback_reference ?? "Rollback reference unavailable",
        })),
      });
      setDefensiveRuntime(runtime);
      setDefensivePack(runtime.pack);
      setMessage(runtime.blocked ? (runtime.halt_reasons?.join(" ") ?? "Runtime blocked by authorization policy") : "Defensive runtime prepared");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Defensive runtime preparation failed");
    }
  };

  const evaluateCandidate = async () => {
    if (!defensiveRuntime?.pack || !candidateOutput.trim()) return;
    try {
      const evaluation = await apiService.evaluateAndStoreDefensiveCandidate({
        candidate_output: candidateOutput.trim(),
        pack: defensiveRuntime.pack as unknown as Record<string, unknown>,
        tenant_id: tenantId,
        repository_id: selectedRepositoryId || undefined,
        findings: patchJobs.slice(0, 1).map((job) => ({
          id: job.id,
          title: job.pr_artifact?.title ?? "Patch job",
          severity: job.status === "pr-ready" ? "HIGH" : "MEDIUM",
          summary: job.rollback_reference ?? "Rollback reference unavailable",
        })),
      });
      setDefensiveEvaluation(evaluation);
      const replayList = await apiService.listDefensiveReplays({ tenant_id: tenantId, repository_id: selectedRepositoryId || undefined });
      setDefensiveReplays(replayList);
      setMessage(evaluation.blocked ? (evaluation.halt_reasons?.join(" ") ?? "Candidate blocked by authorization policy") : "Candidate evaluated and replay stored");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Candidate evaluation failed");
    }
  };

  const generateDraft = async () => {
    if (!defensiveRuntime?.pack) return;
    try {
      const draft = await apiService.generateDefensiveDraft({
        pack: defensiveRuntime.pack as unknown as Record<string, unknown>,
        findings: patchJobs.slice(0, 1).map((job) => ({
          id: job.id,
          title: job.pr_artifact?.title ?? "Patch job",
          severity: job.status === "pr-ready" ? "HIGH" : "MEDIUM",
          summary: job.rollback_reference ?? "Rollback reference unavailable",
        })),
        repository_context: (defensiveRuntime.repository_context ?? {}) as Record<string, unknown>,
      });
      if (draft.blocked) {
        setMessage(draft.halt_reasons?.join(" ") ?? "Runtime draft blocked by authorization policy");
        return;
      }
      setCandidateOutput(draft.candidate_output);
      setMessage("Runtime draft generated");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Runtime draft generation failed");
    }
  };

  useEffect(() => {
    if (!selectedRepositoryId && !selectedPatchJobId) return;
    refreshHandoffs();
  }, [refreshHandoffs, selectedPatchJobId, selectedRepositoryId]);

  useEffect(() => {
    if (!selectedRepositoryId && !handoffs[0]?.id) return;
    loadDefensivePack();
  }, [selectedRepositoryId, handoffs, loadDefensivePack]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white">Enterprise Settings</h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">
            Live environment readiness, federated identity, repository delivery and executive operating views. This screen reads
            directly from the backend enterprise endpoints.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TextInput value={tenantId} onChange={(event) => setTenantId(event.target.value)} placeholder="tenant id" className="w-56" />
          <button
            onClick={() => loadData(tenantId)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-zinc-200">
          {message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Env Readiness" icon={CloudCog}>
          <div className="mb-4 flex items-center gap-3">
            <StatusPill ok={Boolean(environment && environment.ready_count === environment.total_count)} label={`${environment?.ready_count ?? 0}/${environment?.total_count ?? 0} ready`} />
          </div>
          <div className="space-y-3">
            {environment?.environment.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                <span className="font-mono text-sm text-zinc-200">{item.name}</span>
                <StatusPill ok={item.configured} label={item.configured ? "configured" : "missing"} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Operating Model" icon={ShieldCheck}>
          <div className="space-y-3 text-sm text-zinc-300">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-zinc-500">SLA</p>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs">{JSON.stringify(operatingModel?.sla ?? {}, null, 2)}</pre>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-zinc-500">Executive Snapshot</p>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs">{JSON.stringify(executiveSnapshot ?? {}, null, 2)}</pre>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Federated Verify" icon={KeyRound}>
          <div className="space-y-3">
            <select
              value={selectedProviderId}
              onChange={(event) => setSelectedProviderId(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="">Select provider</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.provider_type} :: {provider.issuer}
                </option>
              ))}
            </select>
            <TextInput value={federatedToken} onChange={(event) => setFederatedToken(event.target.value)} placeholder="Paste OIDC token" />
            <div className="flex gap-3">
              <button onClick={checkProviderReadiness} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Provider Readiness
              </button>
              <button onClick={verifyToken} className="rounded-xl bg-cyber-green px-4 py-3 text-sm font-semibold text-black">
                Verify Token
              </button>
            </div>
            <pre className="rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-zinc-300">{JSON.stringify(providerReadiness ?? verifiedIdentity ?? {}, null, 2)}</pre>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Identity Providers" icon={ShieldCheck}>
          <div className="grid gap-3 md:grid-cols-2">
            <TextInput value={providerForm.issuer} onChange={(event) => setProviderForm((prev) => ({ ...prev, issuer: event.target.value }))} placeholder="Issuer URL" />
            <TextInput value={providerForm.client_id} onChange={(event) => setProviderForm((prev) => ({ ...prev, client_id: event.target.value }))} placeholder="Client ID" />
            <TextInput value={providerForm.audience} onChange={(event) => setProviderForm((prev) => ({ ...prev, audience: event.target.value }))} placeholder="Audience" />
            <TextInput value={providerForm.discovery_url} onChange={(event) => setProviderForm((prev) => ({ ...prev, discovery_url: event.target.value }))} placeholder="Discovery URL" />
            <TextInput value={providerForm.jwks_uri} onChange={(event) => setProviderForm((prev) => ({ ...prev, jwks_uri: event.target.value }))} placeholder="JWKS URI (optional)" />
            <TextInput value={providerForm.claim_role} onChange={(event) => setProviderForm((prev) => ({ ...prev, claim_role: event.target.value }))} placeholder="Role claim name" />
          </div>
          <button onClick={submitProvider} className="mt-4 rounded-xl bg-cyber-green px-4 py-3 text-sm font-semibold text-black">
            Register Provider
          </button>
          <div className="mt-5 space-y-3">
            {providers.map((provider) => (
              <div key={provider.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-sm text-white">{provider.issuer}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{provider.provider_type} / {provider.client_id}</p>
                  </div>
                  <button onClick={() => setSelectedProviderId(provider.id)} className="text-xs uppercase tracking-[0.2em] text-cyber-green">
                    select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Repository Delivery" icon={GitBranch}>
          <div className="grid gap-3 md:grid-cols-2">
            <TextInput value={repositoryForm.repo_slug} onChange={(event) => setRepositoryForm((prev) => ({ ...prev, repo_slug: event.target.value }))} placeholder="acme/platform" />
            <TextInput value={repositoryForm.default_branch} onChange={(event) => setRepositoryForm((prev) => ({ ...prev, default_branch: event.target.value }))} placeholder="main" />
            <TextInput value={repositoryForm.ci_provider} onChange={(event) => setRepositoryForm((prev) => ({ ...prev, ci_provider: event.target.value }))} placeholder="github-actions" />
            <TextInput value={repositoryForm.secret_ref} onChange={(event) => setRepositoryForm((prev) => ({ ...prev, secret_ref: event.target.value }))} placeholder="GITHUB_TOKEN" />
            <TextInput value={repositoryForm.webhook_secret_ref} onChange={(event) => setRepositoryForm((prev) => ({ ...prev, webhook_secret_ref: event.target.value }))} placeholder="GITHUB_WEBHOOK_SECRET" />
            <TextInput value={repositoryForm.api_base_url} onChange={(event) => setRepositoryForm((prev) => ({ ...prev, api_base_url: event.target.value }))} placeholder="https://api.github.com" />
          </div>
          <button onClick={submitRepository} className="mt-4 rounded-xl bg-cyber-green px-4 py-3 text-sm font-semibold text-black">
            Register Repository
          </button>
          <div className="mt-5 space-y-3">
            {repositories.map((repository) => (
              <div key={repository.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-sm text-white">{repository.repo_slug}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{repository.provider} / {repository.ci_provider}</p>
                  </div>
                  <button onClick={() => setSelectedRepositoryId(repository.id)} className="text-xs uppercase tracking-[0.2em] text-cyber-green">
                    select
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={checkRepositoryReadiness} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Check Delivery Readiness
            </button>
          </div>
          <pre className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-zinc-300">{JSON.stringify(repositoryReadiness ?? {}, null, 2)}</pre>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Authorized Targets" icon={ShieldCheck}>
          <div className="mb-4 grid gap-3">
            {AUTHORIZED_TARGET_PRESETS.map((preset) => (
              <div key={preset.label} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{preset.label}</p>
                    <p className="text-xs text-zinc-400">{preset.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => applyAuthorizedTargetPreset(preset)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                    >
                      Load Preset
                    </button>
                    <button
                      onClick={() => savePresetAndRefresh(preset)}
                      className="rounded-xl border border-cyber-green/30 bg-cyber-green/10 px-3 py-2 text-xs font-semibold text-cyber-green"
                    >
                      Save Preset
                    </button>
                    <button
                      onClick={() => runAuthorizedPresetFlow(preset)}
                      className="rounded-xl border border-cyber-green/30 bg-cyber-green px-3 py-2 text-xs font-semibold text-black"
                    >
                      Run Flow
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <TextInput value={authorizedTargetForm.target_id} onChange={(event) => setAuthorizedTargetForm((prev) => ({ ...prev, target_id: event.target.value }))} placeholder="acme/platform or staging-acme" />
            <TextInput value={authorizedTargetForm.repository_id} onChange={(event) => setAuthorizedTargetForm((prev) => ({ ...prev, repository_id: event.target.value }))} placeholder="repository id (optional)" />
            <TextInput value={authorizedTargetForm.target_type} onChange={(event) => setAuthorizedTargetForm((prev) => ({ ...prev, target_type: event.target.value }))} placeholder="repository / staging / lab" />
            <TextInput value={authorizedTargetForm.authorization_mode} onChange={(event) => setAuthorizedTargetForm((prev) => ({ ...prev, authorization_mode: event.target.value }))} placeholder="explicit-written-scope" />
            <TextInput value={authorizedTargetForm.evidence_reference} onChange={(event) => setAuthorizedTargetForm((prev) => ({ ...prev, evidence_reference: event.target.value }))} placeholder="scope-doc-7" />
            <TextInput value={authorizedTargetForm.allowed_operations} onChange={(event) => setAuthorizedTargetForm((prev) => ({ ...prev, allowed_operations: event.target.value }))} placeholder="validation,staging-verification" />
          </div>
          <TextInput value={authorizedTargetForm.constraints} onChange={(event) => setAuthorizedTargetForm((prev) => ({ ...prev, constraints: event.target.value }))} placeholder="Constraint A;Constraint B" className="mt-3" />
          <button onClick={submitAuthorizedTarget} className="mt-4 rounded-xl bg-cyber-green px-4 py-3 text-sm font-semibold text-black">
            Save Authorized Target
          </button>
        </SectionCard>

        <SectionCard title="Scope Registry" icon={ShieldCheck}>
          <div className="space-y-3">
            {authorizedTargets.map((target) => (
              <div key={target.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm text-white">{target.target_id}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {target.target_type} / {target.authorization_mode}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAuthorizedTargetForm({
                        tenant_id: target.tenant_id,
                        repository_id: target.repository_id ?? "",
                        target_id: target.target_id,
                        target_type: target.target_type,
                        authorization_mode: target.authorization_mode,
                        evidence_reference: target.evidence_reference,
                        allowed_operations: target.allowed_operations.join(","),
                        constraints: target.constraints.join(";"),
                      });
                      if (target.repository_id) setSelectedRepositoryId(target.repository_id);
                    }}
                    className="text-xs uppercase tracking-[0.2em] text-cyber-green"
                  >
                    load
                  </button>
                </div>
                <p className="mt-2 text-xs text-zinc-400">Evidence: {target.evidence_reference}</p>
                <p className="mt-2 text-xs text-zinc-300">{target.allowed_operations.join(", ")}</p>
              </div>
            ))}
            {!authorizedTargets.length && (
              <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-zinc-500">
                No authorized targets registered for this tenant yet.
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Delivery Console" icon={GitBranch}>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto_auto]">
          <select
            value={selectedPatchJobId}
            onChange={(event) => setSelectedPatchJobId(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="">Select patch job</option>
            {patchJobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.id} :: {job.status}
              </option>
            ))}
          </select>
          <select
            value={selectedRepositoryId}
            onChange={(event) => setSelectedRepositoryId(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="">Select repository</option>
            {repositories.map((repository) => (
              <option key={repository.id} value={repository.id}>
                {repository.repo_slug} :: {repository.provider}
              </option>
            ))}
          </select>
          <button onClick={createHandoff} className="rounded-xl bg-cyber-green px-4 py-3 text-sm font-semibold text-black">
            Create Handoff
          </button>
          <button onClick={refreshHandoffs} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
            Refresh
          </button>
        </div>
        <div className="mt-5 grid gap-3">
          {handoffs.map((handoff) => (
            <div key={handoff.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-mono text-sm text-white">{handoff.title}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    gate:{handoff.release_gate_status} / delivery:{handoff.delivery_status ?? "draft"}
                  </p>
                  {handoff.remote_url && (
                    <a href={handoff.remote_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-cyber-green">
                      {handoff.remote_url}
                    </a>
                  )}
                </div>
                <button onClick={() => publishHandoff(handoff.id)} className="rounded-xl border border-cyber-green/30 bg-cyber-green/10 px-4 py-3 text-sm font-semibold text-cyber-green">
                  Publish
                </button>
                <button onClick={() => syncHandoff(handoff.id)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
                  Sync
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <SectionCard title="Defensive AI Control Plane" icon={BrainCircuit}>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <StatusPill ok={Boolean(defensivePack?.policy.guardrails.length)} label={defensivePack ? "pack loaded" : "pack idle"} />
            <button onClick={loadDefensivePack} className="rounded-xl border border-cyber-green/30 bg-cyber-green/10 px-4 py-3 text-sm font-semibold text-cyber-green">
              Refresh Defensive Pack
            </button>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Authorized Scope</p>
              <div className="space-y-2 text-sm text-zinc-300">
                <p className="font-mono text-white">{defensivePack?.authorized_target.target_id ?? "No target selected"}</p>
                <p>{defensivePack?.authorized_target.authorization_mode ?? "No authorization mode"}</p>
                <p className="text-xs text-zinc-500">Evidence: {defensivePack?.authorized_target.evidence_reference ?? "n/a"}</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Retrieval Mix</p>
              <p className="font-mono text-xs text-zinc-300">{defensivePack?.retrieval.query ?? "No retrieval query"}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {defensivePack?.retrieval.memories.slice(0, 6).map((memory) => (
                  <span key={memory.id} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                    {memory.memory_type} :: {memory.title}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Guardrails</p>
              <div className="space-y-2 text-sm text-zinc-300">
                {defensivePack?.policy.guardrails.map((item) => (
                  <p key={item}>• {item}</p>
                )) ?? <p className="text-zinc-500">No guardrails loaded.</p>}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Stop Conditions</p>
              <div className="space-y-2 text-sm text-zinc-300">
                {defensivePack?.evaluation.stop_conditions.map((item) => (
                  <p key={item}>• {item}</p>
                )) ?? <p className="text-zinc-500">No stop conditions loaded.</p>}
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Replay Timeline</p>
            <div className="grid gap-2 md:grid-cols-2">
              {defensivePack?.replay.timeline.slice(0, 8).map((item, index) => (
                <div key={`${item.stage}-${index}`} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-zinc-300">
                  <span className="font-semibold text-white">{item.stage}</span> :: {item.status}
                </div>
              )) ?? <p className="text-zinc-500">No replay timeline available.</p>}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Replay Dataset" icon={RefreshCw}>
          <div className="space-y-3">
            {defensiveReplays.slice(0, 8).map((replay) => (
              <div key={replay.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-sm text-white">{replay.case_type}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{replay.status} / score {replay.total_score}</p>
                  </div>
                  <StatusPill ok={replay.status === "accepted"} label={replay.status} />
                </div>
                <p className="mt-3 line-clamp-4 text-xs text-zinc-300">{replay.candidate_output}</p>
              </div>
            ))}
            {!defensiveReplays.length && (
              <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-zinc-500">
                No replay dataset entries for this tenant yet.
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Runtime Evaluation Desk" icon={BrainCircuit}>
        <div className="grid gap-4 lg:grid-cols-[auto_auto_auto_1fr]">
          <button onClick={prepareRuntime} className="rounded-xl bg-cyber-green px-4 py-3 text-sm font-semibold text-black">
            Prepare Runtime
          </button>
          <button onClick={generateDraft} className="rounded-xl border border-cyber-green/30 bg-cyber-green/10 px-4 py-3 text-sm font-semibold text-cyber-green">
            Generate Draft
          </button>
          <button onClick={evaluateCandidate} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
            Evaluate And Store
          </button>
          <div className="flex items-center gap-3">
            <StatusPill ok={Boolean(defensiveRuntime)} label={defensiveRuntime ? defensiveRuntime.runtime_mode : "runtime idle"} />
            <StatusPill ok={Boolean(defensiveEvaluation?.passed)} label={defensiveEvaluation ? `score ${defensiveEvaluation.total_score}` : "no score"} />
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Candidate Output</p>
              <textarea
                value={candidateOutput}
                onChange={(event) => setCandidateOutput(event.target.value)}
                className="min-h-[220px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-cyber-green/50"
              />
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Instruction Bundle</p>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-zinc-300">
                {JSON.stringify(defensiveRuntime?.instruction_bundle ?? {}, null, 2)}
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Runtime Authorization</p>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-zinc-300">
                {JSON.stringify(
                  {
                    blocked: defensiveRuntime?.blocked,
                    authorization_status: defensiveRuntime?.authorization_status,
                    halt_reasons: defensiveRuntime?.halt_reasons ?? [],
                    repository_context: defensiveRuntime?.repository_context ?? {},
                  },
                  null,
                  2
                )}
              </pre>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Evaluation Result</p>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-zinc-300">
                {JSON.stringify(defensiveEvaluation ?? {}, null, 2)}
              </pre>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Runtime Scorecards</p>
              <div className="space-y-2 text-sm text-zinc-300">
                {defensiveRuntime?.evaluation_targets.map((item) => (
                  <p key={`${item.name}-${item.target}`}>
                    <span className="font-semibold text-white">{item.name}</span> :: {item.target}
                  </p>
                )) ?? <p className="text-zinc-500">Prepare runtime to view scorecards.</p>}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
