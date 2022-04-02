import {MethodTypes} from "./constants";
import express from "express";

export namespace FoundryVTT {

    export namespace Manifest{
        export interface Pack {
            name: string;
            label: string;
            system: string;
            path: string;
            entity: string;
        }

        export interface Dependency{
            name: string;
            type?: string;
            manifest?: string;
        }

        export interface Language {
            lang: string;
            name: string;
            path: string;
        }

        export interface Author {
            name: string;
            email?: string;
            url?: string;
        }

        export interface Json {
            name: string;
            title: string;
            description: string;
            version: string;
            author: string;
            minimumCoreVersion: string;
            compatibleCoreVersion?: string;
            scripts?: string[];
            esmodules?: string[];
            styles?: string[];
            packs?: FoundryVTT.Manifest.Pack[];
            dependencies?: FoundryVTT.Manifest.Dependency[];
            languages?: FoundryVTT.Manifest.Language[];
            systems?: string[];
            system?: string;
            minimumSystemVersion?: string | number;
            authors?: FoundryVTT.Manifest.Author[];
            socket?: boolean;
            url?: string;
            manifest?: string;
            download?: string;
            license?: string;
            readme?: string;
            bugs?: string;
            changelog?: string;
            //World.json Specific properties
            background?: string;
            coreVersion?: string;
            nextSession?: string;
            systemVersion?: string;
        }
    }
}

export interface SystemNames {
    full: string;
    foundry: string;
    short: string;
}

export interface ShieldIOResponse {
    schemaVersion: 1;
    label: string;
    message: string;
    color?: string;
    labelColor?: string;
    isError?: boolean;
    namedLogo?: string;
    logoSvg?: string;
    logoColor?: string;
    logoWidth?: number;
    logoPosition?: string;
    style?: string;
    cacheSeconds?: number;
}

/**
 * A routh method
 */
export interface Method {
    /**
     * The method type
     */
    type: MethodTypes;
    /**
     * The method key, this makes up the root of the URL /api/{key}
     */
    key: string;
    /**
     * Any URL parameters to append onto the end of the root
     */
    parameters: string;
    /**
     * The call back function when the route is triggered.
     */
    callback: express.RequestHandler;
}
