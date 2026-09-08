import { useState, useEffect } from "react";
import api from "../api/axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects");
      setProjects(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, { name, description });
      } else {
        await api.post("/projects", { name, description });
      }
      resetForm();
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save project");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setName(project.name);
    setDescription(project.description || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await api.delete(`/projects/${id}`);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete project");
    }
  };

  return (
    <div>
      <h2>Projects</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: 8, marginRight: 8 }}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: 8, marginRight: 8, width: 250 }}
        />
        <button type="submit" disabled={saving} style={{ padding: 8 }}>
          {saving ? "Saving..." : editingId ? "Update" : "Add project"}
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
      ) : projects.length === 0 ? (
        <p>No projects yet. Create your first one above.</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ background: "#eee", textAlign: "left" }}>
              <th style={{ padding: 8 }}>Name</th>
              <th style={{ padding: 8 }}>Description</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 8 }}>{p.name}</td>
                <td style={{ padding: 8 }}>{p.description}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => startEdit(p)} style={{ marginRight: 8 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Projects;