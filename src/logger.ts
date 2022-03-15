import { Logtail } from "@logtail/node";

class Logging{

    private logtail: Logtail | null = null;

    constructor() {
        const token = process.env.LOGTAIL || '';
        if(token){
            this.logtail = new Logtail(token);
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
const Logger: Logging = new Logging();
export default Logger;
