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
import { FieldMany2one } from "~/modules/desk/components/fields/many2one";
import type { PartnerSchema, PartnerValidationError } from "../schemas";
import type { CountrySchema, CountryStateSchema } from "../../country/schemas";
import { PartnerService } from "../service";
import { useDesk } from "~/hooks/use-desk";
import { useEffect, useState } from "react";
import camelcaseKeys from "camelcase-keys";
import { toast } from "sonner";
import { getFieldError } from "~/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const handle: DeskHandle = {
  breadcrumb: (match) => {
    if (match.params?.id === "new") return "Tambah";
    return match.loaderData?.record?.name || match.loaderData?.record?.id;
  },
};

export async function clientLoader({
  context,
  params,
}: Route.ClientLoaderArgs): Promise<
  DeskLoaderData<PartnerSchema> & {
    countries: CountrySchema[];
    countryStates: CountryStateSchema[];
  }
> {
  const isCreate = params.id === "new";
  const partnerService = new PartnerService(context);

  const countries = await partnerService.getCountries();
  const countryStates = await partnerService.getCountryStates();

  if (isCreate) {
    return { record: null, countries, countryStates };
  }

  const record = await partnerService.getPartnerById(params.id);
  if (record) {
    return { record, countries, countryStates };
  }

  throw data(null, { status: 404 });
}

export async function clientAction({
  request,
  params,
  context,
}: Route.ClientActionArgs) {
  const partnerService = new PartnerService(context);

  if (request.method === "DELETE") {
    const success = await partnerService.deletePartner(params.id);
    if (success) {
      toast.success("Kontak berhasil dihapus");
      return redirect("/app/partners");
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
    await partnerService.validate(rawDataCamel);

  if (success) {
    if (params.id === "new") {
      const partner = await partnerService.createPartner(validatedData);
      if (partner) {
        toast.success("Kontak berhasil disimpan");
        return redirect(`/app/partners/${partner.id}`);
      }
      return {
        state: "error",
        error: {
          formErrors: [{ message: "Gagal menyimpan data." }],
        },
      };
    }
    const partner = await partnerService.updatePartner(
      params.id,
      validatedData,
    );
    if (partner) {
      toast.success("Kontak berhasil disimpan");
      return { state: "saved", record: partner };
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

export default function PartnerFormRoute({ loaderData }: Route.ComponentProps) {
  const { record: initialRecord, countries, countryStates } = loaderData;
  const actionData = useActionData<typeof clientAction>();
  const submit = useSubmit();
  const [fieldErrors, setFieldErrors] = useState<PartnerValidationError>({});

  const { formRef, isDirty, setIsDirty, setSaveHandler } = useDesk();

  const record =
    actionData?.state === "saved" && actionData.record
      ? actionData.record
      : initialRecord;

  const [countryId, setCountryId] = useState<string | null>(
    record?.countryId ?? null,
  );
  const [countryStateId, setCountryStateId] = useState<string | null>(
    record?.countryStateId ?? null,
  );

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

  const handleCountryChange = (value: string | null) => {
    setCountryId(value);
    // Reset country state if it doesn't belong to the new country
    if (countryStateId) {
      const state = countryStates.find((s) => s.id === countryStateId);
      if (state && state.countryId !== value) {
        setCountryStateId(null);
      }
    }
    setIsDirty(true);
  };

  const handleCountryStateChange = (value: string | null) => {
    setCountryStateId(value);
    // Auto-set country when selecting a state
    if (value) {
      const state = countryStates.find((s) => s.id === value);
      if (state && state.countryId) {
        setCountryId(state.countryId);
      }
    }
    setIsDirty(true);
  };

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
              <FieldDescription>Nama dan informasi kontak</FieldDescription>
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
                      errors={getFieldError<keyof PartnerSchema>(
                        "name",
                        fieldErrors,
                      )}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="type">Individu/Perusahaan</FieldLabel>
                    <Select
                      name="type"
                      defaultValue={record?.type || "individual"}
                    >
                      <SelectTrigger className="w-full" id="type">
                        <SelectValue placeholder="Pilih Tipe Partner" />
                      </SelectTrigger>
                      <SelectContent align="start">
                        <SelectGroup>
                          <SelectItem value="individual">Individu</SelectItem>
                          <SelectItem value="company">Perusahaan</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldError
                      errors={getFieldError<keyof PartnerSchema>(
                        "type",
                        fieldErrors,
                      )}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={record?.email}
                    />
                    <FieldError
                      errors={getFieldError<keyof PartnerSchema>(
                        "email",
                        fieldErrors,
                      )}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="mobile">Nomor HP</FieldLabel>
                    <Input
                      id="mobile"
                      name="mobile"
                      type="phone"
                      defaultValue={record?.mobile}
                    />
                    <FieldError
                      errors={getFieldError<keyof PartnerSchema>(
                        "mobile",
                        fieldErrors,
                      )}
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="address">Alamat</FieldLabel>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      defaultValue={record?.address}
                    />
                    <FieldError
                      errors={getFieldError<keyof PartnerSchema>(
                        "address",
                        fieldErrors,
                      )}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="address2">Alamat 2</FieldLabel>
                    <Input
                      id="address2"
                      name="address2"
                      type="text"
                      defaultValue={record?.address2}
                    />
                    <FieldError
                      errors={getFieldError<keyof PartnerSchema>(
                        "address2",
                        fieldErrors,
                      )}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="city">Kota/Kab</FieldLabel>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      defaultValue={record?.city}
                    />
                    <FieldError
                      errors={getFieldError<keyof PartnerSchema>(
                        "city",
                        fieldErrors,
                      )}
                    />
                  </Field>
                  <div className="grid grid-cols-3 gap-4">
                    <FieldMany2one
                      name="country_state_id"
                      label="Provinsi"
                      placeholder="Cari Provinsi"
                      items={countryStates}
                      value={countryStateId}
                      onValueChange={handleCountryStateChange}
                    />
                    <FieldMany2one
                      name="country_id"
                      label="Negara"
                      placeholder="Cari Negara"
                      items={countries}
                      value={countryId}
                      onValueChange={handleCountryChange}
                    />
                    <Field>
                      <FieldLabel htmlFor="zip">Kode Pos</FieldLabel>
                      <Input
                        id="zip"
                        name="zip"
                        type="text"
                        defaultValue={record?.zip}
                      />
                      <FieldError
                        errors={getFieldError<keyof PartnerSchema>(
                          "zip",
                          fieldErrors,
                        )}
                      />
                    </Field>
                  </div>
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
