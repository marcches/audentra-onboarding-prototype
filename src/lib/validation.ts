import { z } from "zod";

/**
 * Every message here is written for the student, not the developer.
 *
 * The one that matters most: the live portal rejects "+1 555 234 5678" and
 * shows the raw backend pattern — `phone: String should match pattern
 * ^\+[1-9][0-9]{7,14}$`. Here the country code is a separate select, the
 * number field accepts the spaces, dashes and brackets people actually type,
 * and the failure message says what a good answer looks like.
 */

export const PHONE_DIGITS_MIN = 7;
export const PHONE_DIGITS_MAX = 14;

export function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export const phoneNumber = z
  .string()
  .trim()
  .refine((value) => phoneDigits(value).length > 0, {
    message: "Enter your mobile number.",
  })
  .refine((value) => phoneDigits(value).length >= PHONE_DIGITS_MIN, {
    message: "That number is too short. It should be 7 to 14 digits after the country code.",
  })
  .refine((value) => phoneDigits(value).length <= PHONE_DIGITS_MAX, {
    message: "That number is too long. It should be 7 to 14 digits after the country code.",
  })
  .refine((value) => /^[\d\s().-]+$/.test(value), {
    message: "Use digits only. Spaces, dashes and brackets are fine — letters are not.",
  });

export const optionalPhoneNumber = z
  .string()
  .trim()
  .refine((value) => value === "" || phoneDigits(value).length >= PHONE_DIGITS_MIN, {
    message: "That number is too short. It should be 7 to 14 digits after the country code.",
  })
  .refine((value) => value === "" || phoneDigits(value).length <= PHONE_DIGITS_MAX, {
    message: "That number is too long. It should be 7 to 14 digits after the country code.",
  });

export const emailAddress = z
  .string()
  .trim()
  .min(1, { message: "Enter your email address." })
  .pipe(
    z.email({
      message:
        "That doesn't look like an email address. It needs an @ and a domain, like you@mail.com.",
    }),
  );

export const password = z
  .string()
  .min(12, { message: "Passwords need at least 12 characters. Yours is shorter than that." })
  .refine((value) => /[a-zA-Z]/.test(value), {
    message: "Add at least one letter.",
  })
  .refine((value) => /\d/.test(value), {
    message: "Add at least one number.",
  });

export const createAccountSchema = z
  .object({
    email: emailAddress,
    dialCode: z.string().min(1),
    phone: phoneNumber,
    password,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "These two don't match. Retype the same password in both fields.",
  });

export type CreateAccountValues = z.infer<typeof createAccountSchema>;

export const signInSchema = z.object({
  email: emailAddress,
  password: z.string().min(1, { message: "Enter your password." }),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const declineSchema = z.object({
  reason: z.string(),
  note: z.string().max(250, { message: "Keep it under 250 characters." }),
});

export type DeclineValues = z.infer<typeof declineSchema>;

const emergencyContactSchema = z.object({
  id: z.string(),
  fullName: z.string().trim().min(1, { message: "Enter their full name." }),
  relationship: z.string().min(1, { message: "Choose how you know them." }),
  dialCode: z.string().min(1),
  phone: phoneNumber,
});

export const aboutYouSchema = z
  .object({
    preferredName: z.string().trim().max(60, { message: "That's longer than 60 characters." }),
    pronouns: z.string().trim().max(40, { message: "That's longer than 40 characters." }),
    dialCode: z.string().min(1),
    phone: optionalPhoneNumber,
    citizenship: z.string().min(1, { message: "Choose the one that applies to you." }),
    street: z.string().trim(),
    unit: z.string().trim(),
    city: z.string().trim(),
    state: z.string().trim(),
    postalCode: z.string().trim(),
    country: z.string(),
    residencyVerification: z.string(),
    emergencyContacts: z.array(emergencyContactSchema).min(1),
    grantsFamilyAccess: z.boolean(),
    familyMemberName: z.string().trim(),
    familyMemberEmail: z.string().trim(),
    disclosureScope: z.array(z.string()),
  })
  .superRefine((values, ctx) => {
    if (!values.grantsFamilyAccess) return;

    if (values.familyMemberName.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["familyMemberName"],
        message: "Enter their name.",
      });
    }

    const email = emailAddress.safeParse(values.familyMemberEmail);
    if (!email.success) {
      ctx.addIssue({
        code: "custom",
        path: ["familyMemberEmail"],
        message: "Enter a valid email address — this is where their access goes.",
      });
    }

    if (values.disclosureScope.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["disclosureScope"],
        message: "Pick at least one thing they can see, or turn access back off.",
      });
    }
  });

export type AboutYouValues = z.infer<typeof aboutYouSchema>;
