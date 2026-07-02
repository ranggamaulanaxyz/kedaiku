import type { ComponentPropsWithoutRef } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";

interface Many2oneData {
  id: string;
  name?: string;
}

interface Many2oneFieldProps extends ComponentPropsWithoutRef<typeof Combobox> {
  placeholder?: string;
  items: Many2oneData[];
}

export default function Many2oneField({
  placeholder,
  items,
  ...props
}: Many2oneFieldProps) {
  return (
    <Combobox
      items={items}
      itemToStringLabel={(item: any) => item?.name || item?.id || ""}
      itemToStringValue={(item: any) => item?.id || "new"}
      {...props}
    >
      <ComboboxInput
        placeholder={placeholder}
        showTrigger={true}
        showClear={true}
      />
      <ComboboxContent>
        <ComboboxEmpty>Tidak ada data.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item}>
              {item.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
