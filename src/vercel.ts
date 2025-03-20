"use strict";
import Fastify, {FastifyReply, FastifyRequest} from "fastify";
//import Server from "./classes/server.js";

//const server = new Server(process.env.PORT || "3000");
const app = Fastify({
    logger: true,
});

app.get('/', async (req, reply) => {
    return reply.status(200).type('text/html').send('<html><body><h1>Welcome to the Vercel server!</h1></body></html>');
})

// Register your application as a normal plugin.
//app.register(server.routes);

export default async function handler (req:FastifyRequest, res: FastifyReply) {
    await app.ready();
    app.server.emit('request', req, res);
}
