import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ZodError } from "zod";
import type { ValidationError, ValidationErrorDetails } from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatError<T extends string = string>(
  error: ZodError,
  fallbackKey?: T,
): ValidationError<T> {
  const formattedErrors: ValidationError = {};
  error.issues.forEach((issue) => {
    if (issue.code == "unrecognized_keys") {
      if (!formattedErrors["unrecognized_keys"]) {
        formattedErrors["unrecognized_keys"] = [];
      }
      const keys = issue.keys.map((key) => `"${key}"`).join(", ");
      formattedErrors["unrecognized_keys"].push({
        message: `Unrecognized keys: ${keys}`,
      });
      return;
    }

    const fieldName = (issue.path.length > 0 ? issue.path[0].toString() : fallbackKey) as T | undefined;
    if (fieldName) {
      if (!formattedErrors[fieldName]) {
        formattedErrors[fieldName] = [];
      }

      formattedErrors[fieldName].push({
        message: issue.message,
      });
    }
  });
  return formattedErrors as ValidationError<T>;
}

export function getFieldError<T extends string = string>(
  key: T,
  fieldErrors: ValidationError<T>,
): ValidationErrorDetails[] {
  return fieldErrors[key] ?? [];
}
