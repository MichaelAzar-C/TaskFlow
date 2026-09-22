const styles = {
  todo: "bg-gray-100 text-gray-700",
  "in-progress": "bg-amber-100 text-amber-800",
  done: "bg-green-100 text-green-800",
};

const labels = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[status] || styles.todo
      }`}
    >
      {labels[status] || status}
    </span>
  );
}