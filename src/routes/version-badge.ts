import Route from "../classes/route.js";
import {FoundryGrey, FoundryOrange, FoundrySVG, MethodTypes} from "../constants.js";
import {ShieldIOResponse} from "../interfaces";
import express from "express";
import Logger from "../logger.js";


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
            logoSvg: FoundrySVG,
            style: this.parseBadgeStyle(req)
        };
        let moduleUrl = this.parseModuleUrl(req);

        if(moduleUrl){
            Logger.info(`Loading Data From: ${moduleUrl}`, {badgeData: {type: "VERSION", url: moduleUrl}});
            const moduleJson = await this.getModuleJson(moduleUrl);
            let min = '', compatible = '';
            if(moduleJson.hasOwnProperty('minimumCoreVersion')){
                min = moduleJson.minimumCoreVersion.toString().trim();
            } else if(moduleJson.hasOwnProperty('coreVersion') && moduleJson.coreVersion){
                min = moduleJson.coreVersion.toString().trim();
            }
            if(moduleJson.hasOwnProperty('compatibleCoreVersion') && moduleJson.compatibleCoreVersion){
                compatible = moduleJson.compatibleCoreVersion.toString().trim();
            }

            if(min !== ''){
                shieldIo.message = min;
            }

            if(compatible !== '' && compatible !== min){
                const minVal = parseFloat(min);
                const compatVal = parseFloat(compatible);
                if(minVal > compatVal && compatVal % 1 === 0 && Math.trunc(minVal) === compatVal){
                    shieldIo.message = `${min}+`;
                } else {
                    shieldIo.message = `${shieldIo.message} - ${compatible}`;
                }
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
