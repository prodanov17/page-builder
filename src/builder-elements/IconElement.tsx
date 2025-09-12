import { type FC, type MouseEvent } from 'react';
import * as Icons from 'lucide-react';
import type { BaseComponentProps, IconProps } from '@/utils/types';

const IconElement: FC<BaseComponentProps<IconProps>> = ({ id, props, onSelect, isSelected }) => {
    const IconComp = (Icons as any)[props.name || 'Square'] || (Icons as any)['Square'];
    const color = props.color || '#111827';
    const size = props.size || 24;
    const style = {
        margin: props.margin ?? '0',
        padding: props.padding ?? '0',
        display: 'inline-flex',
        border: `2px solid ${isSelected ? 'red' : 'transparent'}`,
        borderRadius: 8,
        cursor: 'pointer',
    } as const;
    const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        onSelect(id);
    };
    return (
        <div style={style} onClick={handleClick}>
            <IconComp color={color} size={size} />
        </div>
    );
};

export default IconElement;

