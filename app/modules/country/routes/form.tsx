import { useDeskForm } from "~/hooks/use-desk";
import type { DeskHandle } from "~/modules/desk/types";
import { CountrySchema } from "../schemas";
import DeskForm from "~/modules/desk/components/form";
import { FieldGroup } from "~/components/ui/field";
import { FieldText, FieldNumber } from "~/modules/desk/components/fields/field";

export const handle: DeskHandle = {
  breadcrumb: "Indonesia",
};

export default function CountryForm() {
  const fields = [
    {
      field: FieldText,
      accessorKey: "id",
      label: "ID",
      xxx: "a",
    },
    {
      field: FieldText,
      accessorKey: "name",
      label: "Nama",
    },
  ];

  const defaultValues: CountrySchema = {
    id: "sd",
    name: "sdf",
  };

  const form = useDeskForm<CountrySchema>({
    defaultValues,
    fields,
  });

  return (
    <DeskForm form={form}>
      {(Field) => (
        <FieldGroup>
          <Field name="id" />
          <Field name="name" />
        </FieldGroup>
      )}
    </DeskForm>
  );
}
