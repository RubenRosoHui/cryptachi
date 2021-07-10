import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/home/Home.vue';
import Register from '../pages/register/Register.vue';
import Login from '../pages/login/Login.vue';
import Contact from '../pages/contact/Contact.vue';
import Account from '../pages/account/Account.vue';
import NotFound from '../pages/error/NotFound.vue';

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
    { path: '/', component: Home },
    { path: '/register', component: Register },
    { path: '/login', component: Login },
    { path: '/contact', component: Contact },
    { path: '/account', component: Account },
		{ path: '/:catchAll(.*)', component: NotFound }
  ]
});

export default router;
