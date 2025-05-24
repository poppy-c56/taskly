import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const TeamList = () => {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("/api/teams");
        setTeams(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <>
        <style>{`
          .loading-container {
            min-height: 80vh;
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
            <p className="loading-text">Loading your teams...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .teams-container {
          position: relative;
          z-index: 10;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 20px;
        }

        .teams-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .teams-header {
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

        .teams-title {
          font-size: 32px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 8px;
          line-height: 1.2;
          word-wrap: break-word;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .teams-subtitle {
          color: #718096;
          font-size: 18px;
          margin: 0;
          line-height: 1.4;
        }

        .teams-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .teams-count {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 16px 24px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #4a5568;
          font-weight: 600;
          font-size: 16px;
          animation: slideUp 0.6s ease-out 0.1s;
          animation-fill-mode: both;
        }

        .create-team-btn {
          padding: 16px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
          animation: slideUp 0.6s ease-out 0.2s;
          animation-fill-mode: both;
        }

        .create-team-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        .teams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .team-card {
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
          cursor: pointer;
        }

        .team-card:nth-child(1) { animation-delay: 0.1s; }
        .team-card:nth-child(2) { animation-delay: 0.2s; }
        .team-card:nth-child(3) { animation-delay: 0.3s; }
        .team-card:nth-child(4) { animation-delay: 0.4s; }
        .team-card:nth-child(5) { animation-delay: 0.5s; }
        .team-card:nth-child(6) { animation-delay: 0.6s; }

        .team-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }

        .team-card:hover::before {
          left: 100%;
        }

        .team-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
        }

        .team-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 16px;
        }

        .team-info {
          flex: 1;
          min-width: 0;
        }

        .team-name {
          font-size: 22px;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 8px 0;
          word-wrap: break-word;
          line-height: 1.3;
        }

        .team-description {
          color: #718096;
          font-size: 15px;
          margin: 0 0 20px 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .team-avatar {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
          flex-shrink: 0;
        }

        .team-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .team-stat {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #718096;
          font-size: 14px;
          font-weight: 500;
        }

        .stat-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          font-size: 12px;
        }

        .team-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .team-btn {
          padding: 10px 20px;
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
          gap: 6px;
          flex: 1;
          min-width: 100px;
        }

        .team-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .team-btn.secondary {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .team-btn:hover {
          transform: translateY(-2px);
        }

        .team-btn.primary:hover {
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .team-btn.secondary:hover {
          background: rgba(102, 126, 234, 0.15);
        }

        .empty-state {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 80px 40px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
          animation: slideUp 0.6s ease-out 0.3s;
          animation-fill-mode: both;
        }

        .empty-icon {
          font-size: 80px;
          margin-bottom: 24px;
          opacity: 0.6;
        }

        .empty-title {
          font-size: 28px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 16px;
        }

        .empty-description {
          color: #718096;
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .empty-action {
          padding: 16px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 16px;
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
          .teams-container {
            padding: 12px;
          }
          
          .teams-header {
            padding: 24px;
            border-radius: 20px;
            margin-bottom: 20px;
          }
          
          .teams-title {
            font-size: 24px;
            flex-direction: column;
            gap: 8px;
          }
          
          .teams-subtitle {
            font-size: 16px;
          }
          
          .teams-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          
          .teams-count {
            text-align: center;
            padding: 12px 20px;
          }
          
          .create-team-btn {
            justify-content: center;
            padding: 14px 24px;
          }
          
          .teams-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .team-card {
            padding: 24px;
            border-radius: 16px;
          }
          
          .team-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .team-avatar {
            width: 50px;
            height: 50px;
            font-size: 20px;
            align-self: center;
          }
          
          .team-name {
            font-size: 20px;
          }
          
          .team-stats {
            gap: 16px;
            justify-content: space-between;
          }
          
          .team-actions {
            gap: 8px;
          }
          
          .team-btn {
            padding: 12px 16px;
            font-size: 13px;
          }
          
          .empty-state {
            padding: 40px 24px;
            border-radius: 20px;
          }
          
          .empty-icon {
            font-size: 60px;
          }
          
          .empty-title {
            font-size: 22px;
          }
          
          .empty-description {
            font-size: 16px;
            margin-bottom: 24px;
          }
        }

        @media (max-width: 480px) {
          .teams-container {
            padding: 8px;
          }
          
          .teams-header,
          .team-card,
          .empty-state {
            padding: 20px;
            border-radius: 16px;
          }
          
          .teams-title {
            font-size: 20px;
          }
          
          .create-team-btn,
          .empty-action {
            padding: 12px 20px;
            font-size: 14px;
          }
          
          .team-actions {
            flex-direction: column;
          }
          
          .team-btn {
            min-width: auto;
          }
        }
      `}</style>

      <div className="teams-container">
        <div className="teams-content">
          <div className="teams-header">
            <h1 className="teams-title">👥 Your Teams</h1>
            <p className="teams-subtitle">
              Collaborate and manage projects with your team members
            </p>
          </div>

          <div className="teams-actions">
            <div className="teams-count">
              {teams.length} {teams.length === 1 ? "Team" : "Teams"}
            </div>
            <Link to="/teams/new" className="create-team-btn">
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
              Create New Team
            </Link>
          </div>

          {teams.length > 0 ? (
            <div className="teams-grid">
              {teams.map((team, index) => (
                <div key={team.id || index} className="team-card">
                  <div className="team-header">
                    <div className="team-info">
                      <h3 className="team-name">
                        {team.name || `Team ${index + 1}`}
                      </h3>
                      <p className="team-description">
                        {team.description ||
                          "No description provided for this team."}
                      </p>
                    </div>
                    <div className="team-avatar">
                      {(team.name || `T${index + 1}`).charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="team-stats">
                    <div className="team-stat">
                      <div className="stat-icon">👥</div>
                      <span>{team.memberCount || 0} Members</span>
                    </div>
                    <div className="team-stat">
                      <div className="stat-icon">📋</div>
                      <span>{team.taskCount || 0} Tasks</span>
                    </div>
                    <div className="team-stat">
                      <div className="stat-icon">📊</div>
                      <span>{team.projectCount || 0} Projects</span>
                    </div>
                  </div>

                  <div className="team-actions">
                    <Link
                      to={`/teams/${team.id || index}/view`}
                      className="team-btn primary"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View
                    </Link>
                    <Link
                      to={`/teams/${team.id || index}/edit`}
                      className="team-btn secondary"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3 className="empty-title">No teams yet</h3>
              <p className="empty-description">
                Teams help you collaborate with others and manage projects
                together. Create your first team to get started with
                collaborative task management.
              </p>
              <Link to="/teams/new" className="empty-action">
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
                Create Your First Team
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TeamList;
