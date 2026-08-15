import { ArrowRightIcon, SparkleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { Balance } from "@/components/balance";
import { Field, ReadOnlyField } from "@/components/field";
import { ImageViewerProvider, useImageViewer } from "@/components/image-viewer";
import { Notice } from "@/components/notice";
import { OptionCard } from "@/components/option-card";
import { PhoneInput } from "@/components/phone-input";
import { PricePill } from "@/components/points-award";
import {
  FlatCard,
  IconTile,
  OnGround,
  Panel,
  PanelDivider,
  SectionLabel,
  SelectionMark,
  Well,
} from "@/components/surfaces";
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
import { AudentraMark, Wordmark } from "@/components/wordmark";
import { residences } from "@/lib/housing";
import { cn } from "@/lib/utils";

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
        <Section
          title="Identity"
          caption="One drawing, four colourings. The ground picks the tone, not the taste of whoever is placing it."
        >
          <IdentitySheet />
        </Section>

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

        <Section
          title="The four surfaces"
          caption="One step of luminance and at most one border between any two. Shadow is not a level: it belongs to what genuinely floats."
        >
          <SurfaceDemo />
        </Section>

        <Section
          title="The three Ground exceptions"
          caption="The only places content sits directly on the recessed page. Each names itself in code, so a fourth cannot be added quietly."
        >
          <GroundDemo />
        </Section>

        <Section
          title="The five archetypes"
          caption="Every route is one of these and composes from its parts. The archetype is read from steps.ts, never passed by the route."
        >
          <ArchetypeDemo />
        </Section>

        <Section
          title="Selection, emphasis and motion"
          caption="Selection is fill and a check. Emphasis is a ring glow. Nothing scales, grows, thickens a border or lifts on hover."
        >
          <StateDemo />
        </Section>

        <Section
          title="Points as a transaction"
          caption="The same tag is the price beforehand and the receipt afterwards, and it is the object that flies to the Balance."
        >
          <div className="flex flex-wrap items-start gap-6">
            <div className="space-y-2">
              <p className="field-label">Price</p>
              <PricePill points={30} />
            </div>
            <div className="space-y-2">
              <p className="field-label">Receipt</p>
              <PricePill points={30} earned />
            </div>
            <div className="space-y-2">
              <p className="field-label">In flight, 56px</p>
              <PricePill points={30} size="flight" earned />
            </div>
            <div className="w-56 space-y-2">
              <p className="field-label">The Balance</p>
              <Balance />
            </div>
          </div>
        </Section>

        <Section
          title="The image viewer"
          caption="Click any photograph. Arrow keys and Esc work, the filmstrip jumps, and the page behind does not move."
        >
          <ImageViewerProvider>
            <ViewerDemo />
          </ImageViewerProvider>
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
              Body 15 · Persistent helper text sits under the field it belongs to.
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
              label="U.S. citizen"
              consequence="We will ask for your U.S. passport."
            />
            <OptionCard
              value="off-campus"
              id="sg-off-campus"
              label="International student"
              consequence="We will ask for your home country passport. No U.S. address needed."
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

/**
 * The identity, on the three grounds it has to survive.
 *
 * Worth drawing rather than listing, because the whole reason four colourings
 * exist is that each one fails on somebody else's ground — and that is only
 * ever obvious side by side. The mark keeps its own colours on light and on
 * dark *neutral*; it goes flat white only on brand violet, where its left
 * stroke is the same colour as the panel.
 *
 * Every asset here is generated from `brand/` by `scripts/brand-variants.mjs`.
 */
const GROUNDS = [
  { name: "Light", tone: "ink", className: "bg-white border-ink-100" },
  { name: "Dark neutral", tone: "on-dark", className: "bg-ink-900 border-transparent" },
  { name: "Brand", tone: "knockout", className: "brand-gradient border-transparent" },
] as const;

function IdentitySheet() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {GROUNDS.map((ground) => (
          <div key={ground.name} className="space-y-2">
            {/* The border is on all three, transparent where it is not wanted:
                only the light card needs one to separate from the canvas, and
                giving it to that card alone put its caption 2px below its
                neighbours'. */}
            <div
              className={cn(
                "flex flex-col items-start justify-center gap-4 rounded-[var(--radius-card)] border p-5",
                ground.className,
              )}
            >
              <Wordmark tone={ground.tone} tagline />
              {/* The same lockup at chrome size, which is where a mark either
                  holds together or turns into a smudge. */}
              <Wordmark tone={ground.tone} className="h-3.5" />
            </div>
            <p className="text-caption text-ink-500">
              {ground.name} · <code>tone=&quot;{ground.tone}&quot;</code>
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-6 rounded-[var(--radius-card)] border border-ink-100 bg-white p-5">
        <div className="space-y-2">
          <AudentraMark className="h-10" />
          <p className="text-caption text-ink-500">Symbol</p>
        </div>
        <div className="space-y-2">
          {/* `mono` takes the colour of its parent, so it is the one variant
              that can be used as material rather than as a signature. */}
          <AudentraMark tone="mono" className="h-10 text-ink-900/25" />
          <p className="text-caption text-ink-500">
            Symbol · <code>tone=&quot;mono&quot;</code>
          </p>
        </div>
        <div className="space-y-2">
          <Wordmark tone="mono" className="h-5 text-violet-500" />
          <p className="text-caption text-ink-500">
            Lockup · <code>tone=&quot;mono&quot;</code>
          </p>
        </div>
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

/* ---------------------------------------------------------------------------
   The foundation, demonstrated.

   This is the proof ticket 01 shipped. A surface language written down in a
   document and drawn nowhere is a surface language the next round reads
   differently.
   ------------------------------------------------------------------------ */

function SurfaceDemo() {
  return (
    <div className="rounded-[var(--radius-card)] bg-ground p-5">
      <p className="mb-3 field-label">Ground, which holds titles, section labels and spacing</p>
      <Panel
        title="Panel"
        description="Elevated, framing one subject. Optional header and footer."
        action={
          <Button variant="ghost" size="sm">
            One action
          </Button>
        }
        footerMeta="Metadata at the left"
        footer={
          <Button variant="secondary" size="sm">
            The way out
          </Button>
        }
      >
        <p className="text-body text-ink-700">
          A Panel may contain anything, including Wells and internal dividers. Never another
          identical Panel.
        </p>
        <PanelDivider />
        <Well label="Well">
          <p className="text-small text-ink-600">
            Inset within a Panel: read-only summaries, file lists, dropzones, previews and grids.
            Darker than the Panel, never darker than the Ground. Never the primary action.
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <FlatCard as="li" key={index} className="p-3">
                <p className="text-small text-ink-700">Flat card</p>
              </FlatCard>
            ))}
          </ul>
        </Well>
        <div className="mt-3">
          <Well dashed>
            <p className="text-center text-small text-ink-500">
              A dashed Well is a dropzone: an invitation, not a record.
            </p>
          </Well>
        </div>
      </Panel>
    </div>
  );
}

function GroundDemo() {
  return (
    <div className="space-y-4 rounded-[var(--radius-card)] bg-ground p-5">
      <SectionLabel description="1. A label for the panel below it, which cannot live inside the thing it names.">
        Section label
      </SectionLabel>

      <OnGround reason="catalogue" as="section">
        <p className="mb-2 text-small text-ink-500">
          2. A catalogue that is the screen. Framing it puts a white box on a grey page containing
          white cards.
        </p>
        <ul className="grid gap-2 sm:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <FlatCard as="li" key={index} className="p-3">
              <p className="text-small text-ink-700">Catalogue item</p>
            </FlatCard>
          ))}
        </ul>
      </OnGround>

      <OnGround reason="checkout-asymmetry" as="section" className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <p className="text-small text-ink-500">
            3. The checkout, where only the summary is framed. Framing both halves would erase the
            emphasis that makes the summary the summary.
          </p>
        </div>
        <Panel title="Deposit">
          <p className="text-body font-strong text-ink-900 numeric">$500 due today</p>
        </Panel>
      </OnGround>
    </div>
  );
}

