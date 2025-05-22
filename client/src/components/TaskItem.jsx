import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const TaskItem = ({ task, onDelete, onUpdateStatus }) => {
  const { _id, title, description, dueDate, priority, status, assignedTo } =
    task;
  const { authState } = useContext(AuthContext);

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
    if (!dateString) return "No due date";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusChange = (e) => {
    onUpdateStatus(_id, e.target.value);
  };

  const getAssigneeNames = () => {
    if (!assignedTo || assignedTo.length === 0) return "Unassigned";

    return assignedTo
      .map((assigneeId) => {
        const member = authState.teamMembers.find((m) => m._id === assigneeId);
        return member ? member.name : "Unknown";
      })
      .join(", ");
  };

  return (
    <div className="task-item border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
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

      <div className="task-details text-sm text-gray-500 mb-4 space-y-1">
        <div className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatDate(dueDate)}</span>
        </div>

        <div className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span>{getAssigneeNames()}</span>
        </div>
      </div>

      <div className="task-actions flex items-center justify-between mt-2">
        <select
          value={status}
          onChange={handleStatusChange}
          className="text-sm border rounded p-1 bg-white"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="actions flex gap-2">
          <Link
            to={`/tasks/edit/${_id}`}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(_id)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
