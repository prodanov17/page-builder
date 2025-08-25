export interface BaseProps {
  margin?: string;
  padding?: string;
}

export interface ButtonProps extends BaseProps {
  text?: string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  fontSize?: string;
  borderRadius?: string;
}

export interface TextProps extends BaseProps {
  content?: string;
  fontSize?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  fontWeight?: string | number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface ImageProps extends BaseProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  borderRadius?: string;
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

export interface ContainerProps extends BaseProps {
  backgroundColor?: string;
  borderColor?: string;
  minHeight?: string;
  display?: 'flex' | 'block' | 'grid' | 'inline-flex';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  alignItems?: string;
  justifyContent?: string;
  gap?: string;
  width?: string;
  height?: string;
  name?: string;
  backgroundImage?: string;
}

export interface ChildPlacement {
  order?: number;
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
}

export interface BaseComponentProps<T extends ComponentProps> {
  id: string;
  props: T;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export interface ContainerComponentProps extends BaseComponentProps<ContainerProps> {
  children?: BuilderComponent[];
  selectedComponentId?: string | null;
  onAddComponentRequest?: (id: string) => void;
  updateChildPlacement?: (childId: string, placement: Partial<ChildPlacement>) => void;
}

export type ComponentProps = ButtonProps | TextProps | ImageProps | ContainerProps;

export interface BuilderComponent {
  id: string;
  type: 'button' | 'text' | 'image' | 'container';
  props: ComponentProps;
  children?: BuilderComponent[];
  placement?: ChildPlacement;
}

export interface Builder {
  id: string;
  name: string;
  components: BuilderComponent[];
  styles: {
    [key: string]: string | number;
  };
}

// React specific type declarations
declare module 'react' {
  interface JSX {
    IntrinsicElements: {
      [elemName: string]: any;
    };
  }
}

declare module 'react/jsx-runtime' {
  export default any;
  export const Fragment: any;
}
