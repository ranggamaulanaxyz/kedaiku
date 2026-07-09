import type { DeskHandle, DeskLoaderData } from "~/modules/desk/types";
import { data, Form, redirect, useSubmit, useActionData } from "react-router";
import type { Route } from "./+types/form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { FieldDate } from "~/modules/desk/components/fields/date";
import type { CountrySchema, CountryValidationError } from "../schemas";
import { CountryService } from "../service";
import { useDesk } from "~/hooks/use-desk";
import { useEffect, useState } from "react";
import camelcaseKeys from "camelcase-keys";
import { toast } from "sonner";
import { getFieldError } from "~/lib/utils";

export const handle: DeskHandle = {
  breadcrumb: (match) => {
    if (match.params?.id === "new") return "Tambah";
    return match.loaderData?.record?.name || match.loaderData?.record?.id;
  },
};

export async function clientLoader({
  context,
  params,
}: Route.ClientLoaderArgs): Promise<DeskLoaderData<CountrySchema>> {
  const isCreate = params.id === "new";
  if (isCreate) {
    return { record: null };
  }

  const countryService = new CountryService(context);
  const record = await countryService.getCountryById(params.id);
  if (record) {
    return { record };
  }

  throw data(null, { status: 404 });
}

export async function clientAction({
  request,
  params,
  context,
}: Route.ClientActionArgs) {
  const countryService = new CountryService(context);

  if (request.method === "DELETE") {
    const success = await countryService.deleteCountry(params.id);
    if (success) {
      toast.success("Negara berhasil dihapus");
      return redirect("/app/countries");
    }
    return {
      state: "error",
      error: {
        formErrors: [{ message: "Gagal menghapus data." }],
      },
    };
  }

  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);
  const rawDataCamel = camelcaseKeys(rawData, { deep: true });

  // Country actions
  const { success, validatedData, error } =
    await countryService.validate(rawDataCamel);

  if (success) {
    if (params.id === "new") {
      const country = await countryService.createCountry(validatedData);
      if (country) {
        toast.success("Negara berhasil disimpan");
        return redirect(`/app/countries/${country.id}`);
      }
      return {
        state: "error",
        error: {
          formErrors: [{ message: "Gagal menyimpan data." }],
        },
      };
    }
    const country = await countryService.updateCountry(
      params.id,
      validatedData,
    );
    if (country) {
      toast.success("Negara berhasil disimpan");
      return { state: "saved", record: country };
    }
    return {
      state: "error",
      error: {
        formErrors: [{ message: "Gagal menyimpan data." }],
      },
    };
  }

  return {
    state: "error",
    record: null,
    error: {
      fieldErrors: error,
    },
  };
}

export default function CountryFormRoute({ loaderData }: Route.ComponentProps) {
  const { record: initialRecord } = loaderData;
  const actionData = useActionData<typeof clientAction>();
  const submit = useSubmit();
  const [fieldErrors, setFieldErrors] = useState<CountryValidationError>({});

  const { formRef, isDirty, setIsDirty, setSaveHandler } = useDesk();

  const record =
    actionData?.state === "saved" && actionData.record
      ? actionData.record
      : initialRecord;

  useEffect(() => {
    if (actionData?.state === "error" && actionData.error?.fieldErrors) {
      setFieldErrors(actionData.error.fieldErrors);
    } else {
      setFieldErrors({});
    }
  }, [actionData]);

  useEffect(() => {
    if (isDirty) {
      setFieldErrors({});
    }
  }, [isDirty]);

  useEffect(() => {
    setSaveHandler(() => () => {
      if (formRef.current) {
        submit(formRef.current);
      }
    });
  }, [submit, formRef, setSaveHandler]);

  useEffect(() => {
    if (actionData?.state === "saved") {
      setIsDirty(false);
    }
  }, [actionData, setIsDirty]);

  useEffect(() => {
    if (actionData?.error?.formErrors) {
      actionData.error.formErrors.forEach((error: { message: string }) => {
        toast.error(error.message);
      });
    }
  }, [actionData]);

  return (
    <>
      <Card>
        <CardContent>
          <Form
            ref={formRef}
            method="post"
            key={record?.id}
            onChange={() => setIsDirty(true)}
            className="grid grid-cols-1 gap-12"
          >
            <FieldSet>
              <FieldLegend>Informasi Umum</FieldLegend>
              <FieldDescription>Nama dan kode unik negara</FieldDescription>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Nama</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      defaultValue={record?.name}
                    />
                    <FieldError
                      errors={getFieldError<keyof CountrySchema>(
                        "name",
                        fieldErrors,
                      )}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="code">Kode</FieldLabel>
                    <Input
                      id="code"
                      name="code"
                      type="text"
                      defaultValue={record?.code}
                    />
                    <FieldError
                      errors={getFieldError<keyof CountrySchema>(
                        "code",
                        fieldErrors,
                      )}
                    />
                  </Field>
                </FieldGroup>
              </div>
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
                    value={record?.createdAt}
                    readOnly={true}
                  />
                  <FieldDate
                    name="updated_at"
                    label="Tanggal Diubah"
                    value={record?.updatedAt}
                    readOnly={true}
                  />
                </FieldGroup>
              </div>
            </FieldSet>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
