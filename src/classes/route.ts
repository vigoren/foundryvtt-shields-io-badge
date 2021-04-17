import {Method} from "../interfaces";
import Server from "./server.js";
import {MethodTypes} from "../constants.js";

/**
 * Base Route class
 */
export default class Route{

    /**
     * List of methods supported by this specific route
     */
    methods: Method[] = [];

    constructor() {}

    /**
     * Go through every method and initialize it
     * @param {Server} server The express server to initialize the routes for
     */
    initialize(server: Server){
        for(let i = 0; i < this.methods.length; i++) {
            const method = this.methods[i];
            switch (method.type) {
                case MethodTypes.GET:
                    server.app.get(`/${method.key}/${method.parameters? method.parameters : ':query?'}`, method.callback);
                    break;
                case MethodTypes.POST:
                    server.app.post(`/${method.key}`, method.callback);
                    break;
                default:
                    break;
            }

        }
    }
}
