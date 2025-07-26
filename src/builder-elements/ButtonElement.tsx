import { type FC, type MouseEvent } from 'react';
import type { BaseComponentProps, ButtonProps } from '@/utils/types';

const ButtonElement: FC<BaseComponentProps<ButtonProps>> = ({ id, props, onSelect, isSelected }) => {
    const style = {
        padding: props.padding || '10px 15px',
        backgroundColor: props.backgroundColor || '#007bff',
        color: props.color || 'white',
        border: `2px solid ${isSelected ? 'red' : (props.borderColor || 'transparent')}`,
        margin: props.margin || '5px',
        fontSize: props.fontSize || '16px',
        borderRadius: props.borderRadius || '4px',
        cursor: 'pointer',
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
