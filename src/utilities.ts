import {FoundryVTT, VersionData} from "./interfaces";
import {URL} from "url";
import fetch from "node-fetch";
import Logger from "./logger";


export function parseModuleUrl(req: Request) {
    let moduleUrl = '';
    if (req.query && Object.hasOwn(req.query, 'url')) {
        const queryUrl = req.query['url'];
        if (queryUrl) {
            if (Array.isArray(queryUrl)) {
                moduleUrl = queryUrl.join('');
            } else {
                moduleUrl = queryUrl.toString();
            }
        }
    }
    return moduleUrl;
}

export function parseBadgeStyle(req: Request){
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

export function parseVersionCompatibilityObject(obj: FoundryVTT.Manifest.Compatibility){
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

export function generateVersionLabel(vData: VersionData){
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

export async function getModuleJson(moduleUrl: string): Promise<FoundryVTT.Manifest.Json>{
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
