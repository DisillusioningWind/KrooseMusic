import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import optimizer from 'vite-plugin-optimizer'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
        dts: 'src/auto-imports.d.ts'
      }),
      Components({
        dirs: ['src/components', 'src/pages'],
        resolvers: [ElementPlusResolver()],
        extensions: ['vue'],
        dts: 'src/components.d.ts'
      }),
      optimizer({
        electron: `const { ipcRenderer } = require('electron'); export { ipcRenderer }`,
        fs: () => ({
          find: /^(node:)?fs$/,
          code: `const fs = require('fs'); export { fs as default }`
        }),
        child_process: () => ({
          find: /^(node:)?child_process$/,
          code: `const cp = import.meta.glob('child_process'); export { cp as default }`
        }),
        crypto: () => ({
          find: /^(node:)?crypto$/,
          code: `const crypto = require('crypto'); export { crypto as default }`
        }),
        util: () => ({
          find: /^(node:)?util$/,
          code: `const util = require('util'); export { util as default }`
        }),
      })
    ]
  }
})
