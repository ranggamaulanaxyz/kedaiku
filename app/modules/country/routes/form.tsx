import type { DeskHandle } from "~/modules/desk/types";
import { Form } from "react-router";
import type { Route } from "./+types/form";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { FieldText } from "~/modules/desk/components/fields/field";
import { Card, CardContent } from "~/components/ui/card";
import { FieldDate } from "~/modules/desk/components/fields/date";

export const handle: DeskHandle = {
  breadcrumb: "Indonesia",
};

export async function clientLoader({ params }: Route.ClientActionArgs) {
  const isCreate = params.id === "new";
}

export default function CountryForm() {
  return (
    <Card>
      <CardContent>
        <Form className="grid grid-cols-1 gap-12">
          <FieldSet>
            <FieldLegend>Informasi Umum</FieldLegend>
            <FieldDescription>Nama dan kode unik negara</FieldDescription>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
              <FieldText name="name" label="Nama" />
              <FieldText name="code" label="Kode" />
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Informasi Teknik</FieldLegend>
            <FieldDescription>
              Informasi waktu pembuatan dan pembaruan data
            </FieldDescription>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <FieldGroup>
                <FieldDate
                  name="created_at"
                  label="Tanggal Dibuat"
                  readOnly={true}
                />
                <FieldDate
                  name="updated_at"
                  label="Tanggal Diubah"
                  readOnly={true}
                />
              </FieldGroup>
            </div>
          </FieldSet>
        </Form>
      </CardContent>
    </Card>
  );
}
