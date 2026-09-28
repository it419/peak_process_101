import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const canopyButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-canopy-control whitespace-nowrap font-semibold transition-[color,background-color,border-color,scale] duration-150 ease-out outline-none active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canopy-accent disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-canopy-accent text-canopy-on-accent hover:bg-canopy-accent-hover",
        secondary:
          "border border-canopy-border-strong bg-canopy-card text-canopy-ink hover:border-canopy-accent hover:text-canopy-accent-text",
        ghost: "h-auto rounded-none px-0 text-canopy-accent-text underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 text-sm",
        sm: "h-9 px-4 text-[0.8125rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

interface CanopyButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof canopyButtonVariants> {
  isLoading?: boolean;
  showArrow?: boolean;
}

export const CanopyButton = forwardRef<HTMLButtonElement, CanopyButtonProps>(function CanopyButton(
  { className, variant, size, isLoading, showArrow, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(canopyButtonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
      {!isLoading && showArrow && <ArrowRight className="size-4" aria-hidden />}
    </button>
  );
});
