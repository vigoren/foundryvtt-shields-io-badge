[![Better Uptime Badge](https://betteruptime.com/status-badges/v1/monitor/d8wv.svg)](https://status.vig.vg)
![License](https://img.shields.io/github/license/vigoren/foundryvtt-shields-io-badge)
![Version](https://img.shields.io/github/package-json/v/vigoren/foundryvtt-shields-io-badge)

# FoundryVTT ShieldsIO Badges

This repository provides a basic service that can be used to generate ShieldsIO badges for your own Foundry project read me pages.

This project is hosted at [https://foundryshields.com/](https://foundryshields.com/), checkout the site to generate your badges today!

Alternatively, you can use this repository to host your own instance if you would prefer.


## Hosting your own instance

The service runs as a standalone [bunny.net Edge Script](https://bunny.net/docs/scripting/standalone/overview). Everything, including the landing page and the example manifests, is bundled into a single script, so there is no origin server or storage zone to set up.

### Requirements

- Node.js 22.12 or newer
- A bunny.net account (for deploying only)

### Running locally

```shell
npm install
npm run dev
```

This starts a Vite dev server (default `http://localhost:5173`) that routes every request through the same handler that runs on the edge, so `/`, `/version?url=...` and `/system?url=...` all behave as they do in production. Edits under `src/` are picked up on the next request.

### Tests and type checking

```shell
npm test
npm run typecheck
```

### Building and deploying

```shell
npm run build
```

This writes a single ESM bundle to `dist/index.js`. To deploy it, create a standalone Edge Script in the bunny.net dashboard (or with `npx bunny scripts init`), link this directory to it once, then push a build:

```shell
npx bunny scripts link
npm run deploy
```

`bunny scripts link` writes the script id to `.bunny/script.json`, which is git-ignored. Custom hostnames are added with `npx bunny scripts domains add example.com`.
