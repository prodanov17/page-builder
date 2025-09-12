import { type FC, type MouseEvent } from 'react';
import type { BaseComponentProps, InputProps } from '@/utils/types';

const InputElement: FC<BaseComponentProps<InputProps>> = ({ id, props, onSelect, isSelected }) => {
    const style = {
        margin: props.margin ?? '0',
        width: props.width ?? 'auto',
        height: props.height ?? (props.kind === 'text' ? '36px' : 'auto'),
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    } as const;

    const inputStyle = {
        padding: '8px 10px',
        border: `2px solid ${isSelected ? 'red' : 'rgba(0,0,0,0.12)'}`,
        borderRadius: '10px',
        outline: 'none',
        background: '#fff',
    } as const;

    const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        onSelect(id);
    };

    if (props.kind === 'checkbox' || props.kind === 'radio') {
        return (
            <label style={style} onClick={handleClick}>
                <input type={props.kind} style={{ width: 16, height: 16 }} />
                <span>{props.label ?? (props.kind === 'checkbox' ? 'Checkbox' : 'Radio')}</span>
            </label>
        );
    }

    return (
        <input type="text" placeholder={props.placeholder ?? 'Input'} style={inputStyle} onClick={handleClick} />
    );
};

export default InputElement;

