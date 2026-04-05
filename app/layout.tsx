import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "PlanR – Plan less. Execute more.",
  description:
    "A structured personal execution platform for translating goals into actionable sprints.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
                <ThemeToggle />
              </div>
              <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
