import { BrowserRouter, Routes, Route, NavLink, Outlet, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";

const navStyle = ({ isActive }) => ({
  color: isActive ? "#4ade80" : "#fff",
  textDecoration: "none",
  fontWeight: isActive ? "bold" : "normal",
});

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

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
        <NavLink to="/" end style={navStyle}>Dashboard</NavLink>
        <NavLink to="/projects" style={navStyle}>Projects</NavLink>
        <NavLink to="/tasks" style={navStyle}>Tasks</NavLink>
        <button
          onClick={handleLogout}
          style={{ marginTop: 30, padding: 8, cursor: "pointer" }}
        >
          Log out
        </button>
      </nav>
    </div>
  );
}

function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "220px", padding: "30px", width: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;