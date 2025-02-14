import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001
  } , 
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    
  },
  build: {
    sourcemap: true,
    commonjsOptions: { 
      transformMixedEsModules: true 
    },
    rollupOptions: {
      output: {
        manualChunks(id: any) {
          const HugeLibraries = ["highcharts", "highcharts-vue", "@firebase", "lottie-web", "typescript", "what-country", "@walletconnect", "@portis", "buefy", "chart.js", "@sentry", "@apollo", "@vue"]; // modify as required based on libraries in use
          if (id?.toString().toLowerCase().includes("sentry")) {
            return 'sentry'
          } else if (HugeLibraries.some((libName) => id.includes(`node_modules/${libName}`))) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'color',
      'mersenne-twister',
    ],
  },
})
