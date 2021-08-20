import { createApp } from 'vue';

import router from './router/index.js';
import store from './store/index.js';

import App from './App.vue';

import Dropdown from './components/Dropdown.vue';
import BaseDialog from './components/ui/BaseDialog.vue';
import BaseConfirm from './components/ui/BaseConfirm.vue';
import FormMessage from './components/ui/FormMessage';
import LoadingSpinner from './components/ui/LoadingSpinner.vue';
import RecaptchaButton from './components/buttons/RecaptchaButton.vue';

const app = createApp(App);

app.component('Dropdown', Dropdown);
app.component('BaseDialog', BaseDialog);
app.component('BaseConfirm', BaseConfirm);
app.component('FormMessage', FormMessage);
app.component('LoadingSpinner', LoadingSpinner);
app.component('RecaptchaButton', RecaptchaButton);

app.use(store);
app.use(router);

app.mount('#app');
