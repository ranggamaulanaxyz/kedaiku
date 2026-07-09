import type React from "react";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";

export interface FieldBase {
  name: string;
  children: React.ReactNode;
  label?: string;
}

export function FieldBase({ children, name, label }: FieldBase) {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label ? label : name}</FieldLabel>
      {children}
      <FieldError errors={[]} />
    </Field>
  );
}

export interface FieldProps<T = any> {
  name: string;
  label?: string;
  value?: T;
}

export function FieldText({ name, label, value }: FieldProps<string>) {
  return (
    <FieldBase name={name} label={label}>
      <Input id={name} name={name} type="text" defaultValue={value} />
    </FieldBase>
  );
}

export function FieldNumber(props: FieldProps<number>) {
  return null;
}
