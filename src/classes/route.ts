import {FoundryVTT, Method, VersionData} from "../interfaces";
import Server from "./server.js";
import {MethodTypes} from "../constants.js";
import {URL} from "url";
import fetch from "node-fetch";
import Logger from "../logger.js";
import {FastifyInstance, FastifyRequest} from "fastify";

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
     * @param {Server} fastify The express server to initialize the routes for
     */
    initialize(fastify: FastifyInstance){
        for(let i = 0; i < this.methods.length; i++) {
            const method = this.methods[i];
            switch (method.type) {
                case MethodTypes.GET:
                    fastify.get(`/${method.key}/${method.parameters? method.parameters : ':query?'}`, method.callback);
                    break;
                case MethodTypes.POST:
                    fastify.post(`/${method.key}`, method.callback);
                    break;
                default:
                    break;
            }

        }
    }

    parseModuleUrl(req: FastifyRequest<{ Querystring: { url: string; } }>){
        let moduleUrl = '';
        if(req.query && Object.hasOwn(req.query, 'url')){
            const queryUrl = req.query['url'];
            if(queryUrl){
                if(Array.isArray(queryUrl)){
                    moduleUrl = queryUrl.join('');
                } else {
                    moduleUrl = queryUrl.toString();
                }
            }
        }
        return moduleUrl;
    }

    parseBadgeStyle(req: FastifyRequest<{ Querystring: { style: string; } }>){
        let badgeStyle = 'flat';
        if(req.query && Object.hasOwn(req.query, 'style')){
            const queryStyle = req.query['style'];
            if(queryStyle){
                if(Array.isArray(queryStyle)){
                    badgeStyle = queryStyle.join('');
                } else {
                    badgeStyle = queryStyle.toString();
                }
            }
        }
        return badgeStyle;
    }

    parseVersionCompatibilityObject(obj: FoundryVTT.Manifest.Compatibility){
        const rData: VersionData = {minimum: '', compatible: ''};
        if(obj.hasOwnProperty('minimum') && obj.minimum){
            rData.minimum = obj.minimum.toString().trim();
        }
        if(obj.hasOwnProperty('verified') && obj.verified){
            rData.compatible = obj.verified.toString().trim();
        } else if(obj.hasOwnProperty('maximum') && obj.maximum){
            rData.compatible = obj.maximum.toString().trim();
        }
        return rData;
    }

    generateVersionLabel(vData: VersionData){
        let label = '';
        if(vData.minimum != ''){
            if(vData.compatible != '' && vData.compatible !== vData.minimum){
                const minVal = parseFloat(vData.minimum);
                const compatVal = parseFloat(vData.compatible);
                if(minVal > compatVal && compatVal % 1 === 0 && Math.trunc(minVal) === compatVal){
                    label = `${vData.minimum}+`;
                } else {
                    label = `${vData.minimum} - ${vData.compatible}`;
                }
            } else {
                label = `${vData.minimum}`;
            }
        }
        return label;
    }

    /**
     * Returns the contents of the module json from the URL
     * @param moduleUrl
     */
    async getModuleJson(moduleUrl: string): Promise<FoundryVTT.Manifest.Json>{
        try{
            const url = new URL(moduleUrl);
            const fResponse = await fetch(url.toString());
            return <Promise<FoundryVTT.Manifest.Json>> await fResponse.json();
        } catch (e){
            Logger.error((<Error>e).message, {badgeData: {url: moduleUrl}});
            return {
                id: '',
                name: '',
                title: '',
                description: '',
                version: '',
                author: '',
                minimumCoreVersion: '',
                compatibility: {}
            };
        }
    }
}
