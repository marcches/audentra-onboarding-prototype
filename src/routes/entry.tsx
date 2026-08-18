import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useForm } from "react-hook-form";

import { EntryPanel } from "@/components/entry-panel";
import { Field } from "@/components/field";
import { Notice } from "@/components/notice";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsPanels, TabsTrigger } from "@/components/ui/tabs";
import { Wordmark } from "@/components/wordmark";
import { platform } from "@/lib/fixtures";
import { totalPointsAvailable } from "@/lib/points";
import { stepCount, totalMinutes } from "@/lib/steps";
import { patch, useOnboarding } from "@/lib/store";
import {
  type CreateAccountValues,
  createAccountSchema,
  type SignInValues,
  signInSchema,
} from "@/lib/validation";

/** Email addresses are matched the way mail servers match them, not case-sensitively. */
function sameEmail(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function EntryRoute() {
  const state = useOnboarding();
  const navigate = useNavigate();

  /**
   * Which tab opens, and the words above it, follow whether this device has been
   * here before.
   *
   * The screen used to hardcode Create account on the argument that "anyone
   * arriving from an offer email has no account yet". That premise was never
   * true — there is no personalised invitation link, and a student opening the
   * portal for the fifth time is the ordinary case, not the edge one. So the
   * default is remembered instead of assumed.
   *
   * The tab itself is React state rather than a stored field: it is the live
   * position of a control, and persisting it meant a returning visitor arrived
   * on whichever tab they happened to leave selected months earlier.
   */
  const returning = state.entry.hasAuthenticated;
  const [tab, setTab] = React.useState<"create" | "signin">(returning ? "signin" : "create");

  const enter = () => {
    patch("entry", { hasAuthenticated: true });
    navigate({ to: "/onboarding/offer" });
  };

  return (
    /* Form first in the DOM, panel second and pulled left on desktop.
       On a phone that puts the email field at the top of the page instead of
       behind a full screen of brand — the panel becomes the closing note.

       On desktop the split is exactly one viewport tall and neither half moves
       the page: whichever column overflows scrolls inside itself. A whole-page
       scrollbar on an auth screen reads as a layout that didn't fit. */
    <div className="flex h-dvh min-h-0 flex-row overflow-hidden compact:min-h-dvh compact:h-auto compact:flex-col compact:overflow-visible">
      {/* Centred via an inner wrapper with `min-h-full`, not via `items-center`
          on the scroller itself. Centring a column that overflows its own
          scroll box splits the overflow across both edges, and `scrollTop`
          cannot go negative — so on a short laptop the heading and the tab bar
          sit above the top edge with no way to reach them. Letting the wrapper
          grow past `min-h-full` turns that into ordinary downward scroll. */}
      {/* An even split. The form is capped and centred inside its half, so the
          space around it is symmetric and reads as margin — which is the
          difference between this and the defect it replaces, where a fixed panel
          let the form's gutter grow on one side only. */}
      <div className="flex w-1/2 shrink-0 items-start justify-center overflow-y-auto px-10 py-10 compact:w-full compact:overflow-visible compact:px-4 compact:py-6">
        <div className="flex min-h-full w-full max-w-[27rem] flex-col justify-center gap-6">
          <div className="hidden space-y-2 compact:block">
            <Wordmark />
          </div>

          {/* One heading per tab, not one per screen.
              The two panels ask for different things and mean different things,
              so a heading that covers both says nothing about either. The
              remembered visit still shows through: on Sign in it decides between
              greeting someone back and simply naming the action.

              No institution named, either — the entry screen does not know the
              tenant any more than it knows the person. Both arrive with the
              login. */}
          <div className="space-y-2">
            <h1 className="text-h1 text-ink-900">
              {tab === "create" ? "Create your account" : returning ? "Welcome back" : "Sign in"}
            </h1>
            <p className="text-body text-ink-600">
              {tab === "create"
                ? "One account holds your offer, your checklist, your documents and your payments."
                : returning
                  ? "Pick up where you left off."
                  : "Use the email address and password you set up."}
            </p>
          </div>

          {/* The total, announced **once**, before the first field of anything.
              Melio's "Takes 4-5 minutes, each step is saved as you progress" and
              Langdock's "0 / 595" crowning a checklist. Repeated per screen it
              becomes a running remainder, which is a threat rather than an
              orientation, so this is the only place in the flow it appears.

              One number for everybody. It used to be read "for the full
              spine" because the entrance has not asked Student status yet and
              could not know whether this student had nine Quests or ten; every
              student walks the same nine now (ADR 0011), so the figure the
              entrance announces is the figure they go on to earn. */}
          {/* The comma belongs to the clause before it, not to the one after.
              Split across two flex children it inherited the row's `gap-x`, so
              the line read "About 23 minutes , saved as you go" — punctuation
              pushed off its own word by a layout gap. */}
          <p className="flex flex-wrap items-baseline gap-x-2 text-small text-ink-500">
            <span className="font-strong text-ink-700 numeric">About {totalMinutes} minutes,</span>
            <span>saved as you go.</span>
            <span className="numeric">
              {stepCount} quests, worth {totalPointsAvailable} points toward credit at the campus
              bookstore.
            </span>
          </p>

          <Tabs value={tab} onValueChange={(value) => setTab(value as "create" | "signin")}>
            {/* Sign in leads for a device that has been used before; a first
                visit gets Create account first. The order follows the likely
                intent rather than being fixed either way. */}
            <TabsList>
              {returning ? (
                <>
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                  <TabsTrigger value="create">Create account</TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="create">Create account</TabsTrigger>
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsPanels>
              <TabsContent value="create" stacked>
                <CreateAccountForm
                  onSuccess={() => {
                    patch("entry", { accountCreated: true });
                    enter();
                  }}
                />
              </TabsContent>

              <TabsContent value="signin" stacked>
                <SignInForm onSuccess={enter} />
              </TabsContent>
            </TabsPanels>
          </Tabs>

          <Notice tone="info" title="Email and text messages are switched off in this preview">
            Nothing will arrive in your inbox. Your account still works.
          </Notice>
        </div>
      </div>

      {/* The other half. Both sides are a percentage of the width, so 1280 and
          2560 show the same picture at different sizes — the first round capped
          the panel and let the form absorb the slack, which is why the gutter
          around the form grew by 240px every time the monitor did. */}
      <EntryPanel className="order-first h-full w-1/2 compact:order-none compact:h-auto compact:w-full" />
    </div>
  );
}

function CreateAccountForm({ onSuccess }: { onSuccess: () => void }) {
  const state = useOnboarding();
  const [showPassword, setShowPassword] = React.useState(false);
  const [takenEmail, setTakenEmail] = React.useState<string | null>(null);
  const takenRef = React.useRef<HTMLDivElement>(null);

  // Announce it, and put the keyboard on it. Submit failed silently otherwise:
  // the message drew above a button the user was still focused on.
  React.useEffect(() => {
    if (takenEmail) takenRef.current?.focus();
  }, [takenEmail]);

  const form = useForm<CreateAccountValues>({
    resolver: zodResolver(createAccountSchema),
    mode: "onBlur",
    defaultValues: {
      email: state.entry.email,
      dialCode: state.entry.dialCode,
      phone: state.entry.phone,
      password: "",
      confirmPassword: "",
    },
  });

  const dialCode = form.watch("dialCode");
  const { errors } = form.formState;

  function handleSubmit(values: CreateAccountValues) {
    const submitted = values.email.trim();

    // The one failure worth simulating: this address already has an account.
    // It happens for real when someone forgets they signed up last week.
    // Compared against `registeredEmail`, never the live draft — the draft is
    // whatever is in the box right now, so it always matches itself.
    if (state.entry.accountCreated && sameEmail(submitted, state.entry.registeredEmail)) {
      setTakenEmail(submitted);
      return;
    }

    patch("entry", {
      email: submitted,
      registeredEmail: submitted,
      dialCode: values.dialCode,
      phone: values.phone,
    });
    onSuccess();
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      <Field
        label="Email address"
        htmlFor="create-email"
        hint="This becomes how you sign in."
        error={errors.email?.message ?? undefined}
      >
        <Input
          id="create-email"
          type="email"
          autoComplete="email"
          placeholder="you@mail.com"
          aria-invalid={Boolean(errors.email)}
          {...form.register("email", {
            onChange: (event) => {
              setTakenEmail(null);
              patch("entry", { email: event.target.value });
            },
          })}
        />
      </Field>

      <Field
        label="Mobile number"
        htmlFor="create-phone"
        hint="We use this for reminders only if you choose text."
        error={errors.phone?.message ?? undefined}
      >
        <PhoneInput
          id="create-phone"
          dialCode={dialCode}
          onDialCodeChange={(value) => {
            form.setValue("dialCode", value, { shouldDirty: true });
            patch("entry", { dialCode: value });
          }}
          invalid={Boolean(errors.phone)}
          {...form.register("phone", {
            onChange: (event) => patch("entry", { phone: event.target.value }),
          })}
        />
      </Field>

      <Field
        label="Password"
        htmlFor="create-password"
        hint="At least 12 characters, including a letter and a number."
        error={errors.password?.message ?? undefined}
      >
        <div className="relative">
          <Input
            id="create-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            className="pr-12"
            aria-invalid={Boolean(errors.password)}
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700"
          >
            {showPassword ? (
              <EyeSlashIcon aria-hidden className="size-5" />
            ) : (
              <EyeIcon aria-hidden className="size-5" />
            )}
            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
          </button>
        </div>
      </Field>

      <Field
        label="Confirm password"
        htmlFor="create-confirm"
        error={errors.confirmPassword?.message ?? undefined}
      >
        <Input
          id="create-confirm"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...form.register("confirmPassword")}
        />
      </Field>

      {takenEmail ? (
        <Notice ref={takenRef} alert tone="caution" title="Nothing was created">
          An account already exists for {takenEmail}. Sign in instead, or write to{" "}
          {platform.supportEmail} if it was not you.
        </Notice>
      ) : null}

      <Button type="submit" size="lg" className="w-full">
        Create account
        <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
      </Button>
    </form>
  );
}

function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const state = useOnboarding();
  const [unknownEmail, setUnknownEmail] = React.useState<string | null>(null);
  const unknownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (unknownEmail) unknownRef.current?.focus();
  }, [unknownEmail]);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: { email: state.entry.signInEmail, password: "" },
  });

  const { errors } = form.formState;

  function handleSubmit(values: SignInValues) {
    const known =
      state.entry.accountCreated && sameEmail(values.email.trim(), state.entry.registeredEmail);
    if (!known) {
      setUnknownEmail(values.email.trim());
      return;
    }
    onSuccess();
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      <Field
        label="Email address"
        htmlFor="signin-email"
        error={errors.email?.message ?? undefined}
      >
        <Input
          id="signin-email"
          type="email"
          autoComplete="email"
          placeholder="you@mail.com"
          aria-invalid={Boolean(errors.email)}
          {...form.register("email", {
            onChange: (event) => {
              setUnknownEmail(null);
              patch("entry", { signInEmail: event.target.value });
            },
          })}
        />
      </Field>

      <Field
        label="Password"
        htmlFor="signin-password"
        error={errors.password?.message ?? undefined}
      >
        <Input
          id="signin-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          {...form.register("password")}
        />
      </Field>

      {unknownEmail ? (
        <Notice ref={unknownRef} alert tone="caution" title="Nothing was sent">
          There is no account for {unknownEmail}. Create one above — what you have typed here is
          kept.
        </Notice>
      ) : null}

      <Button type="submit" size="lg" className="w-full">
        Sign in
        <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
      </Button>

      {/* Sign in is two fields shorter than Create account, and the stacked
          panels reserve the taller one's height either way. Rather than leave
          that as a hole, it holds the two things a sign-in form owes you: a way
          out when the password is gone, and a way over when there is no
          account yet. */}
      <div className="space-y-4 border-t border-ink-100 pt-5">
        <p className="text-small text-ink-600">
          Forgotten your password?{" "}
          <a
            href={`mailto:${platform.supportEmail}`}
            className="font-bold text-violet-600 underline underline-offset-2"
          >
            Ask support to reset it
          </a>
          . Self-service reset is switched off in this preview.
        </p>
        <p className="text-small text-ink-600">
          No account yet? Use <strong className="text-ink-800">Create account</strong> above. What
          you have typed here is kept.
        </p>
      </div>
    </form>
  );
}
