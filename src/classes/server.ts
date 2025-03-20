import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import {fastifyStatic} from "@fastify/static";
import VersionBadge from "../routes/version-badge.js";
import path from "path";
import SystemBadge from "../routes/system-badge.js";
import Logger from "../logger.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * The server class for this service
 */
export default class Server{
    app: FastifyInstance | null = null;

    /**
     * The port number to serve to listen on
     * @type{number}
     */
    port: number;

    /**
     * The server constructor
     * @param {string} port The port to listen for events on
     */
    constructor(port: string) {
        this.port = parseInt(port as string);
    }

    /**
     * Starts the server
     */
    async start(){
        try {
            this.app = Fastify({
                logger: true
            });
            this.app.register(fastifyStatic, {
                root: __dirname,
            });
            this.initializeRoutes(this.app);
            await this.app.listen({ port: this.port });
        } catch (err) {
            this.app?.log.error(err);
        }
    }

    async routes(fastify: FastifyInstance, options: any){
        this.initializeRoutes(fastify);
    }

    /**
     * Used to initialize all the routes
     */
    initializeRoutes(fastify: FastifyInstance){
        fastify.get('/', (reqt, res) => {
            res.sendFile('/pages/index.html');
        });
        fastify.get('/sitemap.xml', (req, res) => {
            res.sendFile('/pages/sitemap.xml');
        });
        const vb = new VersionBadge();
        vb.initialize(fastify);

        const sb = new SystemBadge();
        sb.initialize(fastify);
    }
}
