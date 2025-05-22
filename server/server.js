require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

app.use(errorHandlers.validationErrorHandler);
app.use(errorHandlers.duplicateKeyErrorHandler);
app.use(errorHandlers.notFound);
app.use(errorHandlers.errorHandler);

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskly")
  .then(() => {
    console.log("Connected to MongoDB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
