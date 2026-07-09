import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "~/components/ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { FieldBase, type FieldProps } from "./field";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function FieldDate(props: FieldProps<Date | string | null>) {
  const [open, setOpen] = React.useState(false);

  const initialDate = React.useMemo(() => {
    if (!props.value) return undefined;
    const d = new Date(props.value);
    return isValidDate(d) ? d : undefined;
  }, [props.value]);

  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [month, setMonth] = React.useState<Date | undefined>(initialDate);
  const [value, setValue] = React.useState(formatDate(initialDate));

  React.useEffect(() => {
    const d = props.value ? new Date(props.value) : undefined;
    const validD = isValidDate(d) ? d : undefined;
    setDate(validD);
    setMonth(validD);
    setValue(formatDate(validD));
  }, [props.value]);

  return (
    <FieldBase name={props.name} label={props.label} errors={props.errors}>
      <InputGroup>
        <InputGroupInput
          value={value}
          readOnly={props.readOnly}
          onChange={(e) => {
            if (props.readOnly) return;
            const targetDate = new Date(e.target.value);
            setValue(e.target.value);
            if (isValidDate(targetDate)) {
              setDate(targetDate);
              setMonth(targetDate);
            }
          }}
          onFocus={(e) => {
            if (props.readOnly) return;
            e.preventDefault();
            setOpen(true);
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover
            open={props.readOnly ? false : open}
            onOpenChange={props.readOnly ? undefined : setOpen}
          >
            <PopoverTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
                disabled={props.readOnly}
              >
                <CalendarIcon />
                <span className="sr-only">Pilih Tanggal</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={date}
                month={month}
                onMonthChange={setMonth}
                onSelect={(date) => {
                  setDate(date);
                  setValue(formatDate(date));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </FieldBase>
  );
}
