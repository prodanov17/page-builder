import React, { useState, useEffect, useCallback } from 'react';

const PropertiesEditor = ({ component, onUpdateComponent, onRemoveComponent }) => {
    const [currentProps, setCurrentProps] = useState(component.props);
    // const [componentType, setComponentType] = useState(component.type); // If you allow type changes

    useEffect(() => {
        setCurrentProps(component.props);
        // setComponentType(component.type);
    }, [component]); // Re-initialize when component selection changes

    const handleChange = useCallback((propName, value, type) => {
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
        const commonInputStyle = { width: 'calc(100% - 12px)', padding: '6px', border: '1px solid #ccc', borderRadius: '3px', marginBottom: '3px' };
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
            inputElement = <input type="color" style={{ ...commonInputStyle, height: '30px' }} value={value} onChange={(e) => handleChange(key, e.target.value, 'string')} />;
        } else if (key === 'textAlign' || key === 'objectFit' || (key === 'display' && component.type === 'container')) {
            const options = {
                textAlign: ['left', 'center', 'right', 'justify'],
                objectFit: ['fill', 'contain', 'cover', 'none', 'scale-down'],
                display: ['flex', 'block', 'grid', 'inline-flex'] // Add more as needed
            };
            inputElement = (
                <select style={commonInputStyle} value={value} onChange={(e) => handleChange(key, e.target.value, 'string')}>
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

    return (
        <div style={{ padding: '15px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1em' }}>
                Edit: {component.type}
                <span style={{ fontSize: '0.7em', color: '#777', marginLeft: '5px' }}>({component.id.slice(-5)})</span>
            </h4>
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', paddingRight: '5px' }}>
                {/* Always show flexDirection for containers */}
                {component.type === 'container' && renderPropField('flexDirection', currentProps.flexDirection || 'column')}
                {/* Always show margin and padding for all elements */}
                {renderPropField('margin', currentProps.margin || '')}
                {renderPropField('padding', currentProps.padding || '')}
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
                    ['margin','padding'].includes(key) ||
                    (component.type === 'text' && ['bold','italic','underline'].includes(key)) ||
                    (component.type === 'image' && ['position','top','left','right','bottom','background'].includes(key))
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
                                style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '3px', marginBottom: '3px' }}
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
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '3px' }}>Top:</label>
                                    <input type="text" style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '3px' }} value={currentProps.top || ''} onChange={e => handleChange('top', e.target.value, 'string')} />
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '3px' }}>Left:</label>
                                    <input type="text" style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '3px' }} value={currentProps.left || ''} onChange={e => handleChange('left', e.target.value, 'string')} />
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '3px' }}>Right:</label>
                                    <input type="text" style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '3px' }} value={currentProps.right || ''} onChange={e => handleChange('right', e.target.value, 'string')} />
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '3px' }}>Bottom:</label>
                                    <input type="text" style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '3px' }} value={currentProps.bottom || ''} onChange={e => handleChange('bottom', e.target.value, 'string')} />
                                </div>
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
            <button onClick={() => onRemoveComponent(component.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', width: '100%', marginTop: '10px' }}>
                Remove Component
            </button>
        </div>
    );
};
export default PropertiesEditor;
