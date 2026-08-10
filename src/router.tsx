import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";

import { AboutYouRoute } from "@/routes/about-you";
import { EntryRoute } from "@/routes/entry";
import { HousingRoute } from "@/routes/housing";
import { OfferRoute } from "@/routes/offer";
import { StyleGuideRoute } from "@/routes/style-guide";
import { UnchangedStepRoute } from "@/routes/unchanged-step";

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

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: () => (
    <div className="flex min-h-dvh flex-col lg:flex-row">
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

const aboutYouRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "about-you",
  component: AboutYouRoute,
});

const housingRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "housing",
  component: HousingRoute,
});

const campusLifeRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "campus-life",
  component: () => <UnchangedStepRoute id="campus-life" />,
});

const reviewRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "review",
  component: () => <UnchangedStepRoute id="review" />,
});

const depositRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: "deposit",
  component: () => <UnchangedStepRoute id="deposit" />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  entryRoute,
  styleGuideRoute,
  onboardingRoute.addChildren([
    onboardingIndexRoute,
    offerRoute,
    aboutYouRoute,
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
