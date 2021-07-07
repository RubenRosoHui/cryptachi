import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/home/Home.vue';
import Register from '../pages/register/Register.vue';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    { component: Home, path: '/' },
    { component: Register, path: '/register' }
  ]
});

export default router;
