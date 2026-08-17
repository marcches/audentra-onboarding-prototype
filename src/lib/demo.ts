import { onboardingSnapshot, patch } from "@/lib/store";

/**
 * The prototype's bootstrap: a finished gate, so the portal opens on the state
 * it was designed against.
 *
 * The portal presupposes a student who has accepted an offer and walked the
 * nine Quests. Opened on a fresh machine it did the opposite: a Balance reading
 * `0 points to spend` and `$0 in bookstore credit`, which makes the reward block
 * look broken rather than empty, and a checklist whose three carried-over
 * Requirements are carried over from a gate nobody walked.
 *
 * **This is not the portal writing the gate.** That rule is about consequence:
 * nothing a student does in the portal may change what they entered in the gate,
 * because a finished onboarding that moves under them is the worst thing this
 * repo could do. What this is instead is a *bootstrap* — it runs once, only on a
 * store nobody has touched, and it exists because this is a prototype rather
 * than a product with a real account behind it. `CONTEXT-MAP.md` records the
 * exception beside the rule.
 *
 * It lives in one file, exports one function and is called from one place, so
 * that grepping for `seedFinishedGate` finds the whole of it.
 */

/** Nothing has been touched: no answer to the offer, and no account created. */
function pristine(): boolean {
  const state = onboardingSnapshot();
  return (
    state.offer.response === null &&
    !state.whoYouAre.submitted &&
    !state.review.submitted &&
    !state.entry.accountCreated
  );
}

/**
 * The demonstration student: offer accepted and shared, the four required Quests
 * saved, and the three optional ones genuinely skipped.
 *
 * Which is 180 Points of the 215 on offer, and exactly three carried-over
 * Requirements — `Health information`, `Campus life` and the `Deposit`. The
 * skipped three are the point: without them the portal cannot say *nothing was
 * lost* and mean it, and that block is the hinge of the whole checklist.
 */
export function seedFinishedGate(): boolean {
  if (!pristine()) return false;

  patch("entry", {
    email: "alex.rivera@example.com",
    registeredEmail: "alex.rivera@example.com",
    phone: "555 123 4567",
    accountCreated: true,
    hasAuthenticated: true,
  });
  patch("offer", { response: "accepted", respondedAt: "2027-05-01", shared: true });
  patch("whoYouAre", {
    preferredName: "Alex",
    pronouns: "they/them",
    phone: "555 123 4567",
    studentStatus: "us-citizen",
    idDocuments: [{ name: "passport.pdf", size: 482_000 }],
    submitted: true,
  });
  patch("whereYouLive", {
    street: "1226 University Drive",
    city: "menlo-park",
    state: "CA",
    postalCode: "94025",
    country: "US",
    residencyVerification: "permanent-address",
  });
  patch("whoWeCall", {
    emergencyContacts: [
      {
        id: "contact-1",
        fullName: "Marisol Rivera",
        relationship: "parent",
        dialCode: "+1",
        phone: "555 987 6543",
      },
    ],
    submitted: true,
  });
  patch("housing", {
    residenceRanking: ["linden-house", "aster-residence-hall", "maple-court"],
    submitted: true,
  });
  /* Signed, because Review & sign is required and the portal is downstream of
     it. The reference is the one the gate issues, in the gate's own format. */
  patch("review", {
    documentRead: true,
    signatureMode: "type",
    typedSignature: "Alex Rivera",
    consented: true,
    signedAt: "2027-05-02",
    reference: "AST-2027-014882-S1",
    submitted: true,
  });

  return true;
}
