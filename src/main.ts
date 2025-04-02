import App from './App.vue'
import { createApp } from 'vue'
import vuetify from '@/engine/vuetify'
import router from '@/router'
import { createPinia } from 'pinia'

const app = createApp(App)

// Register plugins
const pinia = createPinia()
app.use(vuetify).use(router).use(pinia)

app.mount('#app')

