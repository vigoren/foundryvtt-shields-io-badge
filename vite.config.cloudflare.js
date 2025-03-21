import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { builtinModules } from "node:module";
const external = [...builtinModules, ...builtinModules.map((m) => `node:${m}`)];

export default defineConfig({
    base: "./",
    appType: "custom",
    build: {
        //outDir: "../dist",
        emptyOutDir: true,
        minify: true,
        reportCompressedSize: true,
        ssr: resolve(__dirname, "src/version.ts"),
        rollupOptions: {
            output: {
                dir: "./functions",
                inlineDynamicImports: true
            },
            preserveSymlinks: true,
            external
        }
    },
    ssr: {
        noExternal: [/.*/],
        external
    },
    plugins: [
        viteStaticCopy({
            targets:[
                {
                    src: './src/assets/**/*',
                    dest: 'assets'
                },
                {
                    src: './src/pages/**/*',
                    dest: '.'
                }
            ]
        })
    ]
});
