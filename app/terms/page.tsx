import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl py-10 sm:py-14">
      <div className="rounded-2xl border border-border bg-card/85 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Legal</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          Terms and Conditions
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Effective date: April 5, 2026
        </p>

        <div className="mt-6 space-y-6 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing or using PlanR, you agree to these Terms and Conditions.
              If you do not agree, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account
              credentials and for all activities that occur under your account.
              You must provide accurate account information and keep it updated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Permitted Use</h2>
            <p>
              You may use PlanR for lawful personal or business productivity needs.
              You agree not to misuse the platform, interfere with its operation, or
              attempt unauthorized access to data, systems, or other users.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. User Data and Content</h2>
            <p>
              You retain ownership of task content and other data you submit.
              You grant PlanR permission to process and store this data for delivering
              app functionality, including authentication, synchronization, and
              task management.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Service Availability</h2>
            <p>
              We may update, modify, suspend, or discontinue parts of the service at
              any time. We do not guarantee uninterrupted availability or error-free
              operation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Termination</h2>
            <p>
              We may suspend or terminate access if these terms are violated or if
              required for security, legal, or operational reasons.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Disclaimer</h2>
            <p>
              PlanR is provided &quot;as is&quot; without warranties of any kind, express or
              implied, including merchantability, fitness for a particular purpose,
              and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Limitation of Liability</h2>
            <p>
              To the maximum extent allowed by law, PlanR and its operators are not
              liable for indirect, incidental, special, consequential, or punitive
              damages arising from use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Changes to Terms</h2>
            <p>
              We may revise these terms from time to time. Continued use of PlanR
              after updates means you accept the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">10. Contact</h2>
            <p>
              For questions about these terms, contact the application administrator
              or project owner.
            </p>
          </section>
        </div>

        <div className="mt-8 border-t border-border pt-5">
          <Link
            href="/auth"
            className="text-sm font-medium text-accent-foreground hover:text-foreground"
          >
            Back to Authentication
          </Link>
        </div>
      </div>
    </main>
  );
}
