import { z } from "zod";

const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Please enter a valid email address.");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(128, "Password is too long.");

export const signInFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpAccountSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Name is too long."),
  email: emailSchema,
  password: passwordSchema,
});

export const signUpFormSchema = signUpAccountSchema
  .extend({
    confirmPassword: z.string(),
    agreedToTerms: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }

    if (!data.agreedToTerms) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["agreedToTerms"],
        message: "Please agree to the terms to continue.",
      });
    }
  });

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const taskStatusSchema = z.enum(["Done", "Upcoming"]);

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required.")
    .max(120, "Task title must be 120 characters or less."),
  timeStart: z.string().regex(timeRegex, "Start time must be in HH:mm format."),
  timeEnd: z.string().regex(timeRegex, "End time must be in HH:mm format."),
});

export function firstValidationError(error: z.ZodError): string {
  const firstIssue = error.issues[0];
  return firstIssue?.message ?? "Please check your input and try again.";
}
