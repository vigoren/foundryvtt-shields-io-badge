import express from "express";
import VersionBadge from "../routes/version-badge.js";
import path from "path";
import SystemBadge from "../routes/system-badge.js";
import {RequestHandler} from "express/ts4.0";
import Logger from "../logger.js";

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
        this.app.use(<RequestHandler>express.json());
    }

    /**
     * Starts the server
     */
    start(){
        this.app.listen(this.port, () => {Logger.info('Server Started!', {})});
        this.initializeRoutes();
    }

    /**
     * Used to initialize all the routes
     */
    initializeRoutes(){
        this.app.get('/', (req: express.Request, res: express.Response) => {
            res.sendFile('pages/index.html', {root: path.join(path.dirname(''), 'dist')});
        });
        this.app.use('/assets', express.static('./dist/assets'));

        const vb = new VersionBadge();
        vb.initialize(this);

        const sb = new SystemBadge();
        sb.initialize(this);
    }
}
