import { createRouter, createWebHistory } from 'vue-router';

import store from '../store/index.js';

import Home from '../pages/home/Home.vue';
import Register from '../pages/auth/Register.vue';
import Login from '../pages/auth/Login.vue';
import ResetPassword from '../pages/auth/ResetPassword.vue';
import ResetPasswordLink from '../pages/auth/ResetPasswordLink.vue';
import Contact from '../pages/contact/Contact.vue';
import TheFAQ from '../pages/faq/TheFAQ.vue';
import Account from '../pages/account/Account.vue';
import AccountAliases from '../pages/account/AccountAliases.vue';
import AccountSecurity from '../pages/account/AccountSecurity.vue';
import AccountOrders from '../pages/account/AccountOrders.vue';
import Checkout from '../pages/checkout/Checkout.vue';
import CheckoutDetails from '../pages/checkout/CheckoutDetails.vue';
import CheckoutPayment from '../pages/checkout/CheckoutPayment.vue';
import ConfirmEmail from '../pages/auth/ConfirmEmail';
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
    {
      path: '/reset-password',
      component: ResetPassword,
      beforeEnter(to, _, next) {
        to.query.email && to.query.token ? next() : next('/');
      },
      props: route => ({ token: route.query.token, email: route.query.email })
    },
    { path: '/reset-password-link', component: ResetPasswordLink },
    {
      path: '/confirm-email',
      component: ConfirmEmail,
      beforeEnter(to, _, next) {
        to.query.email && to.query.token ? next() : next('/');
      },
      props: route => ({ token: route.query.token, email: route.query.email })
    },
    { path: '/contact', component: Contact },
    { path: '/faq', component: TheFAQ },
    {
      path: '/account',
      component: Account,
      redirect: '/account/aliases',
      meta: { needsAuth: true },
      children: [
        { path: 'aliases', component: AccountAliases },
        { path: 'security', component: AccountSecurity },
        { path: 'orders', component: AccountOrders }
      ]
    },
    {
      path: '/checkout',
      component: Checkout,
      redirect: '/checkout/details',
      meta: { needsUserInfo: true },
      children: [
        { path: 'details', component: CheckoutDetails, name: 'CheckoutDetails' },
        { path: 'payment', component: CheckoutPayment }
      ]
    },
		{ path: '/:catchAll(.*)', component: NotFound }
  ]
});

router.beforeEach(to => {
  if (to.meta.needsAuth && !store.getters.isAuthenticated) {
    return { path: '/login' };
  }

  if (to.meta.needsUserInfo && !store.getters.user) {
    return { path: '/' }
  }
});

export default router;
