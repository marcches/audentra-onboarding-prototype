import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { CelebrationProvider } from "@/components/celebration";
import { ImageViewerProvider } from "@/components/image-viewer";
import { AreaScreen, RequirementScreen } from "@/routes/area";
import { CampusLifeRoute } from "@/routes/campus-life";
import { CompletionRoute } from "@/routes/completion";
import { DashboardRoute } from "@/routes/dashboard";
import { DepositRoute } from "@/routes/deposit";
import { EntryRoute } from "@/routes/entry";
import { HealthRoute } from "@/routes/health";
import { HousingRoute } from "@/routes/housing";

import { OfferRoute } from "@/routes/offer";
import { ReviewRoute } from "@/routes/review";
import { StyleGuideRoute } from "@/routes/style-guide";
import { WhoWeCallRoute } from "@/routes/who-we-call";
import { WhoYouAreRoute } from "@/routes/who-you-are";

/**
 * Code-based routing on purpose: no generated route tree to keep in sync, so
 * `tsc --noEmit` is meaningful on a clean checkout without a build step first.
 * Every onboarding step is its own URL, so a preview link can point straight at
 * the screen under review.
 */
/**
 * The celebration layer is mounted here rather than under `/onboarding`,
 * because Enrolled lives outside it and the arrival is one of the twelve
 * moments. One layer for the whole app is also the only way "there is exactly
 * one `<canvas>`" can be true — a provider per section would mint one each.
 */
const rootRoute = createRootRoute({
  component: () => (
    <CelebrationProvider>
      <Outlet />
    </CelebrationProvider>
  ),
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
  /* A row at every width: the Rail takes itself out of the flow in `compact`,
     so there is no direction to switch and no component asking how wide the
     window is. The shell's own column carries the recessed ground. */
  component: () => (
    /* The viewer wraps the whole of `/onboarding` so any photograph in the
       flow can open it, and so the page behind it stays mounted while it is
       open — a viewer that unmounted its own trigger could not return focus
       to it. */
    <ImageViewerProvider>
      <div className="flex min-h-dvh bg-canvas">
        <Outlet />
      </div>
    </ImageViewerProvider>
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

/**
 * The address is a Section inside `Who you are` now (ADR 0011), so this path
 * has no screen. It redirects rather than 404ing, using the same `beforeLoad`
 * the index routes use: the Review summary's edit links were written against
 * it, a student may have bookmarked it, and landing on a 404 in the middle of
 * an enrolment flow is the worst possible answer to "where did my address go".
 */
const whereYouLiveRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "where-you-live",
  beforeLoad: () => {
    throw redirect({ to: "/onboarding/who-you-are" });
  },
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

/**
 * The portal, beside the gate rather than inside it.
 *
 * A separate branch of the tree because it is a separate shell: its own
 * navigation, its own Balance role and its own Presence table (ADR 0014).
 * Nothing under `/onboarding` changes, and nothing here reaches into it —
 * except to read, which is what the carried-over Requirements do.
 */
const portalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/portal",
  component: () => (
    <div className="flex min-h-dvh bg-canvas">
      <Outlet />
    </div>
  ),
});

const portalIndexRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/portal/dashboard" });
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "dashboard",
  component: DashboardRoute,
});

/**
 * The seven Areas this cycle did not build, plus My Enrollment, each on its own
 * URL and each rendering the one shared placeholder.
 *
 * Declared from `areas.ts` by hand rather than generated from it, because
 * `createRoute` wants a literal path to type against — but the labels and the
 * sentences come from the data module, so a wrong string here is a 404 rather
 * than a screen that quietly disagrees with the sidebar.
 */
const areaRoutes = (
  [
    "enrollment",
    "classrooms",
    "campus-life",
    "financials",
    "documents",
    "appointments",
    "messages",
    "profile",
  ] as const
).map((id) =>
  createRoute({
    getParentRoute: () => portalRoute,
    path: id,
    component: () => <AreaScreen id={id} />,
  }),
);

/**
 * Where a Quest card's primary action lands when the work is not the gate's.
 * A card with an action that goes nowhere is the dead item this cycle removed
 * from the sidebar, one level in.
 */
const requirementRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: "enrollment/$requirement",
  component: RequirementScreen,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  entryRoute,
  styleGuideRoute,
  completionRoute,
  portalRoute.addChildren([portalIndexRoute, dashboardRoute, requirementRoute, ...areaRoutes]),
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
