import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { CanopyFieldWrapper } from "./CanopyFieldWrapper";
import { canopyFieldInputVariants } from "./canopyFieldStyles";

interface CanopyTextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const CanopyTextareaField = forwardRef<HTMLTextAreaElement, CanopyTextareaFieldProps>(
  function CanopyTextareaField({ label, error, helperText, required, id, name, className, rows = 3, ...props }, ref) {
    const inputId = id ?? name;
    return (
      <CanopyFieldWrapper
        label={label}
        htmlFor={inputId ?? label}
        required={required}
        error={error}
        helperText={helperText}
      >
        <textarea
          ref={ref}
          id={inputId}
          name={name}
          rows={rows}
          className={cn(canopyFieldInputVariants({ hasError: Boolean(error) }), "resize-none py-3", className)}
          aria-invalid={Boolean(error)}
          {...props}
        />
      </CanopyFieldWrapper>
    );
  },
);
