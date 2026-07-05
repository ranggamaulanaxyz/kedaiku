import { useSearchParams, useNavigate, useLocation } from "react-router";
import { useState, useEffect, useRef, Fragment } from "react";
import { Search, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "~/components/ui/input-group";
import { Kbd } from "~/components/ui/kbd";
import { useIsMobile } from "~/hooks/use-mobile";

function DataSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const query = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(query);
  const [isMac, setIsMac] = useState(true);
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    }
  }, []);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isShortcut = isMac
        ? e.metaKey && e.key.toLowerCase() === "k"
        : e.ctrlKey && e.key.toLowerCase() === "k";

      if (isShortcut) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isMac]);

  const applySearch = (value: string) => {
    const trimmed = value.trim();
    if (trimmed === query && location.pathname === "/app/partners") return;

    const params = new URLSearchParams(searchParams);
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    navigate(`/app/partners?${params.toString()}`, {
      replace: location.pathname === "/app/partners",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applySearch(inputValue);
    }
  };

  const handleBlur = () => {
    applySearch(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    if (query || location.pathname !== "/app/partners") {
      applySearch("");
    }
  };

  return (
    <InputGroup>
      <InputGroupInput
        ref={inputRef}
        placeholder="Ketik disini untuk mencari..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        {inputValue ? (
          <InputGroupButton
            onMouseDown={(e) => {
              e.preventDefault();
              handleClear();
            }}
            aria-label="Clear search"
          >
            <X />
          </InputGroupButton>
        ) : isMobile ? null : (
          <Fragment>
            <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
            <Kbd>K</Kbd>
          </Fragment>
        )}
      </InputGroupAddon>
    </InputGroup>
  );
}

export { DataSearch };
