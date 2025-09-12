import { type FC, type MouseEvent } from 'react';
import type { BaseComponentProps, ButtonProps } from '@/utils/types';

const ButtonElement: FC<BaseComponentProps<ButtonProps>> = ({ id, props, onSelect, isSelected }) => {
    const style = {
        padding: props.padding ?? '10px 15px',
        backgroundColor: props.backgroundColor || '#007bff',
        color: props.color || 'white',
        border: `1px solid ${props.borderColor || 'transparent'}`, // The element's own border
        margin: props.margin ?? '0',
        fontSize: props.fontSize || '16px',
        borderRadius: props.borderRadius || '4px',
        cursor: 'pointer',
        width: props.width || undefined,
        height: props.height || undefined,

        // --- SELECTION INDICATOR ---
        outline: isSelected ? '2px solid #3b82f6' : 'none', // A vibrant blue outline

    } as const;

    const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        onSelect(id);
    };

    return (
        <button style={style} onClick={handleClick}>
            {props.text || 'Button'}
        </button>
    );
};

export default ButtonElement;
