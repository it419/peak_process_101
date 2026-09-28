"use client";

import type { ReactNode } from "react";
import { Upload } from "lucide-react";
import { useJobApplicationFormLogic } from "@/hooks/recruitment/useJobApplicationFormLogic";
import { EDUCATION_OPTIONS } from "@/lib/recruitment/constants";
import { CanopyCareersFrame } from "@/components/design/canopy/recruitment/CanopyCareersFrame";
import {
  BackLink,
  CareersHero,
  JobSummaryCard,
  careersContainer,
  formatSalary,
} from "@/components/design/canopy/recruitment/careersUi";
import { CanopyTextField } from "@/components/design/canopy/ui/CanopyTextField";
import { CanopyTextareaField } from "@/components/design/canopy/ui/CanopyTextareaField";
import { CanopySelectField } from "@/components/design/canopy/ui/CanopySelectField";
import { CanopyButton, canopyButtonVariants } from "@/components/design/canopy/ui/CanopyButton";
import { CurveDivider } from "@/components/design/canopy/CurveDivider";
import { formatBytes } from "@/lib/utils/formatBytes";
import type { PublicJobDetail } from "@/types/recruitment";

function FormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="py-10 first:pt-0 last:pb-0">
      <h2 className="canopy-type-heading text-canopy-ink">{title}</h2>
      <p className="canopy-type-meta mt-1 font-normal text-canopy-ink-muted">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Upload control styled as the shared secondary button so it matches every other button. */
const uploadButtonClass = `${canopyButtonVariants({ variant: "secondary" })} h-auto min-h-12 w-fit max-w-full cursor-pointer py-3 text-left whitespace-normal focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-canopy-accent`;

export function JobApplicationFormCanopy({ job }: { job: PublicJobDetail }) {
  const {
    register,
    errors,
    isSubmitting,
    submitError,
    resumeFile,
    setResumeFile,
    resumeError,
    otherFile,
    setOtherFile,
    onContinue,
  } = useJobApplicationFormLogic(job.id);

  const salary = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <CanopyCareersFrame>
      <CareersHero>
        <BackLink href={`/jobs/${job.id}`}>Back to {job.title}</BackLink>
        <p className="canopy-type-eyebrow mt-8 text-canopy-accent-text">Application</p>
        <h1 className="canopy-type-title mt-3 max-w-4xl text-canopy-ink">Apply for {job.title}</h1>
        <p className="canopy-type-lead mt-5 max-w-xl text-canopy-ink-muted">
          Tell us a bit about yourself — it only takes a few minutes.
        </p>
      </CareersHero>
      <CurveDivider fill="var(--color-canopy-surface)" className="-mt-px h-8 sm:h-12 md:h-16" />

      <main className={`${careersContainer} pt-10 pb-20 sm:pt-14 sm:pb-28`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-16">
          <form
            onSubmit={onContinue}
            className="min-w-0 rounded-canopy-card border border-canopy-border bg-canopy-card p-6 shadow-canopy-rest sm:p-10"
          >
            <div className="flex flex-col divide-y divide-canopy-border">
              <FormSection title="Your details" description="How we can reach you, and a little about your background.">
                <div className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
                  <CanopyTextField label="First name" required autoComplete="given-name" error={errors.firstName?.message} {...register("firstName")} />
                  <CanopyTextField label="Last name" required autoComplete="family-name" error={errors.lastName?.message} {...register("lastName")} />
                  <CanopyTextField label="Email" type="email" required autoComplete="email" error={errors.email?.message} {...register("email")} />
                  <CanopyTextField label="Phone number" type="tel" required autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
                  <CanopyTextField label="Current location" required error={errors.location?.message} {...register("location")} />
                  <CanopyTextField
                    label="Years of experience"
                    type="number"
                    min={0}
                    required
                    error={errors.experienceYears?.message}
                    {...register("experienceYears")}
                  />
                  <div className="sm:col-span-2">
                    <CanopySelectField
                      label="Highest education"
                      required
                      options={[...EDUCATION_OPTIONS]}
                      error={errors.education?.message}
                      {...register("education")}
                    />
                  </div>
                </div>
              </FormSection>

              <FormSection title="Resume & links" description="PDF or Word for your resume. Everything else is optional.">
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-[0.8125rem] font-medium text-canopy-ink-muted">
                      Resume <span className="text-canopy-accent-text">*</span>
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <label className={uploadButtonClass}>
                        <Upload className="size-4" aria-hidden />
                        {resumeFile ? "Replace file" : "Upload resume"}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="sr-only"
                          onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                        />
                      </label>
                      {resumeFile && (
                        <p className="canopy-type-meta font-normal text-canopy-ink-muted">
                          {resumeFile.name} · {formatBytes(resumeFile.size)}
                        </p>
                      )}
                    </div>
                    <p className="mt-1.5 min-h-4.25 text-[0.8125rem] text-canopy-error" role={resumeError ? "alert" : undefined}>
                      {resumeError || " "}
                    </p>
                  </div>

                  <CanopyTextareaField label="Cover letter" rows={5} helperText="Optional" error={errors.coverLetter?.message} {...register("coverLetter")} />
                  <div className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
                    <CanopyTextField
                      label="LinkedIn profile"
                      type="url"
                      placeholder="https://linkedin.com/in/you"
                      helperText="Optional"
                      error={errors.linkedinUrl?.message}
                      {...register("linkedinUrl")}
                    />
                    <CanopyTextField
                      label="Portfolio / Website"
                      type="url"
                      placeholder="https://…"
                      helperText="Optional"
                      error={errors.portfolioUrl?.message}
                      {...register("portfolioUrl")}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <label className={uploadButtonClass}>
                      <Upload className="size-4" aria-hidden />
                      {otherFile ? "Replace additional file" : "Attach additional document (optional)"}
                      <input type="file" className="sr-only" onChange={(e) => setOtherFile(e.target.files?.[0] ?? null)} />
                    </label>
                    {otherFile && (
                      <p className="canopy-type-meta font-normal text-canopy-ink-muted">
                        {otherFile.name} · {formatBytes(otherFile.size)}
                      </p>
                    )}
                  </div>
                </div>
              </FormSection>

              <div className="flex flex-col gap-4 pt-10">
                {submitError && (
                  <p className="canopy-type-meta rounded-canopy-control bg-canopy-error-tint px-4 py-3 text-canopy-error" role="alert">
                    {submitError}
                  </p>
                )}
                <CanopyButton type="submit" isLoading={isSubmitting} className="w-full sm:w-auto sm:self-start">
                  Submit application
                </CanopyButton>
              </div>
            </div>
          </form>

          <aside className="lg:sticky lg:top-10">
            <JobSummaryCard eyebrow="Applying for" job={job} salary={salary} />
          </aside>
        </div>
      </main>
    </CanopyCareersFrame>
  );
}
