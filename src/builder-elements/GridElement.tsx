import { forwardRef } from 'react';
import type { BuilderComponent, GridComponentProps, GridChildPlacement } from '@/utils/types';
import { componentMap } from './componentMap';

const GridElement = forwardRef<HTMLDivElement, GridComponentProps>(
  ({ id, props, children = [], onSelect, isSelected, selectedComponentId, onAddComponentRequest, updateChildPlacement }, ref) => {
    const style = {
      display: 'grid',
      gridTemplateColumns: props.gridTemplateColumns || '1fr 1fr',
      gridTemplateRows: props.gridTemplateRows || 'auto',
      gap: props.gap || '8px',
      padding: props.padding || '10px',
      margin: props.margin || '5px',
      backgroundColor: props.backgroundColor || 'rgba(0,0,0,0.03)',
      border: `2px dashed ${isSelected ? 'dodgerblue' : (props.borderColor || '#cccccc')}`,
      width: props.width || 'auto',
      height: props.height || 'auto',
      cursor: 'pointer',
    } as const;

    // Sort children by order if present
    const sortedChildren = [...children].sort((a, b) => (a.placement?.order ?? 0) - (b.placement?.order ?? 0));

    const renderChild = (childComp: BuilderComponent, idx: number) => {
      const ChildComponentToRender = componentMap[childComp.type];
      if (!ChildComponentToRender) {
        return <div key={childComp.id}>Unknown type: {childComp.type}</div>;
      }
      const childStyle = {
        gridColumn: (childComp.placement as GridChildPlacement)?.gridColumn,
        gridRow: (childComp.placement as GridChildPlacement)?.gridRow,
        order: childComp.placement?.order ?? idx,
        position: 'relative',
        minWidth: 0,
      };
      return (
        <div key={childComp.id} style={childStyle}>
          <ChildComponentToRender
            id={childComp.id}
            props={childComp.props}
            children={childComp.children}
            onSelect={onSelect}
            isSelected={selectedComponentId === childComp.id}
            selectedComponentId={selectedComponentId}
            onAddComponentRequest={onAddComponentRequest}
          />
        </div>
      );
    };

    return (
      <div
        ref={ref}
        style={style}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) {
            e.stopPropagation();
            onSelect(id);
          }
        }}
      >
        {sortedChildren.length > 0 ? (
          sortedChildren.map(renderChild)
        ) : (
          <div style={{ color: '#aaa', textAlign: 'center', padding: '20px 0' }} onClick={(e: React.MouseEvent<HTMLDivElement>) => { e.stopPropagation(); onAddComponentRequest?.(id); }}>
            {isSelected ? 'Grid (empty). Click here to add elements.' : 'Empty Grid'}
          </div>
        )}
      </div>
    );
  }
);

GridElement.displayName = 'GridElement';

export default GridElement;
