import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate, useBlocker, useNavigation } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Kbd } from "~/components/ui/kbd";
import { LayoutHeader } from "~/modules/layout/components/header";
import type { RouteHandle } from "~/modules/layout/types";
import type { Route } from "./+types/partner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export const handle: RouteHandle = {
  breadcrumb: () => "Kontak",
};

export default function PartnerRoute({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const [handleSave, setSaveHandler] = useState<() => void>(() => {});
  const [customDiscard, setDiscardHandler] = useState<(() => void) | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const location = useLocation();
  const navigation = useNavigation();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const isSubmitting = navigation.state === "submitting" || (navigation.state === "loading" && navigation.formMethod != null);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isEditMode && !isSubmitting && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowConfirmDialog(true);
    }
  }, [blocker.state]);

  const handleConfirmDiscard = () => {
    setIsEditMode(false);
    setShowConfirmDialog(false);
    if (blocker.state === "blocked") {
      blocker.proceed();
    } else if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleCancelDiscard = () => {
    setShowConfirmDialog(false);
    if (blocker.state === "blocked") {
      blocker.reset();
    }
    setPendingAction(null);
  };

  const handleDiscardClick = () => {
    if (isEditMode) {
      setPendingAction(() => () => {
        if (customDiscard) {
          customDiscard();
        } else {
          setIsEditMode(false);
          if (location.pathname === "/app/partners/new") {
            if (typeof window !== "undefined" && window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate("/app/partners");
            }
          }
        }
      });
      setShowConfirmDialog(true);
    } else {
      if (customDiscard) {
        customDiscard();
      } else {
        if (location.pathname === "/app/partners/new") {
          if (typeof window !== "undefined" && window.history.state && window.history.state.idx > 0) {
            navigate(-1);
          } else {
            navigate("/app/partners");
          }
        }
      }
    }
  };

  useEffect(() => {
    setIsEditMode(false);
  }, [location.pathname]);

  const isNavigate = blocker.state === "blocked";
  const dialogTitle = isNavigate ? "Tinggalkan Halaman?" : "Batalkan Perubahan?";
  const dialogDescription = isNavigate
    ? "Anda memiliki perubahan yang belum disimpan. Jika Anda meninggalkan halaman ini, perubahan Anda akan hilang."
    : "Apakah Anda yakin ingin membatalkan perubahan ini? Semua perubahan yang belum disimpan akan dikembalikan.";
  const confirmButtonText = isNavigate ? "Tinggalkan" : "Buang Perubahan";
  const cancelButtonText = isNavigate ? "Tetap di Sini" : "Batal";

  return (
    <Fragment>
      <LayoutHeader>
        <InputGroup>
          <InputGroupInput placeholder="Ketik disini untuk mencari..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </InputGroupAddon>
        </InputGroup>
        {isEditMode ? (
          <Fragment>
            <Button onClick={handleSave}>Simpan</Button>
            <Button variant="outline" onClick={handleDiscardClick}>
              Batal
            </Button>
          </Fragment>
        ) : (
          <Button asChild>
            <Link to="/app/partners/new">Tambah</Link>
          </Button>
        )}
      </LayoutHeader>
      <Outlet context={{ setSaveHandler, setDiscardHandler, setIsEditMode }} />

      <Dialog
        open={showConfirmDialog}
        onOpenChange={(open) => {
          if (!open) handleCancelDiscard();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDiscard}>
              {cancelButtonText}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDiscard}>
              {confirmButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
