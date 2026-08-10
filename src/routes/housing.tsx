import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BuildingApartmentIcon,
  CarIcon,
  HouseLineIcon,
  QuestionIcon,
  UsersThreeIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import type * as React from "react";

import { Notice } from "@/components/notice";
import { OptionCard } from "@/components/option-card";
import { StepActions, StepShell } from "@/components/step-shell";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  type HousingIntent,
  housingIntents,
  institution,
  protectionOptions,
  residences,
} from "@/lib/fixtures";
import { patch, useOnboarding } from "@/lib/store";

const INTENT_ICONS: Record<HousingIntent, React.ReactNode> = {
  "on-campus": <BuildingApartmentIcon weight="duotone" className="size-5 text-violet-500" />,
  "off-campus": <HouseLineIcon weight="duotone" className="size-5 text-violet-500" />,
  "not-sure": <QuestionIcon weight="duotone" className="size-5 text-violet-500" />,
  commuting: <CarIcon weight="duotone" className="size-5 text-violet-500" />,
  "family-housing": <UsersThreeIcon weight="duotone" className="size-5 text-violet-500" />,
};

/**
 * Housing, reduced.
 *
 * The live step stacks four blocks of questions — room type, bathroom,
 * roommate matching, a lifestyle questionnaire, themed communities — behind the
 * single "on campus" answer. None of that is here. On campus asks one thing;
 * off campus asks one thing; the other three answers ask nothing at all.
 */
export function HousingRoute() {
  const state = useOnboarding();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const intent = state.housing.intent;

  return (
    <StepShell
      current="housing"
      title="Where you'll live"
      lead="One question, and then at most one more. Nothing here is an assignment — it tells Housing what to plan for."
    >
      <fieldset className="space-y-4">
        <legend className="text-h3 mb-3 text-ink-900">
          Where do you picture starting your day?
        </legend>
        <RadioGroup
          value={intent ?? ""}
          onValueChange={(value) => patch("housing", { intent: value as HousingIntent })}
        >
          {housingIntents.map((option) => (
            <OptionCard
              key={option.value}
              value={option.value}
              id={`housing-${option.value}`}
              label={option.label}
              hint={option.hint}
              icon={INTENT_ICONS[option.value]}
            />
          ))}
        </RadioGroup>
      </fieldset>

      {/* Enter-only, no AnimatePresence: changing the key swaps the branch on
          the same frame as the answer. An exit animation here just puts a
          delay between "I picked off campus" and seeing what that means. */}
      {intent ? (
        <motion.section
          key={intent}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5"
        >
          {intent === "on-campus" ? <ResidenceRanking /> : null}
          {intent === "off-campus" ? <ProtectionQuestion /> : null}
          {intent !== "on-campus" && intent !== "off-campus" ? (
            <NothingElse intent={intent} />
          ) : null}
        </motion.section>
      ) : null}

      <StepActions>
        <Button
          type="button"
          size="lg"
          disabled={!intent}
          onClick={() => {
            patch("housing", { submitted: true });
            navigate({ to: "/onboarding/campus-life" });
          }}
        >
          Next: campus life
          <ArrowRightIcon weight="bold" aria-hidden className="size-4" />
        </Button>
      </StepActions>
    </StepShell>
  );
}

/**
 * Rank by tapping, not by dragging.
 *
 * Every ranking pattern Mobbin returned for this was a drag-handle reorder
 * list. Drag is the wrong bet here: a good share of this audience is on a
 * phone, and a drag list is the control that fails hardest on touch and with a
 * keyboard. Tap-to-add plus move up/down does the same job and works
 * everywhere.
 */
