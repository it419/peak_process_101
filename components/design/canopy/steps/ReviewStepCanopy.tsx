"use client";

import { CircleAlert } from "lucide-react";
import { useReviewStepLogic } from "@/hooks/steps/useReviewStepLogic";
import { CanopyReviewSection } from "../CanopyReviewSection";
import { CanopyCheckbox } from "../ui/CanopyCheckbox";
import { CanopyStepShell } from "../CanopyStepShell";

export function ReviewStepCanopy() {
  const {
    statuses,
    reviewSteps,
    allOtherComplete,
    summaries,
    confirmed,
    setConfirmed,
    submitError,
    isSubmitting,
    onSubmit,
  } = useReviewStepLogic();

  return (
    <CanopyStepShell
      stepId="review"
      title="Review & Submit"
      description="Please review your information carefully before submitting. Once submitted, you’ll need to contact HR to make further changes."
      onContinue={onSubmit}
      continueLabel="Submit onboarding"
      continueDisabled={!confirmed || !allOtherComplete}
      isSubmitting={isSubmitting}
    >
      <div>
        {reviewSteps.map((step) => (
          <CanopyReviewSection
            key={step.id}
            title={step.label}
            status={statuses[step.id]}
            href={`/onboarding/${step.slug}`}
            summary={summaries[step.id]}
          />
        ))}
      </div>

      {!allOtherComplete && (
        <p className="mt-5 flex items-center gap-2 text-sm text-canopy-error">
          <CircleAlert className="size-4 shrink-0" /> Finish the sections above before submitting.
        </p>
      )}

      {submitError && (
        <p className="mt-5 flex items-center gap-2 text-sm text-canopy-error">
          <CircleAlert className="size-4 shrink-0" /> {submitError}
        </p>
      )}

      <div className="mt-8 rounded-2xl border border-canopy-accent/30 bg-canopy-card p-4">
        <CanopyCheckbox
          label="I confirm the information provided is accurate to the best of my knowledge."
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />
      </div>
    </CanopyStepShell>
  );
}
