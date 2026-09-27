"use client";

import type { ReactNode } from "react";
import { Upload } from "lucide-react";
import { useJobApplicationFormLogic } from "@/hooks/recruitment/useJobApplicationFormLogic";
import { EDUCATION_OPTIONS } from "@/lib/recruitment/constants";
import { OrganicCareersFrame } from "@/components/design/organic/recruitment/OrganicCareersFrame";
import {
  BackLink,
  CareersHero,
  JobSummaryCard,
  careersContainer,
  formatSalary,
} from "@/components/design/organic/recruitment/careersUi";
import { OrganicTextField } from "@/components/design/organic/ui/OrganicTextField";
import { OrganicTextareaField } from "@/components/design/organic/ui/OrganicTextareaField";
import { OrganicSelectField } from "@/components/design/organic/ui/OrganicSelectField";
import { OrganicButton, organicButtonVariants } from "@/components/design/organic/ui/OrganicButton";
import { CurveDivider } from "@/components/design/organic/CurveDivider";
import { formatBytes } from "@/lib/utils/formatBytes";
import type { PublicJobDetail } from "@/types/recruitment";

function FormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="py-10 first:pt-0 last:pb-0">
      <h2 className="organic-type-heading text-organic-ink">{title}</h2>
      <p className="organic-type-meta mt-1 font-normal text-organic-ink-muted">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Upload control styled as the shared secondary button so it matches every other button. */
const uploadButtonClass = `${organicButtonVariants({ variant: "secondary" })} h-auto min-h-12 w-fit max-w-full cursor-pointer py-3 text-left whitespace-normal focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-organic-accent`;

export function JobApplicationFormOrganic({ job }: { job: PublicJobDetail }) {
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
    <OrganicCareersFrame>
      <CareersHero>
        <BackLink href={`/jobs/${job.id}`}>Back to {job.title}</BackLink>
        <p className="organic-type-eyebrow mt-8 text-organic-accent-text">Application</p>
        <h1 className="organic-type-title mt-3 max-w-4xl text-organic-ink">Apply for {job.title}</h1>
        <p className="organic-type-lead mt-5 max-w-xl text-organic-ink-muted">
          Tell us a bit about yourself — it only takes a few minutes.
        </p>
      </CareersHero>
      <CurveDivider fill="var(--color-organic-surface)" className="-mt-px h-8 sm:h-12 md:h-16" />

      <main className={`${careersContainer} pt-10 pb-20 sm:pt-14 sm:pb-28`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-16">
          <form
            onSubmit={onContinue}
            className="min-w-0 rounded-organic-card border border-organic-border bg-organic-card p-6 shadow-organic-rest sm:p-10"
          >
            <div className="flex flex-col divide-y divide-organic-border">
              <FormSection title="Your details" description="How we can reach you, and a little about your background.">
                <div className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
                  <OrganicTextField label="First name" required autoComplete="given-name" error={errors.firstName?.message} {...register("firstName")} />
                  <OrganicTextField label="Last name" required autoComplete="family-name" error={errors.lastName?.message} {...register("lastName")} />
                  <OrganicTextField label="Email" type="email" required autoComplete="email" error={errors.email?.message} {...register("email")} />
                  <OrganicTextField label="Phone number" type="tel" required autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
                  <OrganicTextField label="Current location" required error={errors.location?.message} {...register("location")} />
                  <OrganicTextField
                    label="Years of experience"
                    type="number"
                    min={0}
                    required
                    error={errors.experienceYears?.message}
                    {...register("experienceYears")}
                  />
                  <div className="sm:col-span-2">
                    <OrganicSelectField
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
                    <p className="text-[0.8125rem] font-medium text-organic-ink-muted">
                      Resume <span className="text-organic-accent-text">*</span>
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
                        <p className="organic-type-meta font-normal text-organic-ink-muted">
                          {resumeFile.name} · {formatBytes(resumeFile.size)}
                        </p>
                      )}
                    </div>
                    <p className="mt-1.5 min-h-4.25 text-[0.8125rem] text-organic-error" role={resumeError ? "alert" : undefined}>
                      {resumeError || " "}
                    </p>
                  </div>

                  <OrganicTextareaField label="Cover letter" rows={5} helperText="Optional" error={errors.coverLetter?.message} {...register("coverLetter")} />
                  <div className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
                    <OrganicTextField
                      label="LinkedIn profile"
                      type="url"
                      placeholder="https://linkedin.com/in/you"
                      helperText="Optional"
                      error={errors.linkedinUrl?.message}
                      {...register("linkedinUrl")}
                    />
                    <OrganicTextField
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
                      <p className="organic-type-meta font-normal text-organic-ink-muted">
                        {otherFile.name} · {formatBytes(otherFile.size)}
                      </p>
                    )}
                  </div>
                </div>
              </FormSection>

              <div className="flex flex-col gap-4 pt-10">
                {submitError && (
                  <p className="organic-type-meta rounded-organic-control bg-organic-error-tint px-4 py-3 text-organic-error" role="alert">
                    {submitError}
                  </p>
                )}
                <OrganicButton type="submit" isLoading={isSubmitting} className="w-full sm:w-auto sm:self-start">
                  Submit application
                </OrganicButton>
              </div>
            </div>
          </form>

          <aside className="lg:sticky lg:top-10">
            <JobSummaryCard eyebrow="Applying for" job={job} salary={salary} />
          </aside>
        </div>
      </main>
    </OrganicCareersFrame>
  );
}
