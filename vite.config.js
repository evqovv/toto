import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
    base: '/',
    plugins: [viteSingleFile()],
    build: {
        outDir: 'docs',
        emptyOutDir: true,
        assetsDir: '.',
        copyPublicDir: true,
        rollupOptions: {
            input: './index.html',
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name][extname]',
            },
        },
    },
})