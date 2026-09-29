import { cva } from "class-variance-authority";

export const canopyFieldInputVariants = cva(
  "w-full rounded-canopy-control border bg-canopy-card px-3.5 text-[0.9375rem] text-canopy-ink placeholder:text-canopy-ink-faint transition-colors duration-150 outline-none disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      hasError: {
        true: "border-canopy-error focus:border-canopy-error focus:ring-3 focus:ring-canopy-error/20",
        false: "border-canopy-border-strong hover:border-canopy-ink-muted focus:border-canopy-accent focus:ring-3 focus:ring-canopy-accent/20",
      },
    },
    defaultVariants: { hasError: false },
  },
);

export const canopyFieldHeightClass = "h-11";
