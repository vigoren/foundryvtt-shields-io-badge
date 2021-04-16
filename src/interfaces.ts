import {MethodTypes} from "./constants";
import express from "express";

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
