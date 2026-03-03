const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const collabRoutes = require("./routes/collabRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

const isAllowedOrigin = (origin = "") => {
  if (!origin) return true;
  return /^https?:\/\/localhost(:\d+)?$/i.test(origin) || /^https?:\/\/127\.0\.0\.1(:\d+)?$/i.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

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

if (require.main === module) {
  require("./server");
}
