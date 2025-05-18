// src/hooks/useBuilder.js
import { useState, useCallback } from "react";

export interface Component {
  id: string;
  type: "button" | "input" | "container" | "text" | "image";
  props: {
    [key: string]: string | number | boolean;
  };
  children?: Component[];
}

export interface Builder {
  id: string;
  name: string;
  components: Component[];
  styles: {
    [key: string]: string | number;
  };
}

const useBuilder = () => {
  const [builder, setBuilderInternal] = useState<Builder | undefined>();

  // Function to initialize or fully replace the builder state
  const setBuilder = useCallback((newBuilderState?: Builder) => {
    setBuilderInternal(newBuilderState);
  }, []);

  const addComponent = useCallback(
    (component: Component, parentId?: string) => {
      if (!builder) return;

      if (!parentId) {
        // Add to top level
        setBuilderInternal((prevBuilder) => ({
          ...prevBuilder!,
          components: [...prevBuilder!.components, component],
        }));
      } else {
        // Add to a specific parent (container)
        const addRecursive = (nodes: Component[]): Component[] => {
          return nodes.map((node) => {
            if (node.id === parentId && node.type === "container") {
              return {
                ...node,
                children: [...(node.children || []), component],
              };
            }
            if (node.children) {
              return { ...node, children: addRecursive(node.children) };
            }
            return node;
          });
        };
        setBuilderInternal((prevBuilder) => ({
          ...prevBuilder!,
          components: addRecursive(prevBuilder!.components),
        }));
      }
    },
    [builder],
  );

  const removeComponent = useCallback(
    (id: string) => {
      if (!builder) return;

      const filterRecursive = (
        components: Component[],
        targetId: string,
      ): Component[] => {
        return components
          .filter((comp) => comp.id !== targetId)
          .map((comp) => {
            if (comp.children && comp.children.length > 0) {
              return {
                ...comp,
                children: filterRecursive(comp.children, targetId),
              };
            }
            return comp;
          });
      };
      setBuilderInternal((prevBuilder) => ({
        ...prevBuilder!,
        components: filterRecursive(prevBuilder!.components, id),
      }));
    },
    [builder],
  );

  const updateComponent = useCallback(
    (id: string, newPartialComponent: Partial<Component>) => {
      if (!builder) return;

      const updateRecursive = (
        components: Component[],
        targetId: string,
        updates: Partial<Component>,
      ): Component[] => {
        return components.map((comp) => {
          if (comp.id === targetId) {
            // Merge props carefully if only props are updated
            if (updates.props && !updates.type && !updates.children) {
              return { ...comp, props: { ...comp.props, ...updates.props } };
            }
            return { ...comp, ...updates };
          }
          if (comp.children && comp.children.length > 0) {
            return {
              ...comp,
              children: updateRecursive(comp.children, targetId, updates),
            };
          }
          return comp;
        });
      };
      setBuilderInternal((prevBuilder) => ({
        ...prevBuilder!,
        components: updateRecursive(
          prevBuilder!.components,
          id,
          newPartialComponent,
        ),
      }));
    },
    [builder],
  );

  const setStyles = useCallback(
    (newStyles: { [key: string]: string | number }) => {
      if (!builder) return;
      setBuilderInternal((prevBuilder) => ({
        ...prevBuilder!,
        styles: { ...prevBuilder!.styles, ...newStyles },
      }));
    },
    [builder],
  );

  // getBuilder is not strictly needed as `builder` is returned.
  // const getBuilder = () => builder;

  const resetBuilder = useCallback((initialBuilderData?: Builder) => {
    setBuilderInternal(initialBuilderData); // Allow resetting to a specific state or undefined
  }, []);

  return {
    builder,
    setBuilder, // Exposed for initialization
    addComponent,
    removeComponent,
    updateComponent,
    setStyles,
    resetBuilder,
  };
};

export default useBuilder;
