// src/App.jsx
import React, { useEffect, useState, useCallback } from 'react';
import EditorLayout from './components/EditorLayout';
import CanvasRenderer from './renderer/CanvasRenderer';
import PropertiesEditor from './components/PropertiesEditor';
import ComponentsList from './components/ComponentsList';
import useBuilder, { type Builder } from './hooks/useBuilder';
import ComponentPalette from './components/CommandPallette';

// Simple ID generator
const generateId = () => `el-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;

function App() {
    const {
        builder,
        setBuilder, // Use this for initialization
        addComponent: addBuilderComponent,
        removeComponent: removeBuilderComponent,
        updateComponent: updateBuilderComponent,
        setStyles: setBuilderStyles,
        updateChildPlacement, // <-- add this
    } = useBuilder();

    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    const [targetParentIdForNewComponent, setTargetParentIdForNewComponent] = useState<string | null>(null);


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

    const handleAddComponent = useCallback((type: any, defaultProps = {}, children?: any[]) => {
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
            const findComponentRecursive = (component: any, id: string | null): any | null => {
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
    function findComponentRecursive(component: any, id: string | null): any | null {
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

    // Use a single recursive search over all root components
    const selectedComponent = builder?.components
        .map(comp => findComponentRecursive(comp, selectedComponentId))
        .find(Boolean) || null;


    if (!builder) {
        return <div>Loading Builder...</div>;
    }

    return (
        <div className="app-container">
            <EditorLayout
                topbar={<ComponentPalette onAddComponent={handleAddComponent} />}
                sidebar={<ComponentsList components={builder.components} selectedId={selectedComponentId} onSelect={handleSelectComponent} onRemove={removeBuilderComponent} />}
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
                    selectedComponent ? (
                        <PropertiesEditor
                            key={selectedComponent.id}
                            component={selectedComponent}
                            onUpdateComponent={updateBuilderComponent}
                            onRemoveComponent={removeBuilderComponent}
                        />
                    ) : (
                        <div style={{ padding: '15px', textAlign: 'center', color: '#777' }}>
                            Select an element on the canvas to edit its properties.
                        </div>
                    )
                }
            />
            {/* For Debugging */}
            {/* <pre style={{position: 'fixed', bottom: 0, left:0, width: '100%', maxHeight: '150px', overflow:'auto', background:'rgba(0,0,0,0.7)', color: 'white', zIndex:1000, fontSize:'10px', padding:'5px' }}>
         Selected ID: {selectedComponentId} <br/>
         Target Parent ID: {targetParentIdForNewComponent} <br/>
         Builder State: {JSON.stringify(builder, null, 2)}
       </pre> */}
        </div>
    );
}

export default App;
