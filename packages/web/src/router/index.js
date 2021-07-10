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
    { component: Home, path: '/' },
    { component: Register, path: '/register' },
    { component: Login, path: '/login' },
    { component: Contact, path: '/contact' },
    { component: Account, path: '/account' },
		{ component: NotFound, path: '/:catchAll(.*)' }
  ]
});

export default router;
