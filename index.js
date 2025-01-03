import express from 'express';
import { ExpressPeerServer } from 'peer';
import cors from 'cors';
import http from 'http';

const app = express();
const server = http.createServer(app);

// CORS configuration to match your frontend domain
app.use(cors({
  origin: process.env.FRONTEND_URL, // In production, specify your frontend domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// PeerServer configuration that matches your frontend settings
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/peerjs',
  port: 443,
  proxied: true, // Important for running behind a reverse proxy (like Vercel)
  ping_interval: 5000, // Keep connections alive
  allow_discovery: true,
  key: 'peerjs' // Optional, matches the default key
});

// Monitor connections
peerServer.on('connection', (client) => {
  console.log('Client connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('Client disconnected:', client.getId());
});

app.use('/', peerServer);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Home page
app.get('/', (req, res) => {
  res.send('<h1>PeerJS Server Running</h1>');
});

// Only listen directly when not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 9000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;