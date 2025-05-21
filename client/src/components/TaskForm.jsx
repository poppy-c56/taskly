import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const TaskForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
    assignedTo: [],
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get("/api/teams/members", {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setTeamMembers(response.data);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError(
          "Failed to load team members. You can still create a task without assigning it."
        );
      }
    };

    const fetchTaskData = async () => {
      if (!isEditing) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        const task = response.data;
        if (task.dueDate) {
          const date = new Date(task.dueDate);
          task.dueDate = date.toISOString().split("T")[0];
        }

        task.assignedTo = task.assignedTo.map((user) => user._id);

        setFormData(task);
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to load task data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
    fetchTaskData();
  }, [id, isEditing, authState.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAssigneeChange = (e) => {
    const selectedOptions = [...e.target.selectedOptions];
    const selectedValues = selectedOptions.map((option) => option.value);

    setFormData({
      ...formData,
      assignedTo: selectedValues,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const requestData = { ...formData };

      if (isEditing) {
        await axios.put(`/api/tasks/${id}`, requestData, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
      } else {
        await axios.post("/api/tasks", requestData, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting task:", err);
      setError("Failed to save task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading task data...</div>;
  }

  return (
    <div className="task-form-container max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Task" : "Create New Task"}
      </h2>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
            rows="4"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="dueDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="priority"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="status"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="assignedTo"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Assign To (hold Ctrl/Cmd to select multiple)
          </label>
          <select
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleAssigneeChange}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
            multiple
          >
            {teamMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {submitting
              ? "Saving..."
              : isEditing
                ? "Update Task"
                : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
