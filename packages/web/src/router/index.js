import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/Home.vue';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    { component: Home, path: '/' }
  ]
});

export default router;
