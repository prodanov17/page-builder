import React from 'react';

interface EditorLayoutProps {
    showPanels: { topbar: boolean; sidebar: boolean; properties: boolean };
    menubar: React.ReactNode;
    topbar: React.ReactNode;
    sidebar: React.ReactNode;
    canvas: React.ReactNode;
    properties: React.ReactNode;
}
const EditorLayout = ({ menubar, topbar, sidebar, canvas, properties, showPanels }: EditorLayoutProps) => (
    <div
        style={{
            display: 'flex',
            height: '100vh',
            fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
            background: 'linear-gradient(180deg, rgba(245,246,248,1) 0%, rgba(238,240,244,1) 100%)',
            padding: '16px',
            boxSizing: 'border-box',
            gap: '16px',
            overflow: 'hidden',
        }}
    >
        <div
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                gap: '16px',
                overflow: 'visible',
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.06)',
                padding: '16px',
            }}
        >
            <div style={{
                borderRadius: '10px',
                boxShadow: '0 6px 14px rgba(0,0,0,0.06)',
                background: 'linear-gradient(180deg, #ffffff, #fbfcff)',
                position: 'relative',
                overflow: 'visible',
            }} className="hide-scrollbars">
                {menubar}

            </div>

            {showPanels.topbar && <div style={{
                borderRadius: '10px',
                padding: '8px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 6px 14px rgba(0,0,0,0.06)',
                background: 'linear-gradient(180deg, #ffffff, #fbfcff)',
                position: 'relative',
                overflow: 'visible',
            }} className="hide-scrollbars">
                {topbar}
            </div>}
            <div style={{ display: 'flex', gap: 16, minHeight: 0 }}>
                {showPanels.sidebar && <div
                    style={{
                        width: '260px',
                        overflowY: 'auto',
                        background: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.06)',
                        border: '1px solid rgba(0,0,0,0.06)',
                        padding: '12px',
                    }}
                    className="hide-scrollbars"
                >
                    {sidebar}
                </div>}
                <div style={{ flex: 1, overflow: 'auto', background: 'linear-gradient(180deg, #fafbfc, #f6f8fb)', borderRadius: '12px', padding: '12px', border: '1px dashed rgba(0,0,0,0.06)' }} className="hide-scrollbars">
                    {canvas}
                </div>
                {showPanels.properties && <div
                    style={{
                        width: '300px',
                        overflowY: 'auto',
                        background: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.06)',
                        border: '1px solid rgba(0,0,0,0.06)',
                        padding: '12px',
                    }}
                    className="hide-scrollbars"
                >
                    {properties}
                </div>}
            </div>
        </div>
    </div>
);
export default EditorLayout;
