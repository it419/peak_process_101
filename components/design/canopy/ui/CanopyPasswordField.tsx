"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CanopyFieldWrapper } from "./CanopyFieldWrapper";
import { canopyFieldHeightClass, canopyFieldInputVariants } from "./canopyFieldStyles";

interface CanopyPasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

/** Password input with a show/hide button, so people can check what they typed. */
export const CanopyPasswordField = forwardRef<HTMLInputElement, CanopyPasswordFieldProps>(function CanopyPasswordField(
  { label, error, helperText, required, id, name, className, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? name;
  const Icon = visible ? EyeOff : Eye;

  return (
    <CanopyFieldWrapper label={label} htmlFor={inputId ?? label} required={required} error={error} helperText={helperText}>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={visible ? "text" : "password"}
          className={cn(canopyFieldInputVariants({ hasError: Boolean(error) }), canopyFieldHeightClass, "pr-12", className)}
          aria-invalid={Boolean(error)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          aria-controls={inputId}
          title={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-1 my-auto flex size-9 items-center justify-center rounded-canopy-control text-canopy-ink-muted transition-colors hover:bg-canopy-surface hover:text-canopy-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-canopy-accent"
        >
          <Icon className="size-[1.125rem]" aria-hidden />
        </button>
      </div>
    </CanopyFieldWrapper>
  );
});
