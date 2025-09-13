import { useState, useEffect } from "react";
import type { Builder } from "@/types/builder";

export type SaveStatus = "idle" | "waiting" | "saving" | "saved";

export const useAutoSave = (
  data: Builder | null,
  onSave: (data: Builder) => Promise<void> | void,
  delay: number = 1500, // 1.5 second delay
) => {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // The debounce effect
  useEffect(() => {
    if (!data) return;

    // Set status to 'waiting' as soon as data changes
    setStatus("waiting");

    const handler = setTimeout(async () => {
      setStatus("saving");
      await onSave(data);
      setStatus("saved");
      setSavedAt(new Date());

      // Reset to idle after a short period
      setTimeout(() => setStatus("idle"), 3000);
    }, delay);

    // Cleanup by clearing the timeout if data changes again before delay is met
    return () => {
      clearTimeout(handler);
    };
  }, [data, onSave, delay]); // Rerun effect if the data to be saved changes

  return { status, savedAt };
};
