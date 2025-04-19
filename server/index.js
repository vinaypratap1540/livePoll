const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const rooms = {}; // Structure: { roomCode: { votes, timer, users } }

io.on('connection', (socket) => {
  socket.on('create_room', ({ room, name }, callback) => {
    if (rooms[room]) return callback({ success: false, message: 'Room already exists' });

    rooms[room] = {
      votes: { cats: 0, dogs: 0 },
      timer: 60,
      users: { [socket.id]: name }
    };

    socket.join(room);
    callback({ success: true, state: rooms[room] });
  });

  socket.on('join_room', ({ room, name }, callback) => {
    if (!rooms[room]) return callback({ success: false, message: 'Room not found' });

    rooms[room].users[socket.id] = name;
    socket.join(room);

    callback({ success: true, state: rooms[room] });

    // Broadcast current votes to room
    io.to(room).emit('vote_update', rooms[room].votes);
  });

  socket.on('vote', ({ room, option }) => {
    if (rooms[room] && rooms[room].votes[option] !== undefined) {
      rooms[room].votes[option]++;
      io.to(room).emit('vote_update', rooms[room].votes);
    }
  });

  socket.on('disconnect', () => {
    for (const room in rooms) {
      if (rooms[room].users[socket.id]) {
        delete rooms[room].users[socket.id];
      }
    }
  });
});

setInterval(() => {
  for (const room in rooms) {
    if (rooms[room].timer > 0) {
      rooms[room].timer--;
      io.to(room).emit('timer_update', rooms[room].timer);
    }
  }
}, 1000);

server.listen(3001, () => console.log('Backend running at http://localhost:3001'));

