const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectToDatabase = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const collabRoutes = require('./src/routes/collabRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');
const configureSocket = require('./src/socket');

const app = express();
const server = http.createServer(app);

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'brindra-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/collab', collabRoutes);

app.use(notFound);
app.use(errorHandler);

const io = new Server(server, {
  cors: {
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  },
  transports: ['polling', 'websocket'],
});

configureSocket(io);
app.set('io', io);

const port = Number(process.env.PORT || 5000);

connectToDatabase()
  .then(() => {
    server.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  });
