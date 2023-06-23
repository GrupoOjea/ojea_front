import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import '@fortawesome/fontawesome-free/css/all.css';

const baseURL = process.env.NODE_ENV === 'production' ? 'http://ojea.cl:3000' : 'http://localhost:3000';

const app = createApp(App);
app.use(router);
app.mount('#app');

app.config.globalProperties.$baseURL = baseURL;
