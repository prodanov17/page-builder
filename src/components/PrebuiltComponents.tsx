import React from 'react';
import { Layers } from 'lucide-react';
import type { Component } from '@/types/builder';
import { prebuiltComponents } from '@/utils/prebuilt';
import { parseComponentFromJson } from '@/utils/utility';
import { toast } from 'sonner';

type PrebuiltComponentsProps = {
    onAddComponent: (component: Component) => void;
};

const PrebuiltComponents: React.FC<PrebuiltComponentsProps> = ({ onAddComponent }) => {

    const handleAddPrebuilt = (jsonString: string) => {
        // Use your utility function to parse, validate, and regenerate IDs
        const component = parseComponentFromJson(jsonString);

        if (component) {
            onAddComponent(component);
            toast.success(`Added "${component.type}" component.`);
        } else {
            toast.error("Failed to add component: Invalid JSON structure.");
            console.error("Invalid pre-built component JSON:", jsonString);
        }
    };

    return (
        <div className="space-y-2">
            {prebuiltComponents.map(({ name, componentJson }) => (
                <button
                    key={name}
                    onClick={() => handleAddPrebuilt(componentJson)}
                    className="flex items-center gap-3 w-full text-left p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                >
                    <Layers size={18} className="text-blue-600 flex-shrink-0" />
                    <span>{name}</span>
                </button>
            ))}
        </div>
    );
};

export default PrebuiltComponents;
