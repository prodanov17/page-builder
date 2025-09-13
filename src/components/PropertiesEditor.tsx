import type { Component, PageProperties } from '@/types/builder';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Trash2, Square, ArrowLeftRight, PanelTopDashed, Settings, Share, Pencil } from 'lucide-react';
import { componentEditorSchema, pageEditorSchema, type ControlDefinition } from '@/utils/editor-schema';

type PropertiesEditorProps = {
    // The component prop is now optional
    component?: Component | null;
    onUpdateComponent: (id: string, update: Partial<Component>) => void;
    onRemoveComponent: (id: string) => void;
    pageStyles: React.CSSProperties;
    onUpdatePageStyles: (newStyles: React.CSSProperties) => void;
    pageProperties: PageProperties;
    onUpdatePageProperties: (newProperties: PageProperties) => void;
    onRenameComponent: (id: string, newName: string) => void;
};

type ComponentEditorViewProps = {
    component: Component;
    onUpdateComponent: (id: string, update: Partial<Component>) => void;
    onRemoveComponent: (id: string) => void;
    onRenameComponent: (id: string, newName: string) => void;
};

type PageEditorViewProps = {
    pageStyles: React.CSSProperties;
    pageProperties: PageProperties;
    onUpdatePageProperties: (newProperties: PageProperties) => void;
    onUpdatePageStyles: (newStyles: React.CSSProperties) => void;
};


// --- Sub-components for UI elements ---

const PropertyGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border border-slate-200 rounded-lg">
            <button
                className="flex justify-between items-center w-full p-2 bg-slate-50 font-semibold text-sm rounded-t-lg"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
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
        // Accept values like "10px 5px", "10 5 3", "0", etc.
        const trimmed = (v ?? '').trim();
        if (trimmed === '') return ['0', '0', '0', '0'];
        const partsRaw = trimmed.split(/\s+/);
        const parts = partsRaw.map(p => {
            // strip trailing "px" if present and parse number
            const num = parseFloat(p.replace(/px$/i, ''));
            return Number.isFinite(num) ? String(num) : '0';
        });
        if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
        if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
        if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]];
        return [parts[0] || '0', parts[1] || '0', parts[2] || '0', parts[3] || '0'];
    };

    const joinBoxShorthand = (t: string, r: string, b: string, l: string): string => {
        const format = (val: string) => {
            const n = parseFloat(String(val));
            if (!Number.isFinite(n) || n === 0) return '0';
            return `${n}px`;
        };
        return `${format(t)} ${format(r)} ${format(b)} ${format(l)}`;
    };

    const [t, r, b, l] = parseBoxShorthand(value);

    const renderInputs = () => {
        switch (mode) {
            case 'overall':
                return <input type="number" className={baseInputStyles} value={t} onChange={e => onChange(joinBoxShorthand(e.target.value, e.target.value, e.target.value, e.target.value))} placeholder="all" />;
            case 'axis':
                return (
                    <div className="flex gap-2">
                        <input type="number" className={baseInputStyles} value={t} onChange={e => onChange(joinBoxShorthand(e.target.value, r, e.target.value, l))} placeholder="top/bottom" />
                        <input type="number" className={baseInputStyles} value={l} onChange={e => onChange(joinBoxShorthand(t, e.target.value, b, e.target.value))} placeholder="left/right" />
                    </div>
                );
            case 'individual':
                return (
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
        <button onClick={() => setMode(targetMode)} className={`p-1.5 rounded-md ${mode === targetMode ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 hover:bg-slate-200'}`} title={targetMode}>
            {children}
        </button>
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


// --- View 1: Editing a Selected Component ---

const ComponentEditorView: React.FC<ComponentEditorViewProps> = ({ component, onUpdateComponent, onRemoveComponent, onRenameComponent }) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValue, setNameValue] = useState(component.name || '');
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [currentProps, setCurrentProps] = useState(component.props ?? {});

    useEffect(() => {
        setCurrentProps(component.props ?? {});
    }, [component]);

    // Effect to focus input when editing starts
    useEffect(() => {
        if (isEditingName && nameInputRef.current) {
            nameInputRef.current.focus();
            nameInputRef.current.select();
        }
    }, [isEditingName]);

    const handleNameChange = () => {
        if (nameValue.trim()) {
            onRenameComponent(component.id, nameValue.trim());
        }
        setIsEditingName(false);
    };

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleNameChange();
        else if (e.key === 'Escape') setIsEditingName(false);
    };


    const handlePropChange = useCallback((propName: string, value: string | number) => {
        setCurrentProps(prev => ({ ...prev, [propName]: value }));
    }, []);

    useEffect(() => {
        if (JSON.stringify(component.props) === JSON.stringify(currentProps)) {
            return;
        }
        const handler = setTimeout(() => {
            onUpdateComponent(component.id, { props: currentProps });
        }, 500);
        return () => clearTimeout(handler);
    }, [component.id, component.props, currentProps, onUpdateComponent]);


    const renderControl = (control: ControlDefinition) => {
        const { prop, label, control: controlType, options = [] } = control;
        const value = currentProps[prop] ?? '';

        switch (controlType) {
            case 'text': return <ControlWrapper key={prop} label={label}><input type="text" className={baseInputStyles} value={String(value)} onChange={e => handlePropChange(prop, e.target.value)} /></ControlWrapper>;
            case 'number': return <ControlWrapper key={prop} label={label}><input type="number" className={baseInputStyles} value={String(value)} onChange={e => handlePropChange(prop, parseFloat(e.target.value) || 0)} /></ControlWrapper>;
            case 'color': return <ControlWrapper key={prop} label={label}><input type="color" className={`${baseInputStyles} p-1 h-10`} value={String(value)} onChange={e => handlePropChange(prop, e.target.value)} /></ControlWrapper>;
            case 'select': return <ControlWrapper key={prop} label={label}><select className={baseInputStyles} value={String(value)} onChange={e => handlePropChange(prop, e.target.value)}>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></ControlWrapper>;
            case 'button-group': return <ControlWrapper key={prop} label={label}><div className="flex items-center gap-1">{options.map(opt => <button key={opt.value} onClick={() => handlePropChange(prop, value === opt.value ? '' : opt.value)} className={`p-2 rounded-md transition ${value === opt.value ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`} title={opt.label}>{opt.icon ?? opt.label}</button>)}</div></ControlWrapper>;
            case 'box': return <div key={prop}><BoxControl label={label} value={String(value)} onChange={(newValue) => handlePropChange(prop, newValue)} /></div>;
            default: return null;
        }
    };

    const schema = componentEditorSchema[component.type];

    return (
        <div className="flex flex-col h-full font-sans">
            <div className="p-3 border-b border-slate-200">
                {isEditingName ? (
                    <input
                        ref={nameInputRef}
                        type="text"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        onBlur={handleNameChange}
                        onKeyDown={handleNameKeyDown}
                        className="m-0 text-base font-semibold bg-white border border-blue-500 rounded px-1"
                    />
                ) : (
                    <div className="flex items-center gap-2">
                        <h4
                            className="m-0 text-base font-semibold inline-block cursor-pointer"
                            onDoubleClick={() => setIsEditingName(true)}
                        >
                            {component.name || <span className="capitalize">{component.type}</span>}
                        </h4>
                        <button
                            onClick={() => setIsEditingName(true)}
                            className="text-slate-500 hover:text-slate-800"
                        >
                            <Pencil size={14} />
                        </button>
                    </div>
                )}
                <span className="text-xs text-slate-400 ml-2">({component.id.slice(-5)})</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-4 hide-scrollbars">
                {!schema || schema.length === 0 ? (
                    <div className="text-center text-slate-400 p-10 flex flex-col items-center gap-3"><Settings size={24} /><span>No properties for this component.</span></div>
                ) : (
                    schema.map(group => <PropertyGroup key={group.title} title={group.title}>{group.controls.map(renderControl)}</PropertyGroup>)
                )}
            </div>
            <div className="p-3 border-t border-slate-200">
                <button className="w-full p-2 rounded-md font-semibold cursor-pointer transition bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5" onClick={() => onRemoveComponent(component.id)}><Trash2 size={14} /> Remove</button>
            </div>
        </div>
    );
};


