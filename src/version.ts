import type { PagesFunction, Request } from "@cloudflare/workers-types";
import { version } from "./routes/version-badge";

type Env = {
    LOGTAIL: string;
};

export const onRequest: PagesFunction<Env> = async (context) => {
    return version(context.request);
};

