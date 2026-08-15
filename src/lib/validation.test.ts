import { describe, expect, it } from "vitest";

import type { StudentStatus } from "@/lib/steps";
import {
  addressSchemaFor,
  documentLabelFor,
  requiredDocumentFor,
  whereYouLiveSchema,
  whoWeCallSchema,
  whoYouAreSchema,
} from "@/lib/validation";

/**
 * The conditional branches.
 *
 * These are the rules the review call asked for, which a previous spec
 * specified and no round built: Student status decides which Identity document
 * is requested, and whether the address participates in validation **at all**.
 * They are pure functions and there is no DOM in this repo, so this is the
 * highest point they can be tested from.
 */

const file = { name: "passport.pdf", size: 1024 };

function whoYouAre(status: string, files = [file]) {
  return {
    preferredName: "Alex",
    pronouns: "",
    dialCode: "+1",
    phone: "",
    studentStatus: status,
    idDocuments: files,
  };
}

describe("the document each status calls for", () => {
  const expected: Record<StudentStatus, string> = {
    "us-citizen": "U.S. passport",
    "permanent-resident": "driver's licence",
    international: "home country passport",
  };

  it("asks a citizen for a U.S. passport, a resident for a licence, and an international student for their own passport", () => {
    for (const [status, document] of Object.entries(expected)) {
      expect(requiredDocumentFor(status as StudentStatus)).toBe(document);
    }
  });

  it("names the document in the error, so switching the answer changes the sentence", () => {
    /* "Attach your U.S. passport" and "Attach your home country passport" are
       the same rule and different sentences, and only one of them is useful. */
    for (const status of Object.keys(expected) as StudentStatus[]) {
      const result = whoYouAreSchema.safeParse(whoYouAre(status, []));
      expect(result.success).toBe(false);
      const message = result.error?.issues.find(
        (issue) => issue.path[0] === "idDocuments",
      )?.message;
      expect(message).toContain(expected[status]);
    }
  });

  it("gives every status a label for the upload", () => {
    for (const status of Object.keys(expected) as StudentStatus[]) {
      expect(documentLabelFor(status)).toMatch(/^Your /);
    }
  });

  it("refuses an unanswered status before it can ask for anything", () => {
    const result = whoYouAreSchema.safeParse(whoYouAre(""));
    expect(result.success).toBe(false);
  });

  it("accepts a complete answer", () => {
    expect(whoYouAreSchema.safeParse(whoYouAre("us-citizen")).success).toBe(true);
  });
});

describe("the address participates only where it applies", () => {
  it("is part of the schema for a citizen and a permanent resident", () => {
    expect(addressSchemaFor("us-citizen")).toBe(whereYouLiveSchema);
    expect(addressSchemaFor("permanent-resident")).toBe(whereYouLiveSchema);
  });

  it("is absent entirely for an international student", () => {
    /* `null`, not a schema of optional fields. A hidden required field that
       blocks Continue with an error nobody can see is the worst version of
       this, and it is what the flow did before. */
    expect(addressSchemaFor("international")).toBeNull();
  });

  it("requires the whole block where it does apply", () => {
    const schema = addressSchemaFor("us-citizen");
    expect(schema).not.toBeNull();
    const result = schema?.safeParse({
      street: "",
      unit: "",
      state: "",
      city: "",
      postalCode: "",
      country: "US",
      residencyVerification: "",
    });
    expect(result?.success).toBe(false);
    const paths = new Set(result?.error?.issues.map((issue) => issue.path[0]));
    for (const field of ["street", "state", "city", "postalCode", "residencyVerification"]) {
      expect(paths.has(field), field).toBe(true);
    }
  });

  it("accepts a well-formed address", () => {
    const result = whereYouLiveSchema.safeParse({
      street: "12 Chapel Street",
      unit: "",
      state: "CA",
      city: "san-francisco",
      postalCode: "94103",
      country: "US",
      residencyVerification: "permanent-address",
    });
    expect(result.success).toBe(true);
  });
});

describe("family access is complete or it is not granted", () => {
  const contact = {
    id: "contact-1",
    fullName: "Marta Rivera",
    relationship: "parent",
    dialCode: "+1",
    phone: "555 123 4567",
  };

  it("accepts a student who grants nobody access", () => {
    const result = whoWeCallSchema.safeParse({
      emergencyContacts: [contact],
      familyAccess: [],
    });
    expect(result.success).toBe(true);
  });

  it("refuses a grant with no scope", () => {
    /* The fourth field is the one that had never been built. A grant without it
       is a name and an email with no meaning attached. */
    const result = whoWeCallSchema.safeParse({
      emergencyContacts: [contact],
      familyAccess: [
        {
          id: "family-1",
          fullName: "Marta Rivera",
          email: "marta@example.com",
          relationship: "parent",
          scope: [],
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("accepts a complete grant", () => {
    const result = whoWeCallSchema.safeParse({
      emergencyContacts: [contact],
      familyAccess: [
        {
          id: "family-1",
          fullName: "Marta Rivera",
          email: "marta@example.com",
          relationship: "parent",
          scope: ["enrollment", "financials"],
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});
