import {console, fetch, Request, URL } from "@cloudflare/workers-types";
import {FoundryVTT, VersionData} from "./interfaces";


export function parseModuleUrl(req: Request) {
    let moduleUrl = '';
    const url = new URL(req.url);
    if (url.searchParams.has("url")) {
        const queryUrl = url.searchParams.get('url');
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
    const url = new URL(req.url);
    if(url.searchParams.has("style")){
        const queryStyle = url.searchParams.get('style');
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
        const fResponse = await fetch(moduleUrl);
        return <Promise<FoundryVTT.Manifest.Json>><unknown>await fResponse.json();
    } catch (e){
        console.error((<Error>e).message, {badgeData: {url: moduleUrl}});
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
