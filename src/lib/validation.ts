import { z } from "zod";

import { studentStatusOptions } from "@/lib/fixtures";
import type { StudentStatus, StudentStatusAnswer } from "@/lib/steps";

/**
 * Every message here is written for the student, not the developer.
 *
 * The one that matters most: the live portal rejects "+1 555 234 5678" and
 * shows the raw backend pattern — `phone: String should match pattern
 * ^\+[1-9][0-9]{7,14}$`. Here the country code is a separate select, the
 * number field accepts the spaces, dashes and brackets people actually type,
 * and the failure message says what a good answer looks like.
 *
 * Wording follows the *Inline validation* rule from the client's Message
 * Library: name the field, say what is wrong, say what is acceptable. Where the
 * field inventory ships an approved string it is copied rather than rewritten —
 * the phone and email messages below are the sheet's own words.
 */

export const PHONE_DIGITS_MIN = 7;
export const PHONE_DIGITS_MAX = 14;

export function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

/** What a phone number may be made of. Spaces, dashes and brackets survive. */
const PHONE_CHARSET = /^[\d\s().-]+$/;

/**
 * One rule set, two entry points. Splitting them by hand is how the About-you
 * field ended up accepting letters that the same field on the entry screen
 * rejected.
 *
 * Order matters: the charset check runs first, so "five five five" is told to
 * use digits rather than told the field is empty — which is what happens if the
 * "any digits at all" check goes first and strips the letters to nothing.
 */
function phoneRule({ required }: { required: boolean }) {
  return z
    .string()
    .trim()
    .refine((value) => value === "" || PHONE_CHARSET.test(value), {
      message: "Enter a valid phone number, including the country code.",
    })
    .refine((value) => !required || value !== "", {
      message: "Enter your mobile number, including the country code.",
    })
    .refine((value) => value === "" || phoneDigits(value).length >= PHONE_DIGITS_MIN, {
      message: "That number is too short. It should be 7 to 14 digits after the country code.",
    })
    .refine((value) => value === "" || phoneDigits(value).length <= PHONE_DIGITS_MAX, {
      message: "That number is too long. It should be 7 to 14 digits after the country code.",
    });
}

export const phoneNumber = phoneRule({ required: true });

export const optionalPhoneNumber = phoneRule({ required: false });

export const emailAddress = z
  .string()
  .trim()
  .min(1, { message: "Enter your email address." })
  .pipe(z.email({ message: "Enter a valid email address." }));

export const password = z
  .string()
  .min(12, { message: "Your password needs at least 12 characters." })
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
    message: "These do not match. Type the same password in both fields.",
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

/* -------------------------------------------------------------------------
   The three Steps that replaced Identity & contact
   ---------------------------------------------------------------------- */

/**
 * Which Identity document each Student status calls for.
 *
 * The review call asked for this and a previous spec specified it; neither
 * round built it, and the flow still asked every student for the same generic
 * upload. It lives beside the schema rather than in a component because it is
 * the rule, not the rendering of it.
 */
export function requiredDocumentFor(status: StudentStatus): string {
  const option = studentStatusOptions.find((entry) => entry.value === status);
  // Unreachable while `StudentStatus` and the fixture agree, which is the point
  // of the union — but a lookup returning `undefined` here would silently drop
  // the requirement rather than fail.
  if (!option) throw new Error(`Unknown student status: ${status}`);
  return option.document;
}

export function documentLabelFor(status: StudentStatus): string {
  const option = studentStatusOptions.find((entry) => entry.value === status);
  if (!option) throw new Error(`Unknown student status: ${status}`);
  return option.documentLabel;
}

const uploadedFile = z.object({ name: z.string(), size: z.number() });

/**
 * Who you are.
 *
 * Student status is answered before the document is requested, so the document
 * requirement can name the document. Switching the answer changes the request
 * in both directions, and the message that comes back with it changes too:
 * "Attach your U.S. passport" and "Attach your home country passport" are the
 * same rule and different sentences, and only one of them is useful.
 */
export const whoYouAreSchema = z
  .object({
    preferredName: z.string().trim().max(60, { message: "That's longer than 60 characters." }),
    pronouns: z.string().trim().max(40, { message: "That's longer than 40 characters." }),
    dialCode: z.string().min(1),
    phone: optionalPhoneNumber,
    studentStatus: z
      .string()
      .min(1, { message: "Choose the one that applies to you." })
      .pipe(
        z.enum(["us-citizen", "permanent-resident", "international"], {
          message: "Choose the one that applies to you.",
        }),
      ),
    idDocuments: z.array(uploadedFile),
  })
  .superRefine((values, ctx) => {
    if (values.idDocuments.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["idDocuments"],
        message: `Attach your ${requiredDocumentFor(values.studentStatus)} before you continue.`,
      });
    }
  });

export type WhoYouAreValues = z.infer<typeof whoYouAreSchema>;

/**
 * Where you live now.
 *
 * The address is required for residency classification, the tuition rate and
 * official post. That reasoning holds, and it is now scoped to the statuses
 * where it applies rather than asserted over everyone.
 */
export const whereYouLiveSchema = z.object({
  street: z.string().trim().min(1, { message: "Enter your street address." }),
  unit: z.string().trim(),
  state: z.string().trim().min(1, { message: "Choose your state." }),
  city: z.string().trim().min(1, { message: "Choose your city." }),
  postalCode: z.string().trim().min(1, { message: "Enter your ZIP code." }),
  country: z.string().min(1, { message: "Choose the country you live in." }),
  residencyVerification: z.string().min(1, { message: "Choose how we should check this." }),
});

export type WhereYouLiveValues = z.infer<typeof whereYouLiveSchema>;

/**
 * The address schema for a given Student status, or `null` where the Step does
 * not exist.
 *
 * `null` rather than a schema with everything optional, and that distinction is
 * the whole point: a hidden required field that blocks Continue with an error
 * nobody can see is the worst version of this, and it is what the flow did
 * before. Absent means absent — the Step is gone from the spine and its fields
 * do not participate in validation at all.
 */
export function addressSchemaFor(status: StudentStatusAnswer): typeof whereYouLiveSchema | null {
  return status === "international" ? null : whereYouLiveSchema;
}

const emergencyContactSchema = z.object({
  id: z.string(),
  fullName: z.string().trim().min(1, { message: "Enter their full name." }),
  relationship: z.string().min(1, { message: "Choose how you know them." }),
  dialCode: z.string().min(1),
  phone: phoneNumber,
});

/**
 * Who we call, who can see.
 *
 * Family access is a list, because more than one person can be granted access
 * and each is an independent record. Each grant carries all four fields Laura
 * listed on the call, and the fourth — the scope — is the one that had never
 * been built.
 */
const familyAccessSchema = z.object({
  id: z.string(),
  fullName: z.string().trim().min(1, { message: "Enter their name." }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Enter a valid email address. This is where their access goes." })
    .pipe(z.email({ message: "Enter a valid email address. This is where their access goes." })),
  relationship: z.string().min(1, { message: "Choose how you know them." }),
  scope: z
    .array(z.string())
    .min(1, { message: "Pick at least one thing they can see, or remove them." }),
});

export const whoWeCallSchema = z.object({
  emergencyContacts: z.array(emergencyContactSchema).min(1),
  familyAccess: z.array(familyAccessSchema),
});

export type WhoWeCallValues = z.infer<typeof whoWeCallSchema>;
