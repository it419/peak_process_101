"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { useJobFormLogic } from "@/hooks/recruitment/useJobFormLogic";
import {
  EMPLOYMENT_TYPE_OPTIONS,
  JOB_STATUS_OPTIONS,
  WORK_MODE_OPTIONS,
  employmentTypeLabel,
  workModeLabel,
} from "@/lib/recruitment/constants";
import { cn } from "@/lib/utils/cn";
import { CanopyTextField } from "@/components/design/canopy/ui/CanopyTextField";
import { CanopyTextareaField } from "@/components/design/canopy/ui/CanopyTextareaField";
import { CanopyButton, canopyButtonVariants } from "@/components/design/canopy/ui/CanopyButton";
import { JobSelectFieldCanopy } from "@/components/design/canopy/recruitment/ui/JobSelectFieldCanopy";
import {
  AdminPageHeading,
  TeamPill,
  adminPanelClass,
} from "@/components/design/canopy/recruitment/AdminShellCanopy";
import type { JobDetail } from "@/types/recruitment";

/* ------------------------------------------------------------------ */
/* Form building blocks                                               */
/* ------------------------------------------------------------------ */

/** Numbered section header: forest circle + serif heading (Canopy apply/new-job pattern). */
function SectionHeading({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="inline-flex size-6.5 shrink-0 items-center justify-center rounded-full bg-canopy-forest text-xs font-bold text-white"
        aria-hidden
      >
        {n}
      </span>
      <h2 className="font-canopy-display text-xl font-semibold text-canopy-ink">{children}</h2>
    </div>
  );
}

/** A <select> restyled as a segmented control: same registered field, now radios. */
function SegmentedRadio({
  legend,
  required,
  options,
  error,
  registration,
}: {
  legend: string;
  required?: boolean;
  options: readonly { value: string; label: string }[];
  error?: string;
  registration: UseFormRegisterReturn;
}) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-1.5">
      <legend className="mb-1.5 text-[0.8125rem] font-medium text-canopy-ink-muted">
        {legend}
        {required && <span className="ml-1 text-canopy-accent-text">*</span>}
      </legend>
      <div
        className={cn(
          "flex max-w-full gap-1 self-start overflow-x-auto rounded-canopy-card bg-canopy-surface-2 p-1",
          error && "ring-1 ring-canopy-error",
        )}
      >
        {options.map((opt) => (
          <label key={opt.value} className="relative cursor-pointer">
            <input type="radio" value={opt.value} className="peer sr-only" {...registration} />
            <span className="block rounded-[8px] px-3.5 py-1.5 text-[0.8125rem] font-semibold whitespace-nowrap text-canopy-ink-muted transition-colors peer-checked:bg-canopy-card peer-checked:text-canopy-ink peer-checked:shadow-canopy-rest peer-hover:text-canopy-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-canopy-accent">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
      <p
        className={cn("min-h-4.25 text-[0.8125rem] leading-snug", error ? "text-canopy-error" : "text-canopy-ink-faint")}
        role={error ? "alert" : undefined}
      >
        {error || " "}
      </p>
    </fieldset>
  );
}

/** The salary checkbox, drawn as a switch. */
function SwitchField({ label, registration }: { label: string; registration: UseFormRegisterReturn }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 self-start">
      <span className="relative inline-flex shrink-0">
        <input type="checkbox" role="switch" className="peer sr-only" {...registration} />
        <span
          className="h-6 w-10 rounded-full bg-canopy-border-strong transition-colors peer-checked:bg-canopy-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-canopy-accent motion-reduce:transition-none"
          aria-hidden
        />
        <span
          className="absolute top-0.5 left-0.5 size-5 rounded-full bg-canopy-card shadow-canopy-rest transition-transform peer-checked:translate-x-4 motion-reduce:transition-none"
          aria-hidden
        />
      </span>
      <span className="text-sm text-canopy-ink">{label}</span>
    </label>
  );
}

