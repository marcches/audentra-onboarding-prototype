# Copy inventory

Every string the student reads, by Step, in its final wording, with the register
marked. **Screens are built from this file.** A screen ticket that invents a
string instead of taking it from here has skipped ticket 03, and the previous
round is the evidence for why that matters: its copy ticket was ninth of nine,
written against screens that already existed, which is why the client says the
input text was never fixed.

## Two registers, declared

Not one voice averaged across the flow. That average is what produces "your form
was submitted successfully!".

| Register | Where | What it sounds like |
|---|---|---|
| **Warm** | Your offer, the acceptance, every Points award, Campus life, Enrolled | Direct, second person, short. The brief via Laura was *"faça parte desse time"*, not *"compartilhe se quiser"*. |
| **Flat** | Who you are, Health information, Where you live now, Who we call, Review & sign, Deposit | Precise, unadorned. Money, FERPA, immigration status and signatures do not want personality. |

The seam between them is a Step boundary, never a paragraph boundary.

## Rules

- A radio option carries its own consequence in its label (Fiverr's "U.S. tax
  authorities might request Form W-9"), never in a footnote under the group.
- A question that needs justifying says why it is asked, **once** (Remote's "We
  need this to determine which tax forms you need").
- Helper text survives only where a field is genuinely ambiguous. Laura: *"tem
  explicação em cada um deles, será que é necessário isso mesmo?"* The helper
  text is itself part of the bulk being scrolled past.
- **No em dashes.** Requested directly by the client on the call.
- Buttons are named for what comes next, never "Submit". Where money is
  involved the button carries the amount.
- What you will need is listed before the first field, not discovered mid-form.

---

## Entry

**Register:** warm.

| Slot | String |
|---|---|
| Heading (new) | Welcome to Aster |
| Heading (returning) | Welcome back |
| Lead | Your place is waiting. Sign in and we will pick up where you left off. |
| Tab | Create account · Sign in |
| Email label | Email address |
| Password label | Password |
| Password help | At least 12 characters, with a letter and a number. |
| Mobile label | Mobile number |
| Submit (new) | Create your account |
| Submit (returning) | Sign in |
| Footer | Trouble getting in? Write to support@audentra.com |

## The entrance line

Announced **once**, before the first field, and never repeated as a running
remainder. Melio's "Takes 4-5 minutes · Each step is saved as you progress" and
Langdock's "0 / 595" crowning a checklist.

> **About {minutes} minutes, saved as you go.** {count} quests, worth
> {points} points toward credit at the campus bookstore.

---

## 1 · Your offer

**Register:** warm. **Archetype:** decision.

| Slot | String |
|---|---|
| Title | Your place at Aster |
| Lead | Everything below is the offer as it stands. Read it, then tell us. |
| Art eyebrow | Aster University |
| Art footer | {programme}, starting {term} |
| Facts label | The offer |
| Fact rows | Programme · Degree · Starts · Campus · Respond by |
| Deposit tile label | Enrollment deposit |
| Deposit tile note | Credited against your first term's tuition, not charged on top of it. |
| Respond-by label | Respond by |
| Reassurance | Accepting does not lock you in for good. You can withdraw in writing any time before term starts. |
| Consequence block heading | What accepting does |
| Consequence 1 | Holds your place in {programme} for {term}. |
| Consequence 2 | Opens housing, so you can rank where you want to live. |
| Consequence 3 | Starts the deposit clock. You have until {deadline} to pay it. |
| Accept | Accept my place |
| Decline | I am not taking this place |
| Decline confirm heading | Turning down your place |
| Decline confirm body | We will let Admissions know. Nothing else happens, and you can write to them if you change your mind. |
| Decline reason label | Anything you want to tell us? (optional) |
| Decline submit | Send my answer |

### The acceptance

| Slot | String |
|---|---|
| Eyebrow | YOU ARE IN |
| Headline | You are an Aster student. |
| Sub | {term} starts in {n} months. Let's get you ready for it. |
| Share prompt | Faça parte desse time. Tell people. |
| Share prompt (EN) | Go on, tell people. It is worth {SHARE_POINTS} points. |
| Share button | Share the news |
| Share earned | Shared. Nice one. |
| Continue | Keep going |

The celebration carries emotion, Points and sharing. It carries **no
information**: "what accepting does" was migrated to the offer screen, where
stating a consequence before the decision is the honest place for it.

The string "Entirely optional" is **deleted**. It is the exact register the
client rejected.

---

## 2 · Who you are

**Register:** flat. **Archetype:** form.

| Slot | String |
|---|---|
| Title | Who you are |
| Lead | Your name as you want it used, a number we can reach you on, and one document. |
| On record label | Already on your record |
| On record note | Admissions holds these. Write to them if any of it is wrong. |
| Preferred name label | Preferred name |
| Preferred name placeholder | What people call you |
| Pronouns label | Pronouns |
| Mobile label | Mobile number |
| Mobile help | We use this for enrolment messages and nothing else. |
| Status legend | Your student status |
| Status why | This decides which document we ask you for, and whether we need a U.S. address. |
| Status option 1 | U.S. citizen |
| Status consequence 1 | We will ask for your U.S. passport. |
| Status option 2 | U.S. permanent resident |
| Status consequence 2 | We will ask for your state-issued driver's licence. |
| Status option 3 | International student |
| Status consequence 3 | We will ask for your home country passport. No U.S. address needed. |
| Upload label (citizen) | Your U.S. passport |
| Upload label (resident) | Your driver's licence |
| Upload label (international) | Your home country passport |
| Dropzone | Drop a photo or PDF here, or choose a file |
| Dropzone limit | Up to 10 MB. JPG, PNG or PDF. |
| File remove | Remove |
| Continue | Save and continue |

Helper text that survives, with its reason:

- **Status why** — the question branches the rest of the flow, and Remote's
  pattern is to say so once rather than to explain each option.
- **Mobile help** — the one field where students reasonably fear a marketing
  list.

Everything else the previous screen explained is deleted.

---

## 3 · Health information

**Register:** flat. Optional Step. **Archetype:** form.

| Slot | String |
|---|---|
| Title | Health information |
| Lead | Optional here. The student portal will ask for it later either way. |
| Accommodation legend | Do you need an accommodation for a disability or health condition? |
| Accommodation why | Accessibility Services uses this to reach you before term starts. Nobody teaching you sees it. |
| Accommodation yes | Yes, I would like to talk to Accessibility Services |
| Accommodation no | No, not right now |
| Note label | What would help? (optional) |
| Note placeholder | Anything you want them to know before they call |
| Medical upload label | Medical documentation |
| Medical upload note | A letter or report from a clinician. |
| Immunization label | Immunization record |
| Immunization note | Aster holds this on file for every student, whatever you answered above. |
| Uploads group label | Documents |
| Skip | Skip for now |
| Skip note | Skipping is fine here. The portal will require your immunization record before you register for classes. |
| Continue | Save and continue |

---

## 4 · Where you live now

**Register:** flat. **Absent entirely for an international student.**
**Archetype:** form.

| Slot | String |
|---|---|
| Title | Where you live now |
| Lead | Your permanent address, which decides your residency classification and where official post goes. |
| Street label | Street address |
| Unit label | Apartment or unit (optional) |
| City label | City |
| State label | State |
| State placeholder | Choose your state |
| City placeholder | Choose your city |
| City empty | Choose a state first |
| Postal label | ZIP code |
| Country label | Country |
| Residency legend | How should we check your residency? |
| Residency option 1 | Use the address above |
| Residency consequence 1 | Fastest, if that is genuinely where you live. |
| Residency option 2 | I will send supporting documents |
| Residency consequence 2 | Enrollment Services will write to you with the list. |
| Residency option 3 | I need an advisor to look at this |
| Residency consequence 3 | Pick this if your situation does not fit the other two. |
| Continue | Save and continue |

---

## 5 · Who we call, who can see

**Register:** flat. **Archetype:** form.

| Slot | String |
|---|---|
| Title | Who we call, who can see |
| Lead | One person we can reach in an emergency, and anyone you want us to be able to talk to. |
| Emergency legend | Emergency contact |
| Emergency name | Full name |
| Emergency relationship | How you know them |
| Emergency phone | Their mobile number |
| Add contact | Add another contact |
| Remove contact | Remove |
| FERPA heading | Why this is yours to decide |
| FERPA body (always visible) | The Family Educational Rights and Privacy Act gives parents the right to see their children's education records. **When you turn 18, or enter a postsecondary institution at any age, that right transfers from your parents to you.** So this is your decision, not theirs. |
| FERPA disclosure | What this means in practice |
| FERPA disclosure body | Without your permission, Aster staff will decline to discuss your grades, your bill or your housing with anyone who asks, including a parent who is paying your fees. Naming someone here is how you change that. You can widen, narrow or withdraw it at any time in writing. |
| Family legend | Family access |
| Family empty | Nobody has access to your record. |
| Add person | Give someone access |
| Person name | Full name |
| Person email | Email address |
| Person email help | This is where their access confirmation goes. |
| Person relationship | How you know them |
| Scope legend | What they can see |
| Scope 1 | Enrollment status |
| Scope 1 detail | Whether you are registered, full-time or part-time, and which programme. Not your grades. |
| Scope 2 | Grades and academic record |
| Scope 2 detail | Your grades each term, your transcript and your academic standing. |
| Scope 3 | Billing and financial aid |
| Scope 3 detail | What you owe, what you have paid, and any aid you hold. Not your grades. |
| Scope 4 | Housing |
| Scope 4 detail | Which residence you are assigned and your move-in window. |
| Scope 5 | Health and disability services |
| Scope 5 detail | Accommodations, and anything you have told Accessibility Services. |
| Scope 6 | Disciplinary record |
| Scope 6 detail | Conduct cases involving you, and how they were resolved. |
| Remove person | Remove access |
| Continue | Save and continue |

The sentence in bold is the one that has to survive every edit. It answers the
question the screen provokes in a seventeen-year-old and in the parent standing
behind them, and without it the screen reads as the university arbitrarily
cutting parents out. It is **always visible**, never behind the disclosure.

---

## 6 · Housing

**Register:** flat, with a warm lead. **Archetype:** catalogue.

| Slot | String |
|---|---|
| Title | Housing |
| Lead | Eight residences. Rank your three favourites and Housing Services will work from that. |
| Preference notice | A preference is a request, not an assignment. Housing Services assigns rooms after the response deadline. |
| Meal plan convention | Room rates are per person, per academic year. Meal plans are priced separately and are not in these figures. |
| Shortlist label | Your shortlist |
| Shortlist empty | Pick three residences and rank them. |
| Shortlist count | {n} of 3 ranked |
| Add to shortlist | Add to shortlist |
| In shortlist | Ranked {n} |
| Remove | Remove from shortlist |
| Move up | Move up |
| Move down | Move down |
| See all photos | See all {n} photos |
| Gallery title | {residence} photos |
| Compare | Compare your three |
| Detail: rooms | Room types |
| Detail: bathroom | Bathroom |
| Detail: laundry | Laundry |
| Detail: air | Air conditioning |
| Detail: walk | Walk to the middle of campus |
| Detail: dining | Dining |
| Detail: capacity | Beds |
| Detail: built | Built |
| Detail: renovated | Renovated |
| Detail: communities | Learning communities |
| Detail: eligibility | Who can live here |
| Detail: gender | Gender configuration |
| Continue | Save my shortlist |
| Continue (empty) | Continue without a preference |

---

## 7 · Campus life

**Register:** warm. Optional Step. **Archetype:** catalogue.

| Slot | String |
|---|---|
| Title | Campus life |
| Lead | Aster has around 420 student organizations. Mark the ones you want to look at, and we will turn it into a route through the Involvement Fair. |
| Interest note | Marking interest does not sign you up. Joining happens in person, at the fair, after classes begin. |
| Search placeholder | Search organizations |
| Filter: category | Category |
| Filter: cost | Cost |
| Filter: time | Weekly time |
| Filter: joining | Getting in |
| Result count | {n} organizations |
| Result count (zero) | No organizations match |
| Clear all | Clear all |
| Filters (mobile) | Filters |
| Sheet footer | Show {n} organizations |
| Interest control | Interested |
| Interest control (marked) | Interested |
| Card meta | {cost} · {time} · {joining} |
| Detail: cost | Cost per semester |
| Detail: time | Weekly time |
| Detail: joining | Getting in |
| Detail: meets | Meets |
| Detail: where | Where |
| Detail: size | Members |
| Route pill | Interested · {n} |
| Skip | Skip for now |
| Continue | Save and continue |

**"Join", "Sign up", "Apply" and "Enroll" appear nowhere as a control.** Where
an organization requires an application, that is information in Getting in.

### Your fair route

| Slot | String |
|---|---|
| Title | Your fair route |
| Fair line | The Involvement Fair is on {date}, on {place}. |
| Summary | {n} organizations · {z} fair zones · about {m} minutes |
| Zone heading | {zone} |
| Stop meta | Table {n} · {joining} |
| Remove stop | Remove |
| Export | Save this route |
| Print | Print |
| Empty | Nothing marked yet. Go back to the catalogue and mark whatever looks interesting. |
| Empty action | Back to the catalogue |
| Note | Nothing here is a commitment. Turn up, or do not. |

---

## 8 · Review & sign

**Register:** flat. **Archetype:** review.

| Slot | String |
|---|---|
| Title | Review & sign |
| Purpose | Check what you told us, then sign the enrollment agreement built from it. |
| Position | Last quest before the deposit |
| Completeness | {answers} answers across {sections} sections · {attention} needs attention |
| Completeness (clean) | {answers} answers across {sections} sections · nothing outstanding |
| Section status: complete | Complete |
| Section status: attention | Needs attention |
| Section status: skipped | Skipped |
| Edit | Edit |
| Expand | Show answers |
| Collapse | Hide answers |
| Agreement heading | Your enrollment agreement |
| Agreement note | Two documents, written out in full. Scroll to the end of both before you sign. |
| Read gate | Keep reading to the end to sign |
| Read gate (done) | Read in full |
| Electronic records | By signing electronically you agree that your electronic signature is the legal equivalent of your handwritten one, and that Aster may keep and send these records electronically. |
| Signature mode: type | Type it |
| Signature mode: draw | Draw it |
| Typed label | Type your full legal name |
| Drawn label | Sign with your mouse or finger |
| Clear | Clear |
| Attestation | I have read both documents and I agree to be legally bound by them. |
| Sign | Sign and continue |
| Signed notice | Signed on {date}. Reference {ref}. |
| Re-open notice | You changed an answer, so the agreement was rewritten. Read it again and sign. |

---

## 9 · Deposit

**Register:** flat. Three screens, one rail entry. **Archetype:** form.

### 9a · Secure your place

| Slot | String |
|---|---|
| Title | Secure your place |
| Lead | One payment of {amount}, credited against your first term's tuition. |
| Card 1 | How you want to pay |
| Option: now | Pay {amount} now |
| Option: now detail | Card or bank transfer. Refundable until {deadline}. |
| Option: deadline | Pay by {deadline} |
| Option: deadline detail | Student Accounts will invoice you. Your place is held either way. |
| Option: waiver | Request a waiver |
| Option: waiver detail | For students for whom the deposit is a barrier. Reviewed within five working days. |
| Card 2 | Payment method |
| Method: card | Card |
| Method: bank | Bank transfer |
| Method: bank detail | Takes two to three working days to clear. |
| Card name | Name on card |
| Card number | Card number |
| Card expiry | Expiry |
| Card cvc | Security code |
| Waiver reason label | Why are you requesting a waiver? |
| Waiver reason help | A sentence is enough. Student Accounts reads these. |
| Card 3 | Review |
| Summary title | Deposit |
| Summary line 1 | Enrollment deposit |
| Summary credit | Credited against your first term's tuition |
| Summary due | Due today |
| Summary due (waiver) | $0, pending review |
| Summary refundable | Refundable until {deadline} |
| Continue | Review before paying |

### 9b · Double check

| Slot | String |
|---|---|
| Title | Double check |
| Lead | Nothing has been charged yet. |
| Change | Change |
| Policy heading | The deposit policy, in short |
| Policy 1 | The deposit is {amount} and it is credited against your first term's bill. |
| Policy 2 | It is refundable in full until {deadline}, and not after it. |
| Policy 3 | If you withdraw after that date you forfeit the deposit and nothing else. |
| Pay | Pay {amount} |
| Pay (deadline) | Confirm and invoice me |
| Pay (waiver) | Send my waiver request |

### 9c · Receipt

| Slot | String |
|---|---|
| Title (paid) | Paid |
| Sentence (paid) | We charged {amount} to your card. Your place is confirmed. |
| Title (processing) | Processing |
| Sentence (processing) | Your bank transfer of {amount} is on its way. It usually clears in two to three working days. |
| Title (deadline) | Scheduled |
| Sentence (deadline) | Nothing has been charged. Student Accounts will invoice you {amount}, due {deadline}. |
| Title (waiver) | Waiver requested |
| Sentence (waiver) | Your request is with Student Accounts. They reply within five working days, and your place is held while they do. |
| Receipt: reference | Reference |
| Receipt: date | Date |
| Receipt: method | Method |
| Receipt: amount | Amount |
| Next heading | What happens next |
| Next 1 | Deposit received |
| Next 2 | Credited to your first term's bill |
| Next 3 | Balance due {date} |
| Continue | Finish |

**Absent by decision:** any countdown or urgency, cart vocabulary, upsells,
promo fields, BNPL branding, marketing opt-ins, and confetti on the receipt.
Applying purchase pressure to a financial obligation, from an institution that
has already admitted the student, is coercive and reads as a scam.

---

## 10 · Enrolled

**Register:** warm. **Archetype:** celebration.

| Slot | String |
|---|---|
| Eyebrow | ENROLLED |
| Headline | That is it. You are an Aster student. |
| Sub | We will write to you in July with your room and your move-in window. |
| Card: name | {legal name} |
| Card: id | {enrolment id} |
| Card: residence | {residence} |
| Card: year | Class of {year} |
| Journey heading | What you did |
| Journey total | {points} points |
| Journey conversion | = {credit} in bookstore credit |
| Receipt disclosure | Your deposit receipt |
| Primary | Spend {credit} at the bookstore |
| Secondary | Done for now |
| Share | Share this |
| Share card metrics | Quests · Points · Residence · Enrolled |
| Share earned | Shared. That is another {SHARE_POINTS} points. |

---

## Errors

**Register:** flat, everywhere. Name the field, say what is wrong, say what is
acceptable.

| Field | Message |
|---|---|
| Email empty | Enter your email address. |
| Email invalid | Enter a valid email address. |
| Password short | Your password needs at least 12 characters. |
| Password letter | Add at least one letter. |
| Password number | Add at least one number. |
| Password mismatch | These do not match. Type the same password in both fields. |
| Phone empty | Enter your mobile number, including the country code. |
| Phone charset | Enter a valid phone number, including the country code. |
| Phone short | That number is too short. It should be 7 to 14 digits after the country code. |
| Phone long | That number is too long. It should be 7 to 14 digits after the country code. |
| Status empty | Choose the one that applies to you. |
| Document missing | Attach your {document} before you continue. |
| Street empty | Enter your street address. |
| City empty | Choose your city. |
| State empty | Choose your state. |
| Postal empty | Enter your ZIP code. |
| Contact name empty | Enter their full name. |
| Contact relationship empty | Choose how you know them. |
| Family email invalid | Enter a valid email address. This is where their access goes. |
| Family scope empty | Pick at least one thing they can see, or remove them. |
| Signature empty | Sign your name before you continue. |
| Consent unchecked | Tick the box to confirm you agree. |
| Waiver reason empty | Tell Student Accounts why, in a sentence. |
