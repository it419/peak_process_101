"use client";

import { usePersonalInfoStepLogic } from "@/hooks/steps/usePersonalInfoStepLogic";
import { genderOptions } from "@/lib/schemas/shared";
import { CanopyTextField } from "../ui/CanopyTextField";
import { CanopySelectField } from "../ui/CanopySelectField";
import { CanopyTextareaField } from "../ui/CanopyTextareaField";
import { CanopyMaskedField } from "../ui/CanopyMaskedField";
import { CanopyStepShell } from "../CanopyStepShell";
import { CanopyFormSection } from "../CanopyFormSection";

export function PersonalInfoStepCanopy() {
  const { register, control, errors, isSubmitting, onContinue } = usePersonalInfoStepLogic();

  return (
    <CanopyStepShell
      stepId="personalInfo"
      title="Personal Information"
      description="Let’s get your information in place."
      onContinue={onContinue}
      isSubmitting={isSubmitting}
    >
      <CanopyFormSection title="Basic information" first>
        <CanopyTextField
          label="First name"
          required
          autoComplete="given-name"
          error={errors.basicInfo?.firstName?.message}
          {...register("basicInfo.firstName")}
        />
        <CanopyTextField
          label="Last name"
          required
          autoComplete="family-name"
          error={errors.basicInfo?.lastName?.message}
          {...register("basicInfo.lastName")}
        />
        <CanopyTextField
          label="Date of birth"
          type="date"
          required
          error={errors.basicInfo?.dateOfBirth?.message}
          {...register("basicInfo.dateOfBirth")}
        />
        <CanopySelectField
          label="Gender"
          options={[...genderOptions]}
          error={errors.basicInfo?.gender?.message}
          {...register("basicInfo.gender")}
        />
      </CanopyFormSection>

      <CanopyFormSection title="Contact information">
        <CanopyTextField
          label="Personal email"
          type="email"
          required
          placeholder="you@email.com"
          autoComplete="email"
          error={errors.contactInfo?.personalEmail?.message}
          {...register("contactInfo.personalEmail")}
        />
        <CanopyTextField
          label="Phone number"
          type="tel"
          required
          placeholder="+91 98765 43210"
          autoComplete="tel"
          error={errors.contactInfo?.phone?.message}
          {...register("contactInfo.phone")}
        />
      </CanopyFormSection>

      <CanopyFormSection title="Address">
        <div className="sm:col-span-2">
          <CanopyTextareaField
            label="Home address"
            required
            placeholder="Street, City, State, PIN"
            error={errors.address?.homeAddress?.message}
            {...register("address.homeAddress")}
          />
        </div>
      </CanopyFormSection>

      <CanopyFormSection
        title="Government information"
        description="Your information is encrypted and accessible only to authorized HR personnel."
      >
        <CanopyMaskedField
          control={control}
          name="governmentIds.aadhaar"
          label="Aadhaar number"
          required
          fullLength={12}
          placeholder="XXXX XXXX XXXX"
          error={errors.governmentIds?.aadhaar?.message}
        />
        <CanopyTextField
          label="PAN number"
          required
          placeholder="ABCDE1234F"
          className="uppercase"
          error={errors.governmentIds?.pan?.message}
          {...register("governmentIds.pan", { setValueAs: (v: string) => (v ?? "").toUpperCase() })}
        />
        <div className="max-w-55 sm:col-span-2">
          <CanopyTextField
            label="UAN number"
            placeholder="12-digit UAN"
            helperText="Leave blank if this is your first job."
            error={errors.governmentIds?.uan?.message}
            {...register("governmentIds.uan")}
          />
        </div>
      </CanopyFormSection>
    </CanopyStepShell>
  );
}
