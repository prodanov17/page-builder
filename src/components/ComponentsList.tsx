import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Type, Box, Image as ImageIcon, Square, FormInput, Trash2, MousePointerClick, ArrowDown, ArrowUp, ChevronDown, Pencil } from 'lucide-react';
import type { Component, ComponentType } from '@/types/builder';

type ComponentsListProps = {
    components: Component[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onRemove: (id: string) => void;
    onMove: (componentId: string, direction: 'up' | 'down') => void;
    onRename: (componentId: string, newName: string) => void;
};

type ComponentWithDepth = Component & { __depth?: number };

const getIconForType = (type: ComponentType) => {
    switch (type) {
        case 'text': return <Type size={16} className="text-gray-500" />;
        case 'container': return <Box size={16} className="text-gray-500" />;
        case 'image': return <ImageIcon size={16} className="text-gray-500" />;
        case 'button': return <MousePointerClick size={16} className="text-gray-500" />;
        case 'input': return <FormInput size={16} className="text-gray-500" />;
        default: return <Square size={16} className="text-gray-500" />;
    }
};

const ComponentsList: React.FC<ComponentsListProps> = ({ components, selectedId, onSelect, onRemove, onMove, onRename }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const [collapsedIds, setCollapsedIds] = useState(new Set<string>());

    const toggleCollapse = (id: string) => {
        setCollapsedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // UPDATED: The flatten function now skips children of collapsed containers
    const flatten = useCallback((nodes: Component[], depth = 0): ComponentWithDepth[] => {
        return nodes.reduce((acc: ComponentWithDepth[], node) => {
            acc.push({ ...node, __depth: depth });
            // Only recurse if the container has children and is NOT collapsed
            if (node.children && !collapsedIds.has(node.id)) {
                acc.push(...flatten(node.children, depth + 1));
            }
            return acc;
        }, []);
    }, [collapsedIds]);

    const handleStartEditing = useCallback((item: Component) => {
        setEditingId(item.id);
        setRenameValue(item.name || item.type);
    }, [])

    const handleFinishEditing = () => {
        if (editingId && renameValue.trim()) {
            onRename(editingId, renameValue.trim());
        }
        setEditingId(null);
        setRenameValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();

        if (e.key === 'Enter') {
            handleFinishEditing()
        }
        else if (e.key === 'Escape') setEditingId(null);
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
                return;
            }

            if (e.key === 'Enter' && selectedId && !editingId) {
                e.preventDefault();
                // We need to find the item from the full, un-flattened list
                const findItem = (nodes: Component[]): Component | null => {
                    for (const node of nodes) {
                        if (node.id === selectedId) return node;
                        if (node.children) {
                            const found = findItem(node.children);
                            if (found) return found;
                        }
                    }
                    return null;
                }
                const selectedItem = findItem(components);
                if (selectedItem) {
                    handleStartEditing(selectedItem);
                }
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
        // The dependency array is now stable
    }, [selectedId, editingId, components, handleStartEditing]);

    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingId]);

    const list = flatten(components);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;
            if (!selectedId) return;

            const currentIndex = list.findIndex(c => c.id === selectedId);
            if (currentIndex === -1) return;

            const currentItem = list[currentIndex];

            switch (e.key) {
                case 'ArrowUp': {
                    e.preventDefault();
                    const nextIndex = currentIndex - 1;
                    if (nextIndex >= 0) onSelect(list[nextIndex].id);
                    break;
                }
                case 'ArrowDown': {
                    e.preventDefault();
                    const nextIndex = currentIndex + 1;
                    if (nextIndex < list.length) onSelect(list[nextIndex].id);
                    break;
                }
                case 'ArrowRight': { // Expand or navigate to first child
                    e.preventDefault();
                    if (currentItem.type === 'container' && currentItem.children?.length) {
                        if (collapsedIds.has(currentItem.id)) {
                            toggleCollapse(currentItem.id); // Expand if collapsed
                        } else {
                            const nextIndex = currentIndex + 1; // Move to first child
                            if (nextIndex < list.length) onSelect(list[nextIndex].id);
                        }
                    }
                    break;
                }
                case 'ArrowLeft': { // Collapse or navigate to parent
                    e.preventDefault();
                    if (currentItem.type === 'container' && !collapsedIds.has(currentItem.id) && currentItem.children?.length) {
                        toggleCollapse(currentItem.id); // Collapse if expanded
                    } else if (currentItem.__depth && currentItem.__depth > 0) {
                        // Find the parent by traversing up the flattened list
                        for (let i = currentIndex - 1; i >= 0; i--) {
                            if (list[i].__depth === currentItem.__depth - 1) {
                                onSelect(list[i].id);
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [selectedId, list, onSelect, collapsedIds, toggleCollapse]); // Dependencies for navigation


    return (
        <div className="hide-scrollbars h-full overflow-auto">
            {list.length > 0 ? list.map((item) => (
                <div
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className="component-list-item group flex items-center gap-2 px-2 py-1.5 rounded-md border border-transparent cursor-pointer mb-0.5"
                    style={{ background: selectedId === item.id ? 'rgba(37,99,235,0.1)' : 'transparent', border: selectedId === item.id ? '1px solid rgba(37,99,235,0.3)' : '1px solid transparent' }}
                >
                    <div style={{ paddingLeft: 16 * (item.__depth || 0) }} />

                    {/* NEW: Collapse button for containers */}
                    {item.type === 'container' && item.children && item.children.length > 0 ? (
                        <button onClick={(e) => { e.stopPropagation(); toggleCollapse(item.id); }} className="p-0.5 rounded hover:bg-slate-200">
                            <ChevronDown size={14} className={`transition-transform ${collapsedIds.has(item.id) ? '-rotate-90' : 'rotate-0'}`} />
                        </button>
                    ) : (
                        <span className="w-[18px]"></span> // Placeholder for alignment
                    )}

                    {getIconForType(item.type)}
                    <div className="flex-1 text-sm hover:overflow-hidden ">
                        {editingId === item.id ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onBlur={handleFinishEditing}
                                onKeyDown={handleKeyDown}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full bg-white border border-blue-500 rounded px-1 py-0 text-sm"
                            />
                        ) : (
                            <span
                                className="truncate"
                                onDoubleClick={(e) => { e.stopPropagation(); handleStartEditing(item); }}
                                style={{ fontWeight: selectedId === item.id ? 600 : 400 }}
                            >
                                {item.name || item.type}
                            </span>
                        )}
                    </div>


                    {/* NEW: Move buttons, visible on hover */}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="Move Up" onClick={(e) => { e.stopPropagation(); onMove(item.id, 'up'); }} className="p-1 rounded hover:bg-slate-200"><ArrowUp size={14} /></button>
                        <button title="Move Down" onClick={(e) => { e.stopPropagation(); onMove(item.id, 'down'); }} className="p-1 rounded hover:bg-slate-200"><ArrowDown size={14} /></button>
                        <button title="Remove" onClick={(e) => { e.stopPropagation(); onRemove(item.id); }} className="p-1 rounded hover:bg-slate-200 text-red-500"><Trash2 size={14} /></button>
                    </div>
                </div>
            )) : <div className="p-4 text-slate-500 text-center">No components added yet.</div>}
        </div>
    );
};

export default ComponentsList;
