import { type FC, type MouseEvent, type ForwardedRef, forwardRef } from 'react';
import { componentMap } from './componentMap';
import type { ContainerComponentProps, BuilderComponent, ChildPlacement } from '@/utils/types';

const alignSelfOptions = [
    'auto',
    'flex-start',
    'flex-end',
    'center',
    'baseline',
    'stretch',
] as const;

const ContainerElement = forwardRef<HTMLDivElement, ContainerComponentProps>(
    ({ id, props, children = [], onSelect, isSelected, selectedComponentId, onAddComponentRequest, updateChildPlacement }, ref) => {
        const isRow = props.flexDirection === 'row' || props.flexDirection === 'row-reverse';
        const style = {
            padding: props.padding ?? '0',
            backgroundColor: props.backgroundColor || 'rgba(0,0,0,0.03)',
            border: `2px dashed ${isSelected ? 'dodgerblue' : (props.borderColor || '#cccccc')}`,
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
            backgroundRepeat: props.backgroundImage ? 'no-repeat' : undefined,
        } as const;

        const handleEmptyClick = (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            onAddComponentRequest?.(id);
        };

        // Move child left/right (order) and change alignSelf
        const handleMove = (childIdx: number, direction: 'left' | 'right') => {
            if (!updateChildPlacement) return;
            const newOrder = (children[childIdx].placement?.order || childIdx) + (direction === 'left' ? -1 : 1);
            updateChildPlacement(children[childIdx].id, { order: newOrder });
        };
        const handleAlignSelf = (childId: string, alignSelf: ChildPlacement['alignSelf']) => {
            if (!updateChildPlacement) return;
            updateChildPlacement(childId, { alignSelf });
        };

        // Sort children by order if present
        const sortedChildren = [...children].sort((a, b) => (a.placement?.order ?? 0) - (b.placement?.order ?? 0));

        const renderChild = (childComp: BuilderComponent, idx: number) => {
            const ChildComponentToRender = componentMap[childComp.type];
            if (!ChildComponentToRender) {
                return <div key={childComp.id}>Unknown type: {childComp.type}</div>;
            }
            const childStyle = isRow
                ? {
                    order: childComp.placement?.order ?? idx,
                    alignSelf: childComp.placement?.alignSelf ?? 'auto',
                    position: 'relative',
                    minWidth: 0,
                }
                : {};
            return (
                <div
                    key={childComp.id}
                    style={childStyle}
                >
                    <ChildComponentToRender
                        id={childComp.id}
                        props={childComp.props}
                        children={childComp.children}
                        onSelect={onSelect}
                        isSelected={selectedComponentId === childComp.id}
                        selectedComponentId={selectedComponentId}
                        onAddComponentRequest={onAddComponentRequest}
                    />
                    {isRow && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 2, alignItems: 'center' }}>
                            <button onClick={() => handleMove(idx, 'left')} style={{ fontSize: 12 }}>&larr;</button>
                            <button onClick={() => handleMove(idx, 'right')} style={{ fontSize: 12 }}>&rarr;</button>
                            <select
                                value={childComp.placement?.alignSelf ?? 'auto'}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleAlignSelf(childComp.id, e.target.value as ChildPlacement['alignSelf'])}
                                style={{ fontSize: 12 }}
                            >
                                {alignSelfOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            );
        };

        return (
            <div
                ref={ref}
                style={style}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    // Only select the container if the click target is the container itself
                    if (e.target === e.currentTarget) {
                        e.stopPropagation();
                        onSelect(id);
                    }
                }}
            >
                {sortedChildren.length > 0 ? (
                    sortedChildren.map(renderChild)
                ) : (
                    <div 
                        style={{ color: '#aaa', textAlign: 'center', padding: '20px 0' }}
                        onClick={handleEmptyClick}
                    >
                        {isSelected ? 'Container (empty). Click here to add elements or drag elements in.' : 'Empty Container'}
                    </div>
                )}
            </div>
        );
    }
);

ContainerElement.displayName = 'ContainerElement';

export default ContainerElement;
