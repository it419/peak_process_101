import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CanopyFormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  first?: boolean;
}

/** A titled group of fields inside a step's white work panel; sections after
 *  the first are separated by a hairline rule. */
export function CanopyFormSection({ title, description, children, className, first }: CanopyFormSectionProps) {
  return (
    <section className={cn(!first && "mt-6 border-t border-canopy-border pt-6", className)}>
      <div className="mb-4">
        <h2 className="font-canopy-display text-[1.1875rem] leading-snug font-semibold text-canopy-ink">{title}</h2>
        {description && <p className="mt-0.5 text-[0.8125rem] text-canopy-ink-muted">{description}</p>}
      </div>
      <div className="grid grid-cols-1 gap-x-3.5 gap-y-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}
