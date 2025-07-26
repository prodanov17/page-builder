import React from 'react';

// Define your available components and their default structures
export const availableComponentsList = [
    { type: 'text', label: 'Text', defaultProps: { content: 'New Text Block', fontSize: '16px', color: '#333' } },
    { type: 'button', label: 'Button', defaultProps: { text: 'Click Me', backgroundColor: '#007bff', color: '#ffffff', padding: '10px 20px' } },
    { type: 'image', label: 'Image', defaultProps: { src: '', alt: 'My Image', width: '200px', height: 'auto' } },
    { type: 'container', label: 'Container (Column)', defaultProps: { padding: '10px', backgroundColor: 'rgba(200,200,200,0.1)', minHeight: '80px', name: 'New Container', flexDirection: 'column' }, children: [] },
    { type: 'container', label: 'Container (Row)', defaultProps: { padding: '10px', backgroundColor: 'rgba(200,200,200,0.1)', minHeight: '80px', name: 'Row Container', flexDirection: 'row', alignItems: 'center' }, children: [] },
];

const ComponentPalette = ({ onAddComponent }) => {
    return (
        <div style={{ padding: '15px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '1.1em' }}>Add Elements</h3>
            {availableComponentsList.map(compInfo => (
                <button
                    key={compInfo.type}
                    onClick={() => onAddComponent(compInfo.type, compInfo.defaultProps, compInfo.children)}
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px',
                        marginBottom: '8px',
                        textAlign: 'left',
                        background: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    {compInfo.label}
                </button>
            ))}
        </div>
    );
};
export default ComponentPalette;
