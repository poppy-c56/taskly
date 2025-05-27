import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Users, Plus, X, ArrowLeft } from "lucide-react";

const CreateTeam = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    members: [],
  });
  const [memberEmail, setMemberEmail] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addMember = () => {
    if (!memberEmail.trim()) {
      alert("Please enter a valid email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(memberEmail)) {
      alert("Please enter a valid email format");
      return;
    }

    if (formData.members.includes(memberEmail)) {
      alert("This member is already added");
      return;
    }

    if (memberEmail === user?.email) {
      alert("You are automatically added as team creator");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, memberEmail],
    }));
    setMemberEmail("");
    alert("Member added to team");
  };

  const removeMember = (emailToRemove) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((email) => email !== emailToRemove),
    }));
    alert("Member removed from team");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Team name is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          members: formData.members,
          createdBy: user._id,
        }),
      });

      if (response.ok) {
        const newTeam = await response.json();
        alert("Team created successfully!");
        window.location.href = "/teams";
      } else {
        const error = await response.json();
        alert(error.message || "Failed to create team");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = "/teams";
  };

  return (
    <>
      <style>{`
        .create-team-container {
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

        .back-button {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 12px 20px;
          color: #4a5568;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
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
          content: '👥';
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

        .form-grid {
          display: grid;
          gap: 24px;
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

        .form-input, .form-textarea {
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

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: rgba(255, 255, 255, 1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
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
          margin-bottom: 20px;
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
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .add-member-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(72, 187, 120, 0.4);
        }

        .creator-card {
          background: rgba(72, 187, 120, 0.1);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
          border: 2px solid rgba(72, 187, 120, 0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .creator-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .creator-avatar {
          width: 40px;
          height: 40px;
          background: rgba(72, 187, 120, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .creator-details h4 {
          margin: 0 0 4px 0;
          color: #2d3748;
          font-weight: 600;
        }

        .creator-details p {
          margin: 0;
          color: #718096;
          font-size: 14px;
        }

        .creator-badge {
          background: rgba(72, 187, 120, 0.2);
          color: #38a169;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .member-card {
          background: rgba(102, 126, 234, 0.1);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 12px;
          border: 2px solid rgba(102, 126, 234, 0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .member-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .member-avatar {
          width: 40px;
          height: 40px;
          background: rgba(102, 126, 234, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .member-details h4 {
          margin: 0;
          color: #2d3748;
          font-weight: 600;
        }

        .remove-btn {
          background: rgba(245, 101, 101, 0.1);
          border: 2px solid rgba(245, 101, 101, 0.2);
          color: #e53e3e;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          background: rgba(245, 101, 101, 0.2);
          transform: scale(1.1);
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

        .info-section {
          background: rgba(102, 126, 234, 0.05);
          border-radius: 16px;
          padding: 20px;
          margin-top: 30px;
          border: 2px solid rgba(102, 126, 234, 0.2);
          animation: slideUp 0.6s ease-out 0.2s;
          animation-fill-mode: both;
        }

        .info-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .info-icon {
          background: rgba(102, 126, 234, 0.2);
          padding: 8px;
          border-radius: 8px;
          font-size: 16px;
        }

        .info-title {
          font-weight: 700;
          color: #2d3748;
          font-size: 16px;
        }

        .info-text {
          color: #4a5568;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        @media (max-width: 768px) {
          .create-team-container {
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

          .form-input, .form-textarea {
            padding: 12px 16px;
            font-size: 14px;
          }

          .btn {
            padding: 14px 24px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="create-team-container">
        <button onClick={handleCancel} className="back-button">
          <ArrowLeft size={16} />
          Back to Teams
        </button>

        <div className="form-header">
          <h2>Create New Team</h2>
          <p>Build your team and start collaborating on amazing projects</p>
        </div>

        <div className="form-main">
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="form-label required">Team Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your team name..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Describe your team's purpose and goals..."
              />
            </div>

            <div className="team-member-section">
              <div className="team-member-header">Team Members</div>

              <div className="add-member-form">
                <div className="add-member-input">
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="Enter member's email address..."
                    className="form-input"
                  />
                </div>
                <button
                  type="button"
                  onClick={addMember}
                  className="add-member-btn"
                >
                  <Plus size={16} />
                  Add Member
                </button>
              </div>

              <div className="creator-card">
                <div className="creator-info">
                  <div className="creator-avatar">
                    <Users size={16} />
                  </div>
                  <div className="creator-details">
                    <h4>{user?.name || "You"}</h4>
                    <p>{user?.email || "your@email.com"}</p>
                  </div>
                </div>
                <div className="creator-badge">Creator</div>
              </div>

              {formData.members.length > 0 && (
                <div>
                  {formData.members.map((email, index) => (
                    <div key={index} className="member-card">
                      <div className="member-info">
                        <div className="member-avatar">
                          <Users size={16} />
                        </div>
                        <div className="member-details">
                          <h4>{email}</h4>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMember(email)}
                        className="remove-btn"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name.trim()}
                className="btn btn-primary"
              >
                {loading ? (
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
                    Creating Team...
                  </>
                ) : (
                  <>🚀 Create Team</>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="info-section">
          <div className="info-header">
            <div className="info-icon">💡</div>
            <div className="info-title">Team Creation Tips</div>
          </div>
          <p className="info-text">
            You'll be automatically added as the team creator and admin. You can
            add members now or invite them later from the team management page.
          </p>
        </div>
      </div>
    </>
  );
};

export default CreateTeam;
