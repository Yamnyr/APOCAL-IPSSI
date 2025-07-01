import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import DocumentsListPage from "./pages/DocumentsListPage";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <div className="content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/documents" element={<DocumentsListPage />} />
                </Routes>
              </div>
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
