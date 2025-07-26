// src/renderer/CanvasRenderer.jsx
import React from 'react';
import { componentMap } from '../builder-elements/componentMap';

const CanvasRenderer = ({ components, globalStyles, onSelectComponent, selectedComponentId, onAddComponentRequestToContainer, updateChildPlacement }) => {
    const renderComponent = (componentConfig) => {
        const ComponentToRender = componentMap[componentConfig.type];

        if (!ComponentToRender) {
            return <div key={componentConfig.id}>Unknown component type: {componentConfig.type}</div>;
        }

        return (
            <ComponentToRender
                key={componentConfig.id}
                id={componentConfig.id}
                props={componentConfig.props}
                children={componentConfig.children}
                onSelect={onSelectComponent}
                isSelected={selectedComponentId === componentConfig.id}
                selectedComponentId={selectedComponentId} // Pass down for child selection logic in Container
                onAddComponentRequest={onAddComponentRequestToContainer} // Pass down to containers
                updateChildPlacement={updateChildPlacement} // Pass for containers
            />
        );
    };

    return (
        <div className="canvas" style={globalStyles}>
            {components.length === 0 && (
                <div style={{ textAlign: 'center', color: '#888', padding: '50px 20px', border: '1px dashed #ccc', margin: '20px' }}>
                    The canvas is empty. Add components from the palette.
                </div>
            )}
            {components.map(renderComponent)}
        </div>
    );
};

export default CanvasRenderer;
