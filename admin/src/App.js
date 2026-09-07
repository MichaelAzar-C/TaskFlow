import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";

function Sidebar() {
  return (
    <div style={{
      width: "220px",
      background: "#1a1a2e",
      color: "#fff",
      height: "100vh",
      padding: "20px",
      position: "fixed",
    }}>
      <h2 style={{ marginBottom: "30px" }}>TaskFlow</h2>
      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</Link>
        <Link to="/projects" style={{ color: "#fff", textDecoration: "none" }}>Projects</Link>
        <Link to="/tasks" style={{ color: "#fff", textDecoration: "none" }}>Tasks</Link>
      </nav>
    </div>
  );
}

function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "220px", padding: "30px", width: "100%" }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><AdminLayout><Projects /></AdminLayout></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><AdminLayout><Tasks /></AdminLayout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;