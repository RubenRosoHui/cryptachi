import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/home/Home.vue';
import Register from '../pages/register/Register.vue';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior: (to, _from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    } else {
      const scrollOptions = { behavior: 'smooth' };

      if (to.hash) scrollOptions.el = to.hash;
      else scrollOptions.top = 0;

      return scrollOptions;
    }
  },
  routes: [
    { component: Home, path: '/' },
    { component: Register, path: '/register' }
  ]
});

export default router;
