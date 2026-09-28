"use client";

import Link from "next/link";
import { ArrowRight, Check, FileText, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatBytes } from "@/lib/utils/formatBytes";
import { useOnboardingStore } from "@/lib/store/onboardingStore";
import {
  useCompletionPercent,
  useCurrentStepId,
  useFullName,
  useRequiredDocumentsRemaining,
  useStepStatuses,
} from "@/lib/store/selectors";
import { getStepById, stepRegistry } from "@/lib/onboarding/steps.config";
import { DOCUMENT_REQUIREMENTS } from "@/lib/onboarding/documents.config";
import { canopyButtonVariants } from "./ui/CanopyButton";
import { CanopyStepTimeline } from "./CanopyStepTimeline";
import { CanopyPageBar, CanopyPill, canopyLeadClass, canopyPageTitleClass } from "./CanopyStepShell";

const REQUIRED_DOCS = DOCUMENT_REQUIREMENTS.filter((doc) => doc.required);

function CanopyDashboardSkeleton() {
  return (
    <div className="animate-pulse motion-reduce:animate-none">
      <div className="h-10 w-2/3 rounded bg-canopy-skeleton" />
      <div className="mt-3 h-4 w-1/2 rounded bg-canopy-skeleton" />
      <div className="mt-6 grid gap-3.5 tablet:grid-cols-[1.6fr_1fr_1fr]">
        <div className="h-28 rounded-canopy-card bg-canopy-skeleton" />
        <div className="hidden h-28 rounded-canopy-card bg-canopy-skeleton sm:block" />
        <div className="hidden h-28 rounded-canopy-card bg-canopy-skeleton sm:block" />
      </div>
      <div className="mt-4 h-80 rounded-canopy-card bg-canopy-skeleton" />
    </div>
  );
}

/** Evergreen progress ring. The percentage is HTML over the SVG so it can use
 *  the display serif; the ring itself is decorative. */
function ProgressRing({ percent }: { percent: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-20 shrink-0 sm:size-24">
      <svg viewBox="0 0 100 100" aria-hidden className="size-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" className="stroke-canopy-surface-2" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - percent / 100)}
          className={cn(
            "stroke-canopy-accent transition-[stroke-dashoffset] duration-700 motion-reduce:transition-none",
            percent === 0 && "opacity-0",
          )}
        />
      </svg>
      <span className="font-canopy-display absolute inset-0 flex items-center justify-center text-[1.375rem] font-semibold text-canopy-ink sm:text-[1.625rem]">
        {percent}%
      </span>
    </div>
  );
}

const panelClass = "rounded-canopy-card border border-canopy-border bg-canopy-card shadow-canopy-rest";
const kpiLabelClass = "text-xs font-bold tracking-[0.04em] text-canopy-ink-muted";

function PanelHeader({ title, meta, id }: { title: string; meta?: string; id: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-canopy-border px-4 py-3.5 sm:px-4.5">
      <h2 id={id} className="text-[0.9375rem] font-bold text-canopy-ink">
        {title}
      </h2>
      {meta && <span className="text-[0.8125rem] text-canopy-ink-muted">{meta}</span>}
    </div>
  );
}

