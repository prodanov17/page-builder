import type { Component } from '@/types/builder';
import React from 'react';

type ComponentsListProps = {
    components: Component[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onRemove: (id: string) => void;
};

type ComponentWithDepth = Component & { __depth?: number };

const ComponentsList: React.FC<ComponentsListProps> = ({ components, selectedId, onSelect, onRemove }) => {
    const flatten = (nodes: ComponentWithDepth[]): ComponentWithDepth[] => {
        const acc: ComponentWithDepth[] = [];
        const visit = (n: ComponentWithDepth, depth: number) => {
            acc.push({ ...n, __depth: depth });
            if (n.children) n.children.forEach((c: Component) => visit(c, depth + 1));
        };
        nodes.forEach(n => visit(n, 0));
        return acc;
    };
    const list = flatten(components);

    return (
        <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Layers</div>
            <div className="hide-scrollbars" style={{ maxHeight: 'calc(100vh - 240px)', overflow: 'auto' }}>
                {list.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8, background: selectedId === item.id ? 'rgba(37,99,235,0.08)' : 'transparent' }}>
                        <div style={{ width: 12 * (item.__depth || 1) }} />
                        <div style={{ flex: 1, cursor: 'pointer', fontWeight: selectedId === item.id ? 600 : 500 }} onClick={() => onSelect(item.id)}>
                            {item.type}
                        </div>
                        <button onClick={() => onSelect(item.id)} style={{ border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer' }}>Select</button>
                        <button onClick={() => onRemove(item.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComponentsList;

