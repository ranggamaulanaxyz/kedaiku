import { Form, useFetcher, useOutletContext, useSubmit } from "react-router";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Many2oneField from "./fields/m2o";
import type { PartnerSchema, PartnerValidationError } from "../schemas";
import { useEffect, useState, useRef } from "react";
import { getFieldError } from "~/lib/utils";
import type { CountrySchema, CountryStateSchema } from "../../country/schemas";
import { toast } from "sonner";

interface DataFromProps {
  state: "idle" | "create" | "edit" | "saved";
  data: {
    partner: PartnerSchema | null;
    countries: CountrySchema[];
    countryStates: CountryStateSchema[];
  };
  error: {
    formErrors?: {
      message: string;
    }[];
    fieldErrors?: PartnerValidationError;
  };
}

export default function DataForm({ state, data, error }: DataFromProps) {
  const { setSaveHandler, setDiscardHandler, setIsEditMode } =
    useOutletContext<{
      setSaveHandler: (handler: () => void) => void;
      setDiscardHandler: (
        handler: ((handler: () => void) => void) | null,
      ) => void;
      setIsEditMode: (isEditMode: boolean) => void;
    }>();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState(state);

  const [partner, setPartner] = useState(data.partner);
  const [countryStates, setCountrySates] = useState(data.countryStates);
  const [countries, setCountries] = useState(data.countries);

  const [fieldErrors, setFieldError] = useState<PartnerValidationError>({});

  useEffect(() => {
    const handleSave = () => {
      if (formRef.current) {
        submit(formRef.current);
      }
    };
    setSaveHandler(() => handleSave);
  }, [setSaveHandler, submit]);

  useEffect(() => {
    if (state !== "create") {
      const handleDiscard = () => {
        setIsEditMode(false);
        setFormState("idle");
        setPartner(data.partner);
        setFieldError({});
        if (formRef.current) {
          formRef.current.reset();
        }
      };
      setDiscardHandler(() => handleDiscard);
    }
    return () => {
      setDiscardHandler(null);
    };
  }, [state, setDiscardHandler, setIsEditMode, data.partner]);

  useEffect(() => {
    setFormState(state);
  }, [state]);

  useEffect(() => {
    if (formState === "create") {
      setIsEditMode(true);
    } else if (formState === "saved") {
      setIsEditMode(false);
      setFormState("idle");
      toast.success("Berhasil menyimpan data");
    }
  }, [setIsEditMode, formState]);

  useEffect(() => {
    setPartner(data.partner);
  }, [data.partner]);

  useEffect(() => {
    setCountrySates(data.countryStates);
    setCountries(data.countries);
  }, [data]);

  useEffect(() => {
    setFieldError(error.fieldErrors || {});
  }, [error.fieldErrors]);

  useEffect(() => {
    if (error.formErrors) {
      error.formErrors.map((error) => {
        toast.error(error.message);
      });
    }
  }, [error.formErrors]);

  const handleCountryChange = async (value: any) => {
    setIsEditMode(true);
    const countryId = value;
    setPartner((prev) => {
      if (!prev) return null;

      let countryStateId = prev.countryStateId;
      if (countryStateId) {
        const state = countryStates.find((s) => s.id === countryStateId);
        if (state && state.countryId !== countryId) {
          countryStateId = null;
        }
      }

      return {
        ...prev,
        countryId: countryId,
        countryStateId: countryStateId,
      };
    });
  };

  const handleCountryStateChange = async (value: any) => {
    setIsEditMode(true);
    const countryStateId = value;
    setPartner((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        countryStateId: countryStateId || undefined,
      };
    });

    if (countryStateId) {
      let state = countryStates.find((state) => state.id === countryStateId);
      if (state && state.countryId) {
        setPartner((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            countryId: state.countryId,
          };
        });
      }
    }
  };

  return (
    <Form
      method="post"
      key={partner?.id}
      ref={formRef}
      onChange={() => setIsEditMode(true)}
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Informasi Umum</FieldLegend>
          <FieldDescription>Nama dan alamat kontak</FieldDescription>
          <div className="grid gap-4 md:grid-cols-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nama</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={partner?.name}
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
                  defaultValue={partner?.type || "individual"}
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
                  defaultValue={partner?.email}
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
                  defaultValue={partner?.mobile}
                />
                <FieldError
                  errors={getFieldError<any>("mobile", fieldErrors)}
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
                  defaultValue={partner?.address}
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
                  defaultValue={partner?.address2}
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
                  defaultValue={partner?.city}
                />
                <FieldError
                  errors={getFieldError<keyof PartnerSchema>(
                    "city",
                    fieldErrors,
                  )}
                />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="country_state_id">Provinsi</FieldLabel>
                  <Many2oneField
                    name="country_state_id"
                    placeholder="Cari Provinsi"
                    items={countryStates}
                    value={partner?.countryStateId ?? null}
                    onValueChange={handleCountryStateChange}
                  />
                  <FieldError
                    errors={getFieldError<keyof PartnerSchema>(
                      "countryStateId",
                      fieldErrors,
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="country_id">Negara</FieldLabel>
                  <Many2oneField
                    name="country_id"
                    placeholder="Cari Negara"
                    items={countries}
                    value={partner?.countryId ?? null}
                    onValueChange={handleCountryChange}
                  />
                  <FieldError
                    errors={getFieldError<keyof PartnerSchema>(
                      "countryId",
                      fieldErrors,
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="zip">Kode Pos</FieldLabel>
                  <Input
                    id="zip"
                    name="zip"
                    type="text"
                    defaultValue={partner?.zip}
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
      </FieldGroup>
    </Form>
  );
}
