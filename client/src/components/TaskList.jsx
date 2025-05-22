import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import TaskItem from "./TaskItem";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/tasks", {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setTasks(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch tasks. Please try again.");
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [authState.token]);

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      setError("Failed to delete task. Please try again.");
      console.error("Error deleting task:", err);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(
        `/api/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      setError("Failed to update task status. Please try again.");
      console.error("Error updating task status:", err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.status === "completed";
    if (filter === "pending") return task.status === "pending";
    if (filter === "in-progress") return task.status === "in-progress";
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sort === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sort === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
    return 0;
  });

  if (loading) return <div className="text-center py-4">Loading tasks...</div>;

  return (
    <div className="task-list-container p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="filter-controls flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded ${filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`px-3 py-1 rounded ${filter === "in-progress" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setFilter("in-progress")}
          >
            In Progress
          </button>
          <button
            className={`px-3 py-1 rounded ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        <div className="sort-controls flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1 border rounded text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message text-red-500 mb-4">{error}</div>}

      {sortedTasks.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No tasks found.</div>
      ) : (
        <div className="tasks-grid space-y-4">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onDelete={handleDeleteTask}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
