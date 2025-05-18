import React from 'react';

const ImageElement = ({ id, props, onSelect, isSelected }) => {
    const style = {
        width: props.width || '150px',
        height: props.height || 'auto', // or props.height || '100px'
        border: `2px solid ${isSelected ? 'red' : 'transparent'}`,
        margin: props.margin || '5px',
        objectFit: props.objectFit || 'cover',
        borderRadius: props.borderRadius || '0px',
        cursor: 'pointer',
    };
    return (
        <img
            src={props.src || 'https://via.placeholder.com/150x100.png?text=Image'}
            alt={props.alt || 'placeholder image'}
            style={style}
            onClick={(e) => { e.stopPropagation(); onSelect(id); }}
        />
    );
};
export default ImageElement;
