// This is a temporary type declaration file until @types/react can be properly installed
declare module 'react' {
    export type FC<P = {}> = (props: P) => any;
    export type MouseEvent<T = Element> = {
        stopPropagation: () => void;
    };
    export type ForwardedRef<T> = ((instance: T | null) => void) | {
        current: T | null;
    } | null;
    export type ComponentType<P = {}> = any;
    export function forwardRef<T, P = {}>(render: (props: P, ref: ForwardedRef<T>) => any): any;

    export interface JSX {
        IntrinsicElements: {
            [elemName: string]: any;
        };
    }
}

declare module 'react/jsx-runtime' {
    const jsx: any;
    const jsxs: any;
    const Fragment: any;
    export { jsx, jsxs, Fragment };
}
