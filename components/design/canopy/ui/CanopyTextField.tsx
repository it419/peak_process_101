import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { CanopyFieldWrapper } from "./CanopyFieldWrapper";
import { canopyFieldHeightClass, canopyFieldInputVariants } from "./canopyFieldStyles";

interface CanopyTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const CanopyTextField = forwardRef<HTMLInputElement, CanopyTextFieldProps>(function CanopyTextField(
  { label, error, helperText, required, id, name, className, ...props },
  ref,
) {
  const inputId = id ?? name;
  return (
    <CanopyFieldWrapper
      label={label}
      htmlFor={inputId ?? label}
      required={required}
      error={error}
      helperText={helperText}
    >
      <input
        ref={ref}
        id={inputId}
        name={name}
        className={cn(canopyFieldInputVariants({ hasError: Boolean(error) }), canopyFieldHeightClass, className)}
        aria-invalid={Boolean(error)}
        {...props}
      />
    </CanopyFieldWrapper>
  );
});
