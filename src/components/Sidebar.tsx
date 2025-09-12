import React, { useState } from 'react';
import ComponentsList from './ComponentsList';
import PrebuiltComponents from './PrebuiltComponents';
import type { Component } from '@/types/builder';

type SidebarProps = {
    components: Component[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onRemove: (id: string) => void;
    onAddPrebuilt: (component: Omit<Component, 'id'>) => void;
};

const Sidebar: React.FC<SidebarProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'layers' | 'components'>('layers');

    const tabStyle = (isActive: boolean): React.CSSProperties => ({
        flex: 1, padding: '8px 12px', border: 'none',
        borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
        background: 'transparent', cursor: 'pointer', fontWeight: isActive ? 600 : 500,
        color: isActive ? '#2563eb' : '#4b5563',
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '12px' }}>
                <button style={tabStyle(activeTab === 'layers')} onClick={() => setActiveTab('layers')}>Layers</button>
                <button style={tabStyle(activeTab === 'components')} onClick={() => setActiveTab('components')}>Components</button>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                {activeTab === 'layers' && (
                    <ComponentsList
                        components={props.components} selectedId={props.selectedId}
                        onSelect={props.onSelect} onRemove={props.onRemove}
                    />
                )}
                {activeTab === 'components' && <PrebuiltComponents onAddComponent={props.onAddPrebuilt} />}
            </div>
        </div>
    );
};

export default Sidebar;
