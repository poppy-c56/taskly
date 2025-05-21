const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const errorHandlers = require("./error-handling");
const authRoutes = require("./routes/auth.routes");
const teamRoutes = require("./routes/team.routes");
const taskRoutes = require("./routes/task.routes");

dotenv.config({ path: ".env" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/tasks", taskRoutes);

app.use(errorHandlers.validationErrorHandler);
app.use(errorHandlers.duplicateKeyErrorHandler);
app.use(errorHandlers.notFound);
app.use(errorHandlers.errorHandler);

module.exports = app;
