import { forwardRef, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CanopyCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

/** Circular rather than square — a small, deliberate echo of the curve motif
 *  that distinguishes Canopy's controls from the other two designs. */
export const CanopyCheckbox = forwardRef<HTMLInputElement, CanopyCheckboxProps>(function CanopyCheckbox(
  { label, className, id, name, ...props },
  ref,
) {
  const inputId = id ?? name;
  return (
    <label htmlFor={inputId} className={cn("flex cursor-pointer items-start gap-2.5", className)}>
      <span className="relative mt-0.5 flex size-5 shrink-0">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          name={name}
          className="peer size-full cursor-pointer appearance-none rounded-full border border-canopy-ink-faint bg-canopy-card transition-colors checked:border-canopy-accent checked:bg-canopy-accent focus-visible:outline-2 focus-visible:outline-canopy-accent focus-visible:outline-offset-2"
          {...props}
        />
        <Check
          className="pointer-events-none absolute inset-0 m-auto size-3 text-canopy-on-accent opacity-0 transition-opacity peer-checked:opacity-100"
          strokeWidth={3}
          aria-hidden
        />
      </span>
      <span className="text-sm leading-snug text-canopy-ink">{label}</span>
    </label>
  );
});
