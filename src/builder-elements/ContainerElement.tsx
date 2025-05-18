import React from 'react';
import { componentMap } from './componentMap'; // To render children

// Forward ref for drag and drop if you add it later
const ContainerElement = React.forwardRef(({ id, props, children, onSelect, isSelected, selectedComponentId, onAddComponentRequest }, ref) => {
    const style = {
        padding: props.padding || '10px',
        backgroundColor: props.backgroundColor || 'rgba(0,0,0,0.03)',
        border: `2px dashed ${isSelected ? 'dodgerblue' : (props.borderColor || '#cccccc')}`,
        margin: props.margin || '5px',
        minHeight: props.minHeight || '50px',
        display: props.display || 'flex',
        flexDirection: props.flexDirection || 'column', // Default to column
        alignItems: props.alignItems || 'stretch',
        justifyContent: props.justifyContent || 'flex-start',
        gap: props.gap || '5px',
        width: props.width || 'auto',
        height: props.height || 'auto',
        cursor: 'pointer', // For selecting the container itself
    };

    const handleContainerClick = (e) => {
        e.stopPropagation(); // Prevent event from bubbling to parent containers if nested
        onSelect(id);
    };

    const renderChild = (childComp) => {
        const ChildComponentToRender = componentMap[childComp.type];
        if (!ChildComponentToRender) {
            return <div key={childComp.id}>Unknown type: {childComp.type}</div>;
        }
        return (
            <ChildComponentToRender
                key={childComp.id}
                id={childComp.id}
                props={childComp.props}
                children={childComp.children}
                onSelect={onSelect} // Pass down the main onSelect
                isSelected={selectedComponentId === childComp.id}
                selectedComponentId={selectedComponentId} // For deeply nested selections
                onAddComponentRequest={onAddComponentRequest} // If children can also request adding components
            />
        );
    };

    return (
        <div ref={ref} style={style} onClick={handleContainerClick}>
            {props.name && <div style={{ color: '#777', fontSize: '0.8em', marginBottom: '5px' }}><em>{props.name}</em></div>}
            {children && children.length > 0 ? (
                children.map(renderChild)
            ) : (
                <div style={{ color: '#aaa', textAlign: 'center', padding: '20px 0' }}
                    onClick={(e) => { e.stopPropagation(); onAddComponentRequest?.(id); }} // Allow adding to empty container
                >
                    {isSelected ? 'Container (empty). Click here to add elements or drag elements in.' : 'Empty Container'}
                </div>
            )}
        </div>
    );
});
export default ContainerElement;
