import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const organicButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-organic-pill whitespace-nowrap font-medium transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-organic-accent disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-organic-accent text-organic-on-accent hover:bg-organic-accent-hover",
        secondary:
          "border border-organic-border-strong bg-transparent text-organic-ink hover:border-organic-accent hover:text-organic-accent-text",
        ghost: "h-auto rounded-none px-0 text-organic-accent-text underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 text-sm",
        sm: "h-9 px-4 text-[0.8125rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

interface OrganicButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof organicButtonVariants> {
  isLoading?: boolean;
  showArrow?: boolean;
}

export const OrganicButton = forwardRef<HTMLButtonElement, OrganicButtonProps>(function OrganicButton(
  { className, variant, size, isLoading, showArrow, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(organicButtonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
      {!isLoading && showArrow && <ArrowRight className="size-4" aria-hidden />}
    </button>
  );
});
