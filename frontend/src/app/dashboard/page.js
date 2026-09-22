"use client";

import { useEffect, useState } from "react";
import { apiFetch, getToken } from "@/lib/api";
import { useRequireAuth } from "@/lib/useRequireAuth";
import ProjectCard from "@/components/ProjectCard";

export default function DashboardPage() {
  useRequireAuth();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) return;

    const load = async () => {
      try {
        const [projectsData, tasksData] = await Promise.all([
          apiFetch("/projects"),
          apiFetch("/tasks"),
        ]);
        setProjects(projectsData);
        setTasks(tasksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <main className="mx-auto max-w-6xl px-6 py-20">Loading...</main>;
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold">Your projects</h1>

      {projects.length === 0 ? (
        <p className="mt-6 text-gray-600">No projects yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              tasks={tasks.filter((t) => t.project?._id === project._id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}