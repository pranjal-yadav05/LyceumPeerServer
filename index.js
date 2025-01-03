import express from 'express';
import { ExpressPeerServer } from 'peer';
import cors from 'cors';
import http from 'http';

const app = express();
const server = http.createServer(app);

// Add more specific CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/peerjs',  // Change this to match the expected path
  allow_discovery: true,
  proxied: true
});

app.use('/', peerServer);

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/', (req,res) => {
  res.send(`
    <h1>Welcome to Peer Server of Lyceum</h1>
  `)
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 9000;  
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app; // Add this for Vercel