interface SkillChipInputProps {
  label: string;
  skills: string[];
  onAdd: (skill: string) => void;
  onRemove: (index: number) => void;
}

function SkillChipInput({ label, skills, onAdd, onRemove }: SkillChipInputProps) {
  const [value, setValue] = useState("");

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onAdd(value);
      setValue("");
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.8125rem] font-medium text-canopy-ink-muted">{label}</label>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 rounded-canopy-pill bg-canopy-surface px-2.5 py-1 text-[0.8125rem] font-semibold text-canopy-accent-text"
            >
              {skill}
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${skill}`}
                className="rounded-full text-canopy-ink-muted hover:text-canopy-error focus-visible:outline-2 focus-visible:outline-canopy-accent"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a skill and press Enter"
        className="h-11 rounded-canopy-control border border-canopy-border-strong bg-canopy-card px-3.5 text-[0.9375rem] text-canopy-ink outline-none placeholder:text-canopy-ink-faint hover:border-canopy-ink-muted focus:border-canopy-accent focus:ring-3 focus:ring-canopy-accent/20"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Careers-site preview (read from the live form values)              */
/* ------------------------------------------------------------------ */

interface PreviewValues {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  workMode: string;
  experienceMinYears: string;
  experienceMaxYears: string;
  salaryMin: string;
  salaryMax: string;
  salaryPublic: boolean;
  status: string;
}

function previewFromJob(job?: JobDetail): PreviewValues {
  const s = (v: number | string | null | undefined) => (v == null ? "" : String(v));
  return {
    title: job?.title ?? "",
    department: job?.department ?? "",
    location: job?.location ?? "",
    employmentType: job?.employmentType ?? "full_time",
    workMode: job?.workMode ?? "onsite",
    experienceMinYears: s(job?.experienceMinYears),
    experienceMaxYears: s(job?.experienceMaxYears),
    salaryMin: s(job?.salaryMin),
    salaryMax: s(job?.salaryMax),
    salaryPublic: job?.salaryPublic ?? false,
    status: job?.status ?? "draft",
  };
}

function previewFromForm(form: HTMLFormElement): PreviewValues {
  const data = new FormData(form);
  const str = (key: string) => String(data.get(key) ?? "").trim();
  return {
    title: str("title"),
    department: str("department"),
    location: str("location"),
    employmentType: str("employmentType"),
    workMode: str("workMode"),
    experienceMinYears: str("experienceMinYears"),
    experienceMaxYears: str("experienceMaxYears"),
    salaryMin: str("salaryMin"),
    salaryMax: str("salaryMax"),
    salaryPublic: data.has("salaryPublic"),
    status: str("status"),
  };
}

function range(min: string, max: string, fmt: (n: number) => string, unit = ""): string | null {
  const lo = min === "" ? null : Number(min);
  const hi = max === "" ? null : Number(max);
  if ((lo == null || Number.isNaN(lo)) && (hi == null || Number.isNaN(hi))) return null;
  if (lo != null && hi != null && !Number.isNaN(lo) && !Number.isNaN(hi)) return `${fmt(lo)}–${fmt(hi)}${unit}`;
  if (lo != null && !Number.isNaN(lo)) return `${fmt(lo)}+${unit}`;
  return `Up to ${fmt(hi as number)}${unit}`;
}

function CareersPreview({ values }: { values: PreviewValues }) {
  const experience = range(values.experienceMinYears, values.experienceMaxYears, String, " yrs");
  const salary = values.salaryPublic
    ? range(values.salaryMin, values.salaryMax, (n) => `₹${n.toLocaleString("en-IN")}`)
    : null;
  const top = [experience, values.workMode && workModeLabel(values.workMode)].filter(Boolean).join(" · ");
  const bottom = [values.location, values.employmentType && employmentTypeLabel(values.employmentType), salary]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={cn(adminPanelClass, "px-5 py-5 sm:px-6")} aria-live="polite">
      <p className="canopy-type-eyebrow text-canopy-accent-text">Preview on careers site</p>
      <div className="mt-3 flex items-start justify-between gap-3 border-t border-canopy-border pt-3">
        <div className="min-w-0">
          <p className={cn("text-[0.9375rem] font-bold", values.title ? "text-canopy-ink" : "text-canopy-ink-faint")}>
            {values.title || "Job title"}
          </p>
          {top && <p className="mt-0.5 text-[0.8125rem] text-canopy-ink-muted">{top}</p>}
        </div>
        {values.department && <TeamPill>{values.department}</TeamPill>}
      </div>
      {bottom && <p className="mt-1.5 text-[0.8125rem] text-canopy-ink-muted">{bottom}</p>}
    </div>
  );
}

const STATUS_HINT: Record<string, string> = {
  draft: "Draft jobs are only visible to HR. Publish to show it on the careers site.",
  published: "Published jobs show on the careers site until the application deadline passes.",
  closed: "Closed jobs are hidden from the careers site.",
};

/* ------------------------------------------------------------------ */
/* Form                                                               */
/* ------------------------------------------------------------------ */

interface AdminJobFormCanopyProps {
  mode: "create" | "edit";
  jobId?: string;
  initialJob?: JobDetail;
}

interface JobFormCanopyProps extends AdminJobFormCanopyProps {
  /** Page heading overrides (the job detail page titles the form with the job). */
  title?: ReactNode;
  lead?: ReactNode;
  /** Extra panel at the top of the right column (the job detail page's status card). */
  aside?: ReactNode;
}

/** The form itself, with optional heading/aside slots for the job detail page. */
export function JobFormCanopy({ mode, jobId, initialJob, title, lead, aside }: JobFormCanopyProps) {
  const { register, errors, isSubmitting, submitError, onContinue, requiredSkills, preferredSkills, addSkill, removeSkill } =
    useJobFormLogic({ mode, jobId, initialJob });
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<PreviewValues>(() => previewFromJob(initialJob));

  const cancelHref = mode === "edit" && jobId ? `/admin/jobs/${jobId}` : "/admin/jobs";

  // Presentation only: mirror the current field values into the preview card.
  function syncPreview() {
    if (formRef.current) setPreview(previewFromForm(formRef.current));
  }

  return (
    <form ref={formRef} onSubmit={onContinue} onChange={syncPreview}>
      <AdminPageHeading
        title={title ?? (mode === "create" ? "Post a new job" : "Edit job")}
        lead={
          lead ??
          (mode === "create"
            ? "Fill in the role details. You can save a draft and publish later."
            : "Update the role details, then save your changes.")
        }
      />

      <div className="mt-5 grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className={cn(adminPanelClass, "flex flex-col gap-3 px-4 py-5.5 sm:px-6")}>
          <SectionHeading n={1}>Role basics</SectionHeading>
          <CanopyTextField label="Job title" required error={errors.title?.message} {...register("title")} />
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 xl:grid-cols-3">
            <CanopyTextField label="Department" error={errors.department?.message} {...register("department")} />
            <CanopyTextField label="Location" error={errors.location?.message} {...register("location")} />
            <JobSelectFieldCanopy
              label="Employment type"
              required
              options={EMPLOYMENT_TYPE_OPTIONS}
              defaultValue={initialJob?.employmentType ?? "full_time"}
              error={errors.employmentType?.message}
              {...register("employmentType")}
            />
          </div>

          <div className="mt-2">
            <SectionHeading n={2}>Work &amp; pay</SectionHeading>
          </div>
          <SegmentedRadio
            legend="Work mode"
            required
            options={WORK_MODE_OPTIONS}
            error={errors.workMode?.message}
            registration={register("workMode")}
          />
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <CanopyTextField
              label="Minimum experience (years)"
              type="number"
              min={0}
              className="canopy-mono"
              error={errors.experienceMinYears?.message}
              {...register("experienceMinYears")}
            />
            <CanopyTextField
              label="Maximum experience (years)"
              type="number"
              min={0}
              className="canopy-mono"
              error={errors.experienceMaxYears?.message}
              {...register("experienceMaxYears")}
            />
            <CanopyTextField
              label="Minimum salary"
              type="number"
              min={0}
              className="canopy-mono"
              error={errors.salaryMin?.message}
              {...register("salaryMin")}
            />
            <CanopyTextField
              label="Maximum salary"
              type="number"
              min={0}
              className="canopy-mono"
              error={errors.salaryMax?.message}
              {...register("salaryMax")}
            />
          </div>
          <SwitchField label="Show salary range on the public job posting" registration={register("salaryPublic")} />

          <div className="mt-5">
            <SectionHeading n={3}>Description</SectionHeading>
          </div>
          <CanopyTextareaField
            label="Overview"
            rows={4}
            helperText="A short summary shown near the top of the job page."
            error={errors.overview?.message}
            {...register("overview")}
          />
          <CanopyTextareaField
            label="Responsibilities"
            rows={5}
            helperText="One per line — shown as a bullet list."
            error={errors.responsibilities?.message}
            {...register("responsibilities")}
          />
          <CanopyTextareaField
            label="Requirements"
            rows={5}
            helperText="One per line — shown as a bullet list."
            error={errors.requirements?.message}
            {...register("requirements")}
          />
          <CanopyTextareaField
            label="Benefits"
            rows={4}
            helperText="One per line — shown as a bullet list."
            error={errors.benefits?.message}
            {...register("benefits")}
          />

          <div className="mt-2">
            <SectionHeading n={4}>Skills &amp; education</SectionHeading>
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
            <SkillChipInput
              label="Required skills"
              skills={requiredSkills}
              onAdd={(s) => addSkill("requiredSkills", s)}
              onRemove={(i) => removeSkill("requiredSkills", i)}
            />
            <SkillChipInput
              label="Preferred skills"
              skills={preferredSkills}
              onAdd={(s) => addSkill("preferredSkills", s)}
              onRemove={(i) => removeSkill("preferredSkills", i)}
            />
          </div>
          <CanopyTextField
            label="Education"
            placeholder="e.g. Bachelor's in Computer Science"
            error={errors.education?.message}
            {...register("education")}
          />
        </div>

        <aside className="flex flex-col gap-3.5 lg:sticky lg:top-6">
          {aside}

          <section className="flex flex-col gap-3 rounded-canopy-card bg-canopy-surface px-5 py-5.5 sm:px-6">
            <h2 className="font-canopy-display text-[1.1875rem] font-semibold text-canopy-ink">Publishing</h2>
            <SegmentedRadio
              legend="Status"
              required
              options={JOB_STATUS_OPTIONS}
              error={errors.status?.message}
              registration={register("status")}
            />
            <CanopyTextField
              label="Application deadline"
              type="date"
              className="canopy-mono"
              error={errors.deadline?.message}
              {...register("deadline")}
            />
            {STATUS_HINT[preview.status] && (
              <p className="-mt-1 text-[0.8125rem] leading-snug text-canopy-ink-muted">{STATUS_HINT[preview.status]}</p>
            )}

            {submitError && (
              <p className="text-sm text-canopy-error" role="alert">
                {submitError}
              </p>
            )}

            <div className="mt-1 flex flex-wrap items-center gap-2.5">
              <CanopyButton type="submit" isLoading={isSubmitting}>
                {mode === "create" ? "Create job" : "Save changes"}
              </CanopyButton>
              <Link href={cancelHref} className={canopyButtonVariants({ variant: "secondary" })}>
                Cancel
              </Link>
            </div>
          </section>

          <CareersPreview values={preview} />
        </aside>
      </div>
    </form>
  );
}

export function AdminJobFormCanopy({ mode, jobId, initialJob }: AdminJobFormCanopyProps) {
  return <JobFormCanopy mode={mode} jobId={jobId} initialJob={initialJob} />;
}
