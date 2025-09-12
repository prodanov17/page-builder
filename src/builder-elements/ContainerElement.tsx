import { forwardRef, type MouseEvent } from 'react';
import type { ContainerComponentProps, BuilderComponent, ChildPlacement } from '@/utils/types';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { componentMap } from './componentMap';

const alignSelfOptions = ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'] as const;

const ContainerElement = forwardRef<HTMLDivElement, ContainerComponentProps>(
    ({ id, props, children = [], onSelect, isSelected, selectedComponentId, onAddComponentRequest, updateChildPlacement }, ref) => {
        const isRow = props.flexDirection === 'row' || props.flexDirection === 'row-reverse';

        // Use the modern 'outline' for the container's own selection indicator
        const style = {
            padding: props.padding ?? '0',
            backgroundColor: props.backgroundColor || 'transparent',
            border: `1px dashed ${props.borderColor || '#cbd5e1'}`, // A subtle default border
            margin: props.margin ?? '0',
            minHeight: props.minHeight || '50px',
            display: props.display || 'flex',
            flexDirection: props.flexDirection || 'column',
            alignItems: props.alignItems || 'stretch',
            justifyContent: props.justifyContent || 'flex-start',
            gap: props.gap || '5px',
            width: props.width ?? 'auto',
            height: props.height ?? 'auto',
            cursor: 'pointer',
            backgroundImage: props.backgroundImage ? `url('${props.backgroundImage}')` : undefined,
            backgroundSize: props.backgroundImage ? 'cover' : undefined,
            backgroundPosition: props.backgroundImage ? 'center' : undefined,
            outline: isSelected ? '2px solid #3b82f6' : 'none',
            outlineOffset: '2px',
        } as const;

        const handleEmptyClick = (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            onAddComponentRequest?.(id);
        };

        const handleMove = (childId: string, direction: 'left' | 'right') => {
            if (!updateChildPlacement) return;
            const child = children.find(c => c.id === childId);
            const currentIndex = children.findIndex(c => c.id === childId);
            if (!child) return;

            const newOrder = (child.placement?.order ?? currentIndex) + (direction === 'left' ? -1 : 1);
            updateChildPlacement(child.id, { order: newOrder });
        };

        const handleAlignSelf = (childId: string, alignSelf: ChildPlacement['alignSelf']) => {
            if (!updateChildPlacement) return;
            updateChildPlacement(childId, { alignSelf });
        };

        const sortedChildren = [...children].sort((a, b) => (a.placement?.order ?? 0) - (b.placement?.order ?? 0));

        const renderChild = (childComp: BuilderComponent, idx: number) => {
            const ChildComponentToRender = componentMap[childComp.type];
            if (!ChildComponentToRender) {
                return <div key={childComp.id}>Unknown type: {childComp.type}</div>;
            }

            const isChildSelected = selectedComponentId === childComp.id;

            return (
                <div key={childComp.id} className="relative" style={{ order: childComp.placement?.order ?? idx, alignSelf: childComp.placement?.alignSelf ?? 'auto' }}>
                    {/* The Child Component */}
                    <ChildComponentToRender
                        {...childComp}
                        onSelect={onSelect}
                        isSelected={isChildSelected}
                        selectedComponentId={selectedComponentId}
                        onAddComponentRequest={onAddComponentRequest}
                        updateChildPlacement={updateChildPlacement}
                    />

                    {/* The Overlay Toolbar - Renders only when conditions are met */}
                    {isRow && isChildSelected && (
                        <div className="absolute top-[-32px] left-1/2 -translate-x-1/2 z-10 flex items-center gap-0.5 p-1 bg-white rounded-md shadow-md border border-slate-200">
                            <button onClick={() => handleMove(childComp.id, 'left')} className="p-1 rounded hover:bg-slate-100"><ArrowLeft size={16} /></button>
                            <button onClick={() => handleMove(childComp.id, 'right')} className="p-1 rounded hover:bg-slate-100"><ArrowRight size={16} /></button>
                            <div className="w-px h-4 bg-slate-200 mx-1"></div>
                            <select
                                value={childComp.placement?.alignSelf ?? 'auto'}
                                onChange={(e) => handleAlignSelf(childComp.id, e.target.value as ChildPlacement['alignSelf'])}
                                className="text-xs border-none bg-transparent focus:ring-0"
                            >
                                {alignSelfOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    )}
                </div>
            );
        };

        return (
            <div ref={ref} style={style} onClick={(e: MouseEvent<HTMLDivElement>) => {
                if (e.target === e.currentTarget) { e.stopPropagation(); onSelect(id); }
            }}>
                {sortedChildren.length > 0 ? (
                    sortedChildren.map(renderChild)
                ) : (
                    <div className="text-slate-400 text-center p-5" onClick={handleEmptyClick}>
                        {isSelected ? 'Container is empty. Click to add an element.' : 'Empty Container'}
                    </div>
                )}
            </div>
        );
    }
);

ContainerElement.displayName = 'ContainerElement';
export default ContainerElement;