function ResidenceRanking() {
  const state = useOnboarding();
  const ranking = state.housing.residenceRanking;
  const ranked = ranking
    .map((id) => residences.find((residence) => residence.id === id))
    .filter((residence): residence is (typeof residences)[number] => Boolean(residence));
  const unranked = residences.filter((residence) => !ranking.includes(residence.id));

  function setRanking(next: string[]) {
    patch("housing", { residenceRanking: next });
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...ranking];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const moved = next[index];
    const displaced = next[target];
    if (moved === undefined || displaced === undefined) return;
    next[index] = displaced;
    next[target] = moved;
    setRanking(next);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-h3 text-ink-900">Rank up to three residences</h2>
        <p className="text-body text-ink-600">
          First choice at the top. Housing considers this, it doesn't guarantee it — rooms are
          assigned after the deadline.
        </p>
      </div>

      {ranked.length > 0 ? (
        <ol className="space-y-2.5">
          {ranked.map((residence, index) => (
            <li
              key={residence.id}
              className="flex items-start gap-3.5 rounded-[var(--radius-card)] border border-violet-500 bg-violet-50/50 p-4 shadow-[0_0_0_1px_var(--color-violet-500)]"
            >
              <span className="brand-gradient flex size-7 shrink-0 items-center justify-center rounded-full text-small font-bold text-white">
                {index + 1}
              </span>
              <span className="flex-1">
                <span className="block text-body font-bold text-ink-900">{residence.name}</span>
                <span className="block text-small text-ink-500">{residence.detail}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1">
                <IconAction
                  label={`Move ${residence.name} up`}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUpIcon weight="bold" aria-hidden className="size-4" />
                </IconAction>
                <IconAction
                  label={`Move ${residence.name} down`}
                  disabled={index === ranked.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDownIcon weight="bold" aria-hidden className="size-4" />
                </IconAction>
                <IconAction
                  label={`Remove ${residence.name} from your ranking`}
                  onClick={() => setRanking(ranking.filter((id) => id !== residence.id))}
                >
                  <XIcon weight="bold" aria-hidden className="size-4" />
                </IconAction>
              </span>
            </li>
          ))}
        </ol>
      ) : null}

      {unranked.length > 0 ? (
        <div className="space-y-2.5">
          {ranked.length > 0 ? <p className="field-label">Also available</p> : null}
          {unranked.map((residence) => (
            <button
              key={residence.id}
              type="button"
              onClick={() => setRanking([...ranking, residence.id])}
              className="flex w-full items-start gap-3.5 rounded-[var(--radius-card)] border border-ink-200 bg-surface p-4 text-left transition-[border-color,box-shadow] hover:border-ink-300 hover:shadow-soft"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-dashed border-ink-300 text-small font-bold text-ink-400">
                +
              </span>
              <span className="flex-1">
                <span className="block text-body font-bold text-ink-900">{residence.name}</span>
                <span className="block text-small text-ink-500">{residence.blurb}</span>
                <span className="mt-1 block text-small text-ink-400">{residence.detail}</span>
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {ranked.length === 0 ? (
        <p className="text-small text-ink-500">
          Skip it if you'd rather. {institution.housingOffice} will place you and tell you where.
        </p>
      ) : null}
    </div>
  );
}

function ProtectionQuestion() {
  const state = useOnboarding();

  return (
    <fieldset className="space-y-4">
      <legend className="text-h3 mb-1 text-ink-900">
        Want to look at tuition or housing protection?
      </legend>
      <p className="mb-3 text-body text-ink-600">
        Optional cover that refunds part of what you've paid if you have to withdraw mid-term.
        Saying yes here just means someone sends you the details.
      </p>
      <RadioGroup
        value={state.housing.protectionInterest}
        onValueChange={(value) => patch("housing", { protectionInterest: value })}
      >
        {protectionOptions.map((option) => (
          <OptionCard
            key={option.value}
            value={option.value}
            id={`protection-${option.value}`}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </fieldset>
  );
}

function NothingElse({ intent }: { intent: HousingIntent }) {
  const copy: Partial<Record<HousingIntent, string>> = {
    "not-sure":
      "Fine. Confirm housing plans lands on your enrollment checklist and you can settle it later.",
    commuting:
      "Nothing else needed here. Parking and commuter details come from Student Life closer to the term.",
    "family-housing": `Nothing else needed here. ${institution.housingOffice} will contact you about family and dependent options.`,
  };

  return (
    <Notice tone="success" title="That's everything for this step">
      {copy[intent]}
    </Notice>
  );
}

function IconAction({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex size-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-surface hover:text-ink-900 disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}
