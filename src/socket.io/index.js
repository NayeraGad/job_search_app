import { Server } from "socket.io";
import {
  sendMessage,
  startChat,
} from "../modules/chat/chatService/chat.socket.service.js";

export const runIO = (httpServer, app) => {
  const io = new Server(httpServer, {
    cors: "*",
  });

  app.set("io", io);

  io.on("connection", async (socket) => {
    await startChat(socket);
    await sendMessage(socket);
  });
};
