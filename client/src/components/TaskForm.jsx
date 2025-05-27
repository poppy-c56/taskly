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
    return (
      <>
        <style>{`
          .loading-container {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
          }
          
          .loading-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
            text-align: center;
            width: 100%;
            max-width: 400px;
          }
          
          .loading-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid rgba(102, 126, 234, 0.2);
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          
          .loading-text {
            color: #4a5568;
            font-size: 18px;
            font-weight: 500;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div className="loading-container">
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading task data...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .task-form-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          position: relative;
          z-index: 10;
        }

        .form-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          margin-bottom: 30px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideUp 0.6s ease-out;
          text-align: center;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-header h2 {
          font-size: 32px;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .form-header h2::before {
          content: '✏️';
          font-size: 36px;
        }

        .form-header p {
          color: #718096;
          font-size: 18px;
          margin: 0;
          line-height: 1.4;
        }

        .form-main {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideUp 0.6s ease-out 0.1s;
          animation-fill-mode: both;
          position: relative;
          overflow: hidden;
        }

        .form-main::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }

        .form-main:hover::before {
          left: 100%;
        }

        .error-alert {
          background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
          border: 2px solid rgba(245, 101, 101, 0.3);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 30px;
          color: #c53030;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 25px rgba(245, 101, 101, 0.2);
        }

        .error-alert::before {
          content: '⚠️';
          font-size: 20px;
          flex-shrink: 0;
        }

        .form-grid {
          display: grid;
          gap: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .form-row.two-columns {
          grid-template-columns: 1fr 1fr;
        }

        .form-group {
          position: relative;
        }

        .form-label {
          display: block;
          color: #2d3748;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-label.required::after {
          content: ' *';
          color: #e53e3e;
        }

        .form-input, .form-textarea, .form-select {
          width: 100%;
          padding: 16px 20px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          box-sizing: border-box;
          color: #2d3748;
          font-family: inherit;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: rgba(255, 255, 255, 1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .form-select[multiple] {
          min-height: 120px;
          padding: 12px;
        }

        .form-select[multiple] option {
          padding: 8px 12px;
          margin: 2px 0;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
        }

        .form-select[multiple] option:checked {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .select-hint {
          font-size: 12px;
          color: #718096;
          margin-top: 6px;
          font-style: italic;
        }

        .team-member-section {
          background: rgba(102, 126, 234, 0.05);
          border-radius: 16px;
          padding: 24px;
          border: 2px dashed rgba(102, 126, 234, 0.2);
        }

        .team-member-header {
          font-size: 16px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .team-member-header::before {
          content: '👥';
          font-size: 20px;
        }

        .add-member-form {
          display: flex;
          gap: 12px;
          align-items: end;
        }

        .add-member-input {
          flex: 1;
        }

        .add-member-btn {
          padding: 16px 24px;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          box-shadow: 0 8px 20px rgba(72, 187, 120, 0.3);
        }

        .add-member-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(72, 187, 120, 0.4);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 2px solid rgba(226, 232, 240, 0.5);
        }

        .btn {
          padding: 16px 32px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          min-width: 140px;
          justify-content: center;
        }

        .btn-cancel {
          background: rgba(226, 232, 240, 0.8);
          color: #4a5568;
          border: 2px solid rgba(226, 232, 240, 0.8);
        }

        .btn-cancel:hover {
          background: rgba(203, 213, 224, 0.9);
          transform: translateY(-1px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          background: linear-gradient(135deg, #a0aec0 0%, #9ca3af 100%);
          cursor: not-allowed;
          box-shadow: none;
        }

        @media (max-width: 768px) {
          .task-form-container {
            padding: 12px;
          }

          .form-header, .form-main {
            padding: 24px;
            border-radius: 20px;
          }

          .form-header h2 {
            font-size: 24px;
            flex-direction: column;
            gap: 8px;
          }

          .form-header p {
            font-size: 16px;
          }

          .form-row.two-columns {
            grid-template-columns: 1fr;
          }

          .add-member-form {
            flex-direction: column;
            align-items: stretch;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .form-header h2 {
            font-size: 20px;
          }

          .form-input, .form-textarea, .form-select {
            padding: 12px 16px;
            font-size: 14px;
          }

          .btn {
            padding: 14px 24px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="task-form-container">
        <div className="form-header">
          <h2>{isEditing ? "Edit Task" : "Create New Task"}</h2>
          <p>
            {isEditing
              ? "Update your task details and keep your project on track"
              : "Fill in the details below to create a new task and stay organized"}
          </p>
        </div>

        <div className="form-main">
          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="form-label required">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter task title..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Provide a detailed description of the task..."
              />
            </div>

            <div className="form-row two-columns">
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            <div className="form-row two-columns">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select
                  multiple
                  value={formData.assignedTo}
                  onChange={handleAssigneeChange}
                  className="form-select"
                >
                  {authState.teamMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
                <p className="select-hint">
                  Hold Ctrl/Cmd to select multiple members
                </p>
              </div>
            </div>

            <div className="team-member-section">
              <div className="team-member-header">Add New Team Member</div>
              <div className="add-member-form">
                <div className="add-member-input">
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Enter team member's email address..."
                    className="form-input"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTeamMember}
                  className="add-member-btn"
                >
                  Add Member
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="btn btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? (
                  <>
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    ></div>
                    Saving...
                  </>
                ) : (
                  <>{isEditing ? "💾 Update Task" : "✨ Create Task"}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TaskForm;
