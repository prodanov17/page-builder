import React from 'react';
import { Type, Box, Image as ImageIcon, Square, FormInput, Trash2, MousePointerClick } from 'lucide-react';
import type { Component, ComponentType } from '@/types/builder';

type ComponentsListProps = {
    components: Component[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onRemove: (id: string) => void;
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

const ComponentsList: React.FC<ComponentsListProps> = ({ components, selectedId, onSelect, onRemove }) => {
    const flatten = (nodes: Component[], depth = 0): ComponentWithDepth[] => {
        return nodes.reduce((acc: ComponentWithDepth[], node) => {
            acc.push({ ...node, __depth: depth });
            if (node.children) {
                acc.push(...flatten(node.children, depth + 1));
            }
            return acc;
        }, []);
    };

    const list = flatten(components);

    return (
        <div className="hide-scrollbars" style={{ height: '100%', overflow: 'auto' }}>
            {list.length > 0 ? list.map((item) => (
                <div
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className="component-list-item"
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
                        borderRadius: 6, background: selectedId === item.id ? 'rgba(37,99,235,0.1)' : 'transparent',
                        border: selectedId === item.id ? '1px solid rgba(37,99,235,0.3)' : '1px solid transparent',
                        cursor: 'pointer', marginBottom: '2px',
                    }}
                >
                    <div style={{ paddingLeft: 16 * (item.__depth || 0) }} />
                    {getIconForType(item.type)}
                    <div style={{ flex: 1, fontWeight: selectedId === item.id ? 600 : 400, color: selectedId === item.id ? '#1e40af' : '#333' }}>
                        {item.type}
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                        className="remove-btn"
                        style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', opacity: 0 }}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )) : <div style={{ padding: 16, color: '#6b7280', textAlign: 'center' }}>
                No components added yet.</div>}
            <style>{`.component-list-item:hover .remove-btn { opacity: 1; }`}</style>
        </div>
    );
};

export default ComponentsList;
