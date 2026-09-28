"use client";

import { CanopyWordmark } from "@/components/design/canopy/CanopyWordmark";
import { CanopyTextField } from "@/components/design/canopy/ui/CanopyTextField";
import { CanopyButton } from "@/components/design/canopy/ui/CanopyButton";
import { CurveDivider } from "@/components/design/canopy/CurveDivider";
import { useAdminLoginLogic } from "@/hooks/recruitment/useAdminLoginLogic";

export function AdminLoginCanopy() {
  const { register, errors, isSubmitting, formError, onContinue } = useAdminLoginLogic();

  return (
    <div className="min-h-screen bg-canopy-bg font-canopy-sans">
      <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-5 py-10">
        <div className="mb-8">
          <CanopyWordmark subtitle="HR Admin" />
        </div>
        <div className="w-full rounded-[1.75rem] bg-canopy-surface px-7 py-9">
          <h1 className="font-canopy-display text-xl font-semibold text-canopy-ink">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-canopy-ink-muted">Sign in to manage job openings and applications.</p>
        </div>
        <CurveDivider fill="var(--color-canopy-surface)" className="-mt-px h-8 w-full" />

        <form onSubmit={onContinue} className="mt-2 flex w-full flex-col gap-4">
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
          {formError && <p className="text-sm text-canopy-error">{formError}</p>}
          <CanopyButton type="submit" isLoading={isSubmitting} className="mt-2 w-full justify-center">
            Sign in
          </CanopyButton>
        </form>
      </div>
    </div>
  );
}
