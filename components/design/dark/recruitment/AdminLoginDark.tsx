"use client";

import { AdminClerkSignIn } from "@/components/recruitment/AdminClerkSignIn";
import { DarkWordmark } from "@/components/design/dark/DarkWordmark";

export function AdminLoginDark() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg px-5 py-10 font-sans">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <DarkWordmark />
        </div>
        <div className="rounded-xl border border-dark-border bg-dark-surface p-7">
          <h1 className="font-dark-display text-xl font-semibold text-dark-text">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-dark-text-muted">Sign in to manage job openings and applications.</p>

          <div className="mt-6">
            <AdminClerkSignIn
              colors={{ primary: "#cba135", text: "#f2f0ec", muted: "#9b9a96", input: "#1c1d22", border: "#3a3b42", danger: "#c25b52" }}
              fontFamily="var(--font-ibm-plex-sans), sans-serif"
              borderRadius="0.5rem"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
