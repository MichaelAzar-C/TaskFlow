"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, getToken } from "@/lib/api";
import { useRequireAuth } from "@/lib/useRequireAuth";
import TaskItem from "@/components/TaskItem";

const STATUS_ORDER = ["todo", "in-progress", "done"];
const STATUS_LABELS = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

export default function ProjectDetail({ id }) {
  useRequireAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) return;

    const load = async () => {
      try {
        const [projectData, tasksData] = await Promise.all([
          apiFetch(`/projects/${id}`),
          apiFetch("/tasks"),
        ]);
        setProject(projectData);
        setTasks(tasksData.filter((t) => t.project?._id === id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return <main className="mx-auto max-w-4xl px-6 py-20">Loading...</main>;
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-red-600">{error}</p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">
        ← Back to dashboard
      </Link>

      <h1 className="mt-4 text-3xl font-bold">{project.name}</h1>
      {project.description && (
        <p className="mt-2 text-gray-600">{project.description}</p>
      )}

      <div className="mt-10 space-y-8">
        {STATUS_ORDER.map((status) => {
          const group = tasks.filter((t) => t.status === status);

          return (
            <section key={status}>
              <h2 className="text-lg font-semibold">
                {STATUS_LABELS[status]}{" "}
                <span className="font-normal text-gray-400">({group.length})</span>
              </h2>

              {group.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">Nothing here.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {group.map((task) => (
                    <TaskItem key={task._id} task={task} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}