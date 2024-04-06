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
  console.log(`Server running at PORT ${PORT}`);
});

const io = new Server(server, {
  cors: { origin: '*' }
});
let likes = 0;
io.on('connect',(socket)=>{
  socket.emit('likeUpdate',likes)
  socket.on('liked',()=>{
    likes++;
    socket.emit('likeUpdate',likes);
    socket.broadcast.emit('likeUpdate',likes)
  })
})


// io.listen(PORT, () => console.log(`Server runing at PORT ${PORT}`));
// module.exports = {io}