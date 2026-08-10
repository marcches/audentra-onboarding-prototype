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
import { institution } from "@/lib/fixtures";
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

  return (
    /* Form first in the DOM, panel second and pulled left on desktop.
       On a phone that puts the email field at the top of the page instead of
       behind a full screen of brand — the invitation becomes the closing note.

       On desktop the split is exactly one viewport tall and neither half moves
       the page: whichever column overflows scrolls inside itself. A whole-page
       scrollbar on an auth screen reads as a layout that didn't fit. */
    <div className="flex min-h-dvh flex-col lg:h-dvh lg:min-h-0 lg:flex-row lg:overflow-hidden">
      {/* Centred via an inner wrapper with `min-h-full`, not via `items-center`
          on the scroller itself. Centring a column that overflows its own
          scroll box splits the overflow across both edges, and `scrollTop`
          cannot go negative — so on a short laptop the heading and the tab bar
          sit above the top edge with no way to reach them. Letting the wrapper
          grow past `min-h-full` turns that into ordinary downward scroll. */}
      <div className="flex w-full items-start justify-center px-4 py-10 sm:px-8 lg:w-[46%] lg:shrink-0 lg:overflow-y-auto lg:py-12">
        <div className="flex min-h-full w-full max-w-[clamp(28rem,26vw,34rem)] flex-col justify-center gap-6">
          <div className="space-y-2 lg:hidden">
            <Wordmark />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-h1 text-ink-900">
              {state.entry.accountCreated ? "Welcome back" : "Let's get you in"}
            </h1>
            <p className="text-body text-ink-600">
              {state.entry.accountCreated
                ? `Sign in and pick up where you left off at ${institution.short}.`
                : `You'll need an account to answer your offer. It takes about a minute.`}
            </p>
          </div>

          <Tabs
            value={state.entry.activeTab}
            onValueChange={(value) => patch("entry", { activeTab: value as "create" | "signin" })}
          >
            {/* Create account sits first and is the default. Anyone arriving
                from an offer email has no account yet — landing them on "Welcome
                back" is the bug this screen exists to fix. */}
            <TabsList>
              <TabsTrigger value="create">Create account</TabsTrigger>
              <TabsTrigger value="signin">Sign in</TabsTrigger>
            </TabsList>

            <TabsPanels>
              <TabsContent value="create" stacked>
                <CreateAccountForm
                  onSuccess={() => {
                    patch("entry", { accountCreated: true });
                    navigate({ to: "/onboarding/offer" });
                  }}
                />
              </TabsContent>

              <TabsContent value="signin" stacked>
                <SignInForm
                  onSuccess={() => {
                    navigate({ to: "/onboarding/offer" });
                  }}
                />
              </TabsContent>
            </TabsPanels>
          </Tabs>

          <Notice tone="info" title="About that verification email">
            Email and text delivery aren't switched on in this preview, so nothing will land in your
            inbox. Your account works anyway — this is a setting, not a fault.
          </Notice>
        </div>
      </div>

      {/* A proportional split, which is what actually stops the drift: both
          halves are a percentage of the width, so 1280 and 2560 show the same
          picture at different sizes. The first round capped the panel and let
          the form absorb the slack, which is why the gutter around the form
          grew by 240px every time the monitor did. */}
      <EntryPanel className="lg:order-first lg:h-full lg:flex-1" />
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
        hint="Only used for enrollment reminders, and only if you ask for them."
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
        hint="At least 12 characters, with a letter and a number in there."
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
              <EyeSlashIcon aria-hidden className="size-4.5" />
            ) : (
              <EyeIcon aria-hidden className="size-4.5" />
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
        <Notice ref={takenRef} alert tone="caution" title="That address already has an account">
          Switch to <strong>Sign in</strong> above and use {takenEmail}, or write to{" "}
          {institution.admissionsEmail} if it wasn't you.
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
        <Notice ref={unknownRef} alert tone="caution" title="No account for that address yet">
          Nothing was sent and nothing was changed. Switch to <strong>Create account</strong> above
          — it keeps what you've already typed.
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
            href={`mailto:${institution.admissionsEmail}`}
            className="font-bold text-violet-600 underline underline-offset-2"
          >
            Ask Admissions to reset it
          </a>
          . Self-service reset isn't switched on in this preview.
        </p>
        <p className="text-small text-ink-600">
          No account yet? Use <strong className="text-ink-800">Create account</strong> above — it
          takes about a minute, and it keeps whatever you've already typed here.
        </p>
      </div>
    </form>
  );
}