// --- View 2: Editing Page Styles ---

const PageEditorView: React.FC<PageEditorViewProps> = ({ pageProperties, onUpdatePageProperties, pageStyles, onUpdatePageStyles }) => {
    const pageName = pageProperties.name || 'Untitled Page';
    const [currentStyles, setCurrentStyles] = useState(pageStyles);
    const [currentName, setCurrentName] = useState(pageName);

    useEffect(() => {
        setCurrentName(pageName);
    }, [pageName]);

    useEffect(() => {
        if (currentName === pageName) return;
        const handler = setTimeout(() => {
            onUpdatePageProperties({ ...pageProperties, name: currentName });
        }, 500);
        return () => clearTimeout(handler);
    }, [currentName, pageName, onUpdatePageProperties, pageProperties]);

    useEffect(() => {
        setCurrentStyles(pageStyles);
    }, [pageStyles]);

    const handleStyleChange = useCallback((styleName: string, value: string) => {
        setCurrentStyles(prev => ({ ...prev, [styleName]: value }));
    }, []);

    useEffect(() => {
        if (JSON.stringify(pageStyles) === JSON.stringify(currentStyles)) {
            return;
        }
        const handler = setTimeout(() => {
            onUpdatePageStyles(currentStyles);
        }, 500);
        return () => clearTimeout(handler);
    }, [currentStyles, pageStyles, onUpdatePageStyles]);

    const renderControl = (control: ControlDefinition) => {
        const { prop, label, control: controlType } = control;
        const value = currentStyles[prop as keyof React.CSSProperties] ?? '';

        switch (controlType) {
            case 'text': return <ControlWrapper key={prop} label={label}><input type="text" className={baseInputStyles} value={String(value)} onChange={e => handleStyleChange(prop, e.target.value)} /></ControlWrapper>;
            case 'color': return <ControlWrapper key={prop} label={label}><input type="color" className={`${baseInputStyles} p-1 h-10`} value={String(value)} onChange={e => handleStyleChange(prop, e.target.value)} /></ControlWrapper>;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-full font-sans">
            <div className="p-3 border-b border-slate-200">
                <h4 className="m-0 text-base font-semibold">Page Settings</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-4 hide-scrollbars">
                <PropertyGroup title="General">
                    <ControlWrapper label="Page Name">
                        <input
                            type="text"
                            className={baseInputStyles}
                            value={currentName}
                            onChange={(e) => setCurrentName(e.target.value)}
                        />
                    </ControlWrapper>
                </PropertyGroup>

                {pageEditorSchema.map(group => (
                    <PropertyGroup key={group.title} title={group.title}>{group.controls.map(renderControl)}</PropertyGroup>
                ))}
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="grid gap-2">
                    <button
                        className="w-full p-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 
                 bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                        onClick={() => { }}
                    >
                        <Share size={16} />
                        Publish site
                    </button>
                </div>
            </div>


        </div>
    );
};


// --- Main Router Component ---

const PropertiesEditor: React.FC<PropertiesEditorProps> = ({ component, onUpdateComponent, onRemoveComponent, pageStyles, onUpdatePageStyles, pageProperties, onUpdatePageProperties, onRenameComponent }) => {
    if (component) {
        return (
            <ComponentEditorView
                key={component.id}
                component={component}
                onRenameComponent={onRenameComponent}
                onUpdateComponent={onUpdateComponent}
                onRemoveComponent={onRemoveComponent}
            />
        );
    }

    return (
        <PageEditorView
            pageProperties={pageProperties}
            onUpdatePageProperties={onUpdatePageProperties}
            pageStyles={pageStyles}
            onUpdatePageStyles={onUpdatePageStyles}
        />
    );
};

export default PropertiesEditor;
