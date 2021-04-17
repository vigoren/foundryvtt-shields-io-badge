import Route from "../classes/route.js";
import {FoundryGrey, FoundryOrange, FoundrySVG, MethodTypes} from "../constants.js";
import express from "express";
import {ShieldIOResponse} from "../interfaces";

export default class SystemBadge extends Route{
    constructor() {
        super();

        this.methods.push({
            type: MethodTypes.GET,
            key: 'system',
            parameters: '',
            callback: this.system.bind(this)
        });
    }

    async system(req: express.Request, res: express.Response){
        const shieldIo: ShieldIOResponse = {
            schemaVersion: 1,
            label: 'Required System',
            message: '',
            color: FoundryOrange,
            labelColor: FoundryGrey,
            logoSvg: FoundrySVG
        };
        let moduleUrl = this.parseModuleUrl(req);
        if(moduleUrl){
            const moduleJson = await this.getModuleJson(moduleUrl);
            if(moduleJson.systems !== undefined){
                let message;
                if(Array.isArray(moduleJson.systems)){
                    message = moduleJson.systems.join(', ');
                } else {
                    message = moduleJson.systems;
                }
                shieldIo.message = message;
            } else if(moduleJson.system !== undefined){
                shieldIo.message = moduleJson.system;
            }
            else {
                shieldIo.message = 'No system required.'
            }
        }
        if(shieldIo.message === '') {
            shieldIo.message = 'Error getting information.';
        }
        res.set('Cache-Control', 'public, max-age:300');
        res.status(200).json(shieldIo);
    }
}
