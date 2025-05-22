const Task = require("../models/Task.model");
const Team = require("../models/Team.model");

exports.createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      deadline,
      assignedTo,
      teamId,
    } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.members.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to create tasks for this team" });
    }

    if (assignedTo && !team.members.includes(assignedTo)) {
      return res
        .status(400)
        .json({ message: "Assigned user must be a team member" });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      deadline: deadline || null,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      team: teamId,
    });

    await Team.findByIdAndUpdate(teamId, { $push: { tasks: task._id } });

    const populatedTask = await Task.findById(task._id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("team", "name");

    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

exports.getTeamTasks = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.members.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to view tasks for this team" });
    }

    const tasks = await Task.find({ team: teamId })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.getUserTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user._id,
    })
      .populate("createdBy", "name email")
      .populate("team", "name")
      .sort({ deadline: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("team", "name");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const team = await Team.findById(task.team);
    if (!team.members.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this task" });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, deadline, assignedTo } =
      req.body;

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const team = await Team.findById(task.team);
    if (!team.members.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    if (assignedTo && !team.members.includes(assignedTo)) {
      return res
        .status(400)
        .json({ message: "Assigned user must be a team member" });
    }

    task.title = title || task.title;
    task.description =
      description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.deadline = deadline !== undefined ? deadline : task.deadline;
    task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;

    const updatedTask = await task.save();

    const populatedTask = await Task.findById(updatedTask._id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("team", "name");

    res.json(populatedTask);
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const team = await Team.findById(task.team);
    const isCreator = task.createdBy.equals(req.user._id);
    const isTeamCreator = team.createdBy.equals(req.user._id);

    if (!isCreator && !isTeamCreator) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await Team.findByIdAndUpdate(task.team, { $pull: { tasks: task._id } });

    await Task.findByIdAndDelete(req.params.taskId);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find(); 
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};
