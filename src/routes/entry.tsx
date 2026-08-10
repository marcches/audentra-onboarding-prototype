import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Field } from "@/components/field";
import { Notice } from "@/components/notice";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wordmark } from "@/components/wordmark";
import { formatDeadline, institution, offer } from "@/lib/fixtures";
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
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <BrandPanel />

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:py-16">
        <div className="w-full max-w-[26rem] space-y-7">
          <div className="space-y-2 lg:hidden">
            <Wordmark />
          </div>

          <div className="space-y-2">
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

            <TabsContent value="create">
              <CreateAccountForm
                onSuccess={() => {
                  patch("entry", { accountCreated: true });
                  navigate({ to: "/onboarding/offer" });
                }}
              />
            </TabsContent>

            <TabsContent value="signin">
              <SignInForm
                onSuccess={() => {
                  navigate({ to: "/onboarding/offer" });
                }}
              />
            </TabsContent>
          </Tabs>

          <Notice tone="info" title="About that verification email">
            Email and text delivery aren't switched on in this preview, so nothing will land in your
            inbox. Your account works anyway — this is a setting, not a fault.
          </Notice>
        </div>
      </div>
    </div>
  );
}

function BrandPanel() {
  return (
    <div className="brand-panel flex flex-col justify-between gap-10 px-6 py-10 text-white sm:px-10 lg:w-[42%] lg:max-w-[34rem] lg:px-14 lg:py-14">
      <Wordmark tone="on-dark" className="hidden lg:inline-flex" />

      <div className="space-y-5">
        <p className="text-micro font-bold tracking-[0.06em] text-white/60 uppercase">
          {institution.name} · Offer of admission
        </p>
        <p className="text-h1 font-black tracking-[-0.03em] text-white lg:text-display">
          You got into {offer.programme}.
        </p>
        <p className="max-w-[26rem] text-lead text-white/70">
          {offer.degree}, starting {offer.startingTerm} at {offer.campus}. Everything you need to
          say yes is on the other side of this form.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/15 pt-6 text-white/80">
        <div>
          <dt className="text-micro font-bold tracking-[0.06em] text-white/50 uppercase">
            Respond by
          </dt>
          <dd className="text-body font-bold text-white">
            {formatDeadline(offer.responseDeadline)}
          </dd>
        </div>
        <div>
          <dt className="text-micro font-bold tracking-[0.06em] text-white/50 uppercase">
            Application
          </dt>
          <dd className="text-body font-bold text-white">AST-2027-014882</dd>
        </div>
      </dl>
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
    </form>
  );
}
