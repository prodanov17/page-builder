import { type FC, type MouseEvent } from 'react';
import type { BaseComponentProps, TextProps } from '@/utils/types';

const TextElement: FC<BaseComponentProps<TextProps>> = ({ id, props, onSelect, isSelected }) => {
    const style = {
        fontSize: props.fontSize || '16px',
        color: props.color || '#333333',
        padding: props.padding ?? '0',
        margin: props.margin ?? '0',
        border: `2px solid ${isSelected ? 'red' : 'transparent'}`,
        textAlign: props.textAlign || 'left',
        fontWeight: props.bold ? 'bold' : (props.fontWeight || 'normal'),
        fontStyle: props.italic ? 'italic' : 'normal',
        textDecoration: [props.underline ? 'underline' : '', props.bold ? '' : '', props.italic ? '' : ''].filter(Boolean).join(' '),
        lineHeight: props.lineHeight || undefined,
        letterSpacing: props.letterSpacing || undefined,
        textTransform: props.textTransform || undefined,
        cursor: 'pointer',
        width: props.width || undefined,
        height: props.height || undefined,
    } as const;

    const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        onSelect(id);
    };

    return (
        <div style={style} onClick={handleClick}>
            {props.content || 'Text Element. Click to edit.'}
        </div>
    );
};

export default TextElement;
