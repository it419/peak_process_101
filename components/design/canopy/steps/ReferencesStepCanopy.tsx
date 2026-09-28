"use client";

import { useReferencesStepLogic } from "@/hooks/steps/useReferencesStepLogic";
import { CanopyTextField } from "../ui/CanopyTextField";
import { CanopyStepShell } from "../CanopyStepShell";
import { CanopyFormSection } from "../CanopyFormSection";

export function ReferencesStepCanopy() {
  const { register, errors, isSubmitting, onContinue } = useReferencesStepLogic();

  return (
    <CanopyStepShell
      stepId="references"
      title="Professional References"
      description="Two people who can speak to your work — a former manager or senior colleague works best."
      onContinue={onContinue}
      isSubmitting={isSubmitting}
    >
      <CanopyFormSection title="Reference 1" first>
        <CanopyTextField
          label="Full name"
          required
          error={errors.primaryReference?.name?.message}
          {...register("primaryReference.name")}
        />
        <CanopyTextField
          label="Relationship"
          placeholder="e.g. Former manager"
          required
          error={errors.primaryReference?.relationship?.message}
          {...register("primaryReference.relationship")}
        />
        <CanopyTextField
          label="Company"
          required
          error={errors.primaryReference?.company?.message}
          {...register("primaryReference.company")}
        />
        <CanopyTextField
          label="Email"
          type="email"
          required
          error={errors.primaryReference?.email?.message}
          {...register("primaryReference.email")}
        />
        <CanopyTextField
          label="Phone number"
          type="tel"
          required
          error={errors.primaryReference?.phone?.message}
          {...register("primaryReference.phone")}
        />
      </CanopyFormSection>

      <CanopyFormSection title="Reference 2">
        <CanopyTextField
          label="Full name"
          required
          error={errors.secondaryReference?.name?.message}
          {...register("secondaryReference.name")}
        />
        <CanopyTextField
          label="Relationship"
          placeholder="e.g. Senior colleague"
          required
          error={errors.secondaryReference?.relationship?.message}
          {...register("secondaryReference.relationship")}
        />
        <CanopyTextField
          label="Company"
          required
          error={errors.secondaryReference?.company?.message}
          {...register("secondaryReference.company")}
        />
        <CanopyTextField
          label="Email"
          type="email"
          required
          error={errors.secondaryReference?.email?.message}
          {...register("secondaryReference.email")}
        />
        <CanopyTextField
          label="Phone number"
          type="tel"
          required
          error={errors.secondaryReference?.phone?.message}
          {...register("secondaryReference.phone")}
        />
      </CanopyFormSection>
    </CanopyStepShell>
  );
}
