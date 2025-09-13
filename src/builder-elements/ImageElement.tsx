import { type FC, type MouseEvent } from 'react';
import type { BaseComponentProps, ImageProps } from '@/utils/types';

const ImageElement: FC<BaseComponentProps<ImageProps>> = ({ id, props, onSelect, isSelected }) => {
    const style = {
        width: props.width ?? 'auto',
        height: props.height ?? 'auto',
        border: `2px solid ${isSelected ? 'dodgerblue' : 'transparent'}`,
        margin: props.margin ?? '0',
        objectFit: props.objectFit || 'cover',
        borderRadius: props.borderRadius || '0px',
        cursor: 'pointer',
        position: props.position || 'static',
        top: props.top || 0,
        left: props.left || 'auto',
        right: props.right || 'auto',
        bottom: props.bottom || 'auto',
    } as const;

    const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        onSelect(id);
    };

    return (
        <img
            src={props.src || 'https://placeholder.pics/svg/300'}
            alt={props.alt || 'placeholder image'}
            style={style}
            onClick={handleClick}
        />
    );
};

export default ImageElement;
