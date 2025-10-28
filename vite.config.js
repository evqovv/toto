import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
    plugins: [viteSingleFile()],
    base: '/',
    build: {
        outDir: './docs',
        assetsDir: '.',
        rollupOptions: {
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name][extname]',
            },
        },
    },
    publicDir: false,
})