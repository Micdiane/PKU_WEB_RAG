import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Toast, { POSITION } from 'vue-toastification'
import type { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import router from './router'

// Mock Service Worker
if (import.meta.env.DEV) {
  import('./mocks/browser').then(({ worker }) => {
    worker.start()
  })
}

const app = createApp(App)

// Configure toast options
const toastOptions: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
}

app.use(Toast, toastOptions)
app.use(createPinia())
app.use(naive)
app.use(router)

app.mount('#app')
