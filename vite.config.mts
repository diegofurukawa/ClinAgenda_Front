import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import Components from 'unplugin-vue-components/vite'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Vue Router Auto Import
    VueRouter({
      dts: true,
      routesFolder: 'src/pages'
    }),

    // Vue
    vue({
      template: { transformAssetUrls }
    }),

    // Vuetify
    vuetify({
      autoImport: true,
      styles: { configFile: 'src/styles/settings.scss' }
    }),

    // Components Auto Import
    Components({
      dirs: ['src/components'],
      dts: true,
      resolvers: [VuetifyResolver()]
    })
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: process.env.NODE_ENV !== 'production'
  },
  // Configuração para o sass
  css: {
    preprocessorOptions: {
      scss: {
        // Evita o uso da API JS legada do Sass
        sassOptions: {
          charset: false,
          outputStyle: 'expanded',
          javascriptEnabled: false // Isso ajuda a evitar a API JS legada
        },
        // Exemplo de definição de variáveis globais em vez de @import
        additionalData: `
          $primary: #f2c94c;
          $secondary: #34495e;
        `
      }
    }
  }
})

