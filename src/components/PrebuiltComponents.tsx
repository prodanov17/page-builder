import React from 'react';
import { Layers } from 'lucide-react';
import type { Component } from '@/types/builder';
import { prebuiltComponents } from '@/utils/prebuilt';

type PrebuiltComponentsProps = {
    onAddComponent: (component: Omit<Component, 'id'>) => void;
};

const PrebuiltComponents: React.FC<PrebuiltComponentsProps> = ({ onAddComponent }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {prebuiltComponents.map(({ name, component }) => (
                <button
                    key={name}
                    onClick={() => onAddComponent(component)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
                        width: '100%', textAlign: 'left', background: '#f9fafb',
                        border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontWeight: 500,
                    }}
                >
                    <Layers size={18} className="text-blue-600" />
                    {name}
                </button>
            ))}
        </div>
    );
};

export default PrebuiltComponents;