const ARCHETYPES: { name: string; rule: string }[] = [
  {
    name: "decision",
    rule: "Exactly one viewport at any width. If it does not fit it loses content, not the constraint.",
  },
  { name: "form", rule: "A measured column of Panels. Scrolls." },
  { name: "catalogue", rule: "The collection is the screen, on the Ground, at full width." },
  {
    name: "review",
    rule: "Reads answers back, then asks for a signature. The one documented exception to the viewport rule.",
  },
  { name: "celebration", rule: "Hands over an object. No rail, no action bar." },
];

function ArchetypeDemo() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ARCHETYPES.map((archetype) => (
        <li key={archetype.name}>
          <Panel className="h-full">
            <p className="font-mono text-small text-violet-700">{archetype.name}</p>
            <p className="mt-1 text-small leading-5 text-ink-600">{archetype.rule}</p>
          </Panel>
        </li>
      ))}
    </ul>
  );
}

function StateDemo() {
  const [selected, setSelected] = React.useState(1);

  return (
    <div className="space-y-5">
      <Well label="Selection is fill and a check, never elevation">
        <ul className="grid gap-2 sm:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <FlatCard
              as="li"
              key={index}
              selected={selected === index}
              interactive
              className="cursor-pointer p-3"
              onClick={() => setSelected(index)}
            >
              <span className="flex items-center gap-2">
                <SelectionMark selected={selected === index} />
                <span className="text-small text-ink-700">Option {index + 1}</span>
              </span>
            </FlatCard>
          ))}
        </ul>
      </Well>

      <div className="flex flex-wrap items-center gap-5">
        <span className="rounded-[var(--radius-field)] bg-panel px-3 py-2 text-small ring-glow">
          Ring glow
        </span>
        <span className="rounded-[var(--radius-field)] bg-panel px-3 py-2 text-small ring-glow-mint">
          Ring glow, done
        </span>
        <IconTile size="lg">
          <SparkleIcon weight="fill" aria-hidden className="size-6" />
        </IconTile>
        <span className="text-small text-ink-500">Icon tile, 12% brand, never behind text</span>
      </div>

      <Well label="Row hover nudges its own content, it does not lift the row">
        <ul>
          {["First row", "Second row", "Third row"].map((label) => (
            <li
              key={label}
              className="row-nudge rounded-[var(--radius-field)] px-3 py-2 hover:bg-ink-50"
            >
              <span className="text-small text-ink-700">{label}</span>
            </li>
          ))}
        </ul>
      </Well>

      <Well label="The motion scale, named once and composed from">
        <ul className="grid gap-2 sm:grid-cols-4">
          {[
            ["--duration-quick", "120ms"],
            ["--duration-base", "220ms"],
            ["--duration-slow", "360ms"],
            ["--duration-stage", "560ms"],
          ].map(([token, value]) => (
            <li key={token} className="text-small">
              <p className="font-mono text-ink-700">{token}</p>
              <p className="text-ink-400 numeric">{value}</p>
            </li>
          ))}
        </ul>
        <ul className="mt-3 grid gap-2 sm:grid-cols-4">
          {["--ease-out-soft", "--ease-out-expo", "--ease-overshoot", "--ease-in-out-soft"].map(
            (token) => (
              <li key={token} className="font-mono text-small text-ink-700">
                {token}
              </li>
            ),
          )}
        </ul>
      </Well>
    </div>
  );
}

function ViewerDemo() {
  const viewer = useImageViewer();
  const sample = residences
    .slice(0, 4)
    .flatMap((residence) => residence.photos.map((photo) => ({ ...photo, label: residence.name })));

  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {sample.map((photo, index) => (
        <li key={photo.src}>
          <button
            type="button"
            onClick={(event) => viewer.open(sample, index, event)}
            className="block aspect-square w-full overflow-hidden rounded-[var(--radius-field)]"
          >
            <img src={photo.src} alt={photo.alt} className="size-full object-cover" />
          </button>
        </li>
      ))}
    </ul>
  );
}
