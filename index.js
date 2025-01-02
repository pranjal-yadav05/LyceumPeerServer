import express from 'express';
import { ExpressPeerServer } from 'peer';
import cors from 'cors';
import http from 'http';

const app = express();
const server = http.createServer(app);

app.use(cors());

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/',
  allow_discovery: true
});

app.get('/', (req,res)=>{
  res.send(`
    <h1>Welcome to Peer Server of Lyceum</h1>
  `)
})


app.use('/', peerServer);


server.listen(9000);