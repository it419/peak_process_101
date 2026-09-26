import { cva } from "class-variance-authority";

export const organicFieldInputVariants = cva(
  "w-full rounded-organic-control border bg-organic-card px-4 text-[0.9375rem] text-organic-ink placeholder:text-organic-ink-faint transition-colors duration-150 outline-none disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      hasError: {
        true: "border-organic-error focus:border-organic-error focus:ring-3 focus:ring-organic-error/20",
        false: "border-organic-border-strong hover:border-organic-ink-muted focus:border-organic-accent focus:ring-3 focus:ring-organic-accent/20",
      },
    },
    defaultVariants: { hasError: false },
  },
);

export const organicFieldHeightClass = "h-12";
