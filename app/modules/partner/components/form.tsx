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
import Many2oneField from "./fields/m2o";

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
                <FieldError errors={[]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="type">Individu/Perusahaan</FieldLabel>
                <Input id="type" name="type" type="text" />
                <FieldError errors={[]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" type="email" />
                <FieldError errors={[]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="mobile">Nomor HP</FieldLabel>
                <Input id="mobile" name="mobile" type="phone" />
                <FieldError errors={[]} />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="address">Alamat</FieldLabel>
                <Input id="address" name="address" type="text" />
                <FieldError errors={[]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="address2">Alamat 2</FieldLabel>
                <Input id="address2" name="address2" type="text" />
                <FieldError errors={[]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="city">Kota/Kab</FieldLabel>
                <Input id="city" name="city" type="text" />
                <FieldError errors={[]} />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="country_state_id">Provinsi</FieldLabel>
                  <Many2oneField
                    placeholder="Cari Provinsi"
                    items={[{ id: "1", name: "Kepulauan Riau" }]}
                  />
                  <FieldError errors={[]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="country_id">Negara</FieldLabel>
                  <Many2oneField
                    placeholder="Cari Negara"
                    items={[{ id: "23423423", name: "Indonesia" }]}
                  />
                  <FieldError errors={[]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="zip">Kode Pos</FieldLabel>
                  <Input id="zip" name="zip" type="text" />
                  <FieldError errors={[]} />
                </Field>
              </div>
            </FieldGroup>
          </div>
        </FieldSet>
      </FieldGroup>
    </Form>
  );
}
