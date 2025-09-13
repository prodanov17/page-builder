import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Plus, Upload } from 'lucide-react';
import { createNewDocument, saveDocument } from '../data/documentRepository';
import { generateId } from '../utils/utility'; // Import the ID generator
import type { Builder } from '../types/builder';
import { toast } from 'sonner'; // Assuming you use a toast library for notifications

const Home = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleNewProject = () => {
        const newDoc = createNewDocument("Untitled Project");
        navigate(`/project/${newDoc.id}`);
    };

    const handleImportClick = () => {
        // Programmatically click the hidden file input
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 1. Read the selected file
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result;
            if (typeof content !== 'string') {
                toast.error("Could not read the file.");
                return;
            }

            try {
                // 2. Parse and validate the JSON content
                const importedData = JSON.parse(content);
                if (!importedData.components || !importedData.styles || !importedData.name) {
                    throw new Error("Invalid project file format.");
                }

                // 3. Create a new document object with a new unique ID
                const newDoc: Builder = {
                    ...importedData,
                    id: generateId(), // CRUCIAL: Assign a new ID to prevent conflicts
                    name: `${importedData.name} (Imported)`,
                };

                // 4. Save the new document to storage
                saveDocument(newDoc);
                toast.success("Project imported successfully!");

                // 5. Navigate to the newly created project's editor
                navigate(`/project/${newDoc.id}`);

            } catch (error) {
                toast.error("Import failed: The file is not a valid project JSON.");
                console.error(error);
            }
        };
        reader.readAsText(file);

        // Reset the file input value to allow importing the same file again
        event.target.value = '';
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
            <div className="text-center px-6">
                <h1 className="text-5xl font-extrabold text-slate-800 mb-3">Builder App</h1>
                <p className="text-lg text-slate-600 mb-12">
                    Create, edit, and manage your web projects with ease.
                </p>

                {/* Button grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-xl mx-auto">
                    <button
                        onClick={() => navigate('/projects')}
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all border border-slate-200"
                    >
                        <Folder size={32} className="text-blue-600" />
                        <span className="text-base font-medium text-slate-700">Open Projects</span>
                    </button>

                    <button
                        onClick={handleNewProject}
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all border border-slate-200"
                    >
                        <Plus size={32} className="text-green-600" />
                        <span className="text-base font-medium text-slate-700">New Project</span>
                    </button>

                    <button
                        onClick={handleImportClick}
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all border border-slate-200"
                    >
                        <Upload size={32} className="text-purple-600" />
                        <span className="text-base font-medium text-slate-700">Import</span>
                    </button>
                </div>
            </div>

            {/* Hidden file input to handle the import action */}
            <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default Home;
