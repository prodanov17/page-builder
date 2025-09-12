// src/config/elementSchemas.ts

import type {
  ComponentProps,
  ComponentSchema,
  ComponentType,
} from "@/types/builder";

// Helper to build defaultProps from property definitions
function buildDefaultProps<T extends Record<string, PropertyDefinition>>(
  properties: T,
): Readonly<ComponentProps<T>> {
  const defaults: Partial<ComponentProps<T>> = {};
  for (const key in properties) {
    defaults[key as keyof T] = properties[key].defaultValue;
  }
  return defaults as Readonly<ComponentProps<T>>;
}

// --- TEXT ELEMENT SCHEMA ---
export const textElementProperties = {
  content: {
    name: "content",
    label: "Text",
    type: "string",
    editor: "textarea",
    defaultValue: "Hello World",
    applyAs: "content",
    group: "Content",
  },
  color: {
    name: "color",
    label: "Color",
    type: "color",
    editor: "color",
    defaultValue: "#333333",
    applyAs: "style",
    styleKey: "color",
    group: "Typography",
  },
  fontSize: {
    name: "fontSize",
    label: "Font Size",
    type: "string",
    editor: "text",
    defaultValue: "16px",
    applyAs: "style",
    styleKey: "fontSize",
    placeholder: "e.g., 16px or 1em",
    group: "Typography",
  },
  textAlign: {
    name: "textAlign",
    label: "Align",
    type: "enum",
    editor: "select",
    defaultValue: "left",
    applyAs: "style",
    styleKey: "textAlign",
    options: [
      { label: "L", value: "left" },
      { label: "C", value: "center" },
      { label: "R", value: "right" },
    ],
    group: "Typography",
  },
  fontWeight: {
    name: "fontWeight",
    label: "Weight",
    type: "enum",
    editor: "select",
    defaultValue: "normal",
    applyAs: "style",
    styleKey: "fontWeight",
    options: [
      { label: "Normal", value: "normal" },
      { label: "Bold", value: "bold" },
    ],
    group: "Typography",
  },
  lineHeight: {
    name: "lineHeight",
    label: "Line Height",
    type: "string",
    editor: "text",
    defaultValue: "1.5",
    applyAs: "style",
    styleKey: "lineHeight",
    group: "Typography",
  },
  padding: {
    name: "padding",
    label: "Padding",
    type: "string",
    editor: "text",
    defaultValue: "0px",
    applyAs: "style",
    styleKey: "padding",
    group: "Layout",
  },
  margin: {
    name: "margin",
    label: "Margin",
    type: "string",
    editor: "text",
    defaultValue: "0px 0px 10px 0px",
    applyAs: "style",
    styleKey: "margin",
    group: "Layout",
  },
} as const satisfies Record<string, PropertyDefinition>; // 'as const' for stricter typing

export const textElementSchema: ComponentSchema<typeof textElementProperties> =
  {
    type: "text",
    label: "Paragraph",
    properties: textElementProperties,
    defaultProps: buildDefaultProps(textElementProperties),
    getContentProp: (props) => "content", // 'content' prop provides the children for this element
    getStyleProps: (props) => {
      // This is like your useTextProp for styles
      const styles: React.CSSProperties = {};
      for (const key in props) {
        const propDef =
          textElementProperties[key as keyof typeof textElementProperties];
        if (
          propDef?.applyAs === "style" &&
          propDef.styleKey &&
          props[key as keyof typeof props] !== undefined
        ) {
          styles[propDef.styleKey] = props[key as keyof typeof props] as any;
        }
      }
      return styles;
    },
  };

// --- BUTTON ELEMENT SCHEMA ---
export const buttonElementProperties = {
  text: {
    name: "text",
    label: "Button Text",
    type: "string",
    editor: "text",
    defaultValue: "Click Me",
    applyAs: "content",
    group: "Content",
  },
  variant: {
    name: "variant",
    label: "Variant",
    type: "enum",
    editor: "select",
    defaultValue: "filled",
    applyAs: "custom",
    options: [
      { label: "Filled", value: "filled" },
      { label: "Outline", value: "outline" },
    ],
    group: "Appearance",
  },
  backgroundColor: {
    name: "backgroundColor",
    label: "Background",
    type: "color",
    editor: "color",
    defaultValue: "#007bff",
    applyAs: "style",
    styleKey: "backgroundColor",
    group: "Appearance",
    isVisible: (props) => props.variant === "filled",
  },
  textColor: {
    name: "textColor",
    label: "Text Color",
    type: "color",
    editor: "color",
    defaultValue: "#ffffff",
    applyAs: "style",
    styleKey: "color",
    group: "Appearance",
  },
  borderColor: {
    name: "borderColor",
    label: "Border Color",
    type: "color",
    editor: "color",
    defaultValue: "#007bff",
    applyAs: "style",
    styleKey: "borderColor",
    group: "Appearance",
    isVisible: (props) => props.variant === "outline",
  },
  padding: {
    name: "padding",
    label: "Padding",
    type: "string",
    editor: "text",
    defaultValue: "10px 20px",
    applyAs: "style",
    styleKey: "padding",
    group: "Layout",
  },
  borderRadius: {
    name: "borderRadius",
    label: "Border Radius",
    type: "string",
    editor: "text",
    defaultValue: "4px",
    applyAs: "style",
    styleKey: "borderRadius",
    group: "Appearance",
  },
  // width: { name: 'width', label: 'Width', type: 'string', editor: 'text', defaultValue: 'auto', applyAs: 'style', styleKey: 'width', group: 'Layout'},
} as const satisfies Record<string, PropertyDefinition>;

