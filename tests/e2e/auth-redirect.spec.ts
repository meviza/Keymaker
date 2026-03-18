import { test, expect, type Page } from "@playwright/test";

async function loginWithDemoFallback(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("operator@keymaker.io").fill("operator@keymaker.io");
  await page.getByPlaceholder("••••••••••••").fill("demo-password");
  await page.getByRole("button", { name: /enter war room/i }).click();
  await expect(page).toHaveURL(/\/command$/);
}

async function mockEnterpriseApi(page: Page) {
  const repositories = [
    {
      id: "repo-1",
      tenant_id: "default-enterprise",
      provider: "github",
      repo_slug: "acme/platform",
      default_branch: "main",
      ci_provider: "github-actions",
    },
  ];
  const generatedReports: Array<{ report_id: string; target_id: string; template: string }> = [];
  const registeredRepositories: string[] = [];

  await page.route("http://localhost:8000/api/v1/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const { pathname } = url;
    const method = request.method();
    const corsHeaders = {
      "access-control-allow-origin": "http://127.0.0.1:3001",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "Content-Type, Authorization",
    };

    const json = (body: unknown) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: corsHeaders,
        body: JSON.stringify(body),
      });

    if (method === "OPTIONS") {
      return route.fulfill({
        status: 204,
        headers: corsHeaders,
      });
    }

    if (pathname === "/api/v1/reports/list" && method === "GET") {
      return json([]);
    }

    if (pathname === "/api/v1/reports/generate" && method === "POST") {
      const payload = JSON.parse(request.postData() ?? "{}") as Record<string, string>;
      generatedReports.push({
        report_id: "KM-TECH-TEST",
        target_id: payload.target_id ?? "unknown",
        template: payload.template ?? "executive",
      });
      return json({
        status: "queued",
        report_id: "KM-TECH-TEST",
        message: "queued",
      });
    }

    if (pathname.startsWith("/api/v1/reports/status/") && method === "GET") {
      return json({ report_id: "KM-TECH-TEST", status: "queued" });
    }

    if (pathname === "/api/v1/delivery-ops/environment/readiness" && method === "GET") {
      return json({
        environment: [{ name: "GITHUB_TOKEN", configured: true }],
        ready_count: 1,
        total_count: 1,
      });
    }

    if (pathname === "/api/v1/identity-access/providers/default-enterprise" && method === "GET") {
      return json({ providers: [] });
    }

    if (pathname === "/api/v1/delivery-ops/repositories/default-enterprise" && method === "GET") {
      return json({ repositories });
    }

    if (pathname === "/api/v1/commercial-ops/operating-model/default-enterprise" && method === "GET") {
      return json({ sla: {}, routing: {}, governance: {} });
    }

    if (pathname === "/api/v1/executive-ops/snapshot/default-enterprise" && method === "GET") {
      return json({ metrics: [], summary: {} });
    }

    if (pathname === "/api/v1/remediation/patch-jobs" && method === "GET") {
      return json({ patch_jobs: [] });
    }

    if (pathname === "/api/v1/platform-ops/authorized-targets" && method === "GET") {
      return json({ authorized_targets: [] });
    }

    if (pathname === "/api/v1/defensive-ai-runtime/replays" && method === "GET") {
      return json({ replays: [] });
    }

    if (pathname === "/api/v1/delivery-ops/pr-handoff" && method === "GET") {
      return json({ handoffs: [] });
    }

    if (pathname === "/api/v1/defensive-ai/pack" && method === "POST") {
      return json({
        case_type: "repo",
        model_strategy: "safe",
        retrieval: { query: "", filters: {}, memories: [] },
        policy: { persona: "defender", guardrails: [], required_checks: [], approval_required: false },
        evaluation: { objectives: [], scorecards: [], stop_conditions: [] },
        replay: { timeline: [], artifacts: [], writeback_targets: [] },
        authorized_target: {
          target_id: "acme/platform",
          target_type: "repository",
          authorization_mode: "explicit-written-scope",
          evidence_reference: "scope-doc",
          allowed_operations: [],
          constraints: [],
        },
      });
    }

    if (pathname === "/api/v1/delivery-ops/repositories" && method === "POST") {
      const payload = JSON.parse(request.postData() ?? "{}") as Record<string, string>;
      registeredRepositories.push(payload.repo_slug ?? "new/repo");
      const created = {
        id: `repo-${repositories.length + 1}`,
        tenant_id: payload.tenant_id ?? "default-enterprise",
        provider: payload.provider ?? "github",
        repo_slug: payload.repo_slug ?? "new/repo",
        default_branch: payload.default_branch ?? "main",
        ci_provider: payload.ci_provider ?? "github-actions",
      };
      repositories.push(created);
      return json(created);
    }

    return route.abort();
  });

  return { generatedReports, registeredRepositories };
}

test("redirects unauthenticated users from protected routes to login", async ({ page }) => {
  await page.goto("/settings?tab=api");

  await expect(page).toHaveURL(/\/login\?next=%2Fsettings%3Ftab%3Dapi$/);
  await expect(page.getByText("Operator Sign-In")).toBeVisible();
});

test("falls back to demo session when backend auth is unavailable", async ({ page }) => {
  await loginWithDemoFallback(page);
  await expect(page.getByRole("heading", { name: "Anahtarci" })).toBeVisible();
  await expect(page.getByText("Target Acquisition")).toBeVisible();
});

test("shows reports empty state for a demo session without backend data", async ({ page }) => {
  await loginWithDemoFallback(page);
  await page.goto("/reports");

  await expect(page).toHaveURL(/\/reports$/);
  await expect(page.getByRole("heading", { name: "Enterprise Reports" })).toBeVisible();
  await expect(page.getByText("No reports yet. Generate your first AI-powered PDF report.")).toBeVisible();
});

test("renders settings control surface for a demo session", async ({ page }) => {
  await loginWithDemoFallback(page);
  await page.goto("/settings");

  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByRole("heading", { name: "Enterprise Settings" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Identity Providers" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Repository Delivery" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Register Repository" })).toBeVisible();
});

test("opens and closes the report generation modal from the reports screen", async ({ page }) => {
  await loginWithDemoFallback(page);
  await mockEnterpriseApi(page);
  await page.goto("/reports");

  await page.getByRole("button", { name: "Generate Report" }).first().click();
  await expect(page.getByText("Generate New Report")).toBeVisible();
  await page.getByPlaceholder("e.g. dvwa_target, 10.0.0.1").fill("staging-app");
  await page.getByRole("button", { name: "Cancel" }).click();

  await expect(page.getByText("Generate New Report")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Generate Report" }).first()).toBeVisible();
});

test("loads an authorized target preset on the settings screen", async ({ page }) => {
  await loginWithDemoFallback(page);
  await mockEnterpriseApi(page);
  await page.goto("/settings");

  await page.getByRole("button", { name: "Load Preset" }).first().click();

  await expect(page.getByText("Staging Repo preset loaded")).toBeVisible();
  await expect(page.locator('input[value="staging-scope-doc"]')).toBeVisible();
  await expect(page.locator('input[value="validation,staging-verification,configuration-review"]')).toBeVisible();
});
