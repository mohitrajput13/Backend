// import express from "express";
// import bodyParser from "body-parser";
// import DoctorRouter from "./routers/doctor.router.js";
// import mongoose from "mongoose";
// import path from "path";
// import dotenv from "dotenv";
// import password from "password";
// import cookieSession from "cookie-session";
// import { fileURLToPath } from "url";
// import cors from "cors";
// import adminRouter from "./routers/admin.router.js";
// import userRouter from "./routers/user.router.js";
// import productRouter from "./routers/product.router.js";
// import Categoryrouter from "./routers/AyurvedaCategory.route.js";
// import CartRouter from "./routers/cart.router.js";
// import OrderRouter from "./routers/order.router.js";
// import yogaRouter from "./routers/yoga.router.js";
// import Reviewrouter from "./routers/reviewUserProduct.route.js";
// import { env } from "process";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const app = express();
// app.use(express.static(path.join(__dirname, "public")));
// dotenv.config();

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then((result) => {
//     app.use(cors());
//     app.use(bodyParser.json());
//     app.use(bodyParser.urlencoded({ extended: true }));
//     app.use("/doctor", DoctorRouter);
//     app.use("/admin", adminRouter);
//     app.use("/user", userRouter);
//     app.use("/product", productRouter);
//     app.use("/category", Categoryrouter);
//     app.use("/cart", CartRouter);
//     app.use("/order", OrderRouter);
//     app.use("/yoga", yogaRouter);
//     app.use("/rate-review", Reviewrouter);
//     app.listen(3000, () => {
//       console.log("Server started....");
//     });
//   })
//   .catch((err) => {
//     console.log(err, "<<<<<<<<");
//   });


const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // production me restrict origin set karein

// Optional: small health endpoint
app.get('/', (req, res) => {
  res.send('WebSocket server running');
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // production me specific origin daalein like "https://yourdomain.com"
    methods: ['GET', 'POST'],
  },
  // pingInterval/pingTimeout default fine; adjust if needed for cPanel timeouts
});

// Simple in-memory message history (last 200 messages)
const MESSAGE_HISTORY_LIMIT = 200;
let messageHistory = [];

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // send recent history to new client
  socket.emit('history', messageHistory);

  // Join room (if client asks)
  socket.on('join-room', (room) => {
    if (room) {
      socket.join(room);
      console.log(`${socket.id} joined room ${room}`);
    }
  });

  // Handle incoming chat message
  socket.on('chat-message', (payload) => {
    // payload should be { text, from, room? }
    const msg = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      text: payload.text || '',
      from: payload.from || 'anonymous',
      ts: new Date().toISOString(),
      room: payload.room || null,
    };

    // store
    messageHistory.push(msg);
    if (messageHistory.length > MESSAGE_HISTORY_LIMIT) {
      messageHistory.shift();
    }

    // broadcast: if room provided -> to room, else to all
    if (msg.room) {
      io.to(msg.room).emit('chat-message', msg);
    } else {
      io.emit('chat-message', msg);
    }
  });

  // Example: typing indicator
  socket.on('typing', (info) => {
    // info = { from, room? }
    if (info && info.room) {
      socket.to(info.room).emit('typing', info);
    } else {
      socket.broadcast.emit('typing', info);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id} — reason: ${reason}`);
  });

  // Optional: handle ping from client for keep-alive
  socket.on('keepalive', () => {
    socket.emit('keepalive-ack', { ok: true, ts: new Date().toISOString() });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

