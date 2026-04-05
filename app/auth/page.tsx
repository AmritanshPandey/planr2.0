"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  IconBrandGoogle,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import {
  completeSignUpWithEmail,
  getAuthErrorMessage,
  sendResetEmail,
  signInWithEmail,
  signInWithGoogle,
} from "@/lib/auth";
import { firebaseEnvReady } from "@/lib/firebase";
import {
  firstValidationError,
  resetPasswordSchema,
  signInFormSchema,
  signUpFormSchema,
} from "@/lib/validation";

function getPasswordStrength(password: string): {
  score: number;
  label: "Weak" | "Medium" | "Strong";
} {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) || /[^\w\s]/.test(password)) score += 1;

  if (score <= 1) return { score, label: "Weak" };
  if (score === 2) return { score, label: "Medium" };
  return { score, label: "Strong" };
}

export default function AuthPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const title = useMemo(
    () =>
      authMode === "signup"
        ? "Create your execution account"
        : "Welcome back",
    [authMode]
  );

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password]
  );

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (authMode === "signup") {
        const parsedSignUp = signUpFormSchema.safeParse({
          fullName,
          email,
          password,
          confirmPassword,
          agreedToTerms,
        });

        if (!parsedSignUp.success) {
          throw new Error(firstValidationError(parsedSignUp.error));
        }

        await completeSignUpWithEmail(
          parsedSignUp.data.fullName,
          parsedSignUp.data.email,
          parsedSignUp.data.password
        );
        showToast({
          title: "Account created",
          description: "A verification email was sent to your inbox.",
          variant: "success",
        });
      } else {
        const parsedSignIn = signInFormSchema.safeParse({ email, password });

        if (!parsedSignIn.success) {
          throw new Error(firstValidationError(parsedSignIn.error));
        }

        await signInWithEmail(parsedSignIn.data.email, parsedSignIn.data.password);
        showToast({
          title: "Signed in",
          description: "Welcome back to PlanR.",
          variant: "success",
        });
      }

      router.push("/dashboard");
    } catch (submitError) {
      showToast({
        title: "Authentication failed",
        description: getAuthErrorMessage(submitError),
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setSubmitting(true);

    try {
      await signInWithGoogle();
      showToast({
        title: "Signed in with Google",
        description: "You are now authenticated.",
        variant: "success",
      });
      router.push("/dashboard");
    } catch (submitError) {
      showToast({
        title: "Google sign-in failed",
        description: getAuthErrorMessage(submitError),
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPassword() {
    const parsedReset = resetPasswordSchema.safeParse({ email });

    if (!parsedReset.success) {
      showToast({
        title: "Invalid email",
        description: firstValidationError(parsedReset.error),
        variant: "error",
      });
      return;
    }

    setSubmitting(true);

    try {
      await sendResetEmail(parsedReset.data.email);
      showToast({
        title: "Reset email sent",
        description: "Check your inbox for a password reset link.",
        variant: "success",
      });
    } catch (resetError) {
      showToast({
        title: "Reset failed",
        description: getAuthErrorMessage(resetError),
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center py-10">
        <p className="text-sm text-muted-foreground">Checking session...</p>
      </main>
    );
  }

  if (!firebaseEnvReady) {
    return (
      <main className="mx-auto flex min-h-[75vh] w-full max-w-2xl flex-col justify-center gap-4 py-10">
        <h1 className="text-3xl font-bold text-foreground">Firebase Setup Required</h1>
        <p className="text-sm text-muted-foreground">
          Add your Firebase values to .env.local before using signup/signin.
        </p>
        <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
          <p>NEXT_PUBLIC_FIREBASE_API_KEY=</p>
          <p>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=</p>
          <p>NEXT_PUBLIC_FIREBASE_PROJECT_ID=</p>
          <p>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=</p>
          <p>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=</p>
          <p>NEXT_PUBLIC_FIREBASE_APP_ID=</p>
        </div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 py-10 text-center">
        <h1 className="text-3xl font-bold text-foreground">Redirecting...</h1>
        <p className="text-sm text-muted-foreground">Taking you to your dashboard.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center gap-6 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Build your profile once, then sign in with email or Google.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-md border border-border p-1">
        <Button
          type="button"
          variant={authMode === "signup" ? "default" : "ghost"}
          className="flex-1"
          onClick={() => setAuthMode("signup")}
        >
          Sign Up
        </Button>
        <Button
          type="button"
          variant={authMode === "signin" ? "default" : "ghost"}
          className="flex-1"
          onClick={() => setAuthMode("signin")}
        >
          Sign In
        </Button>
      </div>

      <form className="space-y-4" onSubmit={handleAuthSubmit}>
        {authMode === "signup" && (
          <Input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
            required
          />
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 8 chars)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            autoComplete={authMode === "signup" ? "new-password" : "current-password"}
            className="pr-16"
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <IconEyeOff className="h-4 w-4" stroke={1.8} />
            ) : (
              <IconEye className="h-4 w-4" stroke={1.8} />
            )}
          </button>
        </div>

        {authMode === "signup" && password.length > 0 && (
          <>
            <div className="space-y-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all duration-200 ${
                    passwordStrength.label === "Weak"
                      ? "w-1/3 bg-red-400"
                      : passwordStrength.label === "Medium"
                        ? "w-2/3 bg-amber-400"
                        : "w-full bg-emerald-400"
                  }`}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Password strength: {passwordStrength.label}
              </p>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                autoComplete="new-password"
                className="pr-16"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <IconEyeOff className="h-4 w-4" stroke={1.8} />
                ) : (
                  <IconEye className="h-4 w-4" stroke={1.8} />
                )}
              </button>
            </div>

            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-accent-foreground"
                checked={agreedToTerms}
                onChange={(event) => setAgreedToTerms(event.target.checked)}
              />
              <span>
                I agree to the {" "}
                <Link href="/terms" className="text-accent-foreground hover:text-foreground">
                  Terms and Conditions
                </Link>
                .
              </span>
            </label>
          </>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting
            ? "Please wait..."
            : authMode === "signup"
              ? "Create Account"
              : "Sign In"}
        </Button>

        {authMode === "signin" && (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            disabled={submitting}
            onClick={() => void handleResetPassword()}
          >
            Forgot password?
          </Button>
        )}

        <div className="relative py-2 text-center text-xs text-muted-foreground">
          <span className="bg-background px-2">or</span>
          <div className="absolute left-0 top-1/2 -z-10 w-full border-t border-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => void handleGoogleSignIn()}
          disabled={submitting}
        >
          <IconBrandGoogle className="h-4 w-4" stroke={1.8} />
          Continue with Google
        </Button>
      </form>

    </main>
  );
}
