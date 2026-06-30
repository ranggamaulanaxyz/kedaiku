import { Form } from "react-router";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";

export default function DataForm() {
  return (
    <Form method="post">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Informasi Umum</FieldLegend>
          <FieldDescription>Nama dan alamat kontak</FieldDescription>
          <div className="grid gap-4 md:grid-cols-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nama</FieldLabel>
                <Input id="name" name="name" type="text" />
                <FieldError errors={[{ message: "Bidang ini wajib diisi!" }]} />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Email</FieldLabel>
                <Input id="name" name="name" type="email" />
                <FieldError errors={[{ message: "Bidang ini wajib diisi!" }]} />
              </Field>
            </FieldGroup>
          </div>
        </FieldSet>
      </FieldGroup>
    </Form>
  );
}
