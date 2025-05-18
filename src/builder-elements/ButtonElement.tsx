import React from 'react';

const ButtonElement = ({ id, props, onSelect, isSelected }) => {
    const style = {
        padding: props.padding || '10px 15px',
        backgroundColor: props.backgroundColor || '#007bff',
        color: props.color || 'white',
        border: `2px solid ${isSelected ? 'red' : (props.borderColor || 'transparent')}`,
        margin: props.margin || '5px',
        fontSize: props.fontSize || '16px',
        borderRadius: props.borderRadius || '4px',
        cursor: 'pointer',
        // Add any other styleable props from your schema
    };
    return (
        <button style={style} onClick={(e) => { e.stopPropagation(); onSelect(id); }}>
            {props.text || 'Button'}
        </button>
    );
};
export default ButtonElement;
