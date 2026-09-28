"use client";

import { useRef, type ReactNode } from "react";
import { Check, FileText, RotateCw, TriangleAlert, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatBytes } from "@/lib/utils/formatBytes";
import { CanopyButton } from "./ui/CanopyButton";
import { CanopyPill } from "./CanopyStepShell";
import type { DocumentMeta, DocumentRequirement } from "@/types/onboarding";

interface CanopyDocumentUploadRowProps {
  requirement: DocumentRequirement;
  meta?: DocumentMeta;
  progress?: number;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

function statusVisual(status: DocumentMeta["status"] | "pending"): { bg: string; icon: ReactNode } {
  switch (status) {
    case "uploaded":
    case "provided":
      return {
        bg: "bg-canopy-success-tint text-canopy-success",
        icon: <Check className="size-4" strokeWidth={2.5} />,
      };
    case "error":
      return { bg: "bg-canopy-error-tint text-canopy-error", icon: <TriangleAlert className="size-4" /> };
    case "uploading":
      return { bg: "bg-canopy-accent-tint text-canopy-accent-text", icon: <Upload className="size-4" /> };
    default:
      return { bg: "bg-canopy-surface text-canopy-ink-muted", icon: <FileText className="size-4" /> };
  }
}

function acceptAttr(formats: string[]): string {
  return formats.map((f) => `.${f.toLowerCase()}`).join(",");
}

export function CanopyDocumentUploadRow({ requirement, meta, progress, onUpload, onRemove }: CanopyDocumentUploadRowProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const status = meta?.status ?? "pending";
  const { bg, icon } = statusVisual(status);

  function handleChange(files: FileList | null) {
    const file = files?.[0];
    if (file) onUpload(file);
  }

  return (
    <div className="flex flex-col gap-3 border-b border-canopy-border py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-canopy-control", bg)}>{icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-canopy-ink">
            {requirement.label}
            <span className="ml-2 text-xs font-medium text-canopy-ink-faint">
              {requirement.providedByHR ? "Provided by HR" : requirement.required ? "Required" : "Optional"}
            </span>
          </p>

          <p className="mt-0.5 text-[0.8125rem] wrap-break-word text-canopy-ink-muted">
            {status === "uploaded" && meta
              ? `${meta.fileName} · ${formatBytes(meta.fileSize)}`
              : requirement.description}
          </p>

          {status === "uploading" && (
            <div className="mt-2 h-1 max-w-56 overflow-hidden rounded-canopy-pill bg-canopy-surface-2">
              <div
                className="h-full rounded-full bg-canopy-accent transition-[width] duration-300"
                style={{ width: `${progress ?? 0}%` }}
              />
            </div>
          )}

          {status === "error" && meta?.errorMessage && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[0.8125rem] text-canopy-error">
              <TriangleAlert className="size-3.5 shrink-0" /> {meta.errorMessage}
            </p>
          )}

          {(status === "pending" || status === "error") && requirement.acceptedFormats.length > 0 && (
            <p className="mt-1 font-canopy-mono text-[0.6875rem] text-canopy-ink-faint">
              {requirement.acceptedFormats.join(", ")} · up to {requirement.maxSizeMB}MB
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 pl-12 sm:pl-0">
        {requirement.providedByHR ? (
          status === "provided" ? <CanopyPill tone="success">Ready</CanopyPill> : null
        ) : status === "uploaded" ? (
          <>
            <CanopyPill tone="success" className="mr-1">
              Uploaded
            </CanopyPill>
            <CanopyButton type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
              Replace
            </CanopyButton>
            <CanopyButton type="button" variant="ghost" size="sm" onClick={onRemove} aria-label="Remove file">
              <X className="size-4" />
            </CanopyButton>
          </>
        ) : status === "uploading" ? (
          <span className="text-[0.8125rem] font-medium text-canopy-accent-text">Uploading{"…"}</span>
        ) : status === "error" ? (
          <CanopyButton type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
            <RotateCw className="size-4" /> Retry
          </CanopyButton>
        ) : (
          <CanopyButton type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
            <Upload className="size-4" /> Upload
          </CanopyButton>
        )}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptAttr(requirement.acceptedFormats)}
          onChange={(e) => {
            handleChange(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
