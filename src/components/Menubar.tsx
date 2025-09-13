import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { HomeIcon } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface TopMenubarProps {
    showPanels: { topbar: boolean; sidebar: boolean; properties: boolean };
    setShowPanels: React.Dispatch<React.SetStateAction<{ topbar: boolean; sidebar: boolean; properties: boolean }>>;
    onUndo: () => void;
    onRedo: () => void;
    canRedo: boolean;
    canUndo: boolean;
    onExportJson: () => void;
    onExportHtml: () => void;
    onNewPage: () => void;
    onSave: () => void;
    onImport: (file: File) => void;
    onDeleteProject: () => void;
    onDuplicate: () => void;
    onCopy: () => void;
    onPaste: () => void;
    onCut: () => void;
    onDelete: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
    onPreviewPage: () => void;
}

export function TopMenubar({
    showPanels,
    setShowPanels,
    onUndo,
    onRedo,
    canRedo,
    canUndo,
    onDeleteProject,
    onExportJson,
    onExportHtml,
    onNewPage,
    onSave,
    onImport,
    onDuplicate,
    onCopy,
    onPaste,
    onCut,
    onDelete,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onPreviewPage,

}: TopMenubarProps) {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && onImport) {
            onImport(file);
        }
    };

    return (
        <>
            <Menubar className="px-4">
                <Button variant="ghost" onClick={() => { navigate("/") }}> <HomeIcon size={16} /></Button>
                <MenubarMenu>
                    <MenubarTrigger>File</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onClick={onNewPage}>New Page <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                        <MenubarItem onClick={() => { navigate("/projects") }}>Open...</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem onClick={onSave}>Save <MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem onClick={handleImportClick}>Import from JSON...</MenubarItem>
                        <MenubarSub>
                            <MenubarSubTrigger>Export</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem onClick={() => {
                                    if (onExportJson)
                                        onExportJson()
                                }}>as JSON</MenubarItem>
                                <MenubarItem onClick={() => {
                                    if (onExportHtml)
                                        onExportHtml()
                                }}
                                >as HTML/CSS</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSeparator />
                        <MenubarItem onClick={onDeleteProject} className="text-red-600 hover:text-red-800">Delete Project...</MenubarItem>
                    </MenubarContent >
                </MenubarMenu >
                <MenubarMenu>
                    <MenubarTrigger>Edit</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem disabled={!canUndo} onClick={() => {
                            if (onUndo && canUndo)
                                onUndo()
                        }}>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
                        <MenubarItem
                            disabled={!canRedo}
                            onClick={() => {
                                if (onRedo && canRedo)
                                    onRedo()
                            }}
                        >Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem onClick={onCut}>Cut <MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
                        <MenubarItem onClick={onCopy}>Copy <MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
                        <MenubarItem onClick={onPaste}>Paste <MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem onClick={onDuplicate}>Duplicate <MenubarShortcut>⌘D</MenubarShortcut></MenubarItem>
                        <MenubarItem onClick={onDelete}>Delete <MenubarShortcut>⌫</MenubarShortcut></MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>View</MenubarTrigger>
                    <MenubarContent>
                        <MenubarCheckboxItem
                            checked={showPanels?.topbar}
                            onCheckedChange={() => {
                                if (setShowPanels)
                                    setShowPanels(prev => ({ ...prev, topbar: !prev.topbar }))
                            }}
                        >Show Top Panel</MenubarCheckboxItem>
                        <MenubarCheckboxItem
                            checked={showPanels?.properties}
                            onCheckedChange={() => {
                                if (setShowPanels)
                                    setShowPanels(prev => ({ ...prev, properties: !prev.properties }))
                            }}
                        >Show Properties Panel</MenubarCheckboxItem>
                        <MenubarCheckboxItem
                            checked={showPanels?.sidebar}
                            onCheckedChange={() => {
                                if (setShowPanels)
                                    setShowPanels(prev => ({ ...prev, sidebar: !prev.sidebar }))
                            }}
                        >Show Side Panel</MenubarCheckboxItem>
                        <MenubarSeparator />
                        <MenubarCheckboxItem>Show Component Outlines</MenubarCheckboxItem>
                        <MenubarCheckboxItem>Show Grid</MenubarCheckboxItem>
                        <MenubarSeparator />
                        <MenubarItem onClick={onZoomIn}>Zoom In <MenubarShortcut>⌘+</MenubarShortcut></MenubarItem>
                        <MenubarItem onClick={onZoomOut}>Zoom Out <MenubarShortcut>⌘-</MenubarShortcut></MenubarItem>
                        <MenubarItem onClick={onZoomReset}>Reset Zoom</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Project</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onClick={onPreviewPage}>Preview <MenubarShortcut>⇧⌘P</MenubarShortcut></MenubarItem>
                        <MenubarItem>Publish...</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Project Settings...</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Help</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>Documentation</MenubarItem>
                        <MenubarItem>Keyboard Shortcuts</MenubarItem>
                        <MenubarItem>Support</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar >
            {/* Hidden file input to handle the import action */}
            < input
                type="file"
                ref={fileInputRef}
                accept=".json"
                style={{ display: 'none' }
                }
                onChange={handleFileChange}
            />
        </>
    )
}

export default TopMenubar
