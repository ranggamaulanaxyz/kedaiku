import { useState, useEffect } from "react";
import { useFetcher } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";
import { Field, FieldLabel, FieldError } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Pencil, Trash, Loader2 } from "lucide-react";
import type { CountryStateSchema, CountryStateValidationError } from "../schemas";
import { getFieldError } from "~/lib/utils";
import { toast } from "sonner";

interface StateListFormProps {
  countryId: string;
  states: CountryStateSchema[];
}

export default function StateListForm({ countryId, states }: StateListFormProps) {
  const fetcher = useFetcher<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<CountryStateSchema | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState<CountryStateValidationError>({});
  const [deleteStateId, setDeleteStateId] = useState<string | null>(null);

  const isSubmitting = fetcher.state !== "idle";

  // Handle fetcher response (success or validation errors)
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.state === "state_success") {
        setIsOpen(false);
        setDeleteStateId(null);
        setNameInput("");
        setSelectedState(null);
        setFieldErrors({});
      } else if (fetcher.data.state === "state_error") {
        if (fetcher.data.error?.fieldErrors) {
          setFieldErrors(fetcher.data.error.fieldErrors);
        }
        if (fetcher.data.error?.formErrors) {
          fetcher.data.error.formErrors.forEach((err: { message: string }) => {
            toast.error(err.message);
          });
        }
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleOpenEdit = (state: CountryStateSchema) => {
    setSelectedState(state);
    setNameInput(state.name);
    setFieldErrors({});
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedState) {
      fetcher.submit(
        {
          intent: "updateState",
          stateId: selectedState.id,
          name: nameInput,
          countryId: countryId,
        },
        { method: "post" }
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteStateId) {
      fetcher.submit(
        {
          intent: "deleteState",
          stateId: deleteStateId,
        },
        { method: "post" }
      );
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-heading font-medium">Daftar Provinsi</CardTitle>
      </CardHeader>
      <CardContent>
        {states.length === 0 ? (
          <div className="flex min-h-[150px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <p className="text-muted-foreground text-sm">Belum ada provinsi yang terdaftar.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">No.</TableHead>
                <TableHead>Nama Provinsi</TableHead>
                <TableHead className="w-[120px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {states.map((state, index) => (
                <TableRow key={state.id}>
                  <TableCell className="font-mono">{index + 1}</TableCell>
                  <TableCell className="font-medium">{state.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleOpenEdit(state)}
                        title="Ubah"
                        type="button"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteStateId(state.id)}
                        title="Hapus"
                        type="button"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Create / Edit Dialog Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Ubah Nama Provinsi</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Field>
                <FieldLabel htmlFor="state-name">Nama Provinsi</FieldLabel>
                <Input
                  id="state-name"
                  type="text"
                  placeholder="Contoh: Jawa Barat"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  disabled={isSubmitting}
                  autoFocus
                />
                <FieldError
                  errors={getFieldError<keyof CountryStateSchema>(
                    "name",
                    fieldErrors
                  )}
                />
              </Field>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                type="button"
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteStateId !== null} onOpenChange={(open) => !open && setDeleteStateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Provinsi?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus provinsi ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
