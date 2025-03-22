import { Logtail } from "@logtail/edge";

export class Logging{

    private logtail: Logtail | null = null;

    constructor(LOGTAIL: (string | null) = null){
        const token = LOGTAIL || '';
        if(token){
            this.logtail = new Logtail(token, {
                endpoint: 'https://in.logs.betterstack.com',
            });
        }
    }

    public debug(message: string){
        console.debug(`[DEBUG] ${message}`);
        if(this.logtail){
            this.logtail.debug(message).catch(console.error);
        }
    }

    public info(message: string, context: any){
        console.info(`[INFO] ${message}`);
        if(this.logtail){
            this.logtail.info(message, context).catch(console.error);
        }
    }

    public warn(message: string){
        console.warn(`[WARN] ${message}`);
        if(this.logtail){
            this.logtail.warn(message).catch(console.error);
        }
    }

    public error(message: string, context: any){
        console.error(`[ERROR] ${message}`);
        if(this.logtail){
            this.logtail.error(message, context).catch(console.error);
        }
    }
}
