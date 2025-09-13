import type { Component } from "@/types/builder";

/**
 * Checks if a string is valid JSON representing a builder component.
 * @returns The parsed Component object if valid, otherwise null.
 */
export function isValidBuilderComponentJson(
  jsonString: string,
): Component | null {
  try {
    const parsed = JSON.parse(jsonString);

    // Check for the special key we added and essential properties
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      parsed.__type === "builder-component" &&
      "id" in parsed &&
      "type" in parsed &&
      "props" in parsed
    ) {
      // It's very likely our component, clean it up before returning
      delete parsed.__type;
      return parsed as Component;
    }
    return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Not a valid JSON string
    return null;
  }
}
