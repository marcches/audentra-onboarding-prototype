import { z } from "zod";

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

const emergencyContactSchema = z.object({
  id: z.string(),
  fullName: z.string().trim().min(1, { message: "Enter their full name." }),
  relationship: z.string().min(1, { message: "Choose how you know them." }),
  dialCode: z.string().min(1),
  phone: phoneNumber,
});

export const identityContactSchema = z
  .object({
    preferredName: z.string().trim().max(60, { message: "That's longer than 60 characters." }),
    pronouns: z.string().trim().max(40, { message: "That's longer than 40 characters." }),
    dialCode: z.string().min(1),
    phone: optionalPhoneNumber,
    citizenship: z.string().min(1, { message: "Choose the one that applies to you." }),
    /**
     * The permanent address is required for every branch except international
     * students, and the whole block is. Laura said it three times, twice on the
     * call and again in the second Jam — "Onde você vive agora? Não é
     * opcional, isso aqui é obrigatório. Então tudo isso é obrigatório." It
     * decides the residency classification, which decides tuition, and it is
     * where official post goes — for a U.S. citizen or permanent resident. An
     * international student has no U.S. permanent address to give, so the
     * requirement (enforced below, in `superRefine`, where it can see the
     * citizenship answer) doesn't apply to that branch. The unit line stays
     * optional throughout because plenty of addresses do not have one.
     */
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
    familyMemberRelationship: z.string().trim(),
    disclosureScope: z.array(z.string()),
  })
  .superRefine((values, ctx) => {
    if (values.citizenship !== "international") {
      if (values.street.length === 0) {
        ctx.addIssue({ code: "custom", path: ["street"], message: "Enter your street address." });
      }
      if (values.city.length === 0) {
        ctx.addIssue({ code: "custom", path: ["city"], message: "Enter your city or town." });
      }
      if (values.state.length === 0) {
        ctx.addIssue({ code: "custom", path: ["state"], message: "Choose your state." });
      }
      if (values.postalCode.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["postalCode"],
          message: "Enter your ZIP or postal code.",
        });
      }
      if (values.country.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["country"],
          message: "Choose the country you live in.",
        });
      }
    }

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

    if (values.familyMemberRelationship.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["familyMemberRelationship"],
        message: "Choose how you know them.",
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

export type IdentityContactValues = z.infer<typeof identityContactSchema>;
