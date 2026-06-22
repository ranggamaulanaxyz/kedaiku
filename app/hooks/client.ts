import { useEffect, useRef } from "react";

export function useClient() {
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { isMounted: isMountedRef.current };
}
