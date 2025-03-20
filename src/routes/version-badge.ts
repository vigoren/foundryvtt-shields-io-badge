import Route from "../classes/route.js";
import {FoundryGrey, FoundryOrange, FoundrySVG, MethodTypes} from "../constants.js";
import {ShieldIOResponse, VersionData} from "../interfaces";
import Logger from "../logger.js";
import {FastifyReply, FastifyRequest} from "fastify";


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

    async version(req: FastifyRequest<{ Querystring: { url: string; style: string; showVersion: string; nameType: string } }>, res: FastifyReply){
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
            let parsedVersion: VersionData = {minimum: '', compatible: ''};

            if(moduleJson.hasOwnProperty('compatibility') && moduleJson.compatibility){
                parsedVersion = this.parseVersionCompatibilityObject(moduleJson.compatibility);
            } else if(moduleJson.hasOwnProperty('minimumCoreVersion')){
                parsedVersion.minimum = moduleJson.minimumCoreVersion.toString().trim();
            } else if(moduleJson.hasOwnProperty('coreVersion') && moduleJson.coreVersion){
                parsedVersion.minimum = moduleJson.coreVersion.toString().trim();
            }
            if(parsedVersion.compatible === '' && moduleJson.hasOwnProperty('compatibleCoreVersion') && moduleJson.compatibleCoreVersion){
                parsedVersion.compatible =  moduleJson.compatibleCoreVersion.toString().trim();
            }

            shieldIo.message = this.generateVersionLabel(parsedVersion);

            if(shieldIo.message.includes('-') || shieldIo.message.includes('+')){
                shieldIo.label = 'Supported Foundry Versions';
            }
        }

        if(shieldIo.message === '') {
            shieldIo.message = 'Error getting information.';
        }

        res.header('Cache-Control', 'public, max-age:300');
        res.status(200).send(shieldIo);
    }
}
