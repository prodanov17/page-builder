import React from 'react';
import type { Component, ComponentType, PropsType } from '@/types/builder';
import { paletteItems } from '@/utils/palette';

interface PaletteProps {
    onAddComponent: (type: ComponentType, defaultProps?: PropsType, children?: Component[]) => void;
}

const ComponentPalette: React.FC<PaletteProps> = ({ onAddComponent }) => {
    return (
        <div
            className="hide-scrollbars"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                overflowX: 'auto',
                padding: '4px',
            }}
        >
            {paletteItems.map((item) => (
                <button
                    key={item.label}
                    onClick={() => onAddComponent(item.type, item.defaultProps)}
                    className="compact-palette-item-btn"
                    title={`Add ${item.label}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        background: '#ffffff',
                        color: '#475569',
                        cursor: 'pointer',
                        flexShrink: 0, // Prevent buttons from shrinking
                        transition: 'all 0.2s ease-in-out',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                >
                    {React.cloneElement(item.icon)}
                    <span style={{ fontSize: '13px', fontWeight: 500, lineHeight: 1 }}>
                        {item.label}
                    </span>
                </button>
            ))}

            <style>{`
        .compact-palette-item-btn:hover {
          border-color: #94a3b8;
          background-color: #f8fafc;
          color: #1e293b;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.07);
        }
        .compact-palette-item-btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
      `}</style>
        </div>
    );
};

export default ComponentPalette;
