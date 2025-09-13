import React from 'react';
import type { Component, ComponentType, PropsType } from '@/types/builder';
import { paletteItems } from '@/utils/palette';
import SaveStatusBar from './ui/save-status';
import type { SaveStatus } from '@/hooks/useAutoSave';

interface PaletteProps {
    saveStatus: SaveStatus;
    savedAt: Date | null;
    onAddComponent: (type: ComponentType, defaultProps?: PropsType, children?: Component[]) => void;
}

const ComponentPalette: React.FC<PaletteProps> = ({
    saveStatus,
    savedAt,
    onAddComponent,
}) => {
    console.log("SaveStatus:", saveStatus);

    return (
        <div className="w-full flex items-center justify-between p-1">
            {/* Left Side: Component Buttons */}
            <div className="flex items-center gap-2 hide-scrollbars overflow-x-auto">
                {paletteItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => onAddComponent(item.type, item.defaultProps)}
                        className="compact-palette-item-btn"
                        title={`Add ${item.label}`}
                    >
                        {React.cloneElement(item.icon)}
                        <span className="text-sm font-medium leading-none">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex items-center gap-2 pl-2">
                <SaveStatusBar
                    saveStatus={saveStatus}
                    showTimestamp={false}
                    lastSavedAt={savedAt}
                    className="px-2 py-1"

                />
            </div>

            <style>{`
                .compact-palette-item-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    background: #ffffff;
                    color: #475569;
                    cursor: pointer;
                    flex-shrink: 0;
                    transition: all 0.2s ease-in-out;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .compact-palette-item-btn:hover {
                    border-color: #94a3b8;
                    background-color: #f8fafc;
                    color: #1e293b;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.07);
                }
                .action-btn {
                    padding: 6px;
                    border-radius: 8px;
                    background: transparent;
                    border: 1px solid transparent;
                    color: #475569;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                }
                .action-btn:hover {
                    background-color: #f1f5f9;
                    color: #1e293b;
                }
            `}</style>
        </div>
    );
};

export default ComponentPalette;
