import {FoundryGrey, FoundryOrange, FoundrySVG} from "../constants.js";
import {ShieldIOResponse, VersionData} from "../interfaces";
import Logger from "../logger.js";

import {parseModuleUrl, parseBadgeStyle, parseVersionCompatibilityObject, generateVersionLabel, getModuleJson} from "../utilities.js";


export async function version(req: Request){
    const shieldIo: ShieldIOResponse = {
        schemaVersion: 1,
        label: 'Supported Foundry Version',
        message: '',
        color: FoundryOrange,
        labelColor: FoundryGrey,
        logoSvg: FoundrySVG,
        style: parseBadgeStyle(req)
    };
    let moduleUrl = parseModuleUrl(req);

    if(moduleUrl){
        Logger.info(`Loading Data From: ${moduleUrl}`, {badgeData: {type: "VERSION", url: moduleUrl}});
        const moduleJson = await getModuleJson(moduleUrl);
        let parsedVersion: VersionData = {minimum: '', compatible: ''};

        if(moduleJson.hasOwnProperty('compatibility') && moduleJson.compatibility){
            parsedVersion = parseVersionCompatibilityObject(moduleJson.compatibility);
        } else if(moduleJson.hasOwnProperty('minimumCoreVersion')){
            parsedVersion.minimum = moduleJson.minimumCoreVersion.toString().trim();
        } else if(moduleJson.hasOwnProperty('coreVersion') && moduleJson.coreVersion){
            parsedVersion.minimum = moduleJson.coreVersion.toString().trim();
        }
        if(parsedVersion.compatible === '' && moduleJson.hasOwnProperty('compatibleCoreVersion') && moduleJson.compatibleCoreVersion){
            parsedVersion.compatible =  moduleJson.compatibleCoreVersion.toString().trim();
        }

        shieldIo.message = generateVersionLabel(parsedVersion);

        if(shieldIo.message.includes('-') || shieldIo.message.includes('+')){
            shieldIo.label = 'Supported Foundry Versions';
        }
    }

    if(shieldIo.message === '') {
        shieldIo.message = 'Error getting information.';
    }

    return new Response(JSON.stringify(shieldIo), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age:300'} });
}
