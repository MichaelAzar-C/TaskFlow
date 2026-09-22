import Link from "next/link";

export default function ProjectCard({ project, tasks }) {
  const done = tasks.filter((t) => t.status === "done").length;

  return (
    <Link
      href={`/projects/${project._id}`}
      className="block rounded-lg border border-gray-200 p-6 transition hover:border-gray-400 hover:shadow-sm"
    >
      <h2 className="text-xl font-semibold">{project.name}</h2>
      {project.description && (
        <p className="mt-1 text-sm text-gray-600">{project.description}</p>
      )}
      <p className="mt-4 text-sm text-gray-500">
        {tasks.length === 0
          ? "No tasks yet"
          : `${done} of ${tasks.length} tasks done`}
      </p>
    </Link>
  );
}