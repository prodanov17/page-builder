import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loadDocument } from '../data/documentRepository';
import type { Builder } from '../types/builder';
import { ExternalLink } from 'lucide-react';
import CanvasRenderer from '@/renderer/CanvasRenderer';

const Preview = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<Builder | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (projectId) {
            const doc = loadDocument(projectId);
            setProject(doc);
        }
        setIsLoading(false);
    }, [projectId]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen font-sans">Loading Preview...</div>;
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center h-screen font-sans text-center bg-slate-50 p-4">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Project Not Found</h1>
                <p className="text-slate-600 mb-6">The project you are trying to preview does not exist.</p>
                <Link
                    to="/projects"
                    className="px-6 py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition"
                >
                    Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Optional: Add a small banner to link back to the editor */}
            <div className="bg-slate-800 text-white text-center text-sm p-2">
                <Link to={`/project/${project.id}`} className="flex items-center justify-center gap-2 hover:underline">
                    <ExternalLink size={14} />
                    <span>Return to Editor</span>
                </Link>
            </div>
            {/* The actual preview content rendered by the canvas */}
            <CanvasRenderer
                ref={null}
                components={project.components}
                globalStyles={project.styles}
                onSelectComponent={() => { }}
                unselectComponent={() => { }}
                onAddComponentRequestToContainer={() => { }}
                updateChildPlacement={() => { }}
                selectedComponentId={null}
                isEditorMode={false}
            />
        </div>
    );
};

export default Preview;
