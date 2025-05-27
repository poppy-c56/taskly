import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit3,
  Plus,
  ArrowLeft,
  Mail,
} from "lucide-react";

const TeamDetails = () => {
  const { user } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true);
        const mockTeam = {
          _id: "1",
          name: "Frontend Development Team",
          description:
            "Responsible for building and maintaining the user interface and user experience of our web applications.",
          createdBy: {
            _id: "user1",
            name: "John Doe",
            email: "john@example.com",
          },
          members: [
            {
              _id: "user1",
              name: "John Doe",
              email: "john@example.com",
              role: "Team Lead",
            },
            {
              _id: "user2",
              name: "Jane Smith",
              email: "jane@example.com",
              role: "Developer",
            },
            {
              _id: "user3",
              name: "Mike Johnson",
              email: "mike@example.com",
              role: "Designer",
            },
            {
              _id: "user4",
              name: "Sarah Wilson",
              email: "sarah@example.com",
              role: "Developer",
            },
          ],
          createdAt: "2024-01-15T10:30:00Z",
        };

        const mockTasks = [
          {
            _id: "task1",
            title: "Redesign Login Page",
            description: "Update the login page with new design system",
            status: "In Progress",
            priority: "High",
            assignedTo: { name: "Jane Smith", email: "jane@example.com" },
            deadline: "2024-02-15T23:59:59Z",
          },
          {
            _id: "task2",
            title: "Implement Dark Mode",
            description: "Add dark mode toggle functionality",
            status: "Todo",
            priority: "Medium",
            assignedTo: { name: "Mike Johnson", email: "mike@example.com" },
            deadline: "2024-02-20T23:59:59Z",
          },
          {
            _id: "task3",
            title: "Fix Navigation Bug",
            description: "Resolve mobile navigation menu issue",
            status: "Done",
            priority: "High",
            assignedTo: { name: "Sarah Wilson", email: "sarah@example.com" },
            deadline: "2024-02-10T23:59:59Z",
          },
        ];

        setTeam(mockTeam);
        setTasks(mockTasks);
      } catch (err) {
        setError("Failed to load team details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Todo":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Done":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleBack = () => {
    window.location.href = "/teams";
  };

  const handleEdit = () => {
    window.location.href = `/teams/${team._id}/edit`;
  };

  const handleAddTask = () => {
    window.location.href = `/tasks/new?team=${team._id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="h-12 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
                <div className="h-64 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!team) return null;

  const isTeamCreator = user?._id === team.createdBy._id;
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "Done").length,
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    todo: tasks.filter((task) => task.status === "Todo").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Teams
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {team.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  Created by {team.createdBy.name} on{" "}
                  {formatDate(team.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {isTeamCreator && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Manage Team
                </button>
              )}
              <button
                onClick={handleAddTask}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>
        </div>

        {team.description && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">{team.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {team.members.length}
                </p>
                <p className="text-sm text-gray-600">Members</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {taskStats.completed}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {taskStats.inProgress}
                </p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {taskStats.todo}
                </p>
                <p className="text-sm text-gray-600">To Do</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Team Members
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {team.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.role && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {member.role}
                        </span>
                      )}
                      {member._id === team.createdBy._id && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Creator
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Tasks
              </h2>
              <button
                onClick={handleAddTask}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All Tasks
              </button>
            </div>
            <div className="p-6">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    No tasks assigned to this team yet
                  </p>
                  <button
                    onClick={handleAddTask}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create First Task
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.slice(0, 5).map((task) => (
                    <div
                      key={task._id}
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">
                          {task.title}
                        </h3>
                        <div className="flex gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}
                          >
                            {task.status}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="w-3 h-3 text-gray-600" />
                          </div>
                          <span className="text-gray-700">
                            {task.assignedTo.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>Due {formatDate(task.deadline)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Team Progress
            </h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>
                  {Math.round((taskStats.completed / taskStats.total) * 100)}%
                  Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(taskStats.completed / taskStats.total) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {taskStats.todo}
                </p>
                <p className="text-sm text-gray-600">To Do</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {taskStats.inProgress}
                </p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {taskStats.completed}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetails;
