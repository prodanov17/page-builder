// src/App.jsx
import { useEffect, useState, useCallback, useRef } from 'react';
import EditorLayout from '@/components/EditorLayout';
import CanvasRenderer from '@/renderer/CanvasRenderer';
import PropertiesEditor from '@/components/PropertiesEditor';
import useBuilder from '@/hooks/useBuilder';
import ComponentPalette from '@/components/CommandPallette';
import type { Component, ComponentType, PageProperties } from '@/types/builder';
import { Copy } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import TopMenubar from '@/components/Menubar';
import { useDocumentActions } from '@/hooks/useDocumentActions';
import { useGlobalKeybinds } from '@/hooks/useGlobalKeybinds';
import { copyComponent, findComponentAndParent, generateId, pasteComponent, regenerateIds } from '@/utils/utility';
import { toast } from 'sonner';
import { createNewDocument, deleteDocument, loadDocument, saveDocument } from '@/data/documentRepository';
import { useAutoSave } from '@/hooks/useAutoSave';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useBrowserZoom } from '@/hooks/useBrowserZoom';

function Project() {
    const { projectId } = useParams<{ projectId: string }>();
    const [projectExists, setProjectExists] = useState<boolean | null>(null); // null = loading

    const navigate = useNavigate();

    const { zoomIn, zoomOut, resetZoom } = useBrowserZoom();

    const {
        builder,
        setBuilder, // Use this for initialization
        addComponent: addBuilderComponent,
        removeComponent: removeBuilderComponent,
        updateComponent: updateBuilderComponent,
        updateChildPlacement, // <-- add this
        updatePageProperties,
        canUndo,
        canRedo,
        undo,
        redo,
        setStyles,
        moveComponent,
        renameComponent,
    } = useBuilder();

    // Instantiate the new hook with the builder state and its setter
    const {
        saveToLocalStorage,
        exportAsJson,
        exportAsHtml,
        importFromJson,
    } = useDocumentActions(builder || null, setBuilder);

    const [showPanels, setShowPanels] = useState({
        sidebar: true,
        properties: true,
        topbar: true,
    });

    const canvasRef = useRef<HTMLDivElement>(null);

    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
    const [targetParentIdForNewComponent, setTargetParentIdForNewComponent] = useState<string | null>(null);
    const [showDebugInfo, setShowDebugInfo] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleClearSelection = useCallback(() => {
        setSelectedComponentId(null);
        setTargetParentIdForNewComponent(null);
    }, []);

    const handleDeleteProject = useCallback(() => {
        if (!projectId) return;

        // Add a confirmation step to prevent accidental deletion
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this project? This action cannot be undone."
        );

        if (isConfirmed) {
            deleteDocument(projectId);
            toast.success("Project deleted successfully.");
            // Navigate the user to the projects list after deletion
            navigate('/projects');
        }
    }, [projectId, navigate]);

    const handleResetPage = useCallback(() => {
        const newDoc = createNewDocument();
        setBuilder(newDoc);
        setSelectedComponentId(null);
        setTargetParentIdForNewComponent(null);
        toast.success("Page reset to initial state.");
    }, [setBuilder]);

    const handleSave = useCallback(() => {
        if (builder) {
            saveDocument(builder);
        }
    }, [builder]);


    useEffect(() => {
        if (projectId) {
            const doc = loadDocument(projectId);
            console.log("Loaded document:", doc);
            if (doc) {
                setBuilder(doc);
                setProjectExists(true);
            } else {
                setProjectExists(false);
            }
        }
    }, [projectId, setBuilder]);

    const { status, savedAt } = useAutoSave(builder || null, handleSave);

    const handleSelectComponent = useCallback((id: string) => {
        setSelectedComponentId(id);
    }, []);

    /**
     * Adds a new component, placing it inside a selected container if possible.
     */
    const handleAddComponent = useCallback((type: ComponentType, defaultProps = {}) => {
        if (!builder) return;

        const newComponent: Omit<Component, 'id'> = {
            type,
            props: defaultProps,
            children: type === 'container' ? [] : undefined,
        };

        let parentId: string | undefined = undefined;

        // Check if a component is selected and if it's a container
        if (selectedComponentId) {
            const result = findComponentAndParent(builder.components, selectedComponentId);
            if (result && result.node.type === 'container') {
                parentId = result.node.id; // Target the selected container
            } else if (result && result.parent) {
                parentId = result.parent.id; // Target the parent of the selected non-container
            }
        }

        addBuilderComponent(regenerateIds(newComponent), parentId);

    }, [builder, selectedComponentId, addBuilderComponent]);


    // This function can be called by a ContainerElement when it wants to add a child
    const handleAddComponentRequestToContainer = useCallback((parentId: string) => {
        setTargetParentIdForNewComponent(parentId);
        setSelectedComponentId(parentId); // Clear current selection to avoid confusion
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

    const handleDuplicateComponent = useCallback(() => {
        if (!builder || !selectedComponentId) return;

        // 1. Find the component and its parent in the tree
        const result = findComponentAndParent(builder.components, selectedComponentId);
        if (!result) return;

        const { node: componentToDuplicate, parent } = result;
        const parentId = parent ? parent.id : undefined; // If parent is null, it's a root component

        // 2. Create a deep clone with new IDs
        const newComponent = regenerateIds(componentToDuplicate);

        // 3. Add the new component to the correct parent
        addBuilderComponent(newComponent, parentId);
        toast.success(`Duplicated "${newComponent.name || newComponent.type}".`);

    }, [builder, selectedComponentId, addBuilderComponent]);



    const handleDeleteComponent = useCallback(() => {
        if (selectedComponentId) {
            removeBuilderComponent(selectedComponentId);
            setSelectedComponentId(null);
        }
    }, [selectedComponentId, removeBuilderComponent]);

    const handleCutComponent = useCallback(() => {
        if (selectedComponent) {
            copyComponent(selectedComponent);
            removeBuilderComponent(selectedComponent.id);
            setSelectedComponentId(null);
        }
    }, [selectedComponent, removeBuilderComponent]);


    useGlobalKeybinds({
        selectedComponent,
        newPage: handleResetPage,
        undo,
        redo,
        removeComponent: removeBuilderComponent,
        save: saveToLocalStorage,
        addComponent: addBuilderComponent,
        clearSelection: handleClearSelection,
        setShowDebugInfo,
        duplicateComponent: handleDuplicateComponent,
    });

    const handleCopyComponent = useCallback(() => {
        if (!selectedComponent) return;
        copyComponent(selectedComponent);
    }, [selectedComponent]);

    const handlePasteComponent = useCallback(async () => {
        const pasted = await pasteComponent();
        if (pasted) {
            addBuilderComponent(pasted);
        } else {
            toast.error("No valid component found on clipboard.");
        }
    }, [addBuilderComponent]);

    const handlePreviewPage = useCallback(() => {
        navigate(`/preview/${projectId}`);
    }, [navigate, projectId]);

    if (projectExists === null) {
        return <div className="flex items-center justify-center h-screen font-sans">Loading project...</div>;
    }

    if (projectExists === false) {
        return (
            <div className="flex flex-col items-center justify-center h-screen font-sans text-center bg-slate-50 p-4">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Project Not Found</h1>
                <p className="text-slate-600 mb-6">The project you are looking for does not exist or has been deleted.</p>
                <Link
                    to="/projects"
                    className="px-6 py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition"
                >
                    Go Back to Projects
                </Link>
            </div>
        );
    }

    if (!builder) {
        return <div>Loading Builder...</div>;
    }


    console.log("Selected Component:", selectedComponent);

    return (
        <div className="app-container">
            <EditorLayout
                showPanels={showPanels}
                menubar={<TopMenubar
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    onZoomReset={resetZoom}
                    onPreviewPage={handlePreviewPage}
                    showPanels={showPanels}
                    setShowPanels={setShowPanels}
                    onDuplicate={handleDuplicateComponent}
                    onCopy={handleCopyComponent}
                    onPaste={handlePasteComponent}
                    onCut={handleCutComponent}
                    onDelete={handleDeleteComponent}
                    onDeleteProject={handleDeleteProject}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={canUndo}
                    onNewPage={handleResetPage}
                    canRedo={canRedo}
                    onExportJson={exportAsJson}
                    onExportHtml={() => {
                        setSelectedComponentId(null); // Deselect to avoid selection outlines in export
                        exportAsHtml()
                    }}
                    onImport={importFromJson}
                    onSave={saveToLocalStorage}
                />}
                topbar={<ComponentPalette
                    saveStatus={status}
                    savedAt={savedAt}
                    onAddComponent={handleAddComponent}
                />}
                sidebar={<Sidebar
                    components={builder.components}
                    selectedId={selectedComponentId}
                    onSelect={handleSelectComponent}
                    onRemove={removeBuilderComponent}
                    onAddPrebuilt={handleAddPrebuiltComponent}
                    onMove={moveComponent}
                    onRename={renameComponent}
                />}
                canvas={
                    <CanvasRenderer
                        ref={canvasRef}
                        components={builder.components}
                        globalStyles={builder.styles}
                        onSelectComponent={handleSelectComponent}
                        selectedComponentId={selectedComponentId}
                        unselectComponent={() => setSelectedComponentId(null)}
                        onAddComponentRequestToContainer={handleAddComponentRequestToContainer}
                        updateChildPlacement={updateChildPlacement}
                        isEditorMode={true}
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
                        pageProperties={{ name: builder.name }}
                        onUpdatePageProperties={(properties: PageProperties) => {
                            updatePageProperties({ name: properties.name })
                        }}
                        onRenameComponent={renameComponent}
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

export default Project;
