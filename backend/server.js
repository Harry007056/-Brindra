require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const app = require("./app");
const { initSocket } = require("./socket");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const server = http.createServer(app);
    initSocket(server);
    server.listen(PORT, () => {
      console.log(`Team Collaboration backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Mongo connection error:", err.message);
    process.exit(1);
  });
