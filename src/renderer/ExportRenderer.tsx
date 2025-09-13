import React from 'react';
import type { Component } from '../types/builder';
import { componentMap } from '@/builder-elements/componentMap';

interface ExportComponentProps {
    component: Component;
}

// This is a simplified version of your component renderer
const ExportedComponent: React.FC<ExportComponentProps> = ({ component }) => {
    const ComponentToRender = componentMap[component.type];
    if (!ComponentToRender) return null;

    return (
        <ComponentToRender
            id={component.id}
            props={component.props}
            children={component.children}
            isEditorMode={false} // Ensure editor mode is off
        // CRITICAL: We DO NOT pass any editor-specific props like isEditorMode, onSelect, etc.
        />
    );
};


interface ExportRendererProps {
    components: Component[];
    globalStyles: React.CSSProperties;
}

// This is the main renderer for the export
const ExportRenderer: React.FC<ExportRendererProps> = ({ components, globalStyles }) => {
    return (
        <div className="canvas" style={globalStyles}>
            {components.map(component => (
                <ExportedComponent key={component.id} component={component} />
            ))}
        </div>
    );
};

export default ExportRenderer;
