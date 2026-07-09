import type React from "react";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";

export interface FieldBase {
  name: string;
  children: React.ReactNode;
  label?: string;
  errors?: {
    message: string;
  }[];
}

export function FieldBase({ children, name, label, errors }: FieldBase) {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label ? label : name}</FieldLabel>
      {children}
      <FieldError errors={errors} />
    </Field>
  );
}

export interface FieldProps<T = any> {
  name: string;
  label?: string;
  value?: T;
  errors?: {
    message: string;
  }[];
  readOnly?: boolean;
}

export function FieldText(props: FieldProps<string>) {
  return (
    <FieldBase name={props.name} label={props.label} errors={props.errors}>
      <Input
        id={props.name}
        name={props.name}
        type="text"
        defaultValue={props.value}
        readOnly={props.readOnly}
      />
    </FieldBase>
  );
}

export function FieldNumber(props: FieldProps<number>) {
  return null;
}
