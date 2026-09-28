"use client";

import { CanopyTextField } from "@/components/design/canopy/ui/CanopyTextField";
import { CanopyButton } from "@/components/design/canopy/ui/CanopyButton";
import { useAdminLoginLogic } from "@/hooks/recruitment/useAdminLoginLogic";

/** The Peak mark on forest, matching the app sidebar. */
function ForestMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-10 shrink-0" aria-hidden>
      <rect width="32" height="32" rx="8" className="fill-canopy-forest" />
      <path d="M7 22.5L13.5 10L17 16.2L19.8 11.6L25 22.5H7Z" className="fill-canopy-forest-gold" />
    </svg>
  );
}

export function AdminLoginCanopy() {
  const { register, errors, isSubmitting, formError, onContinue } = useAdminLoginLogic();

  return (
    <div className="min-h-screen bg-canopy-bg font-canopy-ui text-canopy-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-[26rem] flex-col items-stretch justify-center px-4 py-10">
        <div className="mb-6 flex items-center justify-center gap-3">
          <ForestMark />
          <div className="leading-tight">
            <p className="text-[0.9375rem] font-bold text-canopy-ink">Peak Process Partners</p>
            <p className="mt-0.5 text-[0.6875rem] font-semibold tracking-widest text-canopy-ink-muted uppercase">HR Admin</p>
          </div>
        </div>

        <div className="rounded-canopy-card border border-canopy-border bg-canopy-card px-5 py-7 shadow-canopy-lift sm:px-8 sm:py-8">
          <h1 className="font-canopy-display text-[1.875rem] leading-tight font-semibold tracking-[-0.015em] text-canopy-ink">
            Admin sign in
          </h1>
          <p className="mt-1.5 text-sm text-canopy-ink-muted">Sign in to manage job openings and applications.</p>

          <form onSubmit={onContinue} className="mt-6 flex flex-col gap-2">
            <CanopyTextField
              label="Email"
              type="email"
              autoComplete="email"
              required
              error={errors.email?.message}
              {...register("email")}
            />
            <CanopyTextField
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              error={errors.password?.message}
              {...register("password")}
            />
            {formError && (
              <p className="rounded-canopy-control bg-canopy-error-tint px-3 py-2 text-sm text-canopy-error" role="alert">
                {formError}
              </p>
            )}
            <CanopyButton type="submit" isLoading={isSubmitting} className="mt-2 w-full justify-center">
              Sign in
            </CanopyButton>
          </form>
        </div>
      </div>
    </div>
  );
}
