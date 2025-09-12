import React from 'react';
import { Square, Image as ImageIcon, Type, Box, FormInput, MousePointerClick } from 'lucide-react';
import type { ComponentType } from '@/types/builder';

export interface PaletteItem {
    type: ComponentType;
    label: string;
    icon: React.ReactElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultProps?: { [key: string]: any };
}

// A single flat array for a horizontal layout
export const paletteItems: PaletteItem[] = [
    {
        type: 'container',
        label: 'Container',
        icon: <Box size={16} />,
        defaultProps: {
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        },
    },
    {
        type: 'text',
        label: 'Text',
        icon: <Type size={16} />,
        defaultProps: { content: 'Type something...', fontSize: '16px' },
    },
    {
        type: 'button',
        label: 'Button',
        icon: <MousePointerClick size={16} />,
        defaultProps: {
            text: 'Click me',
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            width: 'auto',
            height: 'auto',
        },
    },
    {
        type: 'image',
        label: 'Image',
        icon: <ImageIcon size={16} />,
        defaultProps: { src: 'https://via.placeholder.com/150', width: '150px', height: '150px', alt: 'Placeholder' },
    },
    {
        type: 'input',
        label: 'Input',
        icon: <FormInput size={16} />,
        defaultProps: {
            label: 'Field Label',
            placeholder: 'Enter value...',
            width: 'auto',
            height: 'auto',
        },
    },
    {
        type: 'icon',
        label: 'Icon',
        icon: <Square size={16} />,
        defaultProps: { name: 'Square', size: 24, color: '#111827' },
    },
];
