import { useState, useEffect } from "react";
import api from "../api/axios";

function StatCard({ label, value }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: 8,
      padding: "16px 20px",
      minWidth: 140,
    }}>
      <div style={{ fontSize: 28, fontWeight: "bold" }}>{value}</div>
      <div style={{ color: "#666", fontSize: 14 }}>{label}</div>
    </div>
  );
}

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.get("/projects"),
          api.get("/tasks"),
        ]);
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const countByStatus = (status) => tasks.filter((t) => t.status === status).length;

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 30 }}>
        <StatCard label="Projects" value={projects.length} />
        <StatCard label="Tasks" value={tasks.length} />
        <StatCard label="To do" value={countByStatus("todo")} />
        <StatCard label="In progress" value={countByStatus("in-progress")} />
        <StatCard label="Done" value={countByStatus("done")} />
      </div>

      <h3>Recent tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.slice(-5).reverse().map((t) => (
            <li key={t._id} style={{ marginBottom: 6 }}>
              {t.title} — <span style={{ color: "#666" }}>{t.project?.name || "—"}</span>{" "}
              <em>({t.status})</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;