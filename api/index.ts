"use strict";
import Fastify, {FastifyReply, FastifyRequest} from "fastify";
import Server from "../src/classes/server.js";

const server = new Server(process.env.PORT || "3000");
const app = Fastify({
    logger: true,
});


// Register your application as a normal plugin.
app.register(server.routes);

export default async function handler (req:FastifyRequest, res: FastifyReply) {
    await app.ready();
    app.server.emit('request', req, res);
}
