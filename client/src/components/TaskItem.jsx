import React from "react";
import { Link } from "react-router-dom";

const TaskItem = ({ task, onDelete, onUpdateStatus }) => {
  const { _id, title, description, dueDate, priority, status, assignedTo } =
    task;

  const priorityClass = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const statusClass = {
    pending: "bg-blue-100 text-blue-800",
    "in-progress": "bg-purple-100 text-purple-800",
    completed: "bg-gray-100 text-gray-800",
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusChange = (e) => {
    onUpdateStatus(_id, e.target.value);
  };

  return (
    <div className="task-item border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="flex gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${priorityClass[priority] || "bg-gray-100"}`}
          >
            {priority}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${statusClass[status] || "bg-gray-100"}`}
          >
            {status}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

      <div className="task-details text-sm text-gray-500 mb-4">
        {dueDate && (
          <div className="flex items-center gap-1">
            <span>Due:</span>
            <span>{formatDate(dueDate)}</span>
          </div>
        )}

        {assignedTo && assignedTo.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span>Assigned to:</span>
            <span>{assignedTo.map((user) => user.name).join(", ")}</span>
          </div>
        )}
      </div>

      <div className="task-actions flex items-center justify-between mt-2">
        <select
          value={status}
          onChange={handleStatusChange}
          className="text-sm border rounded p-1"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="actions flex gap-2">
          <Link
            to={`/tasks/edit/${_id}`}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(_id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