function DocumentsPanel() {
  const documents = useOnboardingStore((s) => s.documents);

  return (
    <section aria-labelledby="canopy-dash-docs" className={panelClass}>
      <PanelHeader id="canopy-dash-docs" title="Documents" />
      <ul>
        {DOCUMENT_REQUIREMENTS.map((req) => {
          const meta = documents[req.id];
          const status = meta?.status ?? "pending";
          const done = status === "uploaded" || status === "provided";
          return (
            <li
              key={req.id}
              className="flex items-center gap-3 border-b border-canopy-border px-4 py-3 last:border-b-0 sm:px-4.5"
            >
              {done ? (
                <Check className="size-4 shrink-0 text-canopy-success" strokeWidth={2.5} aria-hidden />
              ) : status === "error" ? (
                <TriangleAlert className="size-4 shrink-0 text-canopy-error" aria-hidden />
              ) : (
                <FileText className="size-4 shrink-0 text-canopy-ink-muted" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-canopy-ink">{req.label}</p>
                <p className="truncate text-xs text-canopy-ink-muted">
                  {req.providedByHR
                    ? "Provided by HR"
                    : status === "uploaded" && meta
                      ? `${meta.fileName} · ${formatBytes(meta.fileSize)}`
                      : `${req.description}${req.required ? "" : " · Optional"}`}
                </p>
              </div>
              {done ? (
                <CanopyPill tone="success">{status === "provided" ? "Ready" : "Uploaded"}</CanopyPill>
              ) : req.providedByHR ? (
                <CanopyPill tone="neutral">Pending</CanopyPill>
              ) : status === "uploading" ? (
                <span className="text-xs font-semibold text-canopy-accent-text">Uploading{"…"}</span>
              ) : (
                <Link
                  href="/onboarding/documents"
                  aria-label={`${status === "error" ? "Retry" : "Upload"} ${req.label}`}
                  className={cn(canopyButtonVariants({ variant: "secondary", size: "sm" }), "h-8 px-3")}
                >
                  {status === "error" ? "Retry" : "Upload"}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function CanopyDashboard() {
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated);
  const submitted = useOnboardingStore((s) => s.submitted);
  const submittedAt = useOnboardingStore((s) => s.submittedAt);
  const fullName = useFullName();
  const percent = useCompletionPercent();
  const statuses = useStepStatuses();
  const currentStepId = useCurrentStepId();
  const currentStep = getStepById(currentStepId);
  const remainingDocs = useRequiredDocumentsRemaining();
  const firstName = fullName ? (fullName.trim().split(/\s+/)[0] ?? null) : null;
  const doneCount = stepRegistry.filter((step) => statuses[step.id] === "completed").length;
  const continueHref = fullName ? `/onboarding/${currentStep.slug}` : "/onboarding/welcome";

  return (
    <div className="min-h-screen bg-canopy-bg font-canopy-sans text-canopy-ink">
      <div className="mx-auto w-full max-w-[68rem] px-4 py-6 sm:px-8 sm:py-8 tablet:px-11">
        <CanopyPageBar trail={["Onboarding", "Dashboard"]} />

        {!hasHydrated ? (
          <CanopyDashboardSkeleton />
        ) : (
          <>
            <h1 className={cn(canopyPageTitleClass, "mt-0")}>
              {submitted ? (
                <>
                  You{"’"}re all set
                  {firstName ? (
                    <>
                      , <em className="text-canopy-accent-text italic">{firstName}.</em>
                    </>
                  ) : (
                    "."
                  )}
                </>
              ) : firstName ? (
                <>
                  Welcome back, <em className="text-canopy-accent-text italic">{firstName}.</em>
                </>
              ) : (
                <>Welcome to Peak Process Partners.</>
              )}
            </h1>
            <p className={canopyLeadClass}>
              {submitted
                ? "Your onboarding has been submitted to HR. We’ll be in touch if anything else is needed."
                : `You’re ${percent}% of the way through.`}
            </p>

            {/* KPI row */}
            <div className="mt-6 grid gap-3.5 sm:grid-cols-2 tablet:grid-cols-[1.6fr_1fr_1fr]">
              <div
                className={cn(panelClass, "flex items-center gap-4 px-4 py-3.5 sm:col-span-2 sm:gap-5 tablet:col-span-1")}
              >
                <ProgressRing percent={percent} />
                <div className="min-w-0">
                  <p className="text-base font-bold text-canopy-ink">
                    <span className="font-canopy-mono">{doneCount}</span> of{" "}
                    <span className="font-canopy-mono">{stepRegistry.length}</span> steps done
                  </p>
                  <p className="mt-0.5 text-[0.8125rem] text-canopy-ink-muted">
                    {submitted ? "Submitted to HR" : `Next up: ${currentStep.label}`}
                  </p>
                  {!submitted && (
                    <Link
                      href={continueHref}
                      className={cn(canopyButtonVariants({ size: "sm" }), "mt-2.5 h-8.5 px-3.5")}
                    >
                      Continue <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  )}
                </div>
              </div>

              <div className={cn(panelClass, "grid content-start gap-1.5 px-4.5 py-4")}>
                <p className={kpiLabelClass}>Required documents</p>
                <p className="font-canopy-mono text-[1.625rem] leading-tight font-medium text-canopy-ink">
                  {REQUIRED_DOCS.length - remainingDocs}
                  <span className="text-canopy-ink-faint">/{REQUIRED_DOCS.length}</span>
                </p>
                <p className="text-xs text-canopy-ink-muted">
                  {remainingDocs > 0
                    ? `${remainingDocs} required document${remainingDocs > 1 ? "s" : ""} still need${remainingDocs > 1 ? "" : "s"} uploading`
                    : "All required documents in"}
                </p>
              </div>

              <div className={cn(panelClass, "grid content-start gap-1.5 px-4.5 py-4")}>
                <p className={kpiLabelClass}>Submission</p>
                {submitted ? (
                  <>
                    <p className="font-canopy-display text-[1.3125rem] leading-tight font-semibold text-canopy-success">
                      Submitted
                    </p>
                    {submittedAt && (
                      <p className="font-canopy-mono text-xs text-canopy-ink-muted">
                        {new Date(submittedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="font-canopy-display text-[1.3125rem] leading-tight font-semibold text-canopy-ink">
                      Not submitted
                    </p>
                    <p className="text-xs text-canopy-ink-muted">
                      Current step: <span className="font-semibold text-canopy-ink">{currentStep.label}</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 grid items-start gap-4 tablet:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <section aria-labelledby="canopy-dash-checklist" className={cn(panelClass, "overflow-hidden")}>
                <PanelHeader id="canopy-dash-checklist" title="Onboarding checklist" meta="Saves as you go" />
                <CanopyStepTimeline variant="list" />
              </section>

              <DocumentsPanel />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
