import { useEffect, useRef, type RefObject } from "react";

export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled: boolean = true,
): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!enabled) return;
    function handleClickOutside(event: MouseEvent) {
      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target as Node),
      );
      if (isOutside) {
        handlerRef.current();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [refs, enabled]);
}
