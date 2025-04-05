// import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import Components from 'unplugin-vue-components/vite'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

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
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@engine': path.resolve(__dirname, './src/engine'),
      '@enum': path.resolve(__dirname, './src/enum'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@router': path.resolve(__dirname, './src/router'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@template': path.resolve(__dirname, './src/template'),
      '@utils': path.resolve(__dirname, './src/utils')
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

