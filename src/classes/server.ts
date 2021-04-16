import express from "express";
import VersionBadge from "../routes/version-badge.js";

/**
 * The server class for this service
 */
export default class Server{

    /**
     * The express instance
     * @type{express.Express}
     */
    app: express.Express;

    /**
     * The port number to serve to listen on
     * @type{number | string}
     */
    port: number | string;

    /**
     * The server constructor
     * @param {number|string} port The port to listen for events on
     */
    constructor(port: number | string) {
        this.port = port;
        this.app = express();
        this.app.use(express.json());
    }

    /**
     * Starts the server
     */
    start(){
        this.app.listen(this.port, () => {console.log('Server Started!')});
        this.initializeRoutes();
    }

    /**
     * Used to initialize all of the routes
     */
    initializeRoutes(){
        const vb = new VersionBadge();
        vb.initialize(this);
    }
}
