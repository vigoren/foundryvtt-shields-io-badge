/// <reference types="vitest/config" />
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { resolve } from "node:path";
import { Readable } from "node:stream";
import type { IncomingMessage, ServerResponse } from "node:http";

const HANDLER_MODULE = "/src/handler.ts";
const VITE_INTERNAL_PREFIXES = ["/@vite", "/@fs", "/@id", "/node_modules/", "/__vite"];

function toWebRequest(req: IncomingMessage): Request {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const headers = new Headers();
    for (const [name, value] of Object.entries(req.headers)) {
        if (Array.isArray(value)) {
            value.forEach((v) => headers.append(name, v));
        } else if (value !== undefined) {
            headers.set(name, value);
        }
    }
    const method = req.method ?? "GET";
    const hasBody = method !== "GET" && method !== "HEAD";
    return new Request(url, {
        method,
        headers,
        body: hasBody ? (Readable.toWeb(req) as ReadableStream) : undefined,
        ...(hasBody ? { duplex: "half" } : {})
    } as RequestInit);
}

async function writeWebResponse(res: ServerResponse, response: Response) {
    res.statusCode = response.status;
    res.statusMessage = response.statusText;
    response.headers.forEach((value, name) => res.setHeader(name, value));
    res.end(Buffer.from(await response.arrayBuffer()));
}

/**
 * Dev-only plugin: routes every request through the same `handleRequest`
 * function that runs on the edge, reloading it whenever a source file changes.
 */
function edgeDevServer(): Plugin {
    return {
        name: "edge-dev-server",
        configureServer(server: ViteDevServer) {
            server.middlewares.use(async (req, res, next) => {
                if (VITE_INTERNAL_PREFIXES.some((p) => req.url?.startsWith(p))) {
                    return next();
                }
                try {
                    const { handleRequest } = await server.ssrLoadModule(HANDLER_MODULE);
                    await writeWebResponse(res, await handleRequest(toWebRequest(req)));
                } catch (e) {
                    next(e);
                }
            });
        }
    };
}

export default defineConfig(({ command }) => {
    const alias: Record<string, string> = {};
    if (command === "build") {
        // The SDK's edge-only entry has no Node dependencies (hono, @hono/node-server),
        // which keeps the deployed bundle small and free of unsupported built-ins.
        alias["@bunny.net/edgescript-sdk"] = resolve(import.meta.dirname, "node_modules/@bunny.net/edgescript-sdk/esm-bunny/lib.mjs");
    }
    return {
    appType: "custom",
    plugins: [edgeDevServer()],
    resolve: { alias },
    build: {
        outDir: "dist",
        emptyOutDir: true,
        target: "esnext",
        minify: true,
        reportCompressedSize: true,
        lib: {
            entry: resolve(import.meta.dirname, "src/index.ts"),
            formats: ["es"],
            fileName: () => "index.js"
        },
        rollupOptions: {
            external: []
        }
    },
    test: {
        environment: "node"
    }
    };
});
