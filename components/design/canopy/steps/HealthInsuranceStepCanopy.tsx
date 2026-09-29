"use client";

import { Plus, Trash2 } from "lucide-react";
import { useHealthInsuranceStepLogic } from "@/hooks/steps/useHealthInsuranceStepLogic";
import { coverageTypeOptions } from "@/lib/schemas/healthInsurance.schema";
import { CanopyTextField } from "../ui/CanopyTextField";
import { CanopySelectField } from "../ui/CanopySelectField";
import { CanopyButton } from "../ui/CanopyButton";
import { CanopyStepShell } from "../CanopyStepShell";
import { CanopyFormSection } from "../CanopyFormSection";

export function HealthInsuranceStepCanopy() {
  const { register, errors, isSubmitting, onContinue, fields, append, remove, coverageType, path } =
    useHealthInsuranceStepLogic();

  return (
    <CanopyStepShell stepId="healthInsurance" title="Health Insurance" onContinue={onContinue} isSubmitting={isSubmitting}>
      <CanopyFormSection title="Coverage" first>
        <div className="max-w-sm sm:col-span-2">
          <CanopySelectField
            label="Coverage type"
            required
            options={[...coverageTypeOptions]}
            error={errors.coverageType?.message}
            {...register("coverageType")}
          />
        </div>
      </CanopyFormSection>

      {coverageType && coverageType !== "self" && (
        <CanopyFormSection title="Dependents" description="Add each spouse or child covered under your plan.">
          <div className="flex flex-col gap-5 sm:col-span-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-4 rounded-2xl border border-canopy-border p-4 sm:grid-cols-3"
              >
                <CanopyTextField
                  label="Name"
                  required
                  error={errors.dependents?.[index]?.name?.message}
                  {...register(path(`dependents.${index}.name`))}
                />
                <CanopyTextField
                  label="Relationship"
                  placeholder="e.g. Spouse"
                  required
                  error={errors.dependents?.[index]?.relationship?.message}
                  {...register(path(`dependents.${index}.relationship`))}
                />
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <CanopyTextField
                      label="Date of birth"
                      type="date"
                      required
                      error={errors.dependents?.[index]?.dateOfBirth?.message}
                      {...register(path(`dependents.${index}.dateOfBirth`))}
                    />
                  </div>
                  <CanopyButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => remove(index)}
                    aria-label="Remove dependent"
                  >
                    <Trash2 className="size-4" />
                  </CanopyButton>
                </div>
              </div>
            ))}
            <CanopyButton
              type="button"
              variant="secondary"
              size="sm"
              className="self-start"
              onClick={() => append({ name: "", relationship: "", dateOfBirth: "" })}
            >
              <Plus className="size-4" /> Add dependent
            </CanopyButton>
          </div>
        </CanopyFormSection>
      )}

      <CanopyFormSection title="Nominee" description="Who should receive the benefit in an emergency.">
        <CanopyTextField
          label="Nominee name"
          required
          error={errors.nomineeName?.message}
          {...register("nomineeName")}
        />
        <CanopyTextField
          label="Relationship to nominee"
          required
          error={errors.nomineeRelationship?.message}
          {...register("nomineeRelationship")}
        />
      </CanopyFormSection>
    </CanopyStepShell>
  );
}
