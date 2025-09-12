import { type FC, type MouseEvent } from 'react';
import type { BaseComponentProps, ImageProps } from '@/utils/types';

const ImageElement: FC<BaseComponentProps<ImageProps>> = ({ id, props, onSelect, isSelected }) => {
    const style = {
        width: props.width ?? 'auto',
        height: props.height ?? 'auto',
        border: `2px solid ${isSelected ? 'red' : 'transparent'}`,
        margin: props.margin ?? '0',
        objectFit: props.objectFit || 'cover',
        borderRadius: props.borderRadius || '0px',
        cursor: 'pointer',
        position: props.position || 'static',
        top: props.top,
        left: props.left,
        right: props.right,
        bottom: props.bottom,
    } as const;

    const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        onSelect(id);
    };

    return (
        <img
            src={props.src || 'https://via.placeholder.com/150x100.png?text=Image'}
            alt={props.alt || 'placeholder image'}
            style={style}
            onClick={handleClick}
        />
    );
};

export default ImageElement;
