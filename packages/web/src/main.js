import { createApp } from 'vue';

import router from './router/index.js';
import store from './store/index.js';

import App from './App.vue';

import Dropdown from './components/Dropdown.vue';

const app = createApp(App);

app.component('Dropdown', Dropdown);

app.use(store);
app.use(router);

app.mount('#app');
