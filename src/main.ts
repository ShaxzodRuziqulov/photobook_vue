import { createApp } from 'vue';
import './style.css';
import { createPinia } from "pinia";
import router from './router';
import App from './App.vue';
import clickOutside from "@/directives/clickOutside";
import Toast from "vue-toastification";
import 'vue-toastification/dist/index.css';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

const pinia = createPinia()
createApp(App)
    .use(router)
    .use(pinia)
    .use(Toast)
    .use(PrimeVue, {
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: false
            }
        }
    })
    .directive("clickOutside", clickOutside)
    .mount('#app')
