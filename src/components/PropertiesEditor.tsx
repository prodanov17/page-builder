import type { Component } from '@/types/builder';
import React, { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Trash2, Square, ArrowLeftRight, PanelTopDashed, Settings } from 'lucide-react';
import { componentEditorSchema, type ControlDefinition } from '@/utils/editor-schema';

type PropertiesEditorProps = {
    component: Component;
    onUpdateComponent: (id: string, update: Partial<Component>) => void;
    onRemoveComponent: (id: string) => void;
};

// --- Sub-components for UI elements ---

const PropertyGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border border-slate-200 rounded-lg">
            <button className="flex justify-between items-center w-full p-2 bg-slate-50 font-semibold text-sm rounded-t-lg" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            {isOpen && <div className="p-3 space-y-4">{children}</div>}
        </div>
    );
};

const ControlWrapper: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
        {children}
    </div>
);

const baseInputStyles = "w-full bg-white border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";

const BoxControl: React.FC<{ label: string, value: string, onChange: (value: string) => void }> = ({ label, value, onChange }) => {
    // This state is local to each BoxControl instance
    const [mode, setMode] = useState<'overall' | 'axis' | 'individual'>('overall');

    const parseBoxShorthand = (v: string | undefined): [string, string, string, string] => {
        const parts = (v || '0').trim().split(/\s+/).map(p => String(parseFloat(p) || 0));
        if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
        if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
        if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]];
        return [parts[0] || '0', parts[1] || '0', parts[2] || '0', parts[3] || '0'];
    };

    const joinBoxShorthand = (t: string, r: string, b: string, l: string): string => {
        const format = (val: string) => (parseFloat(val) === 0 ? '0' : `${parseFloat(val) || 0}px`);
        return `${format(t)} ${format(r)} ${format(b)} ${format(l)}`;
    };

    const [t, r, b, l] = parseBoxShorthand(value);

    const renderInputs = () => {
        switch (mode) {
            case 'overall': return <input type="number" className={baseInputStyles} value={t} onChange={e => onChange(joinBoxShorthand(e.target.value, e.target.value, e.target.value, e.target.value))} placeholder="all" />;
            case 'axis': return (
                <div className="flex gap-2">
                    <input type="number" className={baseInputStyles} value={t} onChange={e => onChange(joinBoxShorthand(e.target.value, r, e.target.value, l))} placeholder="top/bottom" />
                    <input type="number" className={baseInputStyles} value={l} onChange={e => onChange(joinBoxShorthand(t, e.target.value, b, e.target.value))} placeholder="left/right" />
                </div>
            );
            case 'individual': return (
                <div className="grid grid-cols-4 gap-2">
                    <input type="number" className={baseInputStyles} value={t} onChange={e => onChange(joinBoxShorthand(e.target.value, r, b, l))} placeholder="T" />
                    <input type="number" className={baseInputStyles} value={r} onChange={e => onChange(joinBoxShorthand(t, e.target.value, b, l))} placeholder="R" />
                    <input type="number" className={baseInputStyles} value={b} onChange={e => onChange(joinBoxShorthand(t, r, e.target.value, l))} placeholder="B" />
                    <input type="number" className={baseInputStyles} value={l} onChange={e => onChange(joinBoxShorthand(t, r, b, e.target.value))} placeholder="L" />
                </div>
            );
        }
    };

    const ModeButton: React.FC<{ targetMode: 'overall' | 'axis' | 'individual'; children: React.ReactNode }> = ({ targetMode, children }) => (
        <button onClick={() => setMode(targetMode)} className={`p-1.5 rounded-md ${mode === targetMode ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 hover:bg-slate-200'}`}>{children}</button>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-slate-600">{label}</label>
                <div className="flex gap-1">
                    <ModeButton targetMode="overall"><Square size={14} /></ModeButton>
                    <ModeButton targetMode="axis"><ArrowLeftRight size={14} /></ModeButton>
                    <ModeButton targetMode="individual"><PanelTopDashed size={14} /></ModeButton>
                </div>
            </div>
            {renderInputs()}
        </div>
    );
};

// --- Main Editor Component ---

const PropertiesEditor: React.FC<PropertiesEditorProps> = ({ component, onUpdateComponent, onRemoveComponent }) => {
    const [currentProps, setCurrentProps] = useState(component.props);

    useEffect(() => { setCurrentProps(component.props); }, [component]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onUpdateComponent(component.id, { props: currentProps });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => { window.removeEventListener('keydown', handleKeyDown); };
    }, [component.id, currentProps, onUpdateComponent]);

    const handlePropChange = useCallback((propName: string, value: any) => {
        setCurrentProps(prev => ({ ...prev, [propName]: value }));
    }, []);

    const handleApply = () => { onUpdateComponent(component.id, { props: currentProps }); };

    const renderControl = (control: ControlDefinition) => {
        const { prop, label, control: controlType, options = [] } = control;
        const value = currentProps[prop] ?? '';

        switch (controlType) {
            case 'text':
                return <ControlWrapper label={label}><input type="text" className={baseInputStyles} value={value.toString()} onChange={e => handlePropChange(prop, e.target.value)} /></ControlWrapper>;
            case 'number':
                return <ControlWrapper label={label}><input type={controlType} className={baseInputStyles} value={value.toString()} onChange={e => handlePropChange(prop, e.target.value)} /></ControlWrapper>;

            case 'color':
                return <ControlWrapper label={label}><input type="color" className={`${baseInputStyles} p-1 h-10`} value={value.toString()} onChange={e => handlePropChange(prop, e.target.value)} /></ControlWrapper>;

            case 'select':
                return <ControlWrapper label={label}><select className={baseInputStyles} value={value.toString()} onChange={e => handlePropChange(prop, e.target.value)}>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></ControlWrapper>;

            case 'button-group':
                return (
                    <ControlWrapper label={label}>
                        <div className="flex items-center gap-1">
                            {options.map(opt => (
                                <button key={opt.value} onClick={() => handlePropChange(prop, value === opt.value ? '' : opt.value)} className={`p-2 rounded-md transition ${value === opt.value ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>{opt.icon || opt.label}</button>
                            ))}
                        </div>
                    </ControlWrapper>
                );

            case 'box':
                return <BoxControl label={label} value={value.toString()} onChange={(newValue) => handlePropChange(prop, newValue)} />;

            default: return null;
        }
    };

    const schema = componentEditorSchema[component.type];

    return (
        <div className="flex flex-col h-full font-sans">
            <div className="p-3 border-b border-slate-200">
                <h4 className="m-0 text-base font-semibold inline-block capitalize">{component.type}</h4>
                <span className="text-xs text-slate-400 ml-2">({component.id.slice(-5)})</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {!schema || schema.length === 0 ? (
                    <div className="text-center text-slate-400 p-10 flex flex-col items-center gap-3">
                        <Settings size={24} />
                        <span>No properties defined for this component.</span>
                    </div>
                ) : (
                    schema.map(group => (
                        <PropertyGroup key={group.title} title={group.title}>
                            {group.controls.map(renderControl)}
                        </PropertyGroup>
                    ))
                )}
            </div>

            <div className="p-3 border-t border-slate-200 flex gap-2">
                <button className="flex-1 p-2 rounded-md font-semibold cursor-pointer transition bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5" onClick={() => onRemoveComponent(component.id)}>
                    <Trash2 size={14} /> Remove
                </button>
                <button className="flex-1 p-2 rounded-md font-semibold cursor-pointer transition bg-blue-600 text-white hover:bg-blue-700" onClick={handleApply}>
                    Apply
                </button>
            </div>
        </div>
    );
};

export default PropertiesEditor;
