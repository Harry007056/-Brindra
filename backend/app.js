const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const collabRoutes = require("./routes/collabRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    app: "Team Collaboration Backend",
    status: "running"
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/collab", collabRoutes);

module.exports = app;
