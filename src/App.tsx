// src/App.jsx
import { useEffect, useState, useCallback } from 'react';
import EditorLayout from './components/EditorLayout';
import CanvasRenderer from './renderer/CanvasRenderer';
import PropertiesEditor from './components/PropertiesEditor';
import useBuilder from './hooks/useBuilder';
import ComponentPalette from './components/CommandPallette';
import type { Builder, Component, ComponentType } from './types/builder';
import { Copy } from 'lucide-react';
import Sidebar from './components/Sidebar';

// Simple ID generator
const generateId = () => `el-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;

const regenerateIds = (component: Omit<Component, 'id'>): Component => {
    const newComponent: Component = { ...component, id: generateId() };
    if (newComponent.children) {
        newComponent.children = newComponent.children.map(child => regenerateIds(child));
    }
    return newComponent;
};

function App() {
    const {
        builder,
        setBuilder, // Use this for initialization
        addComponent: addBuilderComponent,
        removeComponent: removeBuilderComponent,
        updateComponent: updateBuilderComponent,
        updateChildPlacement, // <-- add this
        setStyles,
    } = useBuilder();

    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    const [targetParentIdForNewComponent, setTargetParentIdForNewComponent] = useState<string | null>(null);
    const [showDebugInfo, setShowDebugInfo] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!document.activeElement) return;
            if (document.activeElement.tagName.toLowerCase() === 'input') return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedComponentId) {
                    removeBuilderComponent(selectedComponentId);
                    setSelectedComponentId(null);
                }
            } else if (e.key.toLowerCase() === 'd' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                setShowDebugInfo(prev => !prev);
            } else if (e.key === "Escape") {
                setSelectedComponentId(null);
                setTargetParentIdForNewComponent(null);
            }

        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedComponentId, removeBuilderComponent]);

    // Initialize the builder state on mount
    useEffect(() => {
        if (!builder) { // Only initialize if it's not already set (e.g., from a loaded state)
            const initialBuilderData: Builder = {
                id: 'main-page-builder',
                name: 'My Awesome Page',
                components: [], // Start with a blank canvas
                styles: { // Global styles for the canvas itself
                    backgroundColor: '#ffffff',
                    padding: '0',
                    margin: '0',
                    minHeight: 'calc(100vh - 40px)', // Ensure canvas is visible
                    border: '1px solid #eee',
                },
            };
            setBuilder(initialBuilderData);
        }
    }, [builder, setBuilder]);

    const handleSelectComponent = useCallback((id: string) => {
        setSelectedComponentId(id);
    }, []);

    const handleAddComponent = useCallback((type: ComponentType, defaultProps = {}, children?: Component[]) => {
        const newComponent = {
            id: generateId(),
            type: type,
            props: { ...defaultProps },
            children: children || (type === 'container' ? [] : undefined),
        };
        // If a parent is targeted, use it. Otherwise, if a container is selected, add to it.
        let parentId = targetParentIdForNewComponent;
        if (!parentId && selectedComponentId && builder) {
            // Find the selected component
            const findComponentRecursive = (component: Component, id: string | null): Component | null => {
                if (!id) return null;
                if (component.id === id) {
                    return component;
                }
                if (component.children) {
                    for (const child of component.children) {
                        const found = findComponentRecursive(child, id);
                        if (found) {
                            return found;
                        }
                    }
                }
                return null;
            };
            let selected = null;
            for (const comp of builder.components) {
                selected = findComponentRecursive(comp, selectedComponentId);
                if (selected) break;
            }
            if (selected && selected.type === 'container') {
                parentId = selectedComponentId;
            }
        }
        addBuilderComponent(newComponent, parentId || undefined);
        setTargetParentIdForNewComponent(null); // Reset after adding
    }, [addBuilderComponent, targetParentIdForNewComponent, selectedComponentId, builder]);

    // This function can be called by a ContainerElement when it wants to add a child
    const handleAddComponentRequestToContainer = useCallback((parentId: string) => {
        setTargetParentIdForNewComponent(parentId);
        // Optionally, open a mini-palette or modal here to choose which component to add
        // For now, let's assume the main palette will be used and targetParentIdForNewComponent will be picked up
        console.log(`Requested to add component to container: ${parentId}. Select an element from the palette.`);
        // You could also directly show a prompt or a small version of the palette
        // For example, if you had a modal for component selection:
        // openComponentSelectionModal(parentId);
    }, []);


    // Find the selected component recursively in the builder tree
    function findComponentRecursive(component: Component, id: string | null): Component | null {
        if (!id) return null;
        if (component.id === id) {
            return component;
        }
        if (component.children) {
            for (const child of component.children) {
                const found = findComponentRecursive(child, id);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    }

    const handleAddPrebuiltComponent = useCallback((prebuilt: Omit<Component, 'id'>) => {
        const newComponentWithUniqueIds = regenerateIds(prebuilt);
        // Implement parent targeting logic here if needed
        addBuilderComponent(newComponentWithUniqueIds);
    }, [addBuilderComponent]);

    // Use a single recursive search over all root components
    const selectedComponent = builder?.components
        .map(comp => findComponentRecursive(comp, selectedComponentId))
        .find(Boolean) || null;

    // NEW handler to pass to the properties editor for global styles
    const handleUpdatePageStyles = useCallback((newStyles: React.CSSProperties) => {
        setStyles(newStyles as { [key: string]: string });
    }, [setStyles]);


    if (!builder) {
        return <div>Loading Builder...</div>;
    }

    console.log("Selected Component:", selectedComponent);

    return (
        <div className="app-container">
            <EditorLayout
                topbar={<ComponentPalette onAddComponent={handleAddComponent} />}
                sidebar={<Sidebar
                    components={builder.components}
                    selectedId={selectedComponentId}
                    onSelect={handleSelectComponent}
                    onRemove={removeBuilderComponent}
                    onAddPrebuilt={handleAddPrebuiltComponent}
                />}
                canvas={
                    <CanvasRenderer
                        components={builder.components}
                        globalStyles={builder.styles}
                        onSelectComponent={handleSelectComponent}
                        selectedComponentId={selectedComponentId}
                        onAddComponentRequestToContainer={handleAddComponentRequestToContainer}
                        updateChildPlacement={updateChildPlacement}
                    />
                }
                properties={
                    <PropertiesEditor
                        key={selectedComponent?.id || "page-properties"}
                        component={selectedComponent}
                        onUpdateComponent={updateBuilderComponent}
                        onRemoveComponent={removeBuilderComponent}
                        pageStyles={builder.styles}
                        onUpdatePageStyles={handleUpdatePageStyles}
                    />
                }
            />
            {/* For Debugging */}
            {showDebugInfo && <pre className="flex flex-col" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', maxHeight: '150px', overflow: 'auto', background: 'rgba(0,0,0,0.7)', color: 'white', zIndex: 1000, fontSize: '10px', padding: '5px' }}>
                <button className="flex items-center gap-1 w-full cursor-pointer" onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(builder, null, 2));
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                }}><Copy size={12} />{!copySuccess ? "Copy state" : "Copied!"}</button><br />
                Selected ID: {selectedComponentId} <br />
                Target Parent ID: {targetParentIdForNewComponent} <br />
                Builder State: {JSON.stringify(builder, null, 2)}
            </pre>}
        </div >
    );
}

export default App;
