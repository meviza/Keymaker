import type { Metadata } from "next";
import "./globals.css";
import { AppChrome } from "@/components/layout/AppChrome";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Keymaker | Enterprise Security Operating System",
  description: "Agentic application security, cloud defense and code remediation platform for enterprise teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen overflow-x-hidden bg-cyber-black font-[family:var(--font-body)]">
        <AppChrome>
          <ErrorBoundary>{children}</ErrorBoundary>
        </AppChrome>
      </body>
    </html>
  );
}
