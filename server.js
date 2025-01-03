import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
 socket.on('sendLocation',(data)=>{
    io.emit('receiveLocation',{id:socket.id,...data});
 } )
  socket.on('disconnect', () => {
    console.log('disconnected');
    io.emit('removeLocation', socket.id);
  });
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('connected');

});
app.get('/', (req, res) => {
  res.render("index");
});

httpServer.listen(3000, () => {
  console.log('Server is running on port 3000');
});