# Copy inventory — round 4

Updated for the Phases round, not rewritten. Only the strings these decisions
renamed, invented or orphaned were touched: the Housing section (rebuilt in
ticket 04), the Offer's reassurance and share prompt, About you's disclosure
scopes, and Completion's Balance line. Everything else is round 3's and was
approved as it stands.

Every string of interface text in the prototype, by screen, with where it came
from. Two origins only:

- **Sheet** — copied from `raw/data/2026-08-08-audentra-student-portal-fields.md`
  (the Student Portal Fields table, the Scenarios table, or the Message Library
  tab). Not rewritten, not paraphrased. These need no wordsmithing review.
- **Derived** — not in the sheet, written here against a named Message Library
  rule. **These are the ones to read closely.** Each carries the rule it was
  written against, so the review question is "does it obey that rule?" rather
  than "do you like it?".

The rules referenced, from the Message Library tab:

| Rule | What it requires |
| --- | --- |
| Field helper text | States what is wanted and why. Never repeats the label. |
| Inline validation | Names the field, states what is wrong, states what is acceptable. |
| Submit error | States whether anything was saved, sent or charged. Never blames the student for a system failure. |
| Confirmation | Omitted where the result is already visible on screen. |
| Result statement | Persistent. Carries the date and any reference the student may need to quote. |
| Empty state | States why it is empty and what would fill it. Never renders as blank space. |
| Confirmation dialogue | The confirm control is labelled with the action, not with "Yes". |
| Convention — voice | Addresses the student directly. Avoids system language. |

---

## Entry

| String | Origin | Note |
| --- | --- | --- |
| "Aster University enrollment" | Derived | Page title. Names the portal, not the visitor — the old heading guessed at the person's situation ("Welcome back" for someone with no account). |
| "Your account holds your offer, your checklist and your documents." | Derived | Voice. Says what the account is for, one sentence. |
| "This becomes how you sign in." | **Sheet** | Email address helper. |
| "We use this for reminders only if you choose text." | **Sheet** | Mobile phone helper. |
| "At least 12 characters, including a letter and a number." | **Sheet** (pattern) | Sheet has "At least {n} characters"; the two extra conditions are this prototype's password rule and are named because the rule enforces them. |
| "Enter a valid email address." | **Sheet** | Inline validation. |
| "Enter a valid phone number, including the country code." | **Sheet** | Inline validation. Cited in the Message Library as the worked example of the rule. |
| "Enter your mobile number, including the country code." | Derived | Inline validation, empty case. Same shape as the sheet's non-empty case. |
| "That number is too short / too long. It should be 7 to 14 digits after the country code." | Derived | Inline validation. States what is acceptable, which is the half most length errors omit. |
| "Your password needs at least 12 characters." | **Sheet** (pattern) | Sheet: "Your password does not meet the requirements: {unmet requirements listed}." Rendered here as one message per unmet requirement. |
| "These do not match. Type the same password in both fields." | Derived | Inline validation. |
| "Nothing was created. An account already exists for {email}. Sign in instead, or contact Admissions at {email}." | **Sheet** | Submit error — the sheet's own string, with "Nothing was created" as the title because the rule requires stating whether anything was saved. |
| "Nothing was sent. There is no account for {email}. Create one above — what you have typed here is kept." | Derived | Submit error. States that nothing was sent and that nothing is lost. |
| "Email and text messages are switched off in this preview. Nothing will arrive in your inbox. Your account still works." | Derived | Page banner. A prototype-only condition, so the sheet has nothing for it. |
| "All of Aster, in one place. / Enrollment, documents and payments." | Derived | The one institutional line on the brand panel (ADR-0006). Asserts nothing about the individual. |

## Offer

