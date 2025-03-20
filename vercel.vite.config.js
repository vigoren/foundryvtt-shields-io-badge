import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { builtinModules } from "node:module";
const external = [...builtinModules, ...builtinModules.map((m) => `node:${m}`)];

export default defineConfig({
    base: "./",
    appType: "custom",
    build: {
        //outDir: "../dist/api",
        emptyOutDir: true,
        minify: false,
        reportCompressedSize: true,
        ssr: resolve(__dirname, "api/index.ts"),
        rollupOptions: {
            output: {
                dir: "./dist/api",
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
                    dest: 'pages'
                },
                {
                    src: './vercel.json',
                    dest: '.'
                }
            ]
        })
    ]
});
