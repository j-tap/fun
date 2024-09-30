import { createApp } from 'vue'
import router from '@/plugins/router'
import vuetify from '@/plugins/vuetify'
import i18n from '@/plugins/i18n'
import btnMicroanim from '@/plugins/btnMicroanim'
import store from '@/store'
import App from '@/App.vue'
import '@/registerServiceWorker'

const app = createApp(App)

app.use(i18n)
app.use(store)
app.use(router)
app.use(vuetify)
app.use(btnMicroanim)

app.mount('#app')
