const express = require('express')
const cors = require('cors')
const {Server, Socket} = require('socket.io')
const app = express()
const PORT = 5000
app.use(cors())
app.use(express.json())
app.get("/",async (req, res) => {
  res.json('Hello World');
});
const server = app.listen(PORT, () => {
  // console.log(`Server running at PORT ${PORT}`);
});

const io = new Server(server, {
  cors: { origin: '*' }
});
let likes = 0;
io.on('connect',(socket)=>{
  socket.emit('likeUpdate',likes)
  socket.on('liked',()=>{
    console.log('incremented')

    likes++;
    socket.emit('likeUpdate',likes);
    socket.broadcast.emit('likeUpdate',likes)
  })
})


// io.listen(PORT, () => console.log(`Server runing at PORT ${PORT}`));
// module.exports = {io}

 


// const express = require('express');
// const http = require('http');
// const WebSocket = require('ws');

// const app = express();
// const PORT = 8080;

// app.use(express.json());

// const server = http.createServer(app);

// const wss = new WebSocket.Server({ server });

// let counter = 0;

// wss.on('connection', function connection(ws) {
//   console.log('WebSocket connection established.');

//   // Send initial counter value when a new client connects
//   ws.send(JSON.stringify({ event: 'counterUpdate', data: counter }));

//   // Increment counter when client sends 'increment' message
//   ws.on('message', function incoming(message) {
//     console.log('Received message:', message.toString());
//     if (message.toString() === 'increment') {
//       counter++;
//       // Broadcast updated counter value to all clients
//       wss.clients.forEach(function each(client) {
//         if (client !== ws && client.readyState === WebSocket.OPEN) {
//           client.send(JSON.stringify({ event: 'counterUpdate', data: counter }));
//         }
//       });
//     }
//   });
// });
// app.get('/',async(req,res)=>{
//   res.send('Hello world')
// })
// server.listen(PORT, () => {
//   console.log(`Server running at PORT ${PORT}`);
// });