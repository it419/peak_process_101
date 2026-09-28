"use client";

// Canopy shares the careers light/dark preference with Organic: one saved
// choice (and one no-flash script in app/layout.tsx) drives both designs.
export {
  setOrganicTheme as setCanopyTheme,
  useOrganicTheme as useCanopyTheme,
  type OrganicTheme as CanopyTheme,
} from "./organicTheme";
