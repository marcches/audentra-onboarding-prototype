import { ArrowRightIcon, SparkleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";

import { RichBalance } from "@/components/balance";
import { PricePill } from "@/components/celebration";
import { Field, ReadOnlyField } from "@/components/field";
import { ImageViewerProvider, useImageViewer } from "@/components/image-viewer";
import { Notice } from "@/components/notice";
import { OptionCard } from "@/components/option-card";
import { PhoneInput } from "@/components/phone-input";
import {
  Fact,
  FlatCard,
  IconTile,
  OnGround,
  Reveal,
  Section,
  SectionFields,
  SectionLabel,
  Sections,
  SelectionMark,
  Well,
} from "@/components/surfaces";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AudentraMark, Wordmark } from "@/components/wordmark";
import { residences } from "@/lib/housing";
import { presence, widthClasses } from "@/lib/layout";
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
      <header className="brand-panel px-6 py-10 text-white compact:px-4">
        <Wordmark tone="on-dark" />
        <h1 className="mt-6 max-w-[30rem] text-display font-black tracking-[-0.03em] text-white">
          The tokens and primitives everything else is built from.
        </h1>
        <p className="mt-2 max-w-[34rem] text-body text-white/70">
          Brand colour and Satoshi come from the Audentra guidelines. The surface language — paper
          canvas, rules instead of shadows, 10/16/20px radii — is this prototype's own.
        </p>
        <Button asChild variant="secondary" className="mt-6">
          <Link to="/entry">
            Open the flow
            <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
          </Link>
        </Button>
      </header>

      <div className="mx-auto flex w-full max-w-[62rem] flex-col gap-10 px-6 py-10 compact:px-4">
        <Chapter
          title="The three width classes"
          caption="ADR 0008. Declared once in app.css; a fourth cannot be written without editing that block, and a Tailwind default breakpoint fails the build."
        >
          <WidthClasses />
        </Chapter>

        <Chapter
          title="Presence"
          caption="The eight pieces that genuinely differ between a phone and a desktop. Closed at eight — everything else is one DOM node recomposed by CSS."
        >
          <PresenceTable />
        </Chapter>

        <Chapter
          title="Section"
          caption="ADR 0010. A tinted header band, an optional numbered marker that checks itself off, a rule, no shadow — and where it earns a chevron, closed it shows the value it holds rather than its title alone."
        >
          <SectionDemo />
        </Chapter>

        <Chapter
          title="Type"
          caption="Densified this round to body 14/1.5 and a 28px Step title. It went to 13 and 24 first, and that was too far: density is how much is on the screen, not how small it is set."
        >
          <Sections>
            <Section title="The scale">
              <div className="space-y-1.5">
                <p className="text-display">Display 36 · celebration only</p>
                <p className="text-h1">Heading 1 · 28 · the Step title</p>
                <p className="text-h2">Heading 2 · 20 · an overlay title</p>
                <p className="text-h3">Heading 3 · 16 · a Section header</p>
                <p className="text-lead text-ink-600">
                  Lead 15 · one question, and at most one more
                </p>
                <p className="text-body text-ink-700">Body 14/1.5 · the working size everywhere</p>
                <p className="text-small text-ink-500">Small 13 · values, secondary rows</p>
                <p className="text-micro text-ink-500">Micro 12 · hints, counters, receipts</p>
                <p className="field-label">Field label 12 · mobile number</p>
              </div>
            </Section>
          </Sections>
        </Chapter>

        <Chapter
          title="Field widths"
          caption="Width is a property of the answer, in twelfths. A ZIP code in a street address's box is what the client was looking at when they said the forms read as too big."
        >
          <Sections>
            <Section title="The five">
              <SectionFields>
                <Field width="tiny" label="tiny · 3" htmlFor="sg-w-tiny">
                  <Input id="sg-w-tiny" placeholder="94025" />
                </Field>
                <Field width="short" label="short · 4" htmlFor="sg-w-short">
                  <Input id="sg-w-short" placeholder="California" />
                </Field>
                <Field width="medium" label="medium · 6" htmlFor="sg-w-medium">
                  <Input id="sg-w-medium" placeholder="Alex Rivera" />
                </Field>
                <Field width="long" label="long · 8" htmlFor="sg-w-long">
                  <Input id="sg-w-long" placeholder="alex.rivera@example.com" />
                </Field>
                <Field width="full" label="full · 12" htmlFor="sg-w-full">
                  <Textarea id="sg-w-full" rows={2} placeholder="A paragraph, an upload, a group" />
                </Field>
              </SectionFields>
            </Section>
          </Sections>
        </Chapter>

        <Chapter
          title="Motion"
          caption="Four durations, roughly doubled this round so an animation can be seen. Only transform and opacity ever animate."
        >
          <MotionDemo />
        </Chapter>

        <Chapter title="Colour" caption="Brand values first, then the ground they sit on.">
          <div className="grid grid-cols-4 gap-3 compact:grid-cols-2">
            {SWATCHES.map((swatch) => (
              <div key={swatch.token} className="space-y-1.5">
                <div
                  className="h-14 rounded-[var(--radius-field)] border border-ink-100"
                  style={{ backgroundColor: `var(${swatch.token})` }}
                />
                <div>
                  <p className="text-small font-bold text-ink-900">{swatch.name}</p>
                  <p className="text-micro text-ink-500">
                    {swatch.hex} · {swatch.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Chapter>

        <Chapter
          title="Identity"
          caption="One drawing, four colourings. The ground picks the tone, not the taste of whoever is placing it."
        >
          <IdentitySheet />
        </Chapter>

        <Chapter
          title="The three Ground exceptions"
          caption="The only places content sits directly on the recessed page. Each names itself in code, so a fourth cannot be added quietly."
        >
          <GroundDemo />
        </Chapter>

        <Chapter
          title="Selection and emphasis"
          caption="Selection is fill and a check. Emphasis is a ring glow. Nothing scales, grows, thickens a border or lifts on hover."
        >
          <StateDemo />
        </Chapter>

        <Chapter
          title="Points as a transaction"
          caption="The same tag is the price beforehand and the receipt afterwards, and it is the object that flies to the Balance."
        >
          <div className="flex flex-wrap items-start gap-5">
            <div className="space-y-1">
              <p className="field-label">Price</p>
              <PricePill points={30} />
            </div>
            <div className="space-y-1">
              <p className="field-label">Receipt</p>
              <PricePill points={30} earned />
            </div>
            <div className="space-y-1">
              <p className="field-label">In flight</p>
              <PricePill points={30} size="flight" earned />
            </div>
            <div className="w-52 space-y-1">
              <p className="field-label">The Balance</p>
              <RichBalance celebrates />
            </div>
          </div>
        </Chapter>

        <Chapter
          title="The image viewer"
          caption="Click any photograph. Arrow keys and Esc work, the categories jump, and the page behind does not move."
        >
          <ImageViewerProvider>
            <ViewerDemo />
          </ImageViewerProvider>
        </Chapter>

        <Chapter
          title="Buttons"
          caption="Denser this round, with the tap-target floor held in compact — the one declared exception to the density ruler."
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">
              Large
              <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
            </Button>
          </div>
        </Chapter>

        <Chapter title="Fields" caption="Filled until focus, then they lift to white.">
          <Sections>
            <Section title="Every control" collapsible={false}>
              <SectionFields>
                <Field
                  label="Email address"
                  htmlFor="sg-email"
                  hint="This becomes how you sign in."
                >
                  <Input id="sg-email" placeholder="you@mail.com" />
                </Field>
                <Field
                  label="Email address"
                  htmlFor="sg-email-error"
                  error="That doesn't look like an email address. It needs an @ and a domain."
                >
                  <Input id="sg-email-error" defaultValue="alex.rivera" aria-invalid />
                </Field>
                <Field className="col-span-full" label="Mobile number" htmlFor="sg-phone">
                  <PhoneInput id="sg-phone" dialCode={dialCode} onDialCodeChange={setDialCode} />
                </Field>
                <Field label="Citizenship" htmlFor="sg-select">
                  <Select>
                    <SelectTrigger id="sg-select" className="w-full">
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
              </SectionFields>
            </Section>

            <Section title="Choice" collapsible={false}>
              <RadioGroup
                defaultValue="on-campus"
                className="grid grid-cols-2 gap-2 narrow:grid-cols-1"
              >
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
                  consequence="We will ask for your home country passport."
                />
              </RadioGroup>
              <label
                htmlFor="sg-checkbox"
                className="mt-2 flex max-w-md cursor-pointer items-center gap-2.5 rounded-[var(--radius-field)] border border-ink-200 bg-surface px-2.5 py-2"
              >
                <Checkbox id="sg-checkbox" defaultChecked />
                <span className="text-small text-ink-800">Financial account and payments</span>
              </label>
            </Section>

            <Section title="Tabs" collapsible={false}>
              <Tabs defaultValue="create" className="max-w-md">
                <TabsList>
                  <TabsTrigger value="create">Create account</TabsTrigger>
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                </TabsList>
                <TabsContent value="create">
                  <p className="text-small text-ink-600">
                    Default for anyone arriving from an offer.
                  </p>
                </TabsContent>
                <TabsContent value="signin">
                  <p className="text-small text-ink-600">
                    One click away, never the landing state.
                  </p>
                </TabsContent>
              </Tabs>
            </Section>
          </Sections>
        </Chapter>

        <Chapter
          title="Messages"
          caption="Standing conditions. Each one states the position and the way out."
        >
          <div className="space-y-2">
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
        </Chapter>
      </div>
    </div>
  );
}

function Chapter({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="space-y-0.5">
        <h2 className="text-h2 text-ink-900">{title}</h2>
        <p className="text-small text-ink-500">{caption}</p>
      </div>
      {children}
    </section>
  );
}

function WidthClasses() {
  return (
    <Sections>
      <Section title="compact · medium · desktop" collapsible={false}>
        <dl>
          {widthClasses.map((entry) => (
            <Fact
              key={entry.id}
              label={
                <span className="font-mono text-violet-700">
                  {entry.id} · {entry.to ? `${entry.from}–${entry.to - 1}` : `${entry.from}+`}px
                </span>
              }
            >
              <span className="font-normal text-ink-600">{entry.why}</span>
            </Fact>
          ))}
        </dl>
      </Section>
    </Sections>
  );
}

function PresenceTable() {
  return (
    <Sections>
      <Section title={`Exactly ${presence.length} rows`} collapsible={false} bodyClassName="p-0">
        <table className="w-full border-collapse text-small">
          <thead>
            <tr className="border-b border-ink-100">
              <th className="px-3 py-1.5 text-left field-label">Piece</th>
              <th className="px-3 py-1.5 text-left field-label">compact</th>
              <th className="px-3 py-1.5 text-left field-label">desktop</th>
              <th className="px-3 py-1.5 text-left field-label">How</th>
            </tr>
          </thead>
          <tbody>
            {presence.map((row) => (
              <tr key={row.id} className="border-b border-ink-100/70 last:border-0">
                <td className="px-3 py-1.5 font-strong text-ink-900">{row.piece}</td>
                <td className="px-3 py-1.5 text-ink-600">{row.compact}</td>
                <td className="px-3 py-1.5 text-ink-600">{row.desktop}</td>
                <td className="px-3 py-1.5">
                  <span
                    className={cn(
                      "rounded-[var(--radius-pill)] px-1.5 py-0.5 text-micro font-bold tracking-[0.06em] uppercase",
                      row.recomposes === "swap"
                        ? "bg-amber-50 text-amber-500"
                        : "bg-mint-50 text-mint-deep",
                    )}
                  >
                    {row.recomposes}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </Sections>
  );
}

/** The one component the whole round turns on, in both of its states. */
function SectionDemo() {
  const [revealed, setRevealed] = React.useState(false);

  return (
    <div className="rounded-[var(--radius-card)] bg-ground p-4">
      <Sections>
        <Section
          collapsible
          title="Closed, showing its value"
          defaultOpen={false}
          value="1226 University Dr, Menlo Park · CA 94025"
        >
          <SectionFields>
            <Field label="Street address" htmlFor="sg-street">
              <Input id="sg-street" defaultValue="1226 University Dr" />
            </Field>
            <Field label="ZIP code" htmlFor="sg-zip">
              <Input id="sg-zip" defaultValue="94025" />
            </Field>
          </SectionFields>
        </Section>

        <Section title="Open, with a counter" count={[2, 4]}>
          <SectionFields>
            <Fact label="Room types">Single, Double</Fact>
            <Fact label="Bathroom">Shared, one per floor</Fact>
            <Fact label="Walk to campus">6 minutes</Fact>
            <Fact label="Laundry">In the basement</Fact>
          </SectionFields>
        </Section>

        <Section step={2} title="A revealed block">
          <label
            htmlFor="sg-reveal"
            className="flex cursor-pointer items-center gap-2.5 text-small text-ink-700"
          >
            <Checkbox
              id="sg-reveal"
              checked={revealed}
              onCheckedChange={(checked) => setRevealed(checked === true)}
            />
            Show me the field this reveals
          </label>
          <Reveal open={revealed}>
            <div className="pt-2">
              <Well>
                <p className="text-small text-ink-600">
                  Born directly below the control that revealed it, through `grid-template-rows`
                  rather than `height`. Nothing above the trigger moves.
                </p>
              </Well>
            </div>
          </Reveal>
        </Section>
      </Sections>
    </div>
  );
}

function MotionDemo() {
  return (
    <Sections>
      <Section title="The scale" collapsible={false}>
        <div className="grid grid-cols-4 gap-3 compact:grid-cols-2">
          {[
            ["--duration-quick", "240ms", "a chevron, a colour"],
            ["--duration-base", "400ms", "a Section opening, the entry beat"],
            ["--duration-slow", "640ms", "a card arriving"],
            ["--duration-stage", "1000ms", "progress, the long ones"],
          ].map(([token, value, use]) => (
            <div key={token} className="text-small">
              <p className="font-mono text-ink-700">{token}</p>
              <p className="text-ink-900 numeric">{value}</p>
              <p className="text-micro text-ink-400">{use}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3 compact:grid-cols-2">
          {["--ease-out-soft", "--ease-out-expo", "--ease-overshoot", "--ease-in-out-soft"].map(
            (token) => (
              <p key={token} className="font-mono text-small text-ink-700">
                {token}
              </p>
            ),
          )}
        </div>
      </Section>
    </Sections>
  );
}

/**
 * The identity, on the three grounds it has to survive.
 *
 * Worth drawing rather than listing, because the whole reason four colourings
 * exist is that each one fails on somebody else's ground — and that is only
 * ever obvious side by side.
 */
const GROUNDS = [
  { name: "Light", tone: "ink", className: "bg-white border-ink-100" },
  { name: "Dark neutral", tone: "on-dark", className: "bg-ink-900 border-transparent" },
  { name: "Brand", tone: "knockout", className: "brand-gradient border-transparent" },
] as const;

function IdentitySheet() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 compact:grid-cols-1">
        {GROUNDS.map((ground) => (
          <div key={ground.name} className="space-y-1.5">
            <div
              className={cn(
                "flex flex-col items-start justify-center gap-3 rounded-[var(--radius-card)] border p-4",
                ground.className,
              )}
            >
              <Wordmark tone={ground.tone} tagline />
              <Wordmark tone={ground.tone} className="h-3.5" />
            </div>
            <p className="text-micro text-ink-500">
              {ground.name} · <code>tone=&quot;{ground.tone}&quot;</code>
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-5 rounded-[var(--radius-card)] border border-ink-100 bg-white p-4">
        <div className="space-y-1.5">
          <AudentraMark className="h-8" />
          <p className="text-micro text-ink-500">Symbol</p>
        </div>
        <div className="space-y-1.5">
          <AudentraMark tone="mono" className="h-8 text-ink-900/25" />
          <p className="text-micro text-ink-500">
            Symbol · <code>tone=&quot;mono&quot;</code>
          </p>
        </div>
        <div className="space-y-1.5">
          <Wordmark tone="mono" className="h-4 text-violet-500" />
          <p className="text-micro text-ink-500">
            Lockup · <code>tone=&quot;mono&quot;</code>
          </p>
        </div>
      </div>
    </div>
  );
}

function GroundDemo() {
  return (
    <div className="space-y-3 rounded-[var(--radius-card)] bg-ground p-4">
      <SectionLabel description="1. A label for the group below it, which cannot live inside the thing it names.">
        Section label
      </SectionLabel>

      <OnGround reason="catalogue" as="section">
        <p className="mb-1.5 text-micro text-ink-500">
          2. A catalogue that is the screen. Framing it puts a white box on a grey page containing
          white cards.
        </p>
        <ul className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((index) => (
            <FlatCard as="li" key={index} className="p-2.5">
              <p className="text-small text-ink-700">Catalogue item</p>
            </FlatCard>
          ))}
        </ul>
      </OnGround>

      <OnGround reason="checkout-asymmetry" as="section" className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <p className="text-micro text-ink-500">
            3. The checkout, where only the summary is framed. Framing both halves would erase the
            emphasis that makes the summary the summary.
          </p>
        </div>
        <Sections>
          <Section title="Deposit" collapsible={false}>
            <p className="text-body font-strong text-ink-900 numeric">$500 due today</p>
          </Section>
        </Sections>
      </OnGround>
    </div>
  );
}

function StateDemo() {
  const [selected, setSelected] = React.useState(1);

  return (
    <div className="space-y-3">
      <Well label="Selection is fill and a check, never elevation">
        <ul className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((index) => (
            <FlatCard
              as="li"
              key={index}
              selected={selected === index}
              interactive
              className="cursor-pointer p-2.5"
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

      <div className="flex flex-wrap items-center gap-4">
        <span className="rounded-[var(--radius-field)] bg-panel px-2.5 py-1.5 text-small ring-glow">
          Ring glow
        </span>
        <span className="rounded-[var(--radius-field)] bg-panel px-2.5 py-1.5 text-small ring-glow-mint">
          Ring glow, done
        </span>
        <IconTile size="lg">
          <SparkleIcon weight="fill" aria-hidden className="size-5" />
        </IconTile>
        <span className="text-small text-ink-500">Icon tile, 12% brand, never behind text</span>
      </div>

      <Well label="Row hover nudges its own content, it does not lift the row">
        <ul>
          {["First row", "Second row", "Third row"].map((label) => (
            <li
              key={label}
              className="row-nudge rounded-[var(--radius-field)] px-2.5 py-1.5 hover:bg-ink-50"
            >
              <span className="text-small text-ink-700">{label}</span>
            </li>
          ))}
        </ul>
      </Well>
    </div>
  );
}

function ViewerDemo() {
  const viewer = useImageViewer();
  const sample = residences.slice(0, 4).flatMap((residence) =>
    residence.photos.map((photo) => ({
      ...photo,
      label: residence.name,
      category: residence.name,
    })),
  );

  return (
    <ul className="grid grid-cols-6 gap-1.5 compact:grid-cols-3">
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
