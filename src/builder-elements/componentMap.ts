import ButtonElement from "./ButtonElement";
import TextElement from "./TextElement";
import ImageElement from "./ImageElement";
import ContainerElement from "./ContainerElement";
// import InputElement from './InputElement'; // If you create one

export const componentMap = {
  button: ButtonElement,
  text: TextElement,
  image: ImageElement,
  container: ContainerElement,
  // input: InputElement,
};

export const componentPropsMap = {
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
};
