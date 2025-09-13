import type { Component } from "@/types/builder";
import { isValidBuilderComponentJson } from "./validators";

// Simple ID generator
export const generateId = () =>
  `el-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;

export const regenerateIds = (component: Omit<Component, "id">): Component => {
  const newComponent: Component = { ...component, id: generateId() };
  if (newComponent.children) {
    newComponent.children = newComponent.children.map((child) =>
      regenerateIds(child),
    );
  }
  return newComponent;
};

export const copyComponent = (component: Component) => {
  // Add a special key to identify our component on the clipboard
  const componentToCopy = {
    ...component,
    __type: "builder-component",
  };
  navigator.clipboard.writeText(JSON.stringify(componentToCopy, null, 2));
};

export const pasteComponent = async (): Promise<Component | null> => {
  const clipboardText = await navigator.clipboard.readText();

  return parseComponentFromJson(clipboardText);
};

export const parseComponentFromJson = (
  jsonString: string,
): Component | null => {
  const potentialComponent = isValidBuilderComponentJson(jsonString);
  return potentialComponent ? regenerateIds(potentialComponent) : null;
};

// A helper function to find a component and its parent within the tree
export const findComponentAndParent = (
  nodes: Component[],
  id: string,
  parent: Component | null = null,
): { node: Component; parent: Component | null; index: number } | null => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === id) {
      return { node, parent, index: i };
    }
    if (node.children) {
      const found = findComponentAndParent(node.children, id, node);
      if (found) return found;
    }
  }
  return null;
};
