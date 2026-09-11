import { version } from "./routes/version-badge";
import { system } from "./routes/system-badge";
import { getStaticFile } from "./static";

const STATIC_CACHE_SECONDS = 3600;

/**
 * Runtime-agnostic request handler. The edge entry point (index.ts), the Vite
 * dev server and the test suite all call this directly.
 */
export async function handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);

    switch (url.pathname) {
        case "/version":
            return version(req);
        case "/system":
            return system(req);
    }

    const file = getStaticFile(url.pathname);
    if (file) {
        return new Response(file.body, {
            status: 200,
            headers: {
                "Content-Type": file.contentType,
                "Cache-Control": `public, max-age=${STATIC_CACHE_SECONDS}`
            }
        });
    }

    return new Response("Not Found", { status: 404 });
}
