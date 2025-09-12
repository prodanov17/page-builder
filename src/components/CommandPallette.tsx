import { Square, Image as ImageIcon, Type, Box, FormInput } from 'lucide-react';
import { availableComponentsList } from '@/utils/components';
import type { ComponentDefinition, ComponentType, PropsType } from '@/types/builder';

interface PaletteProps { onAddComponent: (type: ComponentType, defaultProps?: PropsType, children?: ComponentDefinition[]) => void };

const ComponentPalette = ({ onAddComponent }: PaletteProps) => {
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
                    onClick={() => onAddComponent(compInfo.type as ComponentType, compInfo.defaultProps, compInfo.children)}
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
