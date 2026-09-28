import Link from "next/link";
import { Check } from "lucide-react";
import { CanopyCareersFrame } from "@/components/design/canopy/recruitment/CanopyCareersFrame";
import { CareersBand, NAV_BACK, careersContainer, panelClass } from "@/components/design/canopy/recruitment/careersUi";
import { canopyButtonVariants } from "@/components/design/canopy/ui/CanopyButton";

export function ApplicationConfirmationCanopy({ jobTitle, reference }: { jobTitle: string; reference: string }) {
  return (
    <CanopyCareersFrame>
      <CareersBand className="flex flex-col items-center py-10 text-center sm:py-12">
        <span className="flex size-12 items-center justify-center rounded-full bg-canopy-forest text-canopy-forest-gold">
          <Check className="size-6" strokeWidth={2.5} aria-hidden />
        </span>
        <p className="canopy-type-eyebrow mt-6 text-canopy-accent-text">Application received</p>
        <h1 className="mt-2 max-w-2xl font-canopy-display text-[clamp(1.875rem,1.5rem+1.4vw,2.375rem)] leading-tight font-semibold tracking-[-0.015em] text-balance text-canopy-ink">
          Thank you for applying for {jobTitle}.
        </h1>
        <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-canopy-ink-muted">
          Your application has been successfully submitted. Our recruitment team will review your application and
          contact you if there are further steps.
        </p>
      </CareersBand>

      <main className={`${careersContainer} flex flex-col items-center pt-8 pb-20 text-center`}>
        {reference && (
          <div className={`${panelClass} px-6 py-4`}>
            <p className="canopy-type-eyebrow text-canopy-ink-muted">Application reference</p>
            <p className="mt-1 canopy-mono text-base tracking-wide text-canopy-ink">{reference}</p>
          </div>
        )}
        <Link href="/jobs" transitionTypes={NAV_BACK} className={`${canopyButtonVariants({ variant: "primary" })} mt-8`}>
          Browse more positions
        </Link>
      </main>
    </CanopyCareersFrame>
  );
}
