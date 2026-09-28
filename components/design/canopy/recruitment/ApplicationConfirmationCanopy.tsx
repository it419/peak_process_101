import Link from "next/link";
import { Check } from "lucide-react";
import { CanopyCareersFrame } from "@/components/design/canopy/recruitment/CanopyCareersFrame";
import { NAV_BACK, careersContainer } from "@/components/design/canopy/recruitment/careersUi";
import { canopyButtonVariants } from "@/components/design/canopy/ui/CanopyButton";
import { CurveDivider } from "@/components/design/canopy/CurveDivider";

export function ApplicationConfirmationCanopy({ jobTitle, reference }: { jobTitle: string; reference: string }) {
  return (
    <CanopyCareersFrame>
      <div className="bg-canopy-surface">
        <div className={`${careersContainer} flex flex-col items-center pt-16 pb-12 text-center sm:pt-24 sm:pb-16`}>
          <span className="flex size-14 items-center justify-center rounded-full bg-canopy-success-tint text-canopy-success">
            <Check className="size-7" strokeWidth={2.5} aria-hidden />
          </span>
          <p className="canopy-type-eyebrow mt-8 text-canopy-accent-text">Application received</p>
          <h1 className="canopy-type-title mt-3 max-w-2xl text-canopy-ink">Thank you for applying for {jobTitle}.</h1>
        </div>
      </div>
      <CurveDivider fill="var(--color-canopy-surface)" className="-mt-px h-8 sm:h-12 md:h-16" />

      <main className={`${careersContainer} flex flex-col items-center pt-10 pb-24 text-center sm:pt-14`}>
        <p className="canopy-type-body max-w-lg text-canopy-ink-muted">
          Your application has been successfully submitted. Our recruitment team will review your application and
          contact you if there are further steps.
        </p>
        {reference && (
          <div className="mt-8 rounded-canopy-control border border-canopy-border bg-canopy-card px-5 py-3 shadow-canopy-rest">
            <p className="canopy-type-eyebrow text-canopy-ink-faint">Application reference</p>
            <p className="mt-1 font-mono text-[0.9375rem] tracking-wide text-canopy-ink">{reference}</p>
          </div>
        )}
        <Link href="/jobs" transitionTypes={NAV_BACK} className={`${canopyButtonVariants({ variant: "primary" })} mt-10`}>
          Browse more positions
        </Link>
      </main>
    </CanopyCareersFrame>
  );
}
