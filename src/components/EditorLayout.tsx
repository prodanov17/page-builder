import React from 'react';
const EditorLayout = ({ palette, canvas, properties }) => (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ width: '220px', borderRight: '1px solid #ddd', overflowY: 'auto', background: '#f8f9fa' }}>{palette}</div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px', background: '#e9ecef' }}>{canvas}</div>
        <div style={{ width: '280px', borderLeft: '1px solid #ddd', overflowY: 'auto', background: '#f8f9fa' }}>{properties}</div>
    </div>
);
export default EditorLayout;
