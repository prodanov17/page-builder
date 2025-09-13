// src/hooks/useBuilder.js
import { useState, useCallback, useEffect, useRef } from "react";
import type {
  AlignSelfType,
  Builder,
  Component,
  PageProperties,
} from "../types/builder";
import { findComponentAndParent } from "@/utils/utility";

const useBuilder = () => {
  const [builder, setBuilderInternal] = useState<Builder | null>();

  // History management state
  const [history, setHistory] = useState<{ stack: Builder[]; index: number }>({
    stack: [],
    index: -1,
  });

  const isTimeTraveling = useRef(false); // A flag to prevent recording undo/redo actions

  const setBuilder = useCallback((newBuilderState?: Builder) => {
    if (newBuilderState) {
      setHistory({ stack: [newBuilderState], index: 0 });
    } else {
      setHistory({ stack: [], index: -1 });
    }
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
      // Use the functional update form to get the latest state
      setBuilderInternal((prevBuilder) => {
        if (!prevBuilder) return undefined; // Should not happen if builder is defined, but good for safety

        return {
          ...prevBuilder,
          styles: { ...prevBuilder.styles, ...newStyles },
        };
      });
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

  // --- Undo/Redo functions now use the new history object ---
  const canUndo = history.index > 0;
  const canRedo = history.index < history.stack.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
      isTimeTraveling.current = true;
      const newIndex = history.index - 1;
      setHistory((prev) => ({ ...prev, index: newIndex }));
      setBuilderInternal(history.stack[newIndex]);
      setTimeout(() => {
        isTimeTraveling.current = false;
      }, 50);
    }
  }, [canUndo, history]);

  const redo = useCallback(() => {
    if (canRedo) {
      isTimeTraveling.current = true;
      const newIndex = history.index + 1;
      setHistory((prev) => ({ ...prev, index: newIndex }));
      setBuilderInternal(history.stack[newIndex]);
      setTimeout(() => {
        isTimeTraveling.current = false;
      }, 50);
    }
  }, [canRedo, history]);

  const resetBuilder = useCallback((initialBuilderData?: Builder) => {
    setBuilderInternal(initialBuilderData); // Allow resetting to a specific state or undefined
  }, []);

  const updatePageProperties = useCallback(
    (newProperties: PageProperties) => {
      if (!builder) return;
      setBuilderInternal((prevBuilder) => ({
        ...prevBuilder!,
        ...newProperties,
      }));
    },
    [builder],
  );

  const moveComponent = useCallback(
    (componentId: string, direction: "up" | "down") => {
      if (!builder) return;

      setBuilderInternal((prevBuilder) => {
        if (!prevBuilder) return prevBuilder;

        const result = findComponentAndParent(
          prevBuilder.components,
          componentId,
        );
        if (!result) return prevBuilder;

        const { parent, index } = result;
        const siblings = parent ? parent.children! : prevBuilder.components;
        const newIndex = direction === "up" ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= siblings.length) {
          return prevBuilder; // Cannot move
        }

        const newSiblings = [...siblings];
        // Swap the elements in the new array
        [newSiblings[index], newSiblings[newIndex]] = [
          newSiblings[newIndex],
          newSiblings[index],
        ];

        // If the component was at the root level
        if (!parent) {
          return { ...prevBuilder, components: newSiblings };
        }

        // If the component is nested, we need to update the parent's children
        const updateTree = (nodes: Component[]): Component[] => {
          return nodes.map((node) => {
            if (node.id === parent.id) {
              return { ...node, children: newSiblings };
            }
            if (node.children) {
              return { ...node, children: updateTree(node.children) };
            }
            return node;
          });
        };

        return {
          ...prevBuilder,
          components: updateTree(prevBuilder.components),
        };
      });
    },
    [builder],
  );

  const renameComponent = useCallback(
    (componentId: string, newName: string) => {
      setBuilderInternal((prevBuilder) => {
        if (!prevBuilder) return prevBuilder;

        const updateNameRecursive = (nodes: Component[]): Component[] => {
          return nodes.map((node) => {
            if (node.id === componentId) {
              return { ...node, name: newName };
            }
            if (node.children) {
              return { ...node, children: updateNameRecursive(node.children) };
            }
            return node;
          });
        };

        return {
          ...prevBuilder,
          components: updateNameRecursive(prevBuilder.components),
        };
      });
    },
    [],
  );

  useEffect(() => {
    if (isTimeTraveling.current || !builder) {
      return;
    }

    // Use the functional update form to avoid dependency issues
    setHistory((prevHistory) => {
      const newStack = prevHistory.stack.slice(0, prevHistory.index + 1);
      newStack.push(builder);
      return {
        stack: newStack,
        index: newStack.length - 1,
      };
    });
  }, [builder]); // The only true dependency is the builder state itself.

  return {
    builder,
    setBuilder, // Exposed for initialization
    addComponent,
    removeComponent,
    updateComponent,
    setStyles,
    resetBuilder,
    canUndo,
    canRedo,
    undo,
    redo,
    updateChildPlacement, // <-- add to return
    updatePageProperties,
    moveComponent,
    renameComponent,
  };
};

export default useBuilder;
