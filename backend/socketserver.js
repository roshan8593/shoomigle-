
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let textWaitingQueue = [];
let videoWaitingQueue = [];

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.room = null;
  socket.mode = null;


  socket.on("start-searching", ({ mode = "text" } = {}) => {
    if (socket.room) return;

    socket.mode = mode;

    textWaitingQueue = textWaitingQueue.filter((id) => id !== socket.id);
    videoWaitingQueue = videoWaitingQueue.filter((id) => id !== socket.id);

    const queue = mode === "video" ? videoWaitingQueue : textWaitingQueue;

    while (queue.length > 0) {
      const partnerId = queue.shift();
      const partner = io.sockets.sockets.get(partnerId);

      if (!partner || partner.room) continue;

      const room = `${socket.id}-${partnerId}`;

      socket.join(room);
      partner.join(room);

      socket.room = room;
      partner.room = room;
      socket.mode = mode;
      partner.mode = mode;

      console.log(`Room created [${mode}]:`, room);

      socket.emit("chat-start", { initiator: true, mode });
      partner.emit("chat-start", { initiator: false, mode });

      return;
    }

    queue.push(socket.id);
  });


  socket.on("chat-message", (msg) => {
    if (socket.room) {
      socket.to(socket.room).emit("message-receive", msg);
    }
  });

 
  socket.on("typing", () => {
    if (socket.room) {
      socket.to(socket.room).emit("typing");
    }
  });


  socket.on("next-stranger", () => {
    handleLeave(socket, true);
  });

  
  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    handleLeave(socket, false);
  });


  function handleLeave(socket, requeuePartner) {
    textWaitingQueue = textWaitingQueue.filter((id) => id !== socket.id);
    videoWaitingQueue = videoWaitingQueue.filter((id) => id !== socket.id);

    if (!socket.room) return;

    const room = socket.room;
    const users = io.sockets.adapter.rooms.get(room);

    socket.to(room).emit("stranger-disconnected");

    if (users) {
      for (const id of users) {
        const s = io.sockets.sockets.get(id);
        if (!s) continue;

        s.leave(room);
        s.room = null;

        if (id !== socket.id && requeuePartner) {
          const queue = s.mode === "video" ? videoWaitingQueue : textWaitingQueue;
          queue.push(id);
        }
      }
    }

    socket.room = null;
  }

  
  socket.on("offer", (offer) => {
    if (socket.room) socket.to(socket.room).emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    if (socket.room) socket.to(socket.room).emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate) => {
    if (socket.room) socket.to(socket.room).emit("ice-candidate", candidate);
  });
});

httpServer.listen(3010, () => {
  console.log("Server running on port 3010");
});