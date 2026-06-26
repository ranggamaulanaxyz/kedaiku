import { Search } from "lucide-react";
import { Field, FieldLabel } from "~/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Kbd } from "~/components/ui/kbd";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DataTable } from "../components/table";

export const handle = {
  breadcrumb: "Partners",
};

export default function PartnerListRoute() {
  return (
    <main>
      <div className="flex justify-between gap-4 border-b p-4">
        <div>
          <InputGroup>
            <InputGroupInput placeholder="Type contact name, email or phone number" />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div></div>
        <div className="flex items-center justify-between gap-1">
          <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="rows-per-page" className="text-nowrap">
              Rows per page
            </FieldLabel>
            <Select defaultValue="25">
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <div>
        <DataTable />
      </div>
    </main>
  );
}
