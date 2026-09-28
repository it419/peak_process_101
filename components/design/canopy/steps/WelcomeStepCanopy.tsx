"use client";

import { useWelcomeStepLogic } from "@/hooks/steps/useWelcomeStepLogic";
import { CanopyTextField } from "../ui/CanopyTextField";
import { CanopyStepShell } from "../CanopyStepShell";

const READY_LIST = [
  "Your Aadhaar and PAN numbers, plus your UAN if you’ve worked before",
  "A photo or scan of a government ID and an address proof",
  "Contact details for two professional references",
  "Your emergency contact’s name and phone number",
];

export function WelcomeStepCanopy() {
  const { register, errors, isSubmitting, firstName, onContinue } = useWelcomeStepLogic();

  return (
    <CanopyStepShell
      stepId="welcome"
      title={
        <>
          Welcome aboard, <span className="text-canopy-accent-text italic">{firstName || "new hire"}</span>.
        </>
      }
      description="This portal will guide you through every step of your onboarding — personal details, benefits, and required documents. It should take about 10–15 minutes."
      onContinue={onContinue}
      continueLabel="Begin"
      isSubmitting={isSubmitting}
      hideBack
    >
      <div>
        <h3 className="font-canopy-display text-base font-semibold text-canopy-ink">Before you begin</h3>
        <p className="mt-1 text-sm text-canopy-ink-muted">Have a few things on hand:</p>
        <ul className="mt-4 space-y-2.5 text-[0.9375rem] leading-relaxed text-canopy-ink-muted">
          {READY_LIST.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-canopy-accent" aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 max-w-sm border-t border-canopy-border pt-8">
          <CanopyTextField
            label="Your full name"
            required
            placeholder="e.g. Priya Sharma"
            autoComplete="name"
            autoFocus
            error={errors.fullName?.message}
            {...register("fullName")}
          />
        </div>
      </div>
    </CanopyStepShell>
  );
}
