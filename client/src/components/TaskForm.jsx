import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState, addTeamMember } = useContext(AuthContext);
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
    assignedTo: [],
  });

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
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
        setFormData({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().split("T")[0]
            : "",
          priority: task.priority,
          status: task.status,
          assignedTo: task.assignedTo.map((user) => user._id),
        });
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to load task data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

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
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setFormData({
      ...formData,
      assignedTo: selectedValues,
    });
  };

  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    try {
      await addTeamMember(newMemberEmail);
      setNewMemberEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        dueDate: formData.dueDate || undefined,
      };

      if (isEditing) {
        await axios.put(`/api/tasks/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
      } else {
        await axios.post("/api/tasks", payload, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting task:", err);
      setError(
        err.response?.data?.message || "Failed to save task. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading task data...</div>;
  }

  return (
    <div className="task-form-container max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Task" : "Create New Task"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Assign To
            </label>
            <select
              multiple
              value={formData.assignedTo}
              onChange={handleAssigneeChange}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {authState.teamMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl/Cmd to select multiple members
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Add Team Member
                </label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleAddTeamMember}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
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
