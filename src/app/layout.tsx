import type { Metadata } from "next";
import "./globals.css";
import { AppChrome } from "@/components/layout/AppChrome";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent FOUC: apply saved theme class synchronously before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('km-theme');document.documentElement.classList.add(t==='light'?'light':'dark');}catch(e){document.documentElement.classList.add('dark');}})();` }} />
      </head>
      <body className="flex min-h-screen overflow-x-hidden bg-white dark:bg-cyber-black font-[family:var(--font-body)]">
        <ThemeProvider>
          <LanguageProvider>
            <AppChrome>
              <ErrorBoundary>{children}</ErrorBoundary>
            </AppChrome>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
