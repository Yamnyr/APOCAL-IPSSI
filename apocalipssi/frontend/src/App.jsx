import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import UploadPage from "./pages/UploadPage"
import DocumentsListPage from "./pages/DocumentsListPage"

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/documents" element={<DocumentsListPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
