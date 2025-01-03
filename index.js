// index.js
import express from 'express';
import { ExpressPeerServer } from 'peer';
import cors from 'cors';
import http from 'http';

const app = express();
const server = http.createServer(app);

// More permissive CORS configuration for development
app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL], // Allow both localhost and production URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Configure PeerServer before using it
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/', // Changed from '/peerjs' because we'll mount it differently
  port: 443,
  proxied: true,
  pingInterval: 5000,
  allow_discovery: true
});

// Mount peerServer at the /peerjs path
app.use('/peerjs', peerServer);

// Monitor connections
peerServer.on('connection', (client) => {
  console.log('Client connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('Client disconnected:', client.getId());
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Home page
app.get('/', (req, res) => {
  res.send('<h1>PeerJS Server Running</h1>');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 9000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;