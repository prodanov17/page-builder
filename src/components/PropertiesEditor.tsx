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

    const handleApply = () => {
        onUpdateComponent(component.id, { props: currentProps });
    };

    const renderPropField = (key, value) => {
        const commonInputStyle = { width: 'calc(100% - 12px)', padding: '6px', border: '1px solid #ccc', borderRadius: '3px', marginBottom: '3px' };
        let inputElement;

        if (typeof value === 'boolean') {
            inputElement = <input type="checkbox" checked={!!value} onChange={(e) => handleChange(key, e.target.checked, 'boolean')} />;
        } else if (typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)) && (key.includes('size') || key.includes('width') || key.includes('height') || key.includes('padding') || key.includes('margin') || key.includes('gap') || key.includes('radius')))) {
            inputElement = <input type="number" style={commonInputStyle} value={value} onChange={(e) => handleChange(key, e.target.value, 'number')} />;
        } else if (typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb'))) {
            inputElement = <input type="color" style={{ ...commonInputStyle, height: '30px' }} value={value} onChange={(e) => handleChange(key, e.target.value, 'string')} />;
        } else if (key === 'flexDirection' && component.type === 'container') {
            inputElement = (
                <select style={commonInputStyle} value={value} onChange={(e) => handleChange(key, e.target.value, 'string')}>
                    <option value="row">Row</option>
                    <option value="column">Column</option>
                    <option value="row-reverse">Row Reverse</option>
                    <option value="column-reverse">Column Reverse</option>
                </select>
            );
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
                {Object.entries(currentProps).map(([key, value]) => renderPropField(key, value))}
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
