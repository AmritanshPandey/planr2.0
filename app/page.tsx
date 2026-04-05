import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 py-20 text-center">
      <h1 className="text-6xl font-bold tracking-tight text-foreground">
        PlanR
      </h1>
      <p className="text-xl text-muted-foreground">Plan less. Execute more.</p>
      <Button asChild size="lg" className="mt-4">
        <Link href="/auth">Get Started</Link>
      </Button>
    </main>
  );
}
