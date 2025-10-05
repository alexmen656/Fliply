import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axiosInstance from './axios'
import { useThemesStore } from './stores/themes'
import './index.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.config.globalProperties.$axios = axiosInstance

// Load and apply theme on app start
const themesStore = useThemesStore()
themesStore.loadFromStorage().then(() => {
  themesStore.applyTheme(themesStore.currentTheme)
})

app.mount('#app')
