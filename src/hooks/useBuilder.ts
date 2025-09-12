// src/hooks/useBuilder.js
import { useState, useCallback } from "react";

export type AlignSelfType =
  | "auto"
  | "flex-start"
  | "flex-end"
  | "center"
  | "baseline"
  | "stretch";

export type JustifyContentType =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";

export interface Component {
  id: string;
  type: "button" | "input" | "container" | "text" | "image" | "icon" | "input";
  props: {
    [key: string]: string | number | boolean | undefined | null;
    position?: string;
    label?: string;
    src?: string;
    altText?: string;
    width?: string;
    height?: string;
    content?: string;
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    placeholder?: string;
    name?: string;
    size?: number;
    justifyContent?: JustifyContentType;
    flexDirection?: "row" | "column";
    kind?: "text" | "checkbox" | "radio";
  };
  placement?: {
    order?: number;
    alignSelf?: AlignSelfType;
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

      // Helper to find parent container and its children
      function findParentAndIndex(
        components: Component[],
        childId: string,
        parent: Component | null = null,
      ): { parent: Component | null; index: number; path: number[] } | null {
        for (let i = 0; i < components.length; i++) {
          const comp = components[i];
          if (comp.id === childId) {
            return { parent, index: i, path: [] };
          }
          if (comp.children) {
            const result = findParentAndIndex(comp.children, childId, comp);
            if (result) {
              result.path.unshift(i);
              return result;
            }
          }
        }
        return null;
      }

      // Special logic for image background transfer
      if (
        newPartialComponent.props &&
        newPartialComponent.props.__setAsBackground
      ) {
        // Find parent container
        const parentInfo = findParentAndIndex(builder.components, id);
        if (
          parentInfo &&
          parentInfo.parent &&
          parentInfo.parent.type === "container"
        ) {
          // Remove image from parent's children and set backgroundImage
          const parentId = parentInfo.parent.id;
          const imageSrc = newPartialComponent.props.src;
          // Remove image from children
          function removeChildAndSetBackground(
            components: Component[],
          ): Component[] {
            return components.map((comp) => {
              if (comp.id === parentId) {
                return {
                  ...comp,
                  props: { ...comp.props, backgroundImage: imageSrc },
                  children: (comp.children || []).filter(
                    (child) => child.id !== id,
                  ),
                };
              } else if (comp.children) {
                return {
                  ...comp,
                  children: removeChildAndSetBackground(comp.children),
                };
              }
              return comp;
            });
          }
          setBuilderInternal((prevBuilder) => ({
            ...prevBuilder!,
            components: removeChildAndSetBackground(prevBuilder!.components),
          }));
          return;
        }
      }
      // Special logic for restoring image from background
      if (
        newPartialComponent.props &&
        newPartialComponent.props.__restoreFromBackground
      ) {
        // Find parent container
        const parentInfo = findParentAndIndex(builder.components, id);
        if (
          parentInfo &&
          parentInfo.parent &&
          parentInfo.parent.type === "container"
        ) {
          const parentId = parentInfo.parent.id;
          // const imageSrc = newPartialComponent.props.src;
          // Add image back as child and clear backgroundImage
          function addChildAndClearBackground(
            components: Component[],
          ): Component[] {
            return components.map((comp) => {
              if (comp.id === parentId) {
                // Only add if not already present
                const alreadyPresent = (comp.children || []).some(
                  (child) => child.id === id,
                );
                return {
                  ...comp,
                  props: { ...comp.props, backgroundImage: undefined },
                  children: alreadyPresent
                    ? comp.children
                    : [
                        ...(comp.children || []),
                        {
                          id,
                          type: "image",
                          props: {
                            ...newPartialComponent.props,
                            background: false,
                            __wasBackground: false,
                          },
                        },
                      ],
                };
              } else if (comp.children) {
                return {
                  ...comp,
                  children: addChildAndClearBackground(comp.children),
                };
              }
              return comp;
            });
          }
          setBuilderInternal((prevBuilder) => ({
            ...prevBuilder!,
            components: addChildAndClearBackground(prevBuilder!.components),
          }));
          return;
        }
      }

      const updateRecursive = (
        components: Component[],
        targetId: string,
        updates: Partial<Component>,
      ): Component[] => {
        return components.map((comp) => {
          if (comp.id === targetId) {
            // Merge props carefully if only props are updated
            if (updates.props && !updates.type && !updates.children) {
              // Remove special keys
              const { ...restProps } = updates.props;
              return { ...comp, props: { ...comp.props, ...restProps } };
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

  const updateChildPlacement = useCallback(
    (
      childId: string,
      placement: { order?: number; alignSelf?: AlignSelfType },
    ) => {
      if (!builder) return;
      function updatePlacementRecursive(components: Component[]): Component[] {
        return components.map((comp) => {
          if (comp.id === childId) {
            return {
              ...comp,
              placement: { ...comp.placement, ...placement },
            };
          }
          if (comp.children) {
            return {
              ...comp,
              children: updatePlacementRecursive(comp.children),
            };
          }
          return comp;
        });
      }
      setBuilderInternal((prevBuilder) => ({
        ...prevBuilder!,
        components: updatePlacementRecursive(prevBuilder!.components),
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
    updateChildPlacement, // <-- add to return
  };
};

export default useBuilder;
