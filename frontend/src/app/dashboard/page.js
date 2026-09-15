"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, getToken } from "@/lib/api";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Load data once on mount
  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

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
  }, [router]);

  // Watch for logout in this tab or any other
  useEffect(() => {
    const check = () => {
      if (!getToken()) router.replace("/login");
    };

    window.addEventListener("auth-change", check);
    window.addEventListener("storage", check);

    return () => {
      window.removeEventListener("auth-change", check);
      window.removeEventListener("storage", check);
    };
  }, [router]);

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
        <div className="mt-8 space-y-8">
          {projects.map((project) => {
            const projectTasks = tasks.filter(
              (t) => t.project?._id === project._id
            );

            return (
              <section
                key={project._id}
                className="rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-xl font-semibold">{project.name}</h2>
                {project.description && (
                  <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                )}

                {projectTasks.length === 0 ? (
                  <p className="mt-4 text-sm text-gray-500">
                    No tasks in this project.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {projectTasks.map((task) => (
                      <li
                        key={task._id}
                        className="flex items-center justify-between rounded border border-gray-100 bg-gray-50 px-4 py-2"
                      >
                        <span>{task.title}</span>
                        <span className="text-xs uppercase text-gray-500">
                          {task.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}