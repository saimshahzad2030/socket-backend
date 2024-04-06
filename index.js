const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.json('Hello World');
});

const wss = new WebSocket.Server({ noServer: true }); // Create a WebSocket server without an HTTP server

let likes = 0;

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ event: 'likeUpdate', data: likes })); // Send initial like count when connected

  ws.on('message', (message) => {
    if (message === 'liked') {
      likes++;
      // Broadcast the updated like count to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ event: 'likeUpdate', data: likes }));
        }
      });
    }
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});

// Upgrade the HTTP server to support WebSocket
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});