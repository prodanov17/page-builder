import { type FC, type MouseEvent } from 'react';
import type { BaseComponentProps, TextProps } from '@/utils/types';

const TextElement: FC<BaseComponentProps<TextProps>> = ({ id, props, onSelect, isSelected }) => {
    const style = {
        fontSize: props.fontSize || '16px',
        color: props.color || '#333333',
        padding: props.padding ?? '0',
        margin: props.margin ?? '0',
        textAlign: props.textAlign || 'left',
        fontWeight: props.bold ? 'bold' : (props.fontWeight || 'normal'),
        fontStyle: props.italic ? 'italic' : 'normal',
        textDecoration: [props.underline ? 'underline' : '', props.bold ? '' : '', props.italic ? '' : ''].filter(Boolean).join(' '),
        lineHeight: props.lineHeight || undefined,
        letterSpacing: props.letterSpacing || undefined,
        textTransform: props.textTransform || undefined,
        cursor: 'pointer',
        width: props.width || 'auto',
        height: props.height || 'auto',

        outline: isSelected ? '2px solid #3b82f6' : 'none', // A vibrant blue outline

    } as const;

    const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        onSelect(id);
    };

    return (
        <div style={style} onClick={handleClick} className={`${isSelected && "rounded-lg"}`}>
            {props.content || 'Text Element. Click to edit.'}
        </div>
    );
};

export default TextElement;
