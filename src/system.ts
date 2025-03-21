import type { PagesFunction, Request } from "@cloudflare/workers-types";
import { system } from "./routes/system-badge";

type Env = {
    LOGTAIL: string;
};

export const onRequest: PagesFunction<Env> = async (context) => {
    return system(context.request);
};
