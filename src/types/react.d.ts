// This is a temporary type declaration file until @types/react can be properly installed
declare module 'react' {
    export type FC<P = {}> = (props: P) => any;
    export type MouseEvent<T = Element> = {
        stopPropagation: () => void;
    };
    export function useState<S = any>(initial?: S): [S, (value: S | ((prev: S) => S)) => void];
    export function useEffect(effect: (...args: any[]) => any, deps?: any[]): void;
    export function useCallback<F extends (...args: any[]) => any>(fn: F, deps?: any[]): F;
    export function useRef<T = any>(initial?: T | null): { current: T | null };
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