export const buttonElementSchema: ComponentSchema<
  typeof buttonElementProperties
> = {
  type: "button",
  label: "Button",
  properties: buttonElementProperties,
  defaultProps: buildDefaultProps(buttonElementProperties),
  getContentProp: () => "text",
  getStyleProps: (props) => {
    const styles: React.CSSProperties = {};
    const variant = props.variant || "filled";

    // Apply common style properties
    for (const key of ["padding", "borderRadius", "width"] as const) {
      if (props[key] !== undefined) styles[key] = props[key];
    }

    if (variant === "filled") {
      styles.backgroundColor = props.backgroundColor;
      styles.color = props.textColor;
      styles.border = "1px solid transparent"; // Or use borderColor if defined for filled too
    } else if (variant === "outline") {
      styles.backgroundColor = "transparent";
      styles.color = props.borderColor;
      styles.borderColor = props.borderColor;
      styles.borderWidth = "1px"; // Example
      styles.borderStyle = "solid";
    }
    return styles;
  },
};

export const imageElementSchema: ComponentSchema = {
  type: "image",
  label: "Image",
  properties: {
    src: {
      name: "src",
      label: "Image URL",
      type: "string",
      editor: "text",
      defaultValue: "",
      applyAs: "attribute",
      attributeName: "src",
      group: "Content",
    },
    altText: {
      name: "altText",
      label: "Alt Text",
      type: "string",
      editor: "text",
      defaultValue: "",
      applyAs: "attribute",
      attributeName: "alt",
      group: "Content",
    },
    width: {
      name: "width",
      label: "Width",
      type: "string",
      editor: "text",
      defaultValue: "",
      applyAs: "style",
      styleKey: "width",
      group: "Layout",
    },
    height: {
      name: "height",
      label: "Height",
      type: "string",
      editor: "text",
      defaultValue: "",
      applyAs: "style",
      styleKey: "height",
      group: "Layout",
    },
  },
  defaultProps: buildDefaultProps({
    src: { ...imageElementProperties.src, defaultValue: "" },
    altText: { ...imageElementProperties.altText, defaultValue: "" },
    width: { ...imageElementProperties.width, defaultValue: "" },
    height: { ...imageElementProperties.height, defaultValue: "" },
  }),
};

export const containerElementSchema: ComponentSchema = {
  type: "container",
  label: "Container",
  properties: {
    backgroundColor: {
      name: "backgroundColor",
      label: "Background Color",
      type: "color",
      editor: "color",
      defaultValue: "#ffffff",
      applyAs: "style",
      styleKey: "backgroundColor",
      group: "Appearance",
    },
    padding: {
      name: "padding",
      label: "Padding",
      type: "string",
      editor: "text",
      defaultValue: "10px",
      applyAs: "style",
      styleKey: "padding",
      group: "Layout",
    },
    margin: {
      name: "margin",
      label: "Margin",
      type: "string",
      editor: "text",
      defaultValue: "0px 0px 10px 0px",
      applyAs: "style",
      styleKey: "margin",
      group: "Layout",
    },
  },
  defaultProps: buildDefaultProps({
    backgroundColor: {
      ...containerElementProperties.backgroundColor,
      defaultValue: "#ffffff",
    },
    padding: { ...containerElementProperties.padding, defaultValue: "10px" },
    margin: {
      ...containerElementProperties.margin,
      defaultValue: "0px 0px 10px 0px",
    },
  }),
};

// --- Add more schemas for Image, Container, Input etc. ---

// Main export
export const elementSchemas: Record<ComponentType, ComponentSchema<any>> = {
  text: textElementSchema,
  button: buttonElementSchema,
  image: imageElementSchema,
  container: containerElementSchema,
  input: inputElementSchema,
};
