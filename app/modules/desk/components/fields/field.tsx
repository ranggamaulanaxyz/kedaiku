import type React from "react";

export interface FieldProps<T = any> {
  name: string;
  value?: T;
  onChange?: (value: T) => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}

export function FieldText(props: FieldProps<string>) {
  return null;
}

export function FieldNumber(props: FieldProps<number>) {
  return null;
}

