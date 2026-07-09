import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  useParams,
  useNavigate,
  useSubmit,
  useBeforeUnload,
  useBlocker,
  useNavigation,
  type BlockerFunction,
} from "react-router";
import type { DeskAction } from "./list";

export interface DeskContext<TData> {
  baseUrl: string;
  actions: DeskAction<TData>;
  setActions: React.Dispatch<React.SetStateAction<DeskAction<TData>>>;
  saveHandler: () => void;
  setSaveHandler: React.Dispatch<React.SetStateAction<() => void>>;
  discardHandler: () => void;
  setDiscardHandler: React.Dispatch<React.SetStateAction<() => void>>;
  isDirty: boolean;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  isCreateMode: boolean;
  setIsCreateMode: React.Dispatch<React.SetStateAction<boolean>>;
  formRef: React.RefObject<HTMLFormElement | null>;
  blocker: ReturnType<typeof useBlocker>;
}

export const DeskContext = createContext<DeskContext<any> | null>(null);

interface DeskProps {
  children: React.ReactNode;
  baseUrl: string;
}

export function Desk<TData>({ children, baseUrl }: DeskProps) {
  const [actions, setActions] = useState<DeskAction<TData>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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

  const navigation = useNavigation();

  // Using blocker to prevent navigation when form is dirty
  const blockerCallback = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) => {
      // Do not block when submitting or redirecting after a submission
      if (navigation.state !== "idle") {
        return false;
      }
      return isDirty && currentLocation.pathname !== nextLocation.pathname;
    },
    [isDirty, navigation.state],
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

  // Show edit mode when form is dirty or in create mode or when we are in a form view (id is present)
  useEffect(() => {
    if (isDirty || isCreateMode) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [isDirty, isCreateMode]);

  const [saveHandler, setSaveHandler] = useState<() => void>(() => {});
  const [customDiscardHandler, setCustomDiscardHandler] = useState<
    (() => void) | null
  >(null);

  const defaultDiscardHandler = useCallback(() => {
    if (isCreateMode) {
      if (typeof window !== "undefined" && window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(baseUrl);
      }
    } else {
      formRef.current?.reset();
      setIsDirty(false);
    }
  }, [isCreateMode, baseUrl, navigate]);

  const discardHandler = customDiscardHandler || defaultDiscardHandler;

  const contextValue: DeskContext<TData> = {
    baseUrl: baseUrl,
    actions: actions,
    setActions: setActions,
    saveHandler: saveHandler,
    setSaveHandler: setSaveHandler,
    discardHandler: discardHandler,
    setDiscardHandler: setCustomDiscardHandler as unknown as React.Dispatch<
      React.SetStateAction<() => void>
    >,
    isDirty: isDirty,
    setIsDirty: setIsDirty,
    isEditMode: isEditMode,
    setIsEditMode: setIsEditMode,
    isCreateMode: isCreateMode,
    setIsCreateMode: setIsCreateMode,
    formRef: formRef,
    blocker: blocker,
  };

  return (
    <DeskContext.Provider value={contextValue}>{children}</DeskContext.Provider>
  );
}
