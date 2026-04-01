import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-[#fafafa] antialiased font-sans">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}
