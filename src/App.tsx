import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProjectsList from "./pages/ProjectsList";
import Project from "./pages/Project";
import Preview from "./pages/Preview";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/project/:projectId" element={<Project />} />
            <Route path="/preview/:projectId" element={<Preview />} />
            {/* Optional: Add a 404 Not Found Route */}
            <Route path="*" element={<div>Not Found</div>} />
        </Routes>
    );
}

export default App;
