import { createRouter, createWebHistory } from 'vue-router';

import store from '../store/index.js';

import Home from '../pages/home/Home.vue';
import Register from '../pages/auth/Register.vue';
import Login from '../pages/auth/Login.vue';
import TwoFactor from '../pages/auth/TwoFactor.vue';
import ResetPassword from '../pages/auth/ResetPassword.vue';
import ResetPasswordLink from '../pages/auth/ResetPasswordLink.vue';
import Contact from '../pages/contact/Contact.vue';
import TheFAQ from '../pages/faq/TheFAQ.vue';
import Account from '../pages/account/Account.vue';
import AccountAliases from '../pages/account/AccountAliases.vue';
import AccountSecurity from '../pages/account/AccountSecurity.vue';
import AccountOrders from '../pages/account/AccountOrders.vue';
import CheckoutDetails from '../pages/checkout/CheckoutDetails.vue';
import CheckoutSuccess from '../pages/checkout/CheckoutSuccess.vue';
import ConfirmEmail from '../pages/auth/ConfirmEmail';
import EmailUnconfirmed from '../pages/error/EmailUnconfirmed';
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
    {
      path: '/register',
      component: Register,
      beforeEnter(_, _2, next) {
        store.getters.isAuthenticated ? next('/account') : next();
      },
    },
    {
      path: '/login',
      component: Login,
      beforeEnter(_, _2, next) {
        store.getters.isAuthenticated ? next('/account') : next();
      }
    },
    {
      path: '/two-factor',
      name: 'TwoFactor',
      component: TwoFactor,
      beforeEnter(to, _, next) {
        to.params.email && to.params.password ? next() : next('/login');
      },
      props: route => ({ email: route.params.email, password: route.params.password })
    },
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
      async beforeEnter(_, _2, next) {
        try {
          await store.dispatch('fetchUserMeta');
        } catch(err) {
          console.log(err);
          if (
            err.httpStatusCode === 401 ||
            (err.httpStatusCode === 500 && err.name === 'JsonWebTokenError')
          ) {
            store.dispatch('logout');
            return next('/login');
          }
        }

        store.getters.user.isEmailConfirmed ? next() : next('/email-unconfirmed');
      },
      meta: { needsAuth: true },
      children: [
        { path: 'aliases', component: AccountAliases },
        { path: 'security', component: AccountSecurity },
        { path: 'orders', component: AccountOrders }
      ]
    },
    {
      path: '/checkout-details',
      component: CheckoutDetails,
      name: 'CheckoutDetails',
      beforeEnter: (to, _, next) => {
        to.query.alias && to.query.domain ? next() : next('/');
      },
      props: route => ({ alias: route.query.alias, domain: route.query.domain })
    },
    {
      path: '/checkout-message',
      component: CheckoutSuccess,
      beforeEnter: (to, _, next) => {
        console.log(to);
        to.query.alias && to.query.domain && to.query.invoiceId ? next() : next('/');
      },
      props: route => ({ alias: route.query.alias, domain: route.query.domain, invoiceID: route.query.invoiceId })
    },
    { path: '/email-unconfirmed', component: EmailUnconfirmed },
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
