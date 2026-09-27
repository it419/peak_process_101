import Link from "next/link";
import type { ReactNode } from "react";
import { OrganicCareersFrame } from "@/components/design/organic/recruitment/OrganicCareersFrame";
import {
  BackLink,
  CareersHero,
  JobMetaChips,
  JobSummaryCard,
  careersContainer,
  formatSalary,
} from "@/components/design/organic/recruitment/careersUi";
import { CurveDivider } from "@/components/design/organic/CurveDivider";
import { organicButtonVariants } from "@/components/design/organic/ui/OrganicButton";
import type { PublicJobDetail } from "@/types/recruitment";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="py-10 first:pt-0 last:pb-0">
      <h2 className="organic-type-heading text-organic-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BulletList({ text }: { text: string }) {
  const items = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="organic-type-body flex gap-3 text-organic-ink-muted">
          <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-organic-accent" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

function hasItems(text: string | null): text is string {
  return Boolean(text && text.split("\n").some((l) => l.trim()));
}

function SkillList({ label, skills, emphasis }: { label: string; skills: string[]; emphasis: boolean }) {
  return (
    <div>
      <p className="organic-type-eyebrow text-organic-ink-faint">{label}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {skills.map((s) => (
          <li
            key={s}
            className={
              emphasis
                ? "organic-type-meta rounded-organic-pill border border-organic-border-strong/60 bg-organic-card px-3 py-1 text-organic-ink"
                : "organic-type-meta rounded-organic-pill border border-organic-border px-3 py-1 text-organic-ink-muted"
            }
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PublicJobDetailOrganic({ job }: { job: PublicJobDetail }) {
  const salary = formatSalary(job.salaryMin, job.salaryMax);
  const hasSkills = job.requiredSkills.length > 0 || job.preferredSkills.length > 0;

  return (
    <OrganicCareersFrame>
      <CareersHero>
        <BackLink href="/jobs">All positions</BackLink>
        {job.department && <p className="organic-type-eyebrow mt-8 text-organic-accent-text">{job.department}</p>}
        <h1 className={`organic-type-title max-w-4xl text-organic-ink ${job.department ? "mt-3" : "mt-8"}`}>
          {job.title}
        </h1>
        <JobMetaChips job={job} salary={salary} className="mt-7" />
      </CareersHero>
      <CurveDivider fill="var(--color-organic-surface)" className="-mt-px h-8 sm:h-12 md:h-16" />

      <main className={`${careersContainer} pt-10 pb-20 sm:pt-14 sm:pb-28`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-16">
          <div className="min-w-0">
            <Link
              href={`/jobs/${job.id}/apply`}
              className={`${organicButtonVariants({ variant: "primary" })} mb-10 w-full lg:hidden`}
            >
              Apply now
            </Link>

            <div className="flex max-w-[68ch] flex-col divide-y divide-organic-border">
              {job.overview && (
                <Section title="Overview">
                  <p className="organic-type-body whitespace-pre-line text-organic-ink-muted">{job.overview}</p>
                </Section>
              )}
              {hasItems(job.responsibilities) && (
                <Section title="Responsibilities">
                  <BulletList text={job.responsibilities} />
                </Section>
              )}
              {hasItems(job.requirements) && (
                <Section title="Requirements">
                  <BulletList text={job.requirements} />
                </Section>
              )}
              {hasSkills && (
                <Section title="Skills">
                  <div className="flex flex-col gap-6">
                    {job.requiredSkills.length > 0 && (
                      <SkillList label="Required" skills={job.requiredSkills} emphasis />
                    )}
                    {job.preferredSkills.length > 0 && (
                      <SkillList label="Preferred" skills={job.preferredSkills} emphasis={false} />
                    )}
                  </div>
                </Section>
              )}
              {job.education && (
                <Section title="Education">
                  <p className="organic-type-body text-organic-ink-muted">{job.education}</p>
                </Section>
              )}
              {hasItems(job.benefits) && (
                <Section title="Benefits">
                  <BulletList text={job.benefits} />
                </Section>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-10">
            <JobSummaryCard eyebrow={"You’re applying for"} job={job} salary={salary}>
              <Link
                href={`/jobs/${job.id}/apply`}
                className={`${organicButtonVariants({ variant: "primary" })} mt-7 w-full`}
              >
                Apply now
              </Link>
            </JobSummaryCard>
          </aside>
        </div>
      </main>
    </OrganicCareersFrame>
  );
}
