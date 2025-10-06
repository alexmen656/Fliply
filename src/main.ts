import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axiosInstance from './axios'
import i18n from './i18n'
import { useThemesStore } from './stores/themes'
import './index.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)

app.config.globalProperties.$axios = axiosInstance

const themesStore = useThemesStore()
themesStore.loadFromStorage().then(() => {
  themesStore.applyTheme(themesStore.currentTheme)
})

app.mount('#app')
