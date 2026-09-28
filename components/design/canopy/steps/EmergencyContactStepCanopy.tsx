"use client";

import { useEmergencyContactStepLogic } from "@/hooks/steps/useEmergencyContactStepLogic";
import { CanopyTextField } from "../ui/CanopyTextField";
import { CanopyTextareaField } from "../ui/CanopyTextareaField";
import { CanopyCheckbox } from "../ui/CanopyCheckbox";
import { CanopyStepShell } from "../CanopyStepShell";
import { CanopyFormSection } from "../CanopyFormSection";

export function EmergencyContactStepCanopy() {
  const { register, errors, isSubmitting, onContinue, sameAsHomeAddress, homeAddress } =
    useEmergencyContactStepLogic();

  return (
    <CanopyStepShell
      stepId="emergencyContact"
      title="Emergency Contact"
      onContinue={onContinue}
      isSubmitting={isSubmitting}
    >
      <CanopyFormSection title="Contact details" first>
        <CanopyTextField label="Full name" required error={errors.name?.message} {...register("name")} />
        <CanopyTextField
          label="Relationship"
          placeholder="e.g. Spouse, Parent, Sibling"
          required
          error={errors.relationship?.message}
          {...register("relationship")}
        />
        <CanopyTextField
          label="Primary phone"
          type="tel"
          required
          error={errors.primaryPhone?.message}
          {...register("primaryPhone")}
        />
        <CanopyTextField
          label="Secondary phone"
          type="tel"
          helperText="Optional"
          error={errors.secondaryPhone?.message}
          {...register("secondaryPhone")}
        />
      </CanopyFormSection>

      <CanopyFormSection title="Address">
        <div className="flex flex-col gap-4 sm:col-span-2">
          <CanopyCheckbox label="Same as my home address" {...register("sameAsHomeAddress")} />
          {sameAsHomeAddress ? (
            homeAddress ? (
              <p className="rounded-xl border border-canopy-border bg-canopy-card px-4 py-3 text-sm text-canopy-ink-muted">
                {homeAddress}
              </p>
            ) : (
              <p className="text-sm text-canopy-ink-faint">Add your home address in Personal Information first.</p>
            )
          ) : (
            <CanopyTextareaField
              label="Address"
              required
              placeholder="Street, City, State, PIN"
              error={errors.address?.message}
              {...register("address")}
            />
          )}
        </div>
      </CanopyFormSection>
    </CanopyStepShell>
  );
}
