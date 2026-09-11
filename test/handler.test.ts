import { afterEach, describe, expect, it, vi } from "vitest";
import { handleRequest } from "../src/handler";

const BASE = "https://foundryshields.com";

function get(path: string) {
    return handleRequest(new Request(`${BASE}${path}`));
}

function mockManifest(manifest: unknown) {
    const fetchMock = vi.fn(async () => Response.json(manifest));
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("static files", () => {
    it("serves the landing page at / and /index.html", async () => {
        for (const path of ["/", "/index.html"]) {
            const res = await get(path);
            expect(res.status).toBe(200);
            expect(res.headers.get("Content-Type")).toBe("text/html; charset=utf-8");
            expect(await res.text()).toContain("<html");
        }
    });

    it("serves the sitemap", async () => {
        const res = await get("/sitemap.xml");
        expect(res.status).toBe(200);
        expect(res.headers.get("Content-Type")).toBe("application/xml; charset=utf-8");
        expect(await res.text()).toContain("<urlset");
    });

    it("serves svg assets", async () => {
        const res = await get("/assets/favicon.svg");
        expect(res.status).toBe(200);
        expect(res.headers.get("Content-Type")).toBe("image/svg+xml");
        expect(await res.text()).toContain("<svg");
    });

    it("serves the example manifests as json", async () => {
        const res = await get("/assets/examples/world.json");
        expect(res.status).toBe(200);
        expect(res.headers.get("Content-Type")).toBe("application/json; charset=utf-8");
        expect((await res.json()).coreVersion).toBeDefined();
    });

    it("marks static files as cacheable", async () => {
        const res = await get("/assets/foundry.svg");
        expect(res.headers.get("Cache-Control")).toMatch(/^public, max-age=\d+$/);
    });

    it("returns 404 for unknown paths", async () => {
        expect((await get("/nope")).status).toBe(404);
        expect((await get("/assets/missing.svg")).status).toBe(404);
    });
});

describe("/version", () => {
    it("builds a version range badge from a v10+ manifest", async () => {
        const fetchMock = mockManifest({ compatibility: { minimum: "10", verified: "11" } });
        const res = await get("/version?url=https://example.com/module.json");
        expect(fetchMock).toHaveBeenCalledWith("https://example.com/module.json");
        expect(res.status).toBe(200);
        expect(res.headers.get("Content-Type")).toBe("application/json");
        expect(res.headers.get("Cache-Control")).toBe("public, max-age=300");
        const body = await res.json();
        expect(body).toMatchObject({
            schemaVersion: 1,
            label: "Supported Foundry Versions",
            message: "10 - 11",
            color: "#ff6400",
            labelColor: "#555555",
            style: "flat"
        });
        expect(body.logoSvg).toContain("<svg");
    });

    it("builds a single version badge from a legacy manifest", async () => {
        mockManifest({ minimumCoreVersion: "0.8.9", compatibleCoreVersion: "0.8.9" });
        const body = await (await get("/version?url=https://example.com/module.json")).json();
        expect(body.label).toBe("Supported Foundry Version");
        expect(body.message).toBe("0.8.9");
    });

    it("passes the style through", async () => {
        mockManifest({ compatibility: { minimum: "12" } });
        const body = await (await get("/version?style=for-the-badge&url=https://example.com/module.json")).json();
        expect(body.style).toBe("for-the-badge");
    });

    it("reports an error when no url is given", async () => {
        const body = await (await get("/version")).json();
        expect(body.message).toBe("Error getting information.");
    });

    it("reports an error when the manifest cannot be fetched", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("boom"); }));
        vi.spyOn(console, "error").mockImplementation(() => {});
        const body = await (await get("/version?url=https://example.com/module.json")).json();
        expect(body.message).toBe("Error getting information.");
    });
});

describe("/system", () => {
    it("lists systems from v10+ relationships with short names", async () => {
        mockManifest({
            relationships: { systems: [{ id: "dnd5e", compatibility: { minimum: "2.0.0" } }, { id: "pf2e" }] }
        });
        const res = await get("/system?nameType=short&showVersion&url=https://example.com/module.json");
        expect(res.headers.get("Cache-Control")).toBe("public, max-age=300");
        const body = await res.json();
        expect(body.label).toBe("Supported Game Systems");
        expect(body.message).toBe("DnD5e 2.0.0, PF2e");
    });

    it("falls back to the raw id for unknown systems", async () => {
        mockManifest({ systems: ["my-custom-system"] });
        const body = await (await get("/system?nameType=full&url=https://example.com/module.json")).json();
        expect(body.label).toBe("Supported Game System");
        expect(body.message).toBe("my-custom-system");
    });

    it("reports All when the manifest names no system", async () => {
        mockManifest({ id: "any-system-module" });
        const body = await (await get("/system?url=https://example.com/module.json")).json();
        expect(body.label).toBe("Supported Game Systems");
        expect(body.message).toBe("All");
    });
});