| String | Origin | Note |
| --- | --- | --- |
| "Your offer" | Derived | Page title. Replaces "Your place at Aster", which Laura named. |
| "Read it, then accept or decline. You can answer once — changing it afterwards goes through Admissions." | **Sheet** (rule) | From the Acceptance field's restriction: "One response only. Changing it requires Admissions." |
| "The degree awarded." / "When you would begin." / "Where you would study." | **Sheet** | Field helper text for Degree, Starting term, Campus. |
| "The date by which you must respond." → "After this the offer closes and only Admissions can reopen it." | **Sheet** (adapted) | Response deadline helper, merged with the expiry rule so the consequence is stated before it happens rather than after. |
| "Accepting does not commit you to payment yet." | **Sheet** | SC-001 tooltip, verbatim. This is the line that gives the deposit block its weight. |
| "Yes, I'm joining" / "No, I won't be joining" | **Sheet** (Acceptance: Accept / Decline) | Wording carried from round 1 and approved on the call. |
| "Your place is reserved and the rest of enrollment opens. Nothing is charged." | Derived | Under the accept control: states the consequence before the confirm, per Confirmation dialogue. |
| "Your record closes. Telling us why is optional and helps us improve." | **Sheet** | SC-002 tooltip. |
| "Welcome to Aster. Your place in Computer Science for Fall 2027 is reserved. Accepting does not commit you to payment yet." | **Sheet** | The acceptance dialog. The sheet's approved string; its third sentence ("Next, create your account") is dropped because the account already exists by this point in the prototype. |
| "Decline my offer" (confirm control) | Derived | Confirmation dialogue: labelled with the action, not with "Yes". |
| "Thank you for letting us know. Your response is recorded." | **Sheet** | SC-002/SC-003. |
| "You accepted this offer on {date}. To change your response, contact Admissions." | **Sheet** | SC-005. |
| "What happens when you accept" — three numbered consequences | Derived | Voice. Moved into the celebration in ticket 02: it answers a question the student asks *after* saying yes. Content is drawn from SC-001 and the offer restrictions. |
| "Nothing is charged today. Accepting reserves your place and opens the rest of enrollment." | Derived | The reassurance above the fixed bar (Upwork). Two sentences, not one joined by a dash — ticket 06. |
| "Go public with it. You're joining Aster." → "Post it to Facebook or LinkedIn and let people hear it from you. Worth 20 points toward your bookstore credit." | Derived | The celebration's share prompt. **Replaces "Entirely optional, and worth N points if you do."** That was verbatim the register the client rejected ("não apenas se você quiser") in the one moment he wanted to feel like going public with a relationship. It remains optional in fact; it no longer apologises for being asked. |

## About you

| String | Origin | Note |
| --- | --- | --- |
| "About you" | Derived | Page title. |
| "Upload an ID and we will fill in what we can." | **Sheet** | Identity document upload helper. |
| "PDF, JPEG or PNG, up to 8 files, 30 MB in total." | **Sheet** | The field's restrictions, stated to the student. |
| "We read your document and filled in the fields below. Check them before continuing." | **Sheet** | Upload success. |
| "We keep your original file, and nothing we read counts until a person checks it." | **Sheet** | SC-011 tooltip. |
| "We could not read this document. Fill the fields in yourself, or try another file." | **Sheet** | Upload error 1 of 3. |
| "This file type is not accepted. Use PDF, JPEG or PNG." | **Sheet** | Upload error 2 of 3. |
| "This file is larger than 30 MB." | **Sheet** | Upload error 3 of 3. |
| "You can attach up to 8 files." | **Sheet** | From the Requirement/Upload row, same restriction. |
| "As it appears on your official documents." → "From your application. The Registrar changes this, not you." | **Sheet** (adapted) | Read-only fields. The sheet's helper plus the RN-PR-02 route to correction, because the field is not editable here. |
| "What you would like us to call you. Defaults to Alex." | **Sheet** | Preferred name helper plus its empty state. |
| "This decides which financial aid and visa steps open later." | Derived | Field helper text. Says why the field is being asked, which the sheet's own version ("Do you need a student visa to study here?") does not. |
| "Your permanent address decides your residency classification, which affects your tuition, and it is where official post goes." | Derived | Field helper text. **Required field** — the errata. The reason survived the rewrite; the "all optional" claim did not. |
| "Enter your street address." / "Enter your city or town." / "Enter your state or province." / "Enter your ZIP or postal code." / "Choose the country you live in." | Derived | Inline validation, one per address field. |
| "How Enrollment Services should review your residency classification" | **Sheet** | Residency review helper, verbatim as the legend. |
| "Review path not selected. Choose one, or leave it and Enrollment Services will pick a path and tell you." | **Sheet** | Empty state, from the field's own Empty column. |
| "One person is enough. They get no access to your record — that is the next section." | Derived | Voice. Pre-empts the question the next section answers. |
| "Enter their full name." / "Choose how you know them." | Derived | Inline validation. |
| "Choose who can see your record and what they can see. You can change or remove this at any time." | **Sheet** | Grant family access helper plus SC-082 tooltip. |
| "No one else has access to your record. You can grant access any time from your profile." | **Sheet** | SC-021 / the field's empty state. |
| "Choose at least one item, or cancel." → "Pick at least one thing they can see, or turn access back off." | **Sheet** (adapted) | Disclosure scope error. Adapted because this screen has a toggle, not a cancel. |
| The six scopes, each with its line: "Enrollment status" / "Grades and academic record" / "Billing and financial aid" / "Housing" / "Health and disability services" / "Disciplinary record" | Derived | Ticket 07. Named as the thing rather than as the office that owns it — a student ticking "Student Financial Services" has not been told what they are giving away. The sentence under each is what makes the tick informed. |
| "These two stay off unless you turn them on." | Derived | Above the health and conduct scopes. States the default rather than relying on the student noticing it. |
| "{name} · N of 6 areas" | Derived | The collapsed section summary. Was "N area(s)". |
| "{n} of 4 sections still need you." | Derived | The fixed column. Voice. |

