import { useContext } from "react";
import { Form } from "react-router";
import { DeskContext } from "~/modules/desk/components/desk";
import type { FieldProps } from "~/modules/desk/components/fields/field";

export function useDesk<TData>() {
  const context = useContext(DeskContext);
  if (!context) {
    throw new Error(
      "useDeskContext must be used within a Desk component/Provider",
    );
  }
  return context as DeskContext<TData>;
}

export type ExtractFieldProps<TField> = TField extends React.ComponentType<infer P>
  ? P
  : TField extends (props: infer P) => any
  ? P
  : {};

export type DeskFieldConfig<TData = any, TKey extends keyof TData = any, TField = any> = {
  field: TField;
  accessorKey: TKey;
  label: string;
} & Omit<ExtractFieldProps<TField>, "name" | "value" | "onChange">;

export type ExtractFieldType<TField> = ExtractFieldProps<TField> extends FieldProps<infer T> ? T : any;

// Helper type to map all fields safely
export type DeskFieldsMap<TData, TFields extends any[]> = {
  [K in keyof TFields]: TFields[K] extends { accessorKey: infer TKey; field: infer TField }
    ? TKey extends keyof TData
      ? ExtractFieldType<TField> extends TData[TKey]
        ? TFields[K] & Omit<ExtractFieldProps<TField>, "name" | "value" | "onChange">
        : Omit<TFields[K], "accessorKey" | "field"> & {
            accessorKey: TKey;
            field: TField;
            _error: "Type mismatch between Field component and data model";
          }
      : never
    : TFields[K];
};

interface DeskFormOptions<TData, TFields extends any[]> {
  defaultValues: TData;
  fields?: readonly [...TFields] & DeskFieldsMap<TData, TFields>;
  fieldErrors?: Record<string, any>;
}

export function useDeskForm<TData, const TFields extends any[] = any[]>({
  defaultValues,
  fields = [] as any,
  fieldErrors,
}: DeskFormOptions<TData, TFields>) {
  return {
    Form,
    defaultValues,
    fields,
    fieldErrors,
  };
}

