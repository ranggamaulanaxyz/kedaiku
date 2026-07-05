import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Link,
  Outlet,
  useBeforeUnload,
  useBlocker,
  useNavigate,
  useParams,
  useSubmit,
  type BlockerFunction,
} from "react-router";
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
import { BlockerAlert, ButtonWithAlert } from "../components/alert";
import { DataSearch } from "../components/search";

export const handle: RouteHandle = {
  breadcrumb: () => "Kontak",
};

export default function PartnerRoute({ loaderData }: Route.ComponentProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const submit = useSubmit();

  // Reset isDirty when params change
  useEffect(() => {
    setIsCreateMode(params.id === "new");
    if (params.id === undefined) {
      setIsDirty(false);
    }
  }, [params.id]);

  // Using blocker to prevent navigation when form is dirty
  const blockerCallback = useCallback<BlockerFunction>(
    () => isDirty,
    [isDirty],
  );
  const blocker = useBlocker(blockerCallback);

  // Prevent page unload/reload when form is dirty
  useBeforeUnload(
    useCallback(
      (event) => {
        if (isDirty) {
          event.preventDefault();
        }
      },
      [isDirty],
    ),
  );

  // Show edit mode when form is dirty or in create mode
  useEffect(() => {
    if (formRef.current && (isDirty || isCreateMode)) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [formRef, isDirty, isCreateMode]);

  // Save handler for submit data
  const handleSave = () => {
    submit(formRef.current);
  };

  // Discard handler for cancel action
  const handleDiscard = () => {
    if (isCreateMode) {
      navigate("/app/partners");
    }
  };

  return (
    <Fragment>
      <LayoutHeader>
        <DataSearch />
        {isEditMode ? (
          <Fragment>
            <Button onClick={handleSave}>Simpan</Button>
            {isDirty ? (
              <ButtonWithAlert
                title="Apa kamu yakin?"
                description="Perubahan saat ini akan hilang jika kamu membatalkannya"
                variant="outline"
                onClick={handleDiscard}
              >
                Batalkan
              </ButtonWithAlert>
            ) : (
              <Button variant="outline" onClick={handleDiscard}>
                Batalkan
              </Button>
            )}
          </Fragment>
        ) : (
          <Button asChild>
            <Link to="/app/partners/new">Tambah</Link>
          </Button>
        )}
      </LayoutHeader>
      <Outlet context={{ formRef, isDirty, setIsDirty }} />
      <BlockerAlert
        title="Perubahan belum disimpan"
        description="Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?"
        blocker={blocker}
      />
    </Fragment>
  );
}
