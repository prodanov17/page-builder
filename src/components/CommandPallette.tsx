import React from 'react';
import { Square, Image as ImageIcon, Type, Box, FormInput } from 'lucide-react';

// Define your available components and their default structures
export const availableComponentsList = [
    { type: 'text', label: 'Text', defaultProps: { content: 'New Text Block', fontSize: '16px', color: '#333', margin: '0', padding: '0', width: 'auto', height: 'auto' } },
    { type: 'button', label: 'Button', defaultProps: { text: 'Click Me', backgroundColor: '#007bff', color: '#ffffff', margin: '0', padding: '0', width: 'auto', height: 'auto' } },
    { type: 'image', label: 'Image', defaultProps: { src: '', alt: 'My Image', width: 'auto', height: 'auto', margin: '0', padding: '0' } },
    { type: 'container', label: 'Container (Column)', defaultProps: { padding: '0', margin: '0', backgroundColor: 'rgba(200,200,200,0.1)', minHeight: '80px', name: 'New Container', flexDirection: 'column', width: 'auto', height: 'auto' }, children: [] },
    { type: 'container', label: 'Container (Row)', defaultProps: { padding: '0', margin: '0', backgroundColor: 'rgba(200,200,200,0.1)', minHeight: '80px', name: 'Row Container', flexDirection: 'row', alignItems: 'center', width: 'auto', height: 'auto' }, children: [] },
    { type: 'input', label: 'Input', defaultProps: { kind: 'text', margin: '0', padding: '0', width: 'auto', height: 'auto' } },
    { type: 'icon', label: 'Icon', defaultProps: { name: 'Square', size: 24, color: '#111827', margin: '0', padding: '0' } },
];

type PaletteProps = { onAddComponent: (type: string, defaultProps?: any, children?: any[]) => void };

const ComponentPalette: React.FC<PaletteProps> = ({ onAddComponent }) => {
    const colors = ['#2563eb', '#7c3aed', '#0ea5e9', '#16a34a', '#f97316'];
    const iconFor = (type: string) => {
        switch (type) {
            case 'text':
                return <Type size={18} />;
            case 'button':
                return <Square size={18} />;
            case 'image':
                return <ImageIcon size={18} />;
            case 'container':
                return <Box size={18} />;
            case 'input':
                return <FormInput size={18} />;
            case 'icon':
                return <Square size={18} />;
            default:
                return <Square size={18} />;
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto', justifyContent: 'center' }} className="hide-scrollbars">
            {availableComponentsList.map((compInfo, idx) => (
                <button
                    key={compInfo.type + idx}
                    onClick={() => onAddComponent(compInfo.type, compInfo.defaultProps, compInfo.children)}
                    style={{
                        width: 38,
                        height: 38,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: colors[idx % colors.length],
                        color: 'white',
                        border: 'none',
                        borderRadius: 12,
                        boxShadow: '0 6px 14px rgba(0,0,0,0.12)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        letterSpacing: 0.2,
                    }}
                    title={compInfo.label}
                >
                    {iconFor(compInfo.type)}
                </button>
            ))}
        </div>
    );
};
export default ComponentPalette;
