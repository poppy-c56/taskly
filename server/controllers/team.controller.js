const Team = require("../models/Team.model");
const User = require("../models/User.model");
const mongoose = require("mongoose");

exports.createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const team = await Team.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    await User.findByIdAndUpdate(req.user._id, { $push: { teams: team._id } });

    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
};

exports.getUserTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({
      members: req.user._id,
    })
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.json(teams);
  } catch (error) {
    next(error);
  }
};

exports.getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .populate({
        path: "tasks",
        populate: {
          path: "assignedTo",
          select: "name email",
        },
      });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.members.some((member) => member._id.equals(req.user._id))) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this team" });
    }

    res.json(team);
  } catch (error) {
    next(error);
  }
};

exports.updateTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.createdBy.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this team" });
    }

    team.name = name || team.name;
    team.description = description || team.description;

    const updatedTeam = await team.save();
    res.json(updatedTeam);
  } catch (error) {
    next(error);
  }
};

exports.addTeamMember = async (req, res, next) => {
  try {
    const { email } = req.body;

    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.createdBy.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to add members to this team" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (team.members.includes(user._id)) {
      return res
        .status(400)
        .json({ message: "User is already a member of this team" });
    }

    team.members.push(user._id);
    await team.save();

    await User.findByIdAndUpdate(user._id, { $push: { teams: team._id } });

    const updatedTeam = await Team.findById(req.params.teamId).populate(
      "members",
      "name email"
    );

    res.json(updatedTeam);
  } catch (error) {
    next(error);
  }
};

exports.removeTeamMember = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.createdBy.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to remove members from this team" });
    }

    if (team.createdBy.equals(userId)) {
      return res.status(400).json({ message: "Cannot remove team creator" });
    }

    if (!team.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is not a member of this team" });
    }

    team.members = team.members.filter((member) => !member.equals(userId));
    await team.save();

    await User.findByIdAndUpdate(userId, { $pull: { teams: team._id } });

    const updatedTeam = await Team.findById(req.params.teamId).populate(
      "members",
      "name email"
    );

    res.json(updatedTeam);
  } catch (error) {
    next(error);
  }
};

exports.deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.createdBy.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this team" });
    }

    await User.updateMany({ teams: team._id }, { $pull: { teams: team._id } });

    await Team.findByIdAndDelete(req.params.teamId);

    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    next(error);
  }
};
