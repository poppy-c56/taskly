import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const ManageTeams = ({ teamId, onBack, onSave }) => {
  const isEdit = Boolean(teamId);

  const [team, setTeam] = useState({
    name: "",
    description: "",
    members: [],
  });

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [teamStats, setTeamStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
  });

  const mockUsers = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "developer" },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "designer",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "manager",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "developer",
    },
  ];

  useEffect(() => {
    if (isEdit) {
      loadTeamData();
    }
  }, [teamId, isEdit]);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      const mockTeam = {
        id: teamId,
        name: "Frontend Development Team",
        description:
          "Responsible for all frontend development tasks and UI/UX implementation.",
        members: [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "Team Lead",
            joinedAt: "2024-01-15",
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "Developer",
            joinedAt: "2024-01-20",
          },
          {
            id: "4",
            name: "Sarah Wilson",
            email: "sarah@example.com",
            role: "Developer",
            joinedAt: "2024-02-01",
          },
        ],
      };

      setTeam(mockTeam);
      setTeamStats({
        totalTasks: 12,
        completedTasks: 5,
        inProgressTasks: 4,
        todoTasks: 3,
      });
    } catch (error) {
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!team.name.trim()) {
      toast.error("Team name is required");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        toast.success("Team updated successfully!");
      } else {
        toast.success("Team created successfully!");
      }
      if (onSave) {
        onSave(team);
      }

      if (onBack) {
        onBack();
      }
    } catch (error) {
      toast.error(isEdit ? "Failed to update team" : "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    const user = mockUsers.find((u) => u.email === newMemberEmail);
    if (!user) {
      toast.error("User not found");
      return;
    }

    if (team.members.some((m) => m.email === newMemberEmail)) {
      toast.error("User is already a team member");
      return;
    }

    try {
      const newMember = {
        ...user,
        role: "Member",
        joinedAt: new Date().toISOString().split("T")[0],
      };

      setTeam((prev) => ({
        ...prev,
        members: [...prev.members, newMember],
      }));

      setNewMemberEmail("");
      toast.success("Member added successfully!");
    } catch (error) {
      toast.error("Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      setTeam((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.id !== memberId),
      }));
      toast.success("Member removed successfully!");
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Teams
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Manage Team" : "Create New Team"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit
                ? "Update team details and manage members"
                : "Set up a new team for collaboration"}
            </p>
          </div>
        </div>
      </div>

      {isEdit && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamStats.totalTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamStats.completedTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamStats.inProgressTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Todo</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamStats.todoTasks}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Team Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Team Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={team.name}
                onChange={handleInputChange}
                placeholder="Enter team name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={team.description}
                onChange={handleInputChange}
                placeholder="Describe the team's purpose and responsibilities"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <span className="mr-2">💾</span>
              )}
              {loading ? "Saving..." : isEdit ? "Update Team" : "Create Team"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Team Members
          </h2>

          <div className="mb-6">
            <div className="flex space-x-2">
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter member's email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              <button
                onClick={handleAddMember}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"
              >
                <span className="mr-1">➕</span>
                Add
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {team.members.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-3">👥</div>
                <p>No team members yet</p>
                <p className="text-sm">Add members by their email address</p>
              </div>
            ) : (
              team.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <span className="mr-1">📧</span>
                          {member.email}
                        </span>
                        {member.joinedAt && (
                          <span className="flex items-center">
                            <span className="mr-1">📅</span>
                            Joined{" "}
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {member.role || "Member"}
                    </span>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                      title="Remove member"
                    >
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTeams;