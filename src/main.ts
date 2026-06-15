import { createApp } from 'vue';
import './style.css';
import { createPinia } from "pinia";
import router from './router';
import App from './App.vue';
import clickOutside from "@/directives/clickOutside";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

const pinia = createPinia()
createApp(App)
    .use(router)
    .use(pinia)
    .component("VueDatePicker", VueDatePicker)
    .use(Toast, {
        position: POSITION.TOP_RIGHT,
        timeout: 1800,
        pauseOnHover: true,
        closeOnClick: true,
    })
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
