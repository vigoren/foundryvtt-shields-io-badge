import type { PagesFunction, Request } from "@cloudflare/workers-types";
import { version } from "./routes/version-badge";
import {system} from "./routes/system-badge";

type Env = {
    LOGTAIL: string;
};

export const onRequest: PagesFunction<Env> = async (context) => {
    if(context.params.route === 'system'){
        return system(context.request);
    }
    return version(context.request);
};

