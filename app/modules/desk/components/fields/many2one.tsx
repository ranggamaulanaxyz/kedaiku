import type { ComponentPropsWithoutRef } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";
import { FieldBase, type FieldProps } from "./field";

interface Many2oneData {
  id: string;
  name?: string;
}

export interface FieldMany2oneProps extends FieldProps<string>, Omit<ComponentPropsWithoutRef<typeof Combobox>, "value" | "defaultValue" | "name"> {
  placeholder?: string;
  items: Many2oneData[];
}

export function FieldMany2one({
  name,
  label,
  value,
  errors,
  readOnly,
  placeholder,
  items,
  ...props
}: FieldMany2oneProps) {
  return (
    <FieldBase name={name} label={label} errors={errors}>
      <Combobox
        value={value}
        disabled={readOnly}
        items={items?.map((item) => item.id)}
        itemToStringLabel={(id) =>
          items.find((item) => item.id === id)?.name || ""
        }
        {...props}
      >
        <ComboboxInput
          placeholder={placeholder}
          showTrigger={true}
          showClear={!readOnly}
          disabled={readOnly}
        />
        <ComboboxContent>
          <ComboboxEmpty>Tidak ada data.</ComboboxEmpty>
          <ComboboxList>
            {(id) => (
              <ComboboxItem key={id} value={id}>
                {items.find((item) => item.id === id)?.name || "Tidak ada nama"}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </FieldBase>
  );
}
