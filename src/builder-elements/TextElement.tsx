import React from 'react';

const TextElement = ({ id, props, onSelect, isSelected }) => {
    const style = {
        fontSize: props.fontSize || '16px',
        color: props.color || '#333333',
        padding: props.padding || '5px',
        margin: props.margin || '5px',
        border: `2px solid ${isSelected ? 'red' : 'transparent'}`,
        textAlign: props.textAlign || 'left',
        fontWeight: props.fontWeight || 'normal',
        cursor: 'pointer',
    };
    return (
        <div style={style} onClick={(e) => { e.stopPropagation(); onSelect(id); }}>
            {props.content || 'Text Element. Click to edit.'}
        </div>
    );
};
export default TextElement;
