console.log('Booting Brindra backend...');
require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const app = require("./app");
const { initSocket } = require("./socket");

const PORT = process.env.PORT || 5000;
let MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI missing! Using local MongoDB (Render needs Atlas URI)");
  MONGO_URI = "mongodb://localhost:27017/brindra"; 
} else {
  console.log('MongoDB URI configured (length:', MONGO_URI.length, ')');
}


mongoose
  .connect(MONGO_URI)
    .then(() => {
    console.log("✅ MongoDB connected successfully");
    const server = http.createServer(app);
    initSocket(server);
    server.listen(PORT, () => {
      console.log(`✅ Backend running on port ${PORT} | Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error("Mongo connection error:", err.message);
    process.exit(1);
  });
