import Route from "../classes/route.js";
import {FoundryGrey, FoundryOrange, FoundrySVG, MethodTypes} from "../constants.js";
import {ShieldIOResponse} from "../interfaces";
import express from "express";
import fetch from "node-fetch";
import {URL} from "url";


export default class VersionBadge extends Route{

    constructor() {
        super();

        this.methods.push({
            type: MethodTypes.GET,
            key: 'version',
            parameters: ':moduleUrl?',
            callback: this.version.bind(this)
        });
    }

    async version(req: express.Request, res: express.Response){
        const shieldIo: ShieldIOResponse = {
            schemaVersion: 1,
            label: 'Supported Foundry Versions',
            message: '',
            color: FoundryOrange,
            labelColor: FoundryGrey,
            logoSvg: FoundrySVG,
            logoColor: "#000000"
        };
        let moduleUrl = '';


        if(req.query && req.query.hasOwnProperty('url')){
            const queryUrl = req.query['url'];
            if(queryUrl){
                if(Array.isArray(queryUrl)){
                    moduleUrl = queryUrl.join('');
                } else {
                    moduleUrl = queryUrl.toString();
                }
            }
        }

        if(moduleUrl){
            try{
                const url = new URL(moduleUrl);
                const fResponse = await fetch(url);
                const moduleJson = await fResponse.json();
                let min = '', compatible = '';
                if(moduleJson.hasOwnProperty('minimumCoreVersion')){
                    min = moduleJson['minimumCoreVersion'].trim();
                }
                if(moduleJson.hasOwnProperty('compatibleCoreVersion')){
                    compatible = moduleJson['compatibleCoreVersion'].trim();
                }

                if(min !== ''){
                    shieldIo.message = min;
                }

                if(compatible !== '' && compatible !== min){
                    shieldIo.message = `${shieldIo.message} - ${compatible}`;
                }

            } catch (e){
                console.error(`${(<Error>e).message}`);
            }
        }

        if(shieldIo.message === '') {
            shieldIo.message = 'Error getting information.';
        }
        res.set('Cache-Control', 'public, max-age:300');
        res.status(200).json(shieldIo);
    }
}
