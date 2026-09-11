/**
 * Every file under src/assets and src/pages is inlined into the bundle at build
 * time so the deployed edge script has no origin or storage zone to reach for.
 */
const assets = import.meta.glob("./assets/**/*", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const pages = import.meta.glob("./pages/*", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export interface StaticFile {
    body: string;
    contentType: string;
}

const contentTypes: Record<string, string> = {
    html: "text/html; charset=utf-8",
    xml: "application/xml; charset=utf-8",
    json: "application/json; charset=utf-8",
    svg: "image/svg+xml",
    txt: "text/plain; charset=utf-8"
};

function contentTypeFor(path: string) {
    const ext = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
    return contentTypes[ext] ?? "application/octet-stream";
}

const files = new Map<string, StaticFile>();

for (const [key, body] of Object.entries(assets)) {
    // "./assets/examples/world.json" -> "/assets/examples/world.json"
    const path = key.slice(1);
    files.set(path, { body, contentType: contentTypeFor(path) });
}
for (const [key, body] of Object.entries(pages)) {
    // "./pages/index.html" -> "/index.html"
    const path = key.slice("./pages".length);
    files.set(path, { body, contentType: contentTypeFor(path) });
}

export function getStaticFile(pathname: string): StaticFile | undefined {
    return files.get(pathname === "/" ? "/index.html" : pathname);
}
