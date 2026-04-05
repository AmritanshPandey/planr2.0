import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  emailSchema,
  firstValidationError,
  signInFormSchema,
  signUpAccountSchema,
} from "@/lib/validation";

function requireAuth() {
  if (!auth) {
    throw new Error(
      "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* values in .env.local."
    );
  }

  return auth;
}

export async function signUpWithEmail(email: string, password: string) {
  const parsed = signInFormSchema.safeParse({ email, password });

  if (!parsed.success) {
    throw new Error(firstValidationError(parsed.error));
  }

  return createUserWithEmailAndPassword(
    requireAuth(),
    parsed.data.email,
    parsed.data.password
  );
}

export async function completeSignUpWithEmail(
  fullName: string,
  email: string,
  password: string
) {
  const parsed = signUpAccountSchema.safeParse({ fullName, email, password });

  if (!parsed.success) {
    throw new Error(firstValidationError(parsed.error));
  }

  const authInstance = requireAuth();
  const credential = await createUserWithEmailAndPassword(
    authInstance,
    parsed.data.email,
    parsed.data.password
  );

  const trimmedName = parsed.data.fullName;

  if (trimmedName) {
    await updateProfile(credential.user, { displayName: trimmedName });
  }

  await sendEmailVerification(credential.user);
  return credential;
}

export async function signInWithEmail(email: string, password: string) {
  const parsed = signInFormSchema.safeParse({ email, password });

  if (!parsed.success) {
    throw new Error(firstValidationError(parsed.error));
  }

  return signInWithEmailAndPassword(
    requireAuth(),
    parsed.data.email,
    parsed.data.password
  );
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(requireAuth(), provider);
}

export async function sendResetEmail(email: string) {
  const parsed = emailSchema.safeParse(email);

  if (!parsed.success) {
    throw new Error(firstValidationError(parsed.error));
  }

  return sendPasswordResetEmail(requireAuth(), parsed.data);
}

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Authentication failed. Please try again.";
  }

  if (!("code" in error)) {
    return error.message;
  }

  const code = String((error as { code?: unknown }).code ?? "");

  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already in use. Try signing in instead.";
    case "auth/invalid-email":
      return "This email address is invalid.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/weak-password":
      return "Use a stronger password with at least 8 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled before completion.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a minute and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return error.message;
  }
}

export async function signOutCurrentUser() {
  return signOut(requireAuth());
}
