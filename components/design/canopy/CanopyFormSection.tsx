import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CanopyFormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  first?: boolean;
}

export function CanopyFormSection({ title, description, children, className, first }: CanopyFormSectionProps) {
  return (
    <section className={cn(!first && "mt-9 border-t border-canopy-border pt-9", className)}>
      <div className="mb-5">
        <h3 className="font-canopy-display text-lg font-semibold text-canopy-ink">{title}</h3>
        {description && <p className="mt-1 text-sm text-canopy-ink-muted">{description}</p>}
      </div>
      <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}
