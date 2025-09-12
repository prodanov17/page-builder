// src/renderer/CanvasRenderer.jsx
import { componentMap } from '../builder-elements/componentMap';
import type { AlignSelfType, Component, ComponentType, PropsType } from '@/types/builder';

interface CanvasRendererProps {
    components: Component[];
    globalStyles: React.CSSProperties;
    onSelectComponent: (id: string) => void;
    selectedComponentId: string | null;
    onAddComponentRequestToContainer: (containerId: string, type: ComponentType, defaultProps?: PropsType, children?: Component[]) => void;
    updateChildPlacement: (childId: string,
        placement: { order?: number; alignSelf?: AlignSelfType },
    ) => void;
}

const CanvasRenderer = ({ components, globalStyles, onSelectComponent, selectedComponentId, onAddComponentRequestToContainer, updateChildPlacement }: CanvasRendererProps) => {
    const renderComponent = (componentConfig: Component) => {
        const ComponentToRender = componentMap[componentConfig.type];

        if (!ComponentToRender) {
            return <div key={componentConfig.id}>Unknown component type: {componentConfig.type}</div>;
        }

        return (
            <ComponentToRender
                key={componentConfig.id}
                id={componentConfig.id}
                props={componentConfig.props}
                children={componentConfig.children}
                onSelect={onSelectComponent}
                isSelected={selectedComponentId === componentConfig.id}
                selectedComponentId={selectedComponentId} // Pass down for child selection logic in Container
                onAddComponentRequest={onAddComponentRequestToContainer} // Pass down to containers
                updateChildPlacement={updateChildPlacement} // Pass for containers
            />
        );
    };

    return (
        <div className="canvas" style={{ ...globalStyles, borderRadius: 12, background: '#fff' }}>
            {components.length === 0 && (
                <div
                    style={{
                        textAlign: 'center',
                        color: '#6b7280',
                        padding: '60px 24px',
                        border: '1px dashed rgba(0,0,0,0.08)',
                        margin: '16px',
                        borderRadius: 12,
                        background: 'linear-gradient(180deg, #ffffff, #cececec)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 10px rgba(0,0,0,0.05)',
                    }}
                >
                    The canvas is empty. Add components from the palette.
                </div>
            )}
            {components.map(renderComponent)}
        </div>
    );
};

export default CanvasRenderer;
