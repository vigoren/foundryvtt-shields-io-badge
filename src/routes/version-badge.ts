import Route from "../classes/route.js";
import {FoundryGrey, FoundryOrange, FoundrySVG, MethodTypes} from "../constants.js";
import {ShieldIOResponse} from "../interfaces";
import express from "express";


export default class VersionBadge extends Route{

    constructor() {
        super();

        this.methods.push({
            type: MethodTypes.GET,
            key: 'version',
            parameters: '',
            callback: this.version.bind(this)
        });
    }

    async version(req: express.Request, res: express.Response){
        const shieldIo: ShieldIOResponse = {
            schemaVersion: 1,
            label: 'Supported Foundry Version',
            message: '',
            color: FoundryOrange,
            labelColor: FoundryGrey,
            logoSvg: FoundrySVG
        };
        let moduleUrl = this.parseModuleUrl(req);

        if(moduleUrl){
            const moduleJson = await this.getModuleJson(moduleUrl);
            let min = moduleJson.minimumCoreVersion.trim(), compatible = '';
            if(moduleJson.compatibleCoreVersion){
                compatible = moduleJson.compatibleCoreVersion.trim();
            }

            if(min !== ''){
                shieldIo.message = min;
            }

            if(compatible !== '' && compatible !== min){
                shieldIo.message = `${shieldIo.message} - ${compatible}`;
                shieldIo.label = 'Supported Foundry Versions';
            }
        }

        if(shieldIo.message === '') {
            shieldIo.message = 'Error getting information.';
        }
        res.set('Cache-Control', 'public, max-age:300');
        res.status(200).json(shieldIo);
    }
}
