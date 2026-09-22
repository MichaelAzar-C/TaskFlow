import StatusBadge from "./StatusBadge";

export default function TaskItem({ task }) {
  return (
    <li className="flex items-center justify-between gap-4 rounded border border-gray-100 bg-gray-50 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate">{task.title}</p>
        {task.description && (
          <p className="truncate text-sm text-gray-500">{task.description}</p>
        )}
      </div>
      <StatusBadge status={task.status} />
    </li>
  );
}