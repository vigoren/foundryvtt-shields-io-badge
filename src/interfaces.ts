import {MethodTypes} from "./constants";

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

        export interface Compatibility {
            minimum?: string | number;
            verified?: string | number;
            maximum?: string | number;
        }

        export interface Relationship {
            systems?: RelationshipItem[];
            requires?: RelationshipItem[];
        }

        export interface RelationshipItem {
            id: string;
            type?: string;
            manifest?: string;
            compatibility?: Compatibility;
        }

        export interface Json {
            id: string;
            name: string;
            title: string;
            description: string;
            version: string;
            author: string;
            compatibility: FoundryVTT.Manifest.Compatibility;
            minimumCoreVersion: string;
            compatibleCoreVersion?: string;
            scripts?: string[];
            esmodules?: string[];
            styles?: string[];
            packs?: FoundryVTT.Manifest.Pack[];
            dependencies?: FoundryVTT.Manifest.Dependency[];
            languages?: FoundryVTT.Manifest.Language[];
            relationships?: FoundryVTT.Manifest.Relationship;
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

export interface VersionData {
    minimum: string;
    compatible: string;
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
