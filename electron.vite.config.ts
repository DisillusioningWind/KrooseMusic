import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import optimizer from 'vite-plugin-optimizer'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ['sharp']
      }
    }
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
        electron: `const { ipcRenderer } = require('electron');export { ipcRenderer };`
      })
    ],
    // autopreview is a devDependency, so we exclude it from the final build
    server: {
      watch: {
        ignored: ['!**/node_modules/autopreview/**'],
      }
    },
    optimizeDeps: {
      exclude: ['autopreview'],
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment'
    }
  },
})
