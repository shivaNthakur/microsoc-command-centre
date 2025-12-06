import { Server } from "socket.io";

let io: Server | null = null;

export default function getIO(server?: any) {
  if (!io && server) {
    io = new Server(server, {
      cors: { origin: "*" },
    });
    console.log("Socket.IO started");
  }
  return io!;
}