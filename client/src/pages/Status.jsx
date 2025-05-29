import React from "react";
import { useGetDasboardStatsQuery } from "../redux/slices/api/taskApiSlice";
import { getInitials, countTasksByStage } from "../utils";
import { Loading, Title } from "../components";

const StatusPage = () => {
  const { data, isLoading, error } = useGetDasboardStatsQuery();

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  if (error) {
    console.error("API Error:", error);
    return (
      <div className="py-10 text-center">
        <p className="text-red-500">Error loading user task status</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  console.log("StatusPage data:", data);

  const calculateTaskStats = (tasks) => {
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return {
        todo: 0,
        inProgress: 0,
        completed: 0,
        total: 0,
        todoPercentage: 0,
        inProgressPercentage: 0,
        completedPercentage: 0,
      };
    }

    const counts = countTasksByStage(tasks);
    const total = tasks.length;

    return {
      ...counts,
      total,
      todoPercentage:
        total > 0 ? Math.round((counts.todo / total) * 100 * 10) / 10 : 0,
      inProgressPercentage:
        total > 0 ? Math.round((counts.inProgress / total) * 100 * 10) / 10 : 0,
      completedPercentage:
        total > 0 ? Math.round((counts.completed / total) * 100 * 10) / 10 : 0,
    };
  };

  const calculateOverallStats = () => {
    if (!data) {
      return {
        totalUsers: 0,
        totalTasks: 0,
        activeUsers: 0,
        overallTodo: 0,
        overallInProgress: 0,
        overallCompleted: 0,
      };
    }

    const users = data.users || [];
    const tasks = data.tasks || {};

    return {
      totalUsers: users.length,
      totalTasks: data.totalTasks || 0,
      activeUsers: users.filter((user) => user.isActive).length,
      overallTodo: tasks.todo || 0,
      overallInProgress: tasks["in progress"] || 0,
      overallCompleted: tasks.completed || 0,
    };
  };

  const overallStats = calculateOverallStats();

  const TableHeader = () => (
    <thead className="border-b border-gray-300 dark:border-gray-600">
      <tr className="text-black dark:text-white text-left">
        <th className="py-3 px-2"> Name</th>
        <th className="py-3 px-2">Title</th>
        <th className="py-3 px-2">Status</th>
        <th className="py-3 px-2">Role</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => {
    return (
      <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-400/10">
        <td className="py-3 px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-600">
              <span className="text-xs font-medium text-center">
                {getInitials(user?.name || "Unknown")}
              </span>
            </div>
            <div>
              <p className="font-medium text-black dark:text-white">
                {user?.name || "Unknown User"}
              </p>
              <span className="text-xs text-gray-500">
                {user?.email || "Team Member"}
              </span>
            </div>
          </div>
        </td>

        <td className="py-3 px-2">
          <span className="text-sm">{user?.title || user?.role || "--"}</span>
        </td>

        <td className="py-3 px-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              user?.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user?.isActive ? "Active" : "Inactive"}
          </span>
        </td>

        <td className="py-3 px-2">
          <span className="text-sm capitalize">{user?.role || "--"}</span>
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full md:px-1 px-0 mb-6">
      <div className="flex items-center justify-between mb-8">
        <Title title="User Task Status" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1f1f1f] p-4 rounded shadow-md">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Total Users
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {overallStats.totalUsers}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1f1f1f] p-4 rounded shadow-md">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Total Tasks
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {overallStats.totalTasks}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1f1f1f] p-4 rounded shadow-md">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Active Users
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            {overallStats.activeUsers}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1f1f1f] p-4 rounded shadow-md">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Completed Tasks
          </h3>
          <p className="text-2xl font-bold text-emerald-600">
            {overallStats.overallCompleted}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1f1f1f] p-4 rounded shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Overall Progress</h3>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Todo: {overallStats.overallTodo}</span>
              <span>In Progress: {overallStats.overallInProgress}</span>
              <span>Completed: {overallStats.overallCompleted}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full flex">
                <div
                  className="bg-amber-500"
                  style={{
                    width:
                      overallStats.totalTasks > 0
                        ? `${
                            (overallStats.overallTodo /
                              overallStats.totalTasks) *
                            100
                          }%`
                        : "0%",
                  }}
                ></div>
                <div
                  className="bg-blue-500"
                  style={{
                    width:
                      overallStats.totalTasks > 0
                        ? `${
                            (overallStats.overallInProgress /
                              overallStats.totalTasks) *
                            100
                          }%`
                        : "0%",
                  }}
                ></div>
                <div
                  className="bg-green-500"
                  style={{
                    width:
                      overallStats.totalTasks > 0
                        ? `${
                            (overallStats.overallCompleted /
                              overallStats.totalTasks) *
                            100
                          }%`
                        : "0%",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="bg-white dark:bg-[#1f1f1f] px-2 md:px-4 py-4 shadow-md rounded">
        <div className="overflow-x-auto">
          {data?.users && data.users.length > 0 ? (
            <table className="w-full">
              <TableHeader />
              <tbody>
                {data.users.map((user, index) => (
                  <TableRow key={user?._id || index} user={user} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No user data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusPage;