import { createApp } from 'vue';

import router from './router/index.js';
import store from './store/index.js';

import App from './App.vue';

import Dropdown from './components/Dropdown.vue';
import BaseDialog from './components/ui/BaseDialog.vue';
import BaseConfirm from './components/ui/BaseConfirm.vue';

const app = createApp(App);

app.component('Dropdown', Dropdown);
app.component('BaseDialog', BaseDialog);
app.component('BaseConfirm', BaseConfirm);

app.use(store);
app.use(router);

app.mount('#app');
