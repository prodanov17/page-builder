import type { ComponentType } from "@/types/builder";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";

export type ControlType = 'text' | 'number' | 'color' | 'select' | 'toggle' | 'box' | 'button-group';

export interface ControlOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

export interface ControlDefinition {
    prop: string;
    label: string;
    defaultValue?: string | number | boolean;
    control: ControlType;
    options?: ControlOption[];
}

export interface GroupDefinition {
    title: string;
    controls: ControlDefinition[];
}

// A shared group for common properties to keep our schema DRY (Don't Repeat Yourself)
const sizingGroup: GroupDefinition = {
    title: 'Sizing & Spacing',
    controls: [
        { prop: 'width', label: 'Width', control: 'text' },
        { prop: 'height', label: 'Height', control: 'text' },
        { prop: 'padding', label: 'Padding', control: 'box' },
        { prop: 'margin', label: 'Margin', control: 'box' },
    ],
};

export const componentEditorSchema: Record<ComponentType, GroupDefinition[]> = {
    container: [
        {
            title: 'Layout',
            controls: [
                { prop: 'display', label: 'Display', control: 'select', options: [{ value: 'flex', label: 'Flex' }, { value: 'grid', label: 'Grid' }, { value: 'block', label: 'Block' }] },
                { prop: 'flexDirection', label: 'Direction', control: 'select', options: [{ value: 'row', label: 'Row' }, { value: 'column', label: 'Column' }] },
                { prop: 'justifyContent', label: 'Justify', control: 'select', options: [{ value: 'flex-start', label: 'Start' }, { value: 'center', label: 'Center' }, { value: 'flex-end', label: 'End' }, { value: 'space-between', label: 'Space Between' }] },
                { prop: 'alignItems', label: 'Align', control: 'select', options: [{ value: 'flex-start', label: 'Start' }, { value: 'center', label: 'Center' }, { value: 'flex-end', label: 'End' }, { value: 'stretch', label: 'Stretch' }] },
                { prop: 'gap', label: 'Gap', control: 'text' },
            ],
        },
        {
            title: 'Appearance',
            controls: [
                { prop: 'backgroundColor', label: 'Background', control: 'color' },
                { prop: 'borderRadius', label: 'Radius', control: 'text' },
                { prop: 'border', label: 'Border', control: 'text' },
                { prop: 'backgroundImage', label: 'Background Image URL', control: 'text' },
            ],
        },
        sizingGroup // Reuse the shared group
    ],
    text: [
        {
            title: 'Content',
            controls: [{ prop: 'content', label: 'Text', control: 'text' }],
        },
        {
            title: 'Typography',
            controls: [
                { prop: 'fontSize', label: 'Size', control: 'text' },
                { prop: 'fontWeight', label: 'Weight', control: 'select', options: [{ value: '400', label: 'Normal' }, { value: '500', label: 'Medium' }, { value: '600', label: 'Semi-Bold' }, { value: '700', label: 'Bold' }] },
                { prop: 'color', label: 'Color', control: 'color' },
                {
                    prop: 'textAlign', label: 'Align', control: 'button-group', options: [
                        { value: 'left', label: 'Left', icon: <AlignLeft size={16} /> }, { value: 'center', label: 'Center', icon: <AlignCenter size={16} /> }, { value: 'right', label: 'Right', icon: <AlignRight size={16} /> }, { value: 'justify', label: 'Justify', icon: <AlignJustify size={16} /> }
                    ]
                },
            ],
        },
        sizingGroup // Reuse the shared group
    ],
    button: [
        { title: 'Content', controls: [{ prop: 'text', label: 'Button Text', control: 'text' }] },
        {
            title: 'Appearance', controls: [
                { prop: 'backgroundColor', label: 'Background', control: 'color' },
                { prop: 'color', label: 'Text Color', control: 'color' },
                { prop: 'borderRadius', label: 'Radius', control: 'text' },
                { prop: 'border', label: 'Border', control: 'text' },
            ]
        },
        sizingGroup
    ],
    image: [
        {
            title: 'Content', controls: [
                { prop: 'src', label: 'Source URL', control: 'text' },
                { prop: 'alt', label: 'Alt Text', control: 'text' },
            ]
        },
        {
            title: 'Positioning', controls: [
                { prop: 'position', label: 'Position', control: 'select', options: [{ value: 'static', label: 'Static' }, { value: 'relative', label: 'Relative' }, { value: 'absolute', label: 'Absolute' }, { value: 'fixed', label: 'Fixed' }, { value: 'sticky', label: 'Sticky' }] },
                { prop: 'top', label: 'Top', control: 'text' },
                { prop: 'left', label: 'Left', control: 'text' },
                { prop: 'right', label: 'Right', control: 'text' },
                { prop: 'bottom', label: 'Bottom', control: 'text' },
            ]
        },
        {
            title: 'Appearance', controls: [
                { prop: 'objectFit', label: 'Fit', control: 'select', options: [{ value: 'cover', label: 'Cover' }, { value: 'contain', label: 'Contain' }, { value: 'fill', label: 'Fill' }, { value: 'none', label: 'None' }] },
                { prop: 'borderRadius', label: 'Radius', control: 'text' },
            ]
        },
        sizingGroup
    ],
    icon: [
        {
            title: 'Icon', controls: [
                { prop: 'name', label: 'Name (from Lucide)', control: 'text' },
                { prop: 'size', label: 'Size', control: 'number' },
                { prop: 'color', label: 'Color', control: 'color' },
                { prop: 'strokeWidth', label: 'Stroke Width', control: 'number' },
            ]
        },
        sizingGroup
    ],
    input: [
        {
            title: 'Content', controls: [
                { prop: 'label', label: 'Label', control: 'text' },
                { prop: 'placeholder', label: 'Placeholder', control: 'text' },
            ]
        },
        {
            title: 'Configuration', controls: [
                { prop: 'kind', label: 'Type', control: 'select', options: [{ value: 'text', label: 'Text' }, { value: 'email', label: 'Email' }, { value: 'password', label: 'Password' }, { value: 'number', label: 'Number' }] }
            ]
        },
        sizingGroup
    ]
};

export const pageEditorSchema: GroupDefinition[] = [
    {
        title: 'Canvas Styles',
        controls: [
            { prop: 'backgroundColor', label: 'Background Color', control: 'color' },
            { prop: 'color', label: 'Default Text Color', control: 'color' },
            { prop: 'fontFamily', label: 'Font Family', control: 'text' },
        ]
    }
];
