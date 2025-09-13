import { useEffect } from "react";
import type { Component } from "@/types/builder";
import { copyComponent, pasteComponent, regenerateIds } from "@/utils/utility";

// Define the functions and state the hook needs to operate
interface KeybindsConfig {
  selectedComponent: Component | null;
  undo: () => void;
  redo: () => void;
  save: () => void;
  removeComponent: (id: string) => void;
  addComponent: (component: Component) => void;
  setShowDebugInfo: React.Dispatch<React.SetStateAction<boolean>>;
  clearSelection: () => void;
  duplicateComponent: (component: Component) => void;
  newPage: () => void;
  // Add any other handlers you need, like for copy/paste/duplicate
}

export const useGlobalKeybinds = (config: KeybindsConfig) => {
  const {
    selectedComponent,
    newPage,
    undo,
    redo,
    save,
    removeComponent,
    addComponent,
    clearSelection,
    setShowDebugInfo,
    duplicateComponent,
  } = config;

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Ignore keybinds when an input is focused
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isModifier = isMac ? e.metaKey : e.ctrlKey;

      // Handle contextual actions (delete)
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedComponent) {
          e.preventDefault();
          removeComponent(selectedComponent.id);
        }
        return; // Stop here to not conflict with modifier keys
      } else if (e.key === "Escape") {
        if (selectedComponent) {
          e.preventDefault();
          clearSelection();
        }
        return; // Stop here to not conflict with modifier keys
      }

      if (!isModifier) return; // All shortcuts below require Ctrl or Cmd

      switch (e.key.toLowerCase()) {
        case "z": // Undo/Redo
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;

        case "n": // New Page
          e.preventDefault();
          newPage();
          break;

        // You can add more global keybinds here
        case "s":
          e.preventDefault();
          save();
          break;

        case "c": // Copy
          e.preventDefault();
          if (selectedComponent) {
            copyComponent(selectedComponent);
          }
          break;

        case "d": // Duplicate
          e.preventDefault();
          if (selectedComponent) {
            duplicateComponent(selectedComponent);
          }
          break;

        case "i": // Toggle Debug Info
          e.preventDefault();
          if (setShowDebugInfo) {
            setShowDebugInfo((prev) => !prev);
          }
          break;

        case "v": // Paste
          e.preventDefault();
          try {
            const potentialComponent = await pasteComponent();

            if (potentialComponent) {
              const newComponent = regenerateIds(potentialComponent);
              addComponent(newComponent);
            }
          } catch (err) {
            console.error("Failed to read clipboard contents: ", err);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // Re-run the effect if the selected component or handlers change
  }, [
    selectedComponent,
    undo,
    redo,
    removeComponent,
    save,
    addComponent,
    clearSelection,
    setShowDebugInfo,
    duplicateComponent,
    newPage,
  ]);
};
