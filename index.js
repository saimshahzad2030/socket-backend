const express = require('express');
const cors = require('cors');
const http = require('http'); // Import the HTTP module
const WebSocket = require('ws'); // Import the WebSocket module

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.json('Hello World');
});

const server = http.createServer(app); // Create an HTTP server
const wss = new WebSocket.Server({ server }); // Create a WebSocket server

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

server.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
