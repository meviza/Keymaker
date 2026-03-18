"use client";

import { Suspense, useEffect, useMemo, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { isLoggedIn } from "@/lib/auth/session";
import { resolveRouteAccess } from "@/lib/auth/access";

function AppChromeInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const currentPath = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const access = useMemo(() => {
    if (!mounted) {
      return resolveRouteAccess(currentPath, false);
    }
    return resolveRouteAccess(currentPath, isLoggedIn());
  }, [currentPath, mounted]);

  useEffect(() => {
    if (mounted && access.redirectTo) {
      router.replace(access.redirectTo);
    }
  }, [access.redirectTo, mounted, router]);

  if (access.isPublic) {
    return <>{children}</>;
  }

  if (!mounted || !access.isAllowed) {
    return (
      <main className="flex min-h-screen flex-1 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyber-dark via-cyber-black to-cyber-black p-8">
        <div className="glass-panel rounded-2xl border border-white/10 px-6 py-5 text-center">
          <p className="text-sm font-medium text-white">Session required</p>
          <p className="mt-2 text-xs text-zinc-500">Redirecting to operator login...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyber-dark via-cyber-black to-cyber-black">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-green/20 to-transparent z-50" />
        <div className="p-8">{children}</div>
      </main>
    </>
  );
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-1 items-center justify-center bg-cyber-black">
        <div className="text-zinc-500 animate-pulse">Loading...</div>
      </main>
    }>
      <AppChromeInner>{children}</AppChromeInner>
    </Suspense>
  );
}
