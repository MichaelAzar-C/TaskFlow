import { useState, useEffect } from "react";
import api from "../api/axios";

const STATUSES = ["todo", "in-progress", "done"];

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [projectId, setProjectId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/projects"),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("todo");
    setProjectId("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3) {
      setError("Task title must be at least 3 characters");
      return;
    }

    if (!editingId && !projectId) {
      setError("Please select a project");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, {
          title: trimmedTitle,
          description: description.trim(),
          status,
        });
      } else {
        await api.post("/tasks", {
          title: trimmedTitle,
          description: description.trim(),
          status,
          project: projectId,
        });
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save task");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setProjectId(task.project?._id || "");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete task");
    }
  };

  return (
    <div>
      <h2>Tasks</h2>

      {projects.length === 0 && !loading && (
        <p style={{ color: "#666" }}>
          Create a project first — every task must belong to one.
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: 8, marginRight: 8 }}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: 8, marginRight: 8, width: 200 }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: 8, marginRight: 8 }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {!editingId && (
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            style={{ padding: 8, marginRight: 8 }}
          >
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        )}

        <button type="submit" disabled={saving} style={{ padding: 8 }}>
          {saving ? "Saving..." : editingId ? "Update" : "Add task"}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} style={{ padding: 8, marginLeft: 8 }}>
            Cancel
          </button>
        )}
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ background: "#eee", textAlign: "left" }}>
              <th style={{ padding: 8 }}>Title</th>
              <th style={{ padding: 8 }}>Project</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 8 }}>{t.title}</td>
                <td style={{ padding: 8 }}>{t.project?.name || "—"}</td>
                <td style={{ padding: 8 }}>{t.status}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => startEdit(t)} style={{ marginRight: 8 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(t._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Tasks;