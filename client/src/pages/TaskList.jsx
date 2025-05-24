import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const TaskList = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/tasks");
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`/api/tasks/${taskId}`);
        setTasks(tasks.filter((task) => task.id !== taskId));
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" || task.status?.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusCount = (status) => {
    return tasks.filter(
      (task) => task.status?.toLowerCase() === status.toLowerCase()
    ).length;
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
            <p className="loading-text">Loading your tasks...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .tasks-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .tasks-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          margin-bottom: 30px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideUp 0.6s ease-out;
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

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .header-content h1 {
          font-size: 32px;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .header-content h1::before {
          content: '📋';
          font-size: 36px;
          flex-shrink: 0;
        }

        .header-content p {
          color: #718096;
          font-size: 18px;
          margin: 0;
          line-height: 1.4;
        }

        .new-task-btn {
          padding: 14px 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
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
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .new-task-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        .controls-section {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-box {
          flex: 1;
          min-width: 280px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 12px 20px 12px 48px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #718096;
          font-size: 20px;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 20px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.9);
          color: #718096;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          position: relative;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .filter-btn:not(.active):hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          border-color: #667eea;
        }

        .stats-overview {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideUp 0.6s ease-out 0.1s;
          animation-fill-mode: both;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .stat-item {
          text-align: center;
          padding: 20px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .stat-number {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-item:nth-child(1) .stat-number { color: #667eea; }
        .stat-item:nth-child(2) .stat-number { color: #f6ad55; }
        .stat-item:nth-child(3) .stat-number { color: #63b3ed; }
        .stat-item:nth-child(4) .stat-number { color: #68d391; }

        .stat-item:nth-child(1) .stat-label { color: #667eea; }
        .stat-item:nth-child(2) .stat-label { color: #f6ad55; }
        .stat-item:nth-child(3) .stat-label { color: #63b3ed; }
        .stat-item:nth-child(4) .stat-label { color: #68d391; }

        .tasks-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        }

        .task-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
          position: relative;
          overflow: hidden;
        }

        .task-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
        }

        .task-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }

        .task-card:hover::before {
          left: 100%;
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 12px;
        }

        .task-title {
          font-size: 18px;
          font-weight: 700;
          color: #2d3748;
          margin: 0;
          line-height: 1.3;
          word-wrap: break-word;
          flex: 1;
        }

        .task-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .status-todo {
          background: linear-gradient(135deg, #fed56b 0%, #f6ad55 100%);
          color: #744210;
        }

        .status-in-progress {
          background: linear-gradient(135deg, #90cdf4 0%, #63b3ed 100%);
          color: #2a4365;
        }

        .status-done {
          background: linear-gradient(135deg, #9ae6b4 0%, #68d391 100%);
          color: #22543d;
        }

        .task-description {
          color: #718096;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .task-due-date {
          color: #718096;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .task-due-date::before {
          content: '📅';
          font-size: 14px;
        }

        .task-priority {
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .priority-high {
          background: #fed7d7;
          color: #c53030;
        }

        .priority-medium {
          background: #feebc8;
          color: #dd6b20;
        }

        .priority-low {
          background: #c6f6d5;
          color: #38a169;
        }

        .task-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .edit-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .edit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .delete-btn {
          background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
        }

        .delete-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(245, 101, 101, 0.4);
        }

        .status-select {
          padding: 6px 12px;
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .status-select:focus {
          outline: none;
          border-color: #667eea;
        }

        .empty-state {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 80px 40px;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideUp 0.6s ease-out 0.2s;
          animation-fill-mode: both;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 12px;
        }

        .empty-description {
          color: #718096;
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 32px;
        }

        .empty-action {
          padding: 16px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
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
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .empty-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .tasks-container {
            padding: 0 12px;
          }

          .tasks-header {
            padding: 24px;
            border-radius: 20px;
          }

          .header-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .header-content h1 {
            font-size: 24px;
          }

          .header-content p {
            font-size: 16px;
          }

          .controls-section {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .search-box {
            min-width: auto;
          }

          .filter-buttons {
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .tasks-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .task-card {
            padding: 20px;
          }

          .task-actions {
            justify-content: space-between;
          }

          .action-btn {
            flex: 1;
            justify-content: center;
          }

          .empty-state {
            padding: 60px 24px;
          }

          .empty-icon {
            font-size: 48px;
          }

          .empty-title {
            font-size: 20px;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .task-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .task-status {
            align-self: flex-start;
          }

          .task-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>

      <div className="tasks-container">
        <div className="tasks-header">
          <div className="header-top">
            <div className="header-content">
              <h1>My Tasks</h1>
              <p>Manage and track all your tasks in one place</p>
            </div>
            <Link to="/tasks/new" className="new-task-btn">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              New Task
            </Link>
          </div>

          <div className="controls-section">
            <div className="search-box">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`filter-btn ${filter === "todo" ? "active" : ""}`}
                onClick={() => setFilter("todo")}
              >
                To Do
              </button>
              <button
                className={`filter-btn ${filter === "in progress" ? "active" : ""}`}
                onClick={() => setFilter("in progress")}
              >
                In Progress
              </button>
              <button
                className={`filter-btn ${filter === "done" ? "active" : ""}`}
                onClick={() => setFilter("done")}
              >
                Done
              </button>
            </div>
          </div>
        </div>

        <div className="stats-overview">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{getStatusCount("to do")}</div>
              <div className="stat-label">To Do</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{getStatusCount("in progress")}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{getStatusCount("done")}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        {filteredTasks.length > 0 ? (
          <div className="tasks-grid">
            {filteredTasks.map((task, index) => (
              <div
                key={task.id || index}
                className="task-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="task-header">
                  <h3 className="task-title">{task.title || "Task Title"}</h3>
                  <span
                    className={`task-status ${
                      task.status === "Done"
                        ? "status-done"
                        : task.status === "In Progress"
                          ? "status-in-progress"
                          : "status-todo"
                    }`}
                  >
                    {task.status || "To Do"}
                  </span>
                </div>

                <p className="task-description">
                  {task.description || "No description provided for this task."}
                </p>

                <div className="task-meta">
                  <div className="task-due-date">
                    Due {task.dueDate || "Not set"}
                  </div>
                  <span
                    className={`task-priority priority-${task.priority?.toLowerCase() || "medium"}`}
                  >
                    {task.priority || "Medium"}
                  </span>
                </div>

                <div className="task-actions">
                  <select
                    className="status-select"
                    value={task.status || "To Do"}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value)
                    }
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                  <Link
                    to={`/tasks/edit/${task.id}`}
                    className="action-btn edit-btn"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="action-btn delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3 className="empty-title">
              {searchTerm || filter !== "all"
                ? "No tasks found"
                : "No tasks yet"}
            </h3>
            <p className="empty-description">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filter criteria to find what you're looking for."
                : "Get started by creating your first task. Stay organized and productive!"}
            </p>
            {!searchTerm && filter === "all" && (
              <Link to="/tasks/new" className="empty-action">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create Your First Task
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TaskList;
