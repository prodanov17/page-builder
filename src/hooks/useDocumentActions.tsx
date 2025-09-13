import { useCallback } from "react";
import type { Builder } from "@/types/builder";
import { toast } from "sonner";
import ExportRenderer from "@/renderer/ExportRenderer";
import { createRoot } from "react-dom/client";

// The hook takes the current builder state and its setter function as arguments
export const useDocumentActions = (
    builder: Builder | null,
    setBuilder: (state: Builder) => void,
) => {
    /**
     * Saves the current builder state to localStorage.
     */
    const saveToLocalStorage = useCallback(() => {
        if (!builder) return;
        try {
            const jsonString = JSON.stringify(builder);
            localStorage.setItem("builderState", jsonString);
            toast.success("Project Saved!");
        } catch (error) {
            console.error("Failed to save project:", error);
            toast.error("Error: Could not save project.");
        }
    }, [builder]);

    /**
     * Loads the builder state from localStorage.
     */
    const loadFromLocalStorage = useCallback(() => {
        try {
            const savedState = localStorage.getItem("builderState");
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                setBuilder(parsedState);
                toast.success("Project Loaded!");
            } else {
                toast.error("No saved project found.");
            }
        } catch (error) {
            console.error("Failed to load project:", error);
            toast.error("Error: Could not load project.");
        }
    }, [setBuilder]);

    /**
     * Exports the current builder state as a downloadable JSON file.
     */
    const exportAsJson = useCallback(() => {
        if (!builder) return;
        const jsonString = JSON.stringify(builder, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${builder.name || "export"}.json`;
        a.click();
        URL.revokeObjectURL(url);

        toast.success("Project Exported!", {
            description: "Download will start shortly.",
        });
    }, [builder]);

    /**
     * Exports the rendered canvas as a complete HTML file.
     * @param canvasElement - The DOM element of the canvas to export.
     */
    const exportAsHtml = useCallback(() => {
        if (!builder) return;

        // 1. Create a temporary, hidden container in the body
        const tempContainer = document.createElement('div');
        document.body.appendChild(tempContainer);

        // 2. Use React to render your clean components into the hidden container
        const root = createRoot(tempContainer);
        root.render(
            <ExportRenderer components={builder.components} globalStyles={builder.styles} />
        );

        // Use a short timeout to allow React to render
        setTimeout(() => {
            // 3. Grab the clean HTML from the container
            const htmlContent = tempContainer.innerHTML;

            // 4. Clean up the temporary container
            root.unmount();
            document.body.removeChild(tempContainer);

            // 5. Proceed with the download logic as before
            const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${builder.name || "Exported Page"}</title>
  <style>

  body { margin: 0; font-family: sans-serif; }
* {
  overflow-wrap: break-word;
  word-break: break-word; /* Use break-word for better cross-browser support */
}
  </style>
</head>
<body><div>${htmlContent}</div></body>
</html>`;
            const blob = new Blob([fullHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'index.html';
            a.click();
            URL.revokeObjectURL(url);
        }, 100); // 100ms is usually enough for the render

    }, [builder]);

    /**
     * Imports a builder state from a user-selected JSON file.
     * @param file - The JSON file selected by the user.
     */
    const importFromJson = useCallback(
        (file: File) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const result = event.target?.result;
                    if (typeof result === "string") {
                        const parsedState = JSON.parse(result);
                        setBuilder(parsedState);
                        toast.success("Project Imported!");
                    }
                } catch (error) {
                    console.error("Failed to import file:", error);
                    toast.error("Error: Could not import project.");
                }
            };
            reader.readAsText(file);
        },
        [setBuilder],
    );

    return {
        saveToLocalStorage,
        loadFromLocalStorage,
        exportAsJson,
        exportAsHtml,
        importFromJson,
    };
};
