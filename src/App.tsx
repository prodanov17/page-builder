import { Route, Routes } from "react-router-dom"
import Home from "./ui/pages/home/Home"

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </>
    )
}

export default App
