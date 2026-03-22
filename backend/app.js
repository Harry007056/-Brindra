const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const collabRoutes = require("./routes/collabRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

const configuredFrontendUrl = String(process.env.FRONTEND_URL || "").trim();
const configuredFrontendOrigin = configuredFrontendUrl
  ? configuredFrontendUrl.replace(/\/+$/, "")
  : "";

const isAllowedOrigin = (origin = "") => {
  if (!origin) return true;
  if (configuredFrontendOrigin && origin.toLowerCase() === configuredFrontendOrigin.toLowerCase()) {
    return true;
  }

  const allowed = [
    /^https?:\/\/localhost(:\d+)?$/i,
    /^https?:\/\/127\.0\.0\.1(:\d+)?$/i,
    /^https:\/\/.*\.vercel\.app$/i,
    /^https:\/\/.*\.netlify\.app$/i,
    /^https:\/\/brindra\.onrender\.com$/i
  ];
  return allowed.some(regex => regex.test(origin));
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
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/plans", require("./routes/plansRoutes"));

module.exports = app;

if (require.main === module) {
  require("./server");
}
