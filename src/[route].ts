import  { type PagesFunction, Response } from "@cloudflare/workers-types";
import { version } from "./routes/version-badge";
import {system} from "./routes/system-badge";
import {Logging} from "./logger";

type Env = {
    LOGTAIL: string;
};

export const onRequest: PagesFunction<Env> = async (context) => {
    const logger = new Logging(context.env.LOGTAIL);
    if(context.params.route === 'system'){
        return system(context.request, logger);
    } else if(context.params.route === 'version'){
        return version(context.request, logger);
    }
    return new Response("Not Found", {status: 404});
};

