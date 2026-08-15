import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { ImageViewerProvider } from "@/components/image-viewer";
import { PointsAwardProvider } from "@/components/points-award";
import { CampusLifeRoute } from "@/routes/campus-life";
import { CompletionRoute } from "@/routes/completion";
import { DepositRoute } from "@/routes/deposit";
import { EntryRoute } from "@/routes/entry";
import { HealthRoute } from "@/routes/health";
import { HousingRoute } from "@/routes/housing";

import { OfferRoute } from "@/routes/offer";
import { ReviewRoute } from "@/routes/review";
import { StyleGuideRoute } from "@/routes/style-guide";
import { WhereYouLiveRoute } from "@/routes/where-you-live";
import { WhoWeCallRoute } from "@/routes/who-we-call";
import { WhoYouAreRoute } from "@/routes/who-you-are";

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
     direction to switch. The shell's own column carries the recessed ground.
     The award provider wraps the whole of `/onboarding` rather than the step:
     a Point is earned by the click that also navigates, and a provider inside
     the step would be unmounted by that navigation halfway through the flight
     it was animating. */
  component: () => (
    <PointsAwardProvider>
      {/* The viewer wraps the whole of `/onboarding` so any photograph in the
          flow can open it, and so the page behind it stays mounted while it is
          open — a viewer that unmounted its own trigger could not return focus
          to it. */}
      <ImageViewerProvider>
        <div className="flex min-h-dvh bg-canvas">
          <Outlet />
        </div>
      </ImageViewerProvider>
    </PointsAwardProvider>
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

const whoYouAreRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "who-you-are",
  component: WhoYouAreRoute,
});

const whereYouLiveRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "where-you-live",
  component: WhereYouLiveRoute,
});

const whoWeCallRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "who-we-call",
  component: WhoWeCallRoute,
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
 * Enrolled sits outside `/onboarding` because it is a `celebration`: it has no
 * rail and no action bar, and nesting it under the step layout would give it
 * both. It *is* in `steps.ts` — the rail should show the destination — but it
 * is reached rather than worked through.
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
    whoYouAreRoute,
    healthRoute,
    whereYouLiveRoute,
    whoWeCallRoute,
    housingRoute,
    campusLifeRoute,
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
