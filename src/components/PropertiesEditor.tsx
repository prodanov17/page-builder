import React from 'react';

type PropertiesEditorProps = {
    component: any;
    onUpdateComponent: (id: string, update: any) => void;
    onRemoveComponent: (id: string) => void;
};

const PropertiesEditor = ({ component, onUpdateComponent, onRemoveComponent }: PropertiesEditorProps) => {
    const [currentProps, setCurrentProps] = React.useState(component.props);
    // const [componentType, setComponentType] = useState(component.type); // If you allow type changes

    React.useEffect(() => {
        setCurrentProps(component.props);
        // setComponentType(component.type);
    }, [component]); // Re-initialize when component selection changes

    const handleChange = React.useCallback((propName: string, value: any, type: 'number' | 'boolean' | 'string') => {
        setCurrentProps(prev => ({
            ...prev,
            [propName]: type === 'number' ? parseFloat(value) || 0 : (type === 'boolean' ? value : value),
        }));
    }, []);

    // Helper to find parent container and update its backgroundImage
    const handleApply = () => {
        // If this is an image and background is checked, move src to parent container backgroundImage
        if (component.type === 'image' && currentProps.background) {
            // Find parent container in builder tree
            // We'll assume the parentId is passed as component.parentId (if available), otherwise, this logic would need to be lifted up
            // For now, emit a custom event to request this operation, or you can extend the API to pass parentId
            // Here, just call onUpdateComponent with a special signal
            onUpdateComponent(component.id, { props: { ...currentProps, __setAsBackground: true } });
        } else if (component.type === 'image' && !currentProps.background && currentProps.__wasBackground) {
            // If unchecking, restore image as child and clear backgroundImage
            onUpdateComponent(component.id, { props: { ...currentProps, __restoreFromBackground: true } });
        } else {
            onUpdateComponent(component.id, { props: currentProps });
        }
    };

    const renderPropField = (key, value) => {
        const commonInputStyle = { width: 'calc(100% - 12px)', padding: '8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px', marginBottom: '6px', background: '#fff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' };
        let inputElement;

        if (key === 'flexDirection' && component.type === 'container') {
            inputElement = (
                <select style={commonInputStyle} value={value} onChange={(e) => handleChange(key, e.target.value, 'string')}>
                    <option value="row">Row</option>
                    <option value="column">Column</option>
                    <option value="row-reverse">Row Reverse</option>
                    <option value="column-reverse">Column Reverse</option>
                </select>
            );
        } else if (typeof value === 'boolean') {
            inputElement = <input type="checkbox" checked={!!value} onChange={(e) => handleChange(key, e.target.checked, 'boolean')} />;
        } else if (typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)) && (key.includes('size') || key.includes('width') || key.includes('height') || key.includes('padding') || key.includes('margin') || key.includes('gap') || key.includes('radius')))) {
            inputElement = <input type="number" style={commonInputStyle} value={value} onChange={(e) => handleChange(key, e.target.value, 'number')} />;
        } else if (typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb'))) {
            inputElement = <input type="color" style={{ ...commonInputStyle, height: '36px' }} value={value} onChange={(e) => handleChange(key, e.target.value, 'string')} />;
        } else if (key === 'textAlign' || key === 'objectFit' || (key === 'display' && component.type === 'container')) {
            const options = {
                textAlign: ['left', 'center', 'right', 'justify'],
                objectFit: ['fill', 'contain', 'cover', 'none', 'scale-down'],
                display: ['flex', 'block', 'grid', 'inline-flex'] // Add more as needed
            };
            inputElement = (
                <select style={{ ...commonInputStyle, appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '28px', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\'><path fill=\'%236b7280\' d=\'M7 10l5 5 5-5z\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }} value={value} onChange={(e) => handleChange(key, e.target.value, 'string')}>
                    {options[key]?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        }
        else {
            inputElement = <input type="text" style={commonInputStyle} value={value} onChange={(e) => handleChange(key, e.target.value, 'string')} />;
        }

        return (
            <div key={key} style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '3px', textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1')}:
                </label>
                {inputElement}
            </div>
        );
    };

    // Common offset options for positioning
    const offsetOptions = ['auto', '0', '5px', '10px', '20px', '50%', '100px'] as const;

    const renderOffsetSelect = (key: 'top' | 'left' | 'right' | 'bottom') => {
        const value = (currentProps as any)[key] ?? '';
        const isCustom = value !== '' && !offsetOptions.includes(value as any);
        return (
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '3px', textTransform: 'capitalize' }}>{key}:</label>
                <select
                    style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '3px', marginBottom: '3px' }}
                    value={isCustom ? 'custom' : (value === '' ? 'auto' : value)}
                    onChange={e => {
                        const v = e.target.value;
                        if (v === 'custom') return; // keep current, show input
                        handleChange(key, v === 'auto' ? '' : v, 'string');
                    }}
                >
                    {offsetOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                    <option value="custom">custom…</option>
                </select>
                {isCustom && (
                    <input
                        type="text"
                        style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '3px' }}
                        value={value}
                        onChange={e => handleChange(key, e.target.value, 'string')}
                        placeholder="e.g. 12px, 2rem"
                    />
                )}
            </div>
        );
    };

    // Parse CSS box shorthand (margin/padding) into 4 sides
    const parseBoxShorthand = (value: string | undefined): [string, string, string, string] => {
        const v = (value || '').trim();
        if (!v) return ['0', '0', '0', '0'];
        const parts = v.split(/\s+/);
        if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
        if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
        if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]];
        return [parts[0], parts[1], parts[2], parts[3]];
    };

    const joinBoxShorthand = (top: string, right: string, bottom: string, left: string) => {
        return `${top} ${right} ${bottom} ${left}`.trim();
    };

    const renderBoxInputs = (boxKey: 'margin' | 'padding', label: string) => {
        const [t, r, b, l] = parseBoxShorthand((currentProps as any)[boxKey]);
        const setSide = (side: 'top' | 'right' | 'bottom' | 'left', val: string) => {
            const next = { top: t, right: r, bottom: b, left: l } as Record<string, string>;
            next[side] = val;
            handleChange(boxKey, joinBoxShorthand(next.top, next.right, next.bottom, next.left), 'string');
        };
        const inputStyle = { width: 'calc(25% - 6px)', padding: '8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px', background: '#fff' } as const;
        const labelStyle = { display: 'block', fontSize: '0.9em', marginBottom: '3px' } as const;
        return (
            <div style={{ marginBottom: '10px' }}>
                <label style={labelStyle}>{label}</label>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input type="text" style={inputStyle} value={t} onChange={e => setSide('top', e.target.value)} placeholder="top" />
                    <input type="text" style={inputStyle} value={r} onChange={e => setSide('right', e.target.value)} placeholder="right" />
                    <input type="text" style={inputStyle} value={b} onChange={e => setSide('bottom', e.target.value)} placeholder="bottom" />
                    <input type="text" style={inputStyle} value={l} onChange={e => setSide('left', e.target.value)} placeholder="left" />
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: '15px' }} onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleApply();
            }
        }}>
            <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1em' }}>
                Edit: {component.type}
                <span style={{ fontSize: '0.7em', color: '#777', marginLeft: '5px' }}>({component.id.slice(-5)})</span>
            </h4>
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', paddingRight: '5px' }}>
                {/* Always show container layout controls */}
                {component.type === 'container' && (
                    <>
                        {renderPropField('flexDirection', currentProps.flexDirection || 'column')}
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '3px' }}>
                                Justify Content:
                            </label>
                            <select
                                style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '3px', marginBottom: '3px' }}
                                value={currentProps.justifyContent || 'flex-start'}
                                onChange={(e) => handleChange('justifyContent', e.target.value, 'string')}
                            >
                                <option value="flex-start">flex-start</option>
                                <option value="center">center</option>
                                <option value="flex-end">flex-end</option>
                                <option value="space-between">space-between</option>
                                <option value="space-around">space-around</option>
                                <option value="space-evenly">space-evenly</option>
                            </select>
                        </div>
                    </>
                )}
                {/* Always show sizing, margin and padding for all elements */}
                {renderPropField('width', currentProps.width ?? 'auto')}
                {renderPropField('height', currentProps.height ?? 'auto')}
                {renderBoxInputs('margin', 'Margin (TRBL)')}
                {renderBoxInputs('padding', 'Padding (TRBL)')}
                {/* Icon specific controls */}
                {component.type === 'icon' && (
                    <>
                        {renderPropField('name', currentProps.name || 'Square')}
                        {renderPropField('size', currentProps.size || 24)}
                        {renderPropField('color', currentProps.color || '#111827')}
                    </>
                )}
                {/* Input specific controls */}
                {component.type === 'input' && (
                    <>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '3px' }}>Type</label>
                            <select style={{ width: '100%', padding: '8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px', marginBottom: '6px', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '28px', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\'><path fill=\'%236b7280\' d=\'M7 10l5 5 5-5z\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }} value={currentProps.kind || 'text'} onChange={(e) => handleChange('kind', e.target.value, 'string')}>
                                <option value="text">text</option>
                                <option value="checkbox">checkbox</option>
                                <option value="radio">radio</option>
                            </select>
                        </div>
                        {renderPropField('label', currentProps.label || '')}
                        {renderPropField('placeholder', currentProps.placeholder || '')}
                    </>
                )}
                {/* B I U buttons for text */}
                {component.type === 'text' && (
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                        <button
                            type="button"
                            style={{ fontWeight: 'bold', fontSize: 18, width: 28, height: 28, border: currentProps.bold ? '2px solid #007bff' : '1px solid #ccc', borderRadius: 4, background: currentProps.bold ? '#e6f0ff' : '#fff', cursor: 'pointer' }}
                            onClick={() => setCurrentProps(prev => ({ ...prev, bold: !prev.bold }))}
                            title="Bold"
                        >B</button>
                        <button
                            type="button"
                            style={{ fontStyle: 'italic', fontSize: 18, width: 28, height: 28, border: currentProps.italic ? '2px solid #007bff' : '1px solid #ccc', borderRadius: 4, background: currentProps.italic ? '#e6f0ff' : '#fff', cursor: 'pointer' }}
                            onClick={() => setCurrentProps(prev => ({ ...prev, italic: !prev.italic }))}
                            title="Italic"
                        >I</button>
                        <button
                            type="button"
                            style={{ textDecoration: 'underline', fontSize: 18, width: 28, height: 28, border: currentProps.underline ? '2px solid #007bff' : '1px solid #ccc', borderRadius: 4, background: currentProps.underline ? '#e6f0ff' : '#fff', cursor: 'pointer' }}
                            onClick={() => setCurrentProps(prev => ({ ...prev, underline: !prev.underline }))}
                            title="Underline"
                        >U</button>
                    </div>
                )}
                {Object.entries(currentProps).map(([key, value]) =>
                    (component.type === 'container' && key === 'flexDirection') ||
                    ['margin','padding','width','height'].includes(key) ||
                    (component.type === 'text' && ['bold','italic','underline'].includes(key)) ||
                    (component.type === 'image' && ['position','top','left','right','bottom','background'].includes(key)) ||
                    (component.type === 'icon' && ['name','size','color'].includes(key)) ||
                    (component.type === 'input' && ['kind','label','placeholder'].includes(key))
                        ? null : renderPropField(key, value)
                )}
                {/* Image advanced positioning controls */}
                {component.type === 'image' && (
                    <>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '3px' }}>
                                Position:
                            </label>
                            <select
                                style={{ width: '100%', padding: '8px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px', marginBottom: '6px', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '28px', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\'><path fill=\'%236b7280\' d=\'M7 10l5 5 5-5z\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                                value={currentProps.position || 'static'}
                                onChange={e => handleChange('position', e.target.value, 'string')}
                            >
                                <option value="static">static</option>
                                <option value="relative">relative</option>
                                <option value="absolute">absolute</option>
                                <option value="fixed">fixed</option>
                                <option value="sticky">sticky</option>
                            </select>
                        </div>
                        {['relative', 'absolute', 'fixed', 'sticky'].includes(currentProps.position) && (
                            <>
                                {renderOffsetSelect('top')}
                                {renderOffsetSelect('left')}
                                {renderOffsetSelect('right')}
                                {renderOffsetSelect('bottom')}
                            </>
                        )}
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '3px' }}>Background:</label>
                            <input type="checkbox" checked={!!currentProps.background} onChange={e => {
                                const checked = e.target.checked;
                                setCurrentProps(prev => ({
                                    ...prev,
                                    background: checked,
                                    __wasBackground: checked ? true : prev.__wasBackground,
                                }));
                            }} />
                            <span style={{ marginLeft: 8 }}>Use image as container background</span>
                        </div>
                    </>
                )}
            </div>
            <button onClick={handleApply} style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', width: '100%', marginTop: '15px' }}>
                Apply Changes
            </button>
            <button onClick={async () => {
                try {
                    const data = JSON.stringify({ id: component.id, type: component.type, props: currentProps, children: component.children }, null, 2);
                    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(data);
                        alert('Component JSON copied to clipboard');
                    } else {
                        const ta = document.createElement('textarea');
                        ta.value = data;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                        alert('Component JSON copied to clipboard');
                    }
                } catch (e) {
                    alert('Failed to copy JSON');
                }
            }} style={{ background: '#111827', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', width: '100%', marginTop: '10px' }}>
                Copy JSON
            </button>
            <button onClick={() => onRemoveComponent(component.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', width: '100%', marginTop: '10px' }}>
                Remove Component
            </button>
        </div>
    );
};
export default PropertiesEditor;
