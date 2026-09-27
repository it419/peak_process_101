import Link from "next/link";
import { Check } from "lucide-react";
import { OrganicCareersFrame } from "@/components/design/organic/recruitment/OrganicCareersFrame";
import { careersContainer } from "@/components/design/organic/recruitment/careersUi";
import { organicButtonVariants } from "@/components/design/organic/ui/OrganicButton";
import { CurveDivider } from "@/components/design/organic/CurveDivider";

export function ApplicationConfirmationOrganic({ jobTitle, reference }: { jobTitle: string; reference: string }) {
  return (
    <OrganicCareersFrame>
      <div className="bg-organic-surface">
        <div className={`${careersContainer} flex flex-col items-center pt-16 pb-12 text-center sm:pt-24 sm:pb-16`}>
          <span className="flex size-14 items-center justify-center rounded-full bg-organic-success-tint text-organic-success">
            <Check className="size-7" strokeWidth={2.5} aria-hidden />
          </span>
          <p className="organic-type-eyebrow mt-8 text-organic-accent-text">Application received</p>
          <h1 className="organic-type-title mt-3 max-w-2xl text-organic-ink">Thank you for applying for {jobTitle}.</h1>
        </div>
      </div>
      <CurveDivider fill="var(--color-organic-surface)" className="-mt-px h-8 sm:h-12 md:h-16" />

      <main className={`${careersContainer} flex flex-col items-center pt-10 pb-24 text-center sm:pt-14`}>
        <p className="organic-type-body max-w-lg text-organic-ink-muted">
          Your application has been successfully submitted. Our recruitment team will review your application and
          contact you if there are further steps.
        </p>
        {reference && (
          <div className="mt-8 rounded-organic-control border border-organic-border bg-organic-card px-5 py-3 shadow-organic-rest">
            <p className="organic-type-eyebrow text-organic-ink-faint">Application reference</p>
            <p className="mt-1 font-mono text-[0.9375rem] tracking-wide text-organic-ink">{reference}</p>
          </div>
        )}
        <Link href="/jobs" className={`${organicButtonVariants({ variant: "primary" })} mt-10`}>
          Browse more positions
        </Link>
      </main>
    </OrganicCareersFrame>
  );
}
