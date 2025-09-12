import ButtonElement from "./ButtonElement";
import TextElement from "./TextElement";
import ImageElement from "./ImageElement";
import ContainerElement from "./ContainerElement";
import type { BaseComponentProps, BuilderComponent } from "@/utils/types";
import InputElement from "./InputElement";
import IconElement from "./IconElement";

type ComponentMapType = {
  button: React.ComponentType<BaseComponentProps<BuilderComponent["props"]>>;
  text: React.ComponentType<BaseComponentProps<BuilderComponent["props"]>>;
  image: React.ComponentType<BaseComponentProps<BuilderComponent["props"]>>;
  container: React.ComponentType<BaseComponentProps<BuilderComponent["props"]>>;
  input: React.ComponentType<BaseComponentProps<BuilderComponent["props"]>>;
  icon: React.ComponentType<BaseComponentProps<BuilderComponent["props"]>>;
};

export const componentMap: ComponentMapType = {
  button: ButtonElement,
  text: TextElement,
  image: ImageElement,
  container: ContainerElement,
  input: InputElement,
  icon: IconElement,
};

type ComponentPropsMapType = {
  [key in keyof ComponentMapType]: {
    name: string;
    label: string;
    type: "string" | "number" | "boolean" | "enum" | "color" | "url";
    options?: string[]; // For enum types
  }[];
};

export const componentPropsMap: ComponentPropsMapType = {
  button: [
    {
      name: "width",
      label: "Width",
      type: "string",
    },
    {
      name: "height",
      label: "Height",
      type: "string",
    },
  ],
  text: [
    {
      name: "fontSize",
      label: "Font Size",
      type: "string",
    },
    {
      name: "color",
      label: "Text Color",
      type: "string",
    },
    {
      name: "content",
      label: "Content",
      type: "string",
    },
  ],
  image: [
    {
      name: "src",
      label: "Image URL",
      type: "string",
    },
    {
      name: "altText",
      label: "Alt Text",
      type: "string",
    },
    {
      name: "width",
      label: "Width",
      type: "string",
    },
    {
      name: "height",
      label: "Height",
      type: "string",
    },
  ],
  container: [
    {
      name: "backgroundColor",
      label: "Background Color",
      type: "string",
    },
    {
      name: "padding",
      label: "Padding",
      type: "string",
    },
    {
      name: "minHeight",
      label: "Min Height",
      type: "string",
    },
    {
      name: "flexDirection",
      label: "Flex Direction",
      type: "string",
    },
  ],
  input: [
    {
      name: "placeholder",
      label: "Placeholder",
      type: "string",
    },
    {
      name: "width",
      label: "Width",
      type: "string",
    },
    {
      name: "height",
      label: "Height",
      type: "string",
    },
  ],
  icon: [
    {
      name: "width",
      label: "Width",
      type: "string",
    },
    {
      name: "height",
      label: "Height",
      type: "string",
    },
  ],
};
