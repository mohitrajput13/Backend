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

// app.js (ESM version)
// Run: npm init -y
//      npm i express socket.io cors
// Start: node app.js

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

// Optional: small health endpoint
app.get("/", (req, res) => {
  res.send("WebSocket server running");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // production me apna domain daalna
    methods: ["GET", "POST"],
  },
});

// Simple history memory
const MESSAGE_HISTORY_LIMIT = 200;
let messageHistory = [];

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // send recent data
  socket.emit("history", messageHistory);

  // join room
  socket.on("join-room", (room) => {
    if (room) {
      socket.join(room);
      console.log(`${socket.id} joined room ${room}`);
    }
  });

  // chat message
  socket.on("chat-message", (payload) => {
    const msg = {
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      text: payload.text || "",
      from: payload.from || "anonymous",
      ts: new Date().toISOString(),
      room: payload.room || null,
    };

    messageHistory.push(msg);
    if (messageHistory.length > MESSAGE_HISTORY_LIMIT) {
      messageHistory.shift();
    }

    if (msg.room) {
      io.to(msg.room).emit("chat-message", msg);
    } else {
      io.emit("chat-message", msg);
    }
  });

  // typing
  socket.on("typing", (info) => {
    if (info?.room) {
      socket.to(info.room).emit("typing", info);
    } else {
      socket.broadcast.emit("typing", info);
    }
  });

  // disconnect
  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id} — ${reason}`);
  });

  // keepalive
  socket.on("keepalive", () => {
    socket.emit("keepalive-ack", {
      ok: true,
      ts: new Date().toISOString(),
    });
  });
});

// start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
