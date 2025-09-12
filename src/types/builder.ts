// src/types/builder.ts

export type PropertyEditorType =
  | "text"
  | "textarea"
  | "number"
  | "boolean" // (e.g., a checkbox or toggle)
  | "select"
  | "color"
  | "slider"
  | "fontFamily" // Potentially a custom picker
  | "imageUpload"; // For image src

export type PropertyApplyAs =
  | "style" // Directly applies to inline style object
  | "attribute" // Applies as an HTML attribute
  | "className" // Adds a class name (value could be the class or part of it)
  | "content" // Used as the direct children/content of the element (e.g., text)
  | "custom"; // The element component has custom logic to handle this prop

export interface PropertyOption {
  label: string;
  value: string | number | boolean;
}

export interface PropertyDefinition {
  name: keyof string; // The actual key in the props object (e.g., 'fontSize') - will be typed per component
  label: string;
  type: "string" | "number" | "boolean" | "enum" | "color" | "url";
  editor: PropertyEditorType;
  defaultValue: string;
  applyAs: PropertyApplyAs;
  styleKey?: string; // CSS property name if applyAs is 'style' (e.g., 'fontSize', 'backgroundColor')
  attributeName?: string; // HTML attribute name if applyAs is 'attribute' (e.g., 'src', 'alt')
  classNamePattern?: string; // e.g., 'text-{{value}}' if applyAs is 'className'
  options?: ReadonlyArray<PropertyOption>; // For 'select' editor
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  group?: "Layout" | "Typography" | "Appearance" | "Content" | "Behavior"; // For organizing in editor
  isVisible?: (props: Record<string, boolean>) => boolean; // Conditionally show property in editor
}

// Generic Props interface for a component based on its schema
export type ComponentProps<T extends Record<string, PropertyDefinition>> = {
  [K in keyof T]?: T[K]["type"] extends "number"
    ? number
    : T[K]["type"] extends "boolean"
      ? boolean
      : string; // Default to string for others (enum, color, url will be strings)
};

export type ComponentType =
  | "button"
  | "input"
  | "container"
  | "text"
  | "image"
  | "icon";

// Describes the schema for a component type
export interface ComponentSchema<
  PropsDef extends Record<string, PropertyDefinition> = Record<
    string,
    PropertyDefinition
  >,
> {
  type: ComponentType;
  label: string; // e.g., "Button", "Paragraph"
  icon?: string; // For the palette
  properties: PropsDef;
  defaultProps: Readonly<ComponentProps<PropsDef>>; // Automatically derived
  // Optional: Function to generate styles/classes from props
  // This is where your use[Element]Prop() idea can be integrated at schema level
  getStyleProps?: (props: ComponentProps<PropsDef>) => React.CSSProperties;
  getAttributeProps?: (
    props: ComponentProps<PropsDef>,
  ) => Record<string, string>;
  getClassNameProps?: (props: ComponentProps<PropsDef>) => string;
  getContentProp?: (props: ComponentProps<PropsDef>) => keyof PropsDef | null; // Which prop holds the main content
}

// Actual instance of a component on the canvas
export interface ComponentInstanceData<
  T extends Record<string, PropertyDefinition> = Record<
    string,
    PropertyDefinition
  >,
> {
  id: string;
  type: ComponentType;
  props: ComponentProps<T>; // Strongly typed props for this instance
  children?: ComponentInstanceData[];
}

// Builder state
export interface BuilderData {
  id: string;
  name: string;
  components: ComponentInstanceData[]; // Array of any component instance type
  globalStyles: React.CSSProperties;
}

export interface ComponentDefinition {
  id: string;
  props: PropsType;
  type: ComponentType;
  label: string;
  defaultProps: PropsType;
  children?: ComponentDefinition[];
}

export type PropsType = Record<string, string | number | boolean | undefined>;
