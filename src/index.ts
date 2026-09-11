import * as BunnySDK from "@bunny.net/edgescript-sdk";
import { handleRequest } from "./handler";

// On the bunny.net edge this registers the handler with the runtime.
// Run locally with `node dist/index.js` it listens on 127.0.0.1:8080.
BunnySDK.net.http.serve(handleRequest);
