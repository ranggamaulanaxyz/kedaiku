import type { DeskHandle, DeskLoaderData } from "~/modules/desk/types";
import { data, Form, redirect, useSubmit, useActionData } from "react-router";
import type { Route } from "./+types/state_form";
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
import type { CountryStateSchema, CountryStateValidationError, CountrySchema } from "../schemas";
import { StateCountryService, CountryService } from "../service";
import { useDesk } from "~/hooks/use-desk";
import { useEffect, useState } from "react";
import camelcaseKeys from "camelcase-keys";
import { toast } from "sonner";
import { getFieldError } from "~/lib/utils";
import Many2oneField from "~/modules/partner/components/fields/m2o";

export const handle: DeskHandle = {
  breadcrumb: (match) => {
    if (match.params?.id === "new") return "Tambah";
    return match.loaderData?.record?.name || match.loaderData?.record?.id;
  },
};

export async function clientLoader({
  context,
  params,
}: Route.ClientLoaderArgs): Promise<DeskLoaderData<CountryStateSchema> & { countries: CountrySchema[] }> {
  const isCreate = params.id === "new";
  
  const countryService = new CountryService(context);
  const { countries } = await countryService.getCountries();

  if (isCreate) {
    return { record: null, countries };
  }

  const stateCountryService = new StateCountryService(context);
  const record = await stateCountryService.getStateById(params.id);
  if (record) {
    return { record, countries };
  }

  throw data(null, { status: 404 });
}

export async function clientAction({
  request,
  params,
  context,
}: Route.ClientActionArgs) {
  const stateCountryService = new StateCountryService(context);

  if (request.method === "DELETE") {
    const success = await stateCountryService.deleteState(params.id);
    if (success) {
      toast.success("Provinsi berhasil dihapus");
      return redirect("/app/states");
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
  const { success, validatedData, error } =
    await stateCountryService.validate(rawDataCamel);

  if (success) {
    if (params.id === "new") {
      const state = await stateCountryService.createState(validatedData);
      if (state) {
        toast.success("Provinsi berhasil disimpan");
        return redirect(`/app/states/${state.id}`);
      }
      return {
        state: "error",
        error: {
          formErrors: [{ message: "Gagal menyimpan data." }],
        },
      };
    }
    const state = await stateCountryService.updateState(
      params.id,
      validatedData,
    );
    if (state) {
      toast.success("Provinsi berhasil disimpan");
      return { state: "saved", record: state };
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

export default function StateFormRoute({ loaderData }: Route.ComponentProps) {
  const { record: initialRecord, countries } = loaderData;
  const actionData = useActionData<typeof clientAction>();
  const submit = useSubmit();
  const [fieldErrors, setFieldErrors] = useState<CountryStateValidationError>({});

  const { formRef, isDirty, setIsDirty, setSaveHandler } = useDesk();

  const record =
    actionData?.state === "saved" && actionData.record
      ? actionData.record
      : initialRecord;

  const [countryId, setCountryId] = useState<string | null>(record?.countryId ?? null);

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
            <FieldDescription>Nama provinsi dan negara asal</FieldDescription>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nama Provinsi</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={record?.name}
                  />
                  <FieldError
                    errors={getFieldError<keyof CountryStateSchema>(
                      "name",
                      fieldErrors,
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="country_id">Negara</FieldLabel>
                  <Many2oneField
                    name="country_id"
                    placeholder="Pilih Negara"
                    items={countries}
                    value={countryId}
                    onValueChange={(val) => {
                      setCountryId(val as string | null);
                      setIsDirty(true);
                    }}
                  />
                  <FieldError
                    errors={getFieldError<keyof CountryStateSchema>(
                      "countryId",
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
  );
}
