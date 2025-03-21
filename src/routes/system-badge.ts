import {FoundryGrey, FoundryOrange, FoundrySVG} from "../constants.js";
import {FoundryVTT, ShieldIOResponse, SystemNames} from "../interfaces";
import Logger from "../logger.js";
import {parseModuleUrl, parseBadgeStyle, parseVersionCompatibilityObject, generateVersionLabel, getModuleJson} from "../utilities.js";


const systemPrettyNames: Record<string, SystemNames> = {
    "alienrpg": {
        full: "Alien RPG",
        foundry: "Alien RPG",
        short: "Alien RPG"
    },"coc7": {
        full: "Call of Cthulhu 7th Edition",
        foundry: "Call of Cthulhu 7th edition (Unofficial)",
        short: "CoC 7e"
    },"blades-in-the-dark": {
        full: "Blades In The Dark",
        foundry: "Blades In The Dark",
        short: "Blades In The Dark"
    },
    "d35e": {
        full: "Dungeons and Dragons 3.5 Edition",
        foundry: "3.5e SRD",
        short: "DnD3.5e"
    },
    "dnd4e": {
        full: "Dungeons and Dragons 4th Edition",
        foundry: "DnD 4th Edition",
        short: "DnD4e"
    },
    "dnd5e": {
        full: "Dungeons and Dragons 5th Edition",
        foundry: "DnD5e",
        short: "DnD5e"
    },
    "lancer": {
        full: "LANCER",
        foundry: "LANCER",
        short: "LANCER"
    },
    "pf2e": {
        full: "Pathfinder 2nd Edition",
        foundry: "Pathfinder 2e",
        short: "PF2e"
    },
    "pf1": {
        full: "Pathfinder 1st Edition",
        foundry: "Pathfinder 1",
        short: "PF1e"
    },
    "sfrpg": {
        full: "Starfinder",
        foundry: "Starfinder",
        short: "SFRPG"
    },
    "starwarsffg": {
        full: "Star Wars Role-Playing Game (FFG)",
        foundry: "Star Wars FFG system for Foundry VTT",
        short: "Star Wars FFG"
    },
    "swade": {
        full: "Savage Worlds Adventure Edition",
        foundry: "Savage Worlds Adventure Edition",
        short: "SWADE"
    },
    "vtm5e": {
        full: "Vampire: The Masquerade 5th Edition",
        foundry: "Vampire the Masquerade 5e",
        short: "V5"
    },
    "wfrp4e": {
        full: "Warhammer Fantasy Roleplay 4th Edition",
        foundry: "Warhammer Fantasy Roleplay 4th Edition",
        short: "WFRP 4e"
    },
    "worldbuilding": {
        full: "Simple Worldbuilding System",
        foundry: "Simple Worldbuilding System",
        short: "SWBS"
    }
};

function getSystemName(key: string, req: Request){
    const url = new URL(req.url);
    if(url.searchParams.has("nameType")){
        const nameType = url.searchParams.get('nameType');
        let type = (Array.isArray(nameType)? nameType.join('') : (nameType || "")).toLowerCase() as 'short' | 'full' | 'foundry';
        if(systemPrettyNames[key] && (<SystemNames>systemPrettyNames[key])[type]){
            return (<SystemNames>systemPrettyNames[key])[type];
        }
    }
    return key;
}

function getSystemMinimumVersion(moduleJson: FoundryVTT.Manifest.Json | FoundryVTT.Manifest.RelationshipItem, req: Request){
    const url = new URL(req.url);
    if(url.searchParams.has("showVersion")){
        if(moduleJson.hasOwnProperty('compatibility') && moduleJson.compatibility){
            const parsedVersion = parseVersionCompatibilityObject(moduleJson.compatibility);
            return ` ${generateVersionLabel(parsedVersion)}`;
        } else if(moduleJson.hasOwnProperty('minimumSystemVersion') || moduleJson.hasOwnProperty('systemVersion')){
            const data = (<FoundryVTT.Manifest.Json>moduleJson);
            if(data.minimumSystemVersion){
                return ` ${data.minimumSystemVersion.toString().trim()}+`;
            } else if(data.systemVersion){
                return ` ${data.systemVersion.toString().trim()}`;
            }
        }
    }
    return '';
}


export async function system(req: Request){
    const shieldIo: ShieldIOResponse = {
        schemaVersion: 1,
        label: 'Supported Game System',
        message: '',
        color: FoundryOrange,
        labelColor: FoundryGrey,
        logoSvg: FoundrySVG,
        style: parseBadgeStyle(req)
    };
    let moduleUrl = parseModuleUrl(req);
    if(moduleUrl){
        Logger.info(`Loading Data From: ${moduleUrl}`, {badgeData: {type: "SYSTEM", url: moduleUrl}, context: {}});
        const moduleJson = await getModuleJson(moduleUrl);
        // @ts-ignore
        delete moduleJson['compatibility']; //We don't need to know the modules own compatibility when checking system data
        if(moduleJson.hasOwnProperty('relationships') && moduleJson.relationships && moduleJson.relationships.hasOwnProperty('systems') && moduleJson.relationships.systems && moduleJson.relationships.systems.length){
            for(let i = 0; i < moduleJson.relationships.systems.length; i++){
                if(i !== 0){
                    shieldIo.message += ', ';
                }
                shieldIo.message += getSystemName(moduleJson.relationships.systems[i].id, req);
                shieldIo.message += getSystemMinimumVersion(moduleJson.relationships.systems[i], req);
            }
            if(moduleJson.relationships.systems.length > 1){
                shieldIo.label = 'Supported Game Systems';
            }
        } else if(moduleJson.systems !== undefined){
            let message = '';
            if(Array.isArray(moduleJson.systems)){
                for(let i = 0; i < moduleJson.systems.length; i++){
                    if(i !== 0){
                        message += ', ';
                    }
                    message += getSystemName(moduleJson.systems[i], req);
                }
                if(moduleJson.systems.length > 1){
                    shieldIo.label = 'Supported Game Systems';
                }
            } else {
                message = getSystemName(moduleJson.systems, req);
            }
            shieldIo.message = message + getSystemMinimumVersion(moduleJson, req);
        } else if(moduleJson.system !== undefined){
            shieldIo.message = getSystemName(moduleJson.system, req) + getSystemMinimumVersion(moduleJson, req);
        } else {
            shieldIo.message = 'All';
            shieldIo.label = 'Supported Game Systems';
        }
    }
    if(shieldIo.message === '') {
        shieldIo.message = 'Error getting information.';
    }
    return new Response(JSON.stringify(shieldIo), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age:300'} });
}
