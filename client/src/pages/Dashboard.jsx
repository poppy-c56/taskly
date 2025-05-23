import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksRes = await axios.get("/api/tasks");
        setTasks(tasksRes.data);

        const teamsRes = await axios.get("/api/teams");
        setTeams(teamsRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <style>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

          @media (max-width: 480px) {
            .loading-card {
              padding: 24px;
              border-radius: 20px;
            }
            
            .loading-text {
              font-size: 16px;
            }
            
            .loading-spinner {
              width: 40px;
              height: 40px;
            }
          }
        `}</style>
        <div className="loading-container">
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        

        .dashboard-container::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
          pointer-events: none;
        }

        .dashboard-container::after {
          content: '';
          position: absolute;
          bottom: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          animation: float 8s ease-in-out infinite reverse;
          pointer-events: none;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .dashboard-header {
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

        .welcome-title {
          font-size: 32px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 8px;
          line-height: 1.2;
          word-wrap: break-word;
        }

        .brand-name {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dashboard-subtitle {
          color: #718096;
          font-size: 18px;
          margin: 0;
          line-height: 1.4;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 200px;
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }

        .stat-card:hover::before {
          left: 100%;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
        }

        .stat-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          flex-shrink: 0;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          color: white;
          font-size: 24px;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
          flex-shrink: 0;
        }

        .stat-title {
          font-size: 20px;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
          word-wrap: break-word;
        }

        .stat-description {
          color: #718096;
          font-size: 16px;
          margin-bottom: 24px;
          line-height: 1.5;
          flex-grow: 1;
        }

        .stat-button {
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          align-self: flex-start;
          white-space: nowrap;
        }

        .stat-button.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .stat-button.secondary {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(72, 187, 120, 0.3);
        }

        .stat-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        .stat-button.secondary:hover {
          box-shadow: 0 12px 30px rgba(72, 187, 120, 0.4);
        }

        .activity-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideUp 0.6s ease-out 0.4s;
          animation-fill-mode: both;
        }

        .activity-title {
          font-size: 24px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .activity-title::before {
          content: '📋';
          font-size: 28px;
          flex-shrink: 0;
        }

        .activity-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .activity-item {
          padding: 20px 0;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-item:hover {
          transform: translateX(8px);
          background: rgba(102, 126, 234, 0.05);
          border-radius: 12px;
          padding-left: 20px;
          padding-right: 20px;
          margin-left: -20px;
          margin-right: -20px;
        }

        .activity-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 8px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .activity-task-title {
          font-size: 16px;
          font-weight: 600;
          color: #667eea;
          margin: 0;
          word-wrap: break-word;
          flex: 1;
          min-width: 0;
        }

        .activity-status {
          padding: 4px 12px;
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

        .status-progress {
          background: linear-gradient(135deg, #90cdf4 0%, #63b3ed 100%);
          color: #2a4365;
        }

        .status-done {
          background: linear-gradient(135deg, #9ae6b4 0%, #68d391 100%);
          color: #22543d;
        }

        .activity-meta {
          color: #718096;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .activity-meta::before {
          content: '📅';
          font-size: 16px;
          flex-shrink: 0;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #718096;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #4a5568;
        }

        .empty-description {
          font-size: 16px;
          line-height: 1.5;
        }

        .button-icon {
          width: 16px;
          height: 16px;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .stat-button:hover .button-icon {
          transform: translateX(2px);
        }

        /* Tablet styles */
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }
          
          .dashboard-container {
            padding: 16px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 12px;
          }
          
          .dashboard-header,
          .activity-section {
            padding: 24px;
            border-radius: 20px;
            margin-bottom: 20px;
          }
          
          .stat-card {
            padding: 24px;
            min-height: auto;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-bottom: 20px;
          }
          
          .welcome-title {
            font-size: 24px;
            line-height: 1.3;
          }
          
          .dashboard-subtitle {
            font-size: 16px;
          }
          
          .stat-header {
            margin-bottom: 16px;
          }
          
          .stat-icon {
            width: 40px;
            height: 40px;
            font-size: 20px;
            margin-right: 12px;
          }
          
          .stat-title {
            font-size: 18px;
          }
          
          .stat-description {
            font-size: 15px;
            margin-bottom: 20px;
          }
          
          .activity-title {
            font-size: 20px;
            margin-bottom: 20px;
          }
          
          .activity-title::before {
            font-size: 24px;
          }
          
          .activity-item {
            padding: 16px 0;
          }
          
          .activity-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .activity-task-title {
            font-size: 15px;
          }
          
          .activity-status {
            align-self: flex-start;
          }
          
          .activity-meta {
            font-size: 13px;
            gap: 6px;
          }
          
          .empty-state {
            padding: 40px 16px;
          }
          
          .empty-icon {
            font-size: 48px;
          }
          
          .empty-title {
            font-size: 18px;
          }
          
          .empty-description {
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .dashboard-container {
            padding: 8px;
          }
          
          .dashboard-header,
          .activity-section {
            padding: 20px;
            border-radius: 16px;
          }
          
          .stat-card {
            padding: 20px;
            border-radius: 16px;
          }
          
          .stats-grid {
            gap: 12px;
          }
          
          .welcome-title {
            font-size: 20px;
          }
          
          .dashboard-subtitle {
            font-size: 14px;
          }
          
          .stat-button {
            padding: 10px 20px;
            font-size: 13px;
            width: 100%;
            justify-content: center;
          }
          
          .activity-item:hover {
            transform: none;
            margin-left: 0;
            margin-right: 0;
            padding-left: 0;
            padding-right: 0;
          }
          
          .activity-meta::before {
            font-size: 14px;
          }
        }

        @media (max-width: 320px) {
          .dashboard-container {
            padding: 6px;
          }
          
          .dashboard-header,
          .activity-section,
          .stat-card {
            padding: 16px;
          }
          
          .welcome-title {
            font-size: 18px;
          }
          
          .stat-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .stat-icon {
            margin-right: 0;
            margin-bottom: 8px;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="welcome-title">
              Welcome back,{" "}
              <span className="brand-name">{user?.name || "User"}!</span>
            </h1>
            <p className="dashboard-subtitle">
              Here's what's happening with your tasks today
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon">📋</div>
                <h3 className="stat-title">Tasks</h3>
              </div>
              <p className="stat-description">
                You have {tasks.length} tasks assigned to you. Stay organized
                and get things done!
              </p>
              <a href="/tasks" className="stat-button primary">
                View all tasks
                <svg
                  className="button-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon">👥</div>
                <h3 className="stat-title">Teams</h3>
              </div>
              <p className="stat-description">
                You are a member of {teams.length} teams. Collaborate and
                achieve more together!
              </p>
              <a href="/teams" className="stat-button primary">
                View all teams
                <svg
                  className="button-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon">✨</div>
                <h3 className="stat-title">Quick Add</h3>
              </div>
              <p className="stat-description">
                Need to create a new task? Click below to get started right
                away.
              </p>
              <button className="stat-button secondary">
                New Task
                <svg
                  className="button-icon"
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
              </button>
            </div>
          </div>

          <div className="activity-section">
            <h3 className="activity-title">Recent Activity</h3>
            <ul className="activity-list">
              {tasks.length > 0 ? (
                tasks.slice(0, 5).map((task, index) => (
                  <li key={index} className="activity-item">
                    <div className="activity-header">
                      <h4 className="activity-task-title">
                        {task.title || "Task Title"}
                      </h4>
                      <span
                        className={`activity-status ${
                          task.status === "Done"
                            ? "status-done"
                            : task.status === "In Progress"
                              ? "status-progress"
                              : "status-todo"
                        }`}
                      >
                        {task.status || "To Do"}
                      </span>
                    </div>
                    <div className="activity-meta">
                      Due {task.dueDate || "Not set"}
                    </div>
                  </li>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h4 className="empty-title">No tasks yet</h4>
                  <p className="empty-description">
                    When you create or get assigned tasks, they'll appear here.
                    Start by creating your first task!
                  </p>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
