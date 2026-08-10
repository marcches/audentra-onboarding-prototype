import { ArrowRightIcon, SparkleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";

import { Field, ReadOnlyField } from "@/components/field";
import { Notice } from "@/components/notice";
import { OptionCard } from "@/components/option-card";
import { PhoneInput } from "@/components/phone-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Wordmark } from "@/components/wordmark";

const SWATCHES: { name: string; token: string; hex: string; note: string }[] = [
  {
    name: "Violet 500",
    token: "--color-violet-500",
    hex: "#6A38FF",
    note: "Brand · primary signal",
  },
  {
    name: "Azure 500",
    token: "--color-azure-500",
    hex: "#1E5BFF",
    note: "Brand · gradient partner",
  },
  { name: "Mint 500", token: "--color-mint-500", hex: "#00C49A", note: "Brand · done / verified" },
  { name: "Ink 900", token: "--color-ink-900", hex: "#0A1F44", note: "Brand navy · all text" },
  {
    name: "Ink 500",
    token: "--color-ink-500",
    hex: "#6B7280",
    note: "Brand grey · secondary text",
  },
  { name: "Canvas", token: "--color-canvas", hex: "#F4F6FB", note: "Page ground" },
  { name: "Sunken", token: "--color-sunken", hex: "#EAEEF7", note: "Field fill, tab track" },
  { name: "Danger 500", token: "--color-danger-500", hex: "#D92651", note: "Validation, decline" },
];

export function StyleGuideRoute() {
  const [dialCode, setDialCode] = React.useState("+1");

  return (
    <div className="min-h-dvh">
      <header className="brand-panel px-6 py-12 text-white sm:px-10 lg:px-16">
        <Wordmark tone="on-dark" />
        <h1 className="mt-8 max-w-[30rem] text-display font-black tracking-[-0.03em] text-white">
          The tokens and primitives everything else is built from.
        </h1>
        <p className="mt-3 max-w-[34rem] text-lead text-white/70">
          Brand colour and Satoshi come from the Audentra guidelines. The surface language — paper
          canvas, slab cards, navy-tinted elevation, 10/16/20px radii — is this prototype's own.
        </p>
        <Button asChild variant="secondary" size="lg" className="mt-8">
          <Link to="/entry">
            Open the flow
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Link>
        </Button>
      </header>

      <div className="mx-auto flex w-full max-w-[62rem] flex-col gap-14 px-6 py-14 sm:px-10">
        <Section title="Colour" caption="Brand values first, then the ground they sit on.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SWATCHES.map((swatch) => (
              <div key={swatch.token} className="space-y-2">
                <div
                  className="h-20 rounded-[var(--radius-card)] border border-ink-100"
                  style={{ backgroundColor: `var(${swatch.token})` }}
                />
                <div>
                  <p className="text-body font-bold text-ink-900">{swatch.name}</p>
                  <p className="text-small text-ink-500">
                    {swatch.hex} · {swatch.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="brand-gradient mt-4 flex h-16 items-center justify-center rounded-[var(--radius-card)] text-body font-bold text-white">
            Brand gradient — reserved for live progress and the accept moment
          </div>
        </Section>

        <Section title="Type" caption="Satoshi throughout. Display sizes are tightly tracked.">
          <div className="space-y-3 rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6">
            <p className="text-display font-black tracking-[-0.03em]">Display 40 · You're in.</p>
            <p className="text-h1">Heading 1 · 32 · Your place at Aster</p>
            <p className="text-h2">Heading 2 · 24 · Where you'll live</p>
            <p className="text-h3">Heading 3 · 18 · Who we call in an emergency</p>
            <p className="text-lead text-ink-600">
              Lead 17 · One question, and then at most one more.
            </p>
            <p className="text-body text-ink-700">
              Body 15 · All optional. It only matters for post that has to reach you.
            </p>
            <p className="text-small text-ink-500">Small 13 · Saved automatically</p>
            <p className="field-label">Field label 12 · Mobile number</p>
          </div>
        </Section>

        <Section
          title="Buttons"
          caption="44px tall by default, so every action clears the tap-target floor."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">
              Large
              <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
            </Button>
          </div>
        </Section>

        <Section title="Fields" caption="Filled until focus, then they lift to white.">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Email address" htmlFor="sg-email" hint="This becomes how you sign in.">
              <Input id="sg-email" placeholder="you@mail.com" />
            </Field>
            <Field
              label="Email address"
              htmlFor="sg-email-error"
              error="That doesn't look like an email address. It needs an @ and a domain, like you@mail.com."
            >
              <Input id="sg-email-error" defaultValue="alex.rivera" aria-invalid />
            </Field>
            <Field label="Mobile number" htmlFor="sg-phone">
              <PhoneInput id="sg-phone" dialCode={dialCode} onDialCodeChange={setDialCode} />
            </Field>
            <Field label="Citizenship" htmlFor="sg-select">
              <Select>
                <SelectTrigger id="sg-select">
                  <SelectValue placeholder="Choose one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">U.S. citizen</SelectItem>
                  <SelectItem value="intl">International student</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Anything else" htmlFor="sg-textarea" optional>
              <Textarea id="sg-textarea" placeholder="Only if you want to." />
            </Field>
            <ReadOnlyField label="Legal first name" value="Alex" />
          </div>
        </Section>

        <Section
          title="Choice"
          caption="Radios and checkboxes rendered as slabs, so the hit area is the card."
        >
          <RadioGroup defaultValue="on-campus" className="max-w-md">
            <OptionCard
              value="on-campus"
              id="sg-on-campus"
              label="On campus"
              hint="In an Aster residence"
            />
            <OptionCard
              value="off-campus"
              id="sg-off-campus"
              label="Off campus"
              hint="Your own place nearby"
            />
          </RadioGroup>
          <label
            htmlFor="sg-checkbox"
            className="mt-4 flex max-w-md cursor-pointer items-center gap-3 rounded-[var(--radius-field)] border border-ink-200 bg-surface px-3.5 py-3"
          >
            <Checkbox id="sg-checkbox" defaultChecked />
            <span className="text-body text-ink-800">Financial account and payments</span>
          </label>
        </Section>

        <Section
          title="Tabs"
          caption="The thumb slides, which is how you notice the other tab exists."
        >
          <Tabs defaultValue="create" className="max-w-md">
            <TabsList>
              <TabsTrigger value="create">Create account</TabsTrigger>
              <TabsTrigger value="signin">Sign in</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <p className="text-body text-ink-600">Default for anyone arriving from an offer.</p>
            </TabsContent>
            <TabsContent value="signin">
              <p className="text-body text-ink-600">One click away, never the landing state.</p>
            </TabsContent>
          </Tabs>
        </Section>

        <Section
          title="Accordion"
          caption="Slab cards whose collapsed header still says what's inside."
        >
          <Accordion type="multiple" defaultValue={["one"]}>
            <AccordionItem value="one">
              <AccordionTrigger>
                <span className="flex flex-1 flex-col gap-0.5 text-left">
                  <span className="text-h3 text-ink-900">Who you are</span>
                  <span className="text-small text-ink-500">
                    Legal name · date of birth · citizenship
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-body text-ink-600">Fields go here.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="two">
              <AccordionTrigger>
                <span className="flex flex-1 flex-col gap-0.5 text-left">
                  <span className="text-h3 text-ink-900">Where you live now</span>
                  <span className="text-small text-ink-500">
                    Permanent address · residency check
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-body text-ink-600">Fields go here.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        <Section
          title="Messages"
          caption="Standing conditions. Each one states the position and the way out."
        >
          <div className="space-y-3">
            <Notice tone="info" title="About that verification email">
              Email and text delivery aren't switched on in this preview. Your account works anyway.
            </Notice>
            <Notice tone="success" title="Nobody else has access">
              That's the default and it's a perfectly good answer.
            </Notice>
            <Notice tone="caution" title="No account for that address yet">
              Nothing was sent and nothing was changed.
            </Notice>
          </div>
        </Section>

        <Section title="Cards" caption="16px radius, hairline ink border, navy-tinted shadow.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Aster Residence Hall</CardTitle>
                <CardDescription>Traditional halls, right on the quad</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body text-ink-600">
                  Shared floors · Dining hall attached · 4 min to the Computer Science building
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SparkleIcon weight="fill" aria-hidden className="size-4 text-violet-500" />
                  Elevation
                </CardTitle>
                <CardDescription>soft · card · lift · modal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Separator />
                <div className="flex gap-3">
                  <div className="h-14 flex-1 rounded-[var(--radius-field)] bg-surface shadow-soft" />
                  <div className="h-14 flex-1 rounded-[var(--radius-field)] bg-surface shadow-card" />
                  <div className="h-14 flex-1 rounded-[var(--radius-field)] bg-surface shadow-lift" />
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-h2 text-ink-900">{title}</h2>
        <p className="text-body text-ink-500">{caption}</p>
      </div>
      {children}
    </section>
  );
}
