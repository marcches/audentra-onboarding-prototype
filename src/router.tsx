import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { CampusLifeRoute } from "@/routes/campus-life";
import { CompletionRoute } from "@/routes/completion";
import { DepositRoute } from "@/routes/deposit";
import { EntryRoute } from "@/routes/entry";
import { HealthRoute } from "@/routes/health";
import { HousingRoute } from "@/routes/housing";
import { IdentityContactRoute } from "@/routes/identity-contact";
import { OfferRoute } from "@/routes/offer";
import { ReviewRoute } from "@/routes/review";
import { StyleGuideRoute } from "@/routes/style-guide";

/**
 * Code-based routing on purpose: no generated route tree to keep in sync, so
 * `tsc --noEmit` is meaningful on a clean checkout without a build step first.
 * Every onboarding step is its own URL, so a preview link can point straight at
 * the screen under review.
 */
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/entry" });
  },
});

const entryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/entry",
  component: EntryRoute,
});

const styleGuideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/style-guide",
  component: StyleGuideRoute,
});

/**
 * `?from=review` marks a step opened from the Review & sign summary, so the
 * step can offer a way back to it. Declared on the parent so every step
 * inherits it — without a `validateSearch` the param is stripped and the
 * summary's "brings you back here" is a promise nothing keeps.
 */
const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  validateSearch: (search: Record<string, unknown>): { from?: "review" } => ({
    from: search.from === "review" ? "review" : undefined,
  }),
  /* Row at every width: the rail hides itself below `lg`, so there is no
     direction to switch. The shell's own column carries the recessed ground. */
  component: () => (
    <div className="flex min-h-dvh bg-canvas">
      <Outlet />
    </div>
  ),
});

const onboardingIndexRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/onboarding/offer" });
  },
});

const offerRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "offer",
  component: OfferRoute,
});

const identityContactRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "identity-contact",
  component: IdentityContactRoute,
});

const housingRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "housing",
  component: HousingRoute,
});

const campusLifeRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "campus-life",
  component: CampusLifeRoute,
});

const healthRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "health",
  component: HealthRoute,
});

const reviewRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "review",
  component: ReviewRoute,
});

const depositRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "deposit",
  component: DepositRoute,
});

/**
 * The arrival screen sits outside `/onboarding` because it is not a step: it
 * has no rail, no counter and no place in `steps.ts`, and nesting it under the
 * step layout would give it all three.
 */
const completionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/done",
  component: CompletionRoute,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  entryRoute,
  styleGuideRoute,
  completionRoute,
  onboardingRoute.addChildren([
    onboardingIndexRoute,
    offerRoute,
    identityContactRoute,
    housingRoute,
    campusLifeRoute,
    healthRoute,
    reviewRoute,
    depositRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
