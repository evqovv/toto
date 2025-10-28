import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'

export default defineConfig({
  plugins: [viteSingleFile()],
  base: '/', // 所有路径从根目录开始
  build: {
    outDir: 'dist',       // 只输出 index.html
    assetsDir: '.',       // 不在 dist 中生成 assets 文件夹
    rollupOptions: {
      output: {
        // 不生成额外文件，只留一个 index.html
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
  publicDir: false, // 不要自动复制 public
})