## Housing

Rebuilt in ticket 04. The three-way intent question and everything hanging off
it are gone: the residences are the step now, and the strings below replace the
whole of the previous section.

| String | Origin | Note |
| --- | --- | --- |
| "Where you'll live" | Derived | Page title. Unchanged, and the subtitle Laura said added nothing is still gone. |
| "Rank 3 of the 8. Housing Services assigns rooms after the response deadline. A shortlist is considered, never guaranteed." | **Sheet** (adapted) | The Housing tooltip, split into two sentences. The qualifier the sheet carries ("Housing considers this, it does not guarantee it") is now the lead of the screen rather than a line inside a panel, because the ranking is the screen. |
| "Your shortlist" | Derived | Panel title. **Shortlist** per `CONTEXT.md` — the previous "Your ranking" named the gesture rather than the thing produced. |
| "First choice at the top. Reorder with the arrows, or drag the number." | Derived | Says how to operate a control whose affordance is not obvious, per Voice. |
| "Nothing shortlisted yet. Choose Add to shortlist on a residence and it takes the first slot." | Derived | Empty state: why it is empty, and what fills it. |
| "1st choice / 2nd choice / 3rd choice — empty" | Derived | Empty slot label. Shown only once at least one slot is filled; see ticket 04. |
| "Add to shortlist" / "Shortlisted #N — remove" | Derived | Replaces "Rank it" and "Nth choice — remove". Names the Shortlist, which is the thing being built. |
| "All 3 slots are full. Remove one to shortlist a different residence." | Derived | Blocked state: what unlocks the control. |
| "Room type" / "Bathroom" | Derived | Filter pill labels. The two facts a student narrows on first. |
| "Nothing matches both filters. No residence offers that room type with that bathroom. Widening either one brings residences back." | Derived | Empty state: why it is empty, and what fills it. |
| Amenity chips: "Single room or Shared room", "Bathroom per floor", "Meal plan included", "N min walk", "Laundry in the building", "First years only" | Derived | Label maps in `fixtures.ts`. The API returns codes; these are the words. No cost — ADR-0003. |
| "Already have a place in the city? I'll arrange my own housing" | Derived | The off-campus exit. Off campus is no longer half the step; this is the discreet path that remains, per ADR-0003. |
| "Noted — you're housing yourself. Housing Services won't assign you a room, and there's no shortlist to build. Nothing else in enrollment depends on this." | Derived | Result statement for the exit: what it means and what it does not affect. |
| "Want to look at tuition or housing protection?" | **Sheet** | Unchanged wording, moved behind the exit — the student arranging their own place is who the field is for. |

## Campus life

| String | Origin | Note |
| --- | --- | --- |
| "Campus life" | Derived | Page title. Replaces "What you'd show up for", which Laura named. |
| "None of this blocks your enrollment and you can change it later. Skip the whole step if you would rather." | **Sheet** (rule) | From the roommate-matching restriction: "Never blocks enrollment. Can be exited at any point." |
| "Ask Disability Services to contact you. Do not upload medical records here." | **Sheet** | Accommodations follow-up helper, verbatim. |
| "Yes, contact me" / "No, not right now" | **Sheet** | The field's values. |
| "Disability Services will contact you by email within 3 working days" | **Sheet** | The field's success message, with the placeholders filled. |
| "Nothing is recorded. Ask Housing Services or Disability Services whenever you need to." | Derived | Confirmation, negative case. |
| "Nothing picked yet. Choose a club on the left and it appears here. Picking none is a fine answer — nothing on this step blocks your enrollment." | Derived | **Empty state.** The old string ("Nothing picked yet.") said the first half only, which is the exact failure the rule names. |

## Review & sign

| String | Origin | Note |
| --- | --- | --- |
| "Read it, then sign it" | Derived | Page title. |
| "Your answers are written into the agreement below. Read to the end — signing unlocks when you have." | **Sheet** (rule) | From the Document to sign helper: "Read this before signing." |
| The Enrollment Agreement, clauses 1–8 | Derived | **The largest block of derived copy in the flow.** Plain English, not the real legal instrument — the ticket scopes this to the reading and signing interaction, not the wording. Every bold span is a value the student entered, which makes the bold its own audit trail. |
| "Type your full name to sign: Alex Rivera." | **Sheet** | Typed signature helper, verbatim. |
| "The name you typed does not match your name on record. Type it exactly as {name}." | **Sheet** | SC-020 / the field's error, verbatim. |
| "Scroll to the end of the agreement. Signing unlocks when you have." | Derived | **Blocked state**: what unlocks the control. |
| "I have read the agreement and I agree to it." | Derived | The consent statement. Shortened — the old version explained the FERPA release, which the agreement itself now does. |
| "Signed on {date}. Reference {ref}." | **Sheet** | **Result statement**: persistent, carries the date and the reference, per the rule. |
| "Reference. Quote it if you contact anyone about this agreement." | Derived | Result statement, explaining what the reference is for. |
| "Your signature goes here" | Derived | Empty state on the signature cell, before signing. |

## Deposit

| String | Origin | Note |
| --- | --- | --- |
| "Your enrollment deposit" | Derived | Page title. |
| "This secures your place and is credited against your balance." | **Sheet** | SC-053 tooltip, verbatim. |
| "Pay $500 now" / "Accept now, pay by the deadline" / "Ask for a waiver or a later date" | Derived | The three options, carried from round 2 and unchanged in scope. |
| "Payment is not connected in this prototype. Nothing is charged and no card details are asked for." | Derived | **System message.** Replaces the simulated card form, removed at Laura's request in Jam 3. |
| "Your place is held. The $500 is due by {date}, and Student Accounts will email you before then." | Derived | Confirmation for the defer option. |
| "Asking costs you nothing. Student Accounts reviews these individually and it has no bearing on your offer." | Derived | Voice. Removes the implied penalty from asking. |
| "A sentence is plenty. You do not need to prove anything here." | Derived | Field helper text. |

## Completion

The concept of this screen is protected — Laura approved it twice and assertively
— so only the copy changed.

| String | Origin | Note |
| --- | --- | --- |
| "YOU'RE ENROLLED" | Derived | Unchanged. Approved. |
| "Your record is live. Nothing needs you right now. We will tell you when something does." | **Sheet** | SC-023 / the Home "items needing attention" zero state, verbatim. |
| "Your record is live. One thing is still open: your deposit, in the first card below." | Derived | The branch where the deposit was skipped. Colon, not a dash — ticket 06. |
| "You earned $30 bookstore credit on the way here. That's 170 points, waiting on your Aster account." | Derived | The closing Balance, ticket 05. Credit first, points second: the number was only ever a way of counting the credit (ADR-0002). Absent entirely at zero points. |
| "Still outstanding. Your place is held until the deadline and not after it. Pay it, or ask for a waiver, from the Deposit step." | Derived | Returned/outstanding state: says what it is and what to do. |
| The four "what happens next" cards | Derived | Voice. Each states when, then what. |
| "Enrollment Agreement · signed" + date + reference | **Sheet** (rule) | Result statement, repeated here so the signature is a record rather than a control. |

---

## What is deliberately still open

- The agreement's clause wording (8 clauses) is the largest derived block and the
  one furthest from anything the sheet covers. It is plain English standing in
  for a legal instrument, and the ticket puts the instrument itself out of scope.
- Three questions go back to Laura before this round closes, per the round-3
  precedence rule — they are listed in `spec.md` under Further Notes and none of
  them is a copy decision this pass can make.
