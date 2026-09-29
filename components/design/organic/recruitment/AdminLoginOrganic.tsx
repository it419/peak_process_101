"use client";

import { AdminClerkSignIn } from "@/components/recruitment/AdminClerkSignIn";
import { OrganicWordmark } from "@/components/design/organic/OrganicWordmark";
import { CurveDivider } from "@/components/design/organic/CurveDivider";

export function AdminLoginOrganic() {
  return (
    <div className="min-h-screen bg-organic-bg font-organic-sans">
      <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-5 py-10">
        <div className="mb-8">
          <OrganicWordmark subtitle="HR Admin" />
        </div>
        <div className="w-full rounded-[1.75rem] bg-organic-surface px-7 py-9">
          <h1 className="font-organic-display text-xl font-semibold text-organic-ink">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-organic-ink-muted">Sign in to manage job openings and applications.</p>
        </div>
        <CurveDivider fill="var(--color-organic-surface)" className="-mt-px h-8 w-full" />

        <div className="mt-6">
            <AdminClerkSignIn
              colors={{ primary: "#a95636", text: "#2a2621", muted: "#5f574b", input: "#fdfbf7", border: "#8f846f", danger: "#a1402f" }}
              fontFamily="var(--font-geist), sans-serif"
              borderRadius="0.75rem"
            />
          </div>
      </div>
    </div>
  );
}
