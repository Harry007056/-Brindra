require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const app = require("./app");
const { initSocket } = require("./socket");

const PORT = process.env.PORT || 5000;
let MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI missing in .env - using local MongoDB");
  MONGO_URI = "mongodb://localhost:27017/brindra"; 
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
