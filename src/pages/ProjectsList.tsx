import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getAllDocuments } from '../data/documentRepository';

const ProjectsList = () => {
    const navigate = useNavigate();
    const projects = getAllDocuments();

    return (
        <div className="min-h-screen bg-slate-50 font-sans p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-600 font-semibold mb-8 hover:text-blue-600 transition"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </button>
                <h1 className="text-3xl font-bold text-slate-800 mb-6">Your Projects</h1>
                {projects.length === 0 ? (
                    <p className="text-slate-500">You don't have any saved projects yet. Go back to create a new one!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {projects.map(project => (
                            <Link
                                to={`/project/${project.id}`}
                                key={project.id}
                                className="block bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-500 transition-all transform hover:-translate-y-1"
                            >
                                <h2 className="text-lg font-bold text-slate-800 truncate">{project.name}</h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Last modified: {new Date(project.lastModified).toLocaleDateString()}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectsList;
