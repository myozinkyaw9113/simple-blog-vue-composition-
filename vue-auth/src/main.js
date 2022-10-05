import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// import VueToastr from "vue-toastr"

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(VueToastr);

app.mount('#app')
