import type React from "react";
import { Form } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Field, FieldLabel, FieldError } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { getFieldError } from "~/lib/utils";
import type { ExtractFieldType } from "~/hooks/use-desk";

type FindField<TFields extends any[], TKey> = TFields extends readonly [infer Head, ...infer Tail]
  ? Head extends { accessorKey: TKey; field: infer TField }
    ? ExtractFieldType<TField>
    : FindField<Tail, TKey>
  : any;

interface DeskFormProps<TData, TFields extends any[]> {
  form: {
    defaultValues: TData;
    fields: readonly [...TFields];
    fieldErrors?: Record<string, any>;
  };
  children: (
    Field: <TKey extends keyof TData & string>(props: { name: TKey }) => React.ReactNode
  ) => React.ReactNode;
}

export default function DeskForm<TData, TFields extends any[] = any[]>({
  form,
  children,
}: DeskFormProps<TData, TFields>) {
  const FieldComponent = <TKey extends keyof TData & string>({
    name,
  }: {
    name: TKey;
  }) => {

    const fieldConfig = form.fields.find((f) => f.accessorKey === name);
    if (!fieldConfig) {
      console.warn(`Field config for "${name}" not found.`);
      return null;
    }

    const value = (form.defaultValues as any)?.[name];
    const errors = form.fieldErrors
      ? getFieldError<any>(name, form.fieldErrors)
      : [];

    return (
      <Field data-invalid={errors.length > 0 ? "true" : undefined}>
        <FieldLabel htmlFor={name}>{fieldConfig.label}</FieldLabel>
        <Input
          id={name}
          name={name}
          defaultValue={value}
          disabled={fieldConfig.isReadonly}
          readOnly={fieldConfig.isReadonly}
          placeholder={fieldConfig.placeholder}
          aria-invalid={errors.length > 0 ? "true" : undefined}
        />
        {errors.length > 0 && <FieldError errors={errors} />}
      </Field>
    );
  };

  return (
    <Card>
      <CardContent>
        <Form className="flex flex-col gap-4">{children(FieldComponent)}</Form>
      </CardContent>
    </Card>
  );
}
