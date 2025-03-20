import Server from "./classes/server.js";
const port = process.env.PORT || "3000";
const server = new Server(port);
server.start().catch(console.error);
