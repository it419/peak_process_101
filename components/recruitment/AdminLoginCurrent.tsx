"use client";

import { AdminClerkSignIn } from "@/components/recruitment/AdminClerkSignIn";
import { PeakWordmark } from "@/components/Logo";

export function AdminLoginCurrent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-50 px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <PeakWordmark subtitle="HR Admin" tone="light" />
        </div>
        <div className="rounded-md border border-paper-200 bg-white p-7">
          <h1 className="font-display text-xl font-semibold text-paper-ink-900">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-paper-ink-600">Sign in to manage job openings and applications.</p>

          <div className="mt-6">
            <AdminClerkSignIn
              colors={{ primary: "#c1501e", text: "#1c1b18", muted: "#635d4f", input: "#ffffff", border: "#d3c9b3", danger: "#b3413a" }}
              fontFamily="var(--font-ibm-plex-sans), sans-serif"
              borderRadius="0.375rem"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
