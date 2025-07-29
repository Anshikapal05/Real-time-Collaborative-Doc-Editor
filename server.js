
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const Document = require('./models/Document');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const rooms = {}; // { roomId: { users: [], sockets: [], document: "" } }

wss.on('connection', (ws) => {
  let currentUser = { roomId: null, username: null };

  ws.on('message', async (message) => {
    try {
      const parsed = JSON.parse(message);

      // 1. JOIN ROOM
      if (parsed.type === 'join') {
        const { roomId, username } = parsed;
        currentUser = { roomId, username };

        // Initialize room if it doesn't exist
        if (!rooms[roomId]) {
          rooms[roomId] = { users: [], sockets: [], document: '' };

          // Fetch or create document
          let doc = await Document.findOne({ roomId });
          if (!doc) {
            doc = await Document.create({ roomId, content: '' });
          }
          rooms[roomId].document = doc.content;
        }

        // Prevent duplicate usernames in a room
        if (rooms[roomId].users.includes(username)) {
          ws.send(JSON.stringify({
            type: 'error',
            message: `Username "${username}" is already taken in room "${roomId}".`
          }));
          return;
        }

        rooms[roomId].users.push(username);
        rooms[roomId].sockets.push(ws);

        // Send current document content
        ws.send(JSON.stringify({ type: 'init', data: rooms[roomId].document }));

        // Broadcast updated user list
        broadcastToRoom(roomId, {
          type: 'user_list',
          users: rooms[roomId].users
        });
      }

      // 2. DOCUMENT UPDATE
      if (parsed.type === 'update') {
        const { roomId, data } = parsed;

        if (rooms[roomId]) {
          rooms[roomId].document = data;

          await Document.findOneAndUpdate(
            { roomId },
            { content: data, lastUpdated: new Date() },
            { new: true, upsert: true }
          );

          // Broadcast to all others
          broadcastToRoom(roomId, { type: 'update', data }, ws);
        }
      }
    } catch (err) {
      console.error('❌ Message Error:', err);
    }
  });

  ws.on('close', () => {
    const { roomId, username } = currentUser;

    if (roomId && rooms[roomId]) {
      const index = rooms[roomId].sockets.indexOf(ws);
      if (index !== -1) {
        rooms[roomId].sockets.splice(index, 1);
        rooms[roomId].users.splice(index, 1);
      }

      broadcastToRoom(roomId, {
        type: 'user_list',
        users: rooms[roomId].users
      });

      if (rooms[roomId].sockets.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

function broadcastToRoom(roomId, message, sender = null) {
  if (!rooms[roomId]) return;

  rooms[roomId].sockets.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
