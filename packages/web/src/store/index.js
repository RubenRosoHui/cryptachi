import { createStore } from 'vuex';

import { handleResponse } from '../lib/exception.js';
import jwtDecode from 'jwt-decode';

let timer;

export default createStore({
  state: {
    jwt: null,
    user: null,
    didAutoLogout: false
  },
  mutations: {
    jwt(state, payload) {
      state.jwt = payload;
    },
    user(state, payload) {
      state.user = payload;
    },
    didAutoLogout(state, payload) {
      state.didAutoLogout = payload;
    }
  },
  actions: {
    loadAuthFromStorage(context) {
      const jwt = JSON.parse(localStorage.getItem('jwt'));

      if (!jwt) return;

      const decoded = jwtDecode(jwt);
      const user = decoded.user;
      const tokenExpiration = decoded.exp;

      const expiresIn = Math.round(+tokenExpiration - new Date().getTime()/1000) * 1000; // In milliseconds
      console.log(`JWT Expires in ${(expiresIn / 86400000).toFixed(1)} days.`)

      if (expiresIn <= 0) return;

      timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);

      context.commit('jwt', jwt);
      context.commit('user', user);
    },
    async register(context, payload) {
      const { email, password, confirmPassword, alias, domain } = payload;

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword, alias, domain })
      });

      const jsonResponse = await handleResponse(response);

      context.commit('user', jsonResponse.user);
      localStorage.setItem('user', JSON.stringify(jsonResponse.user));

      return jsonResponse.user;
    },
    async login(context, creds) {
      const { email, password, authCode, captchaResponse } = creds;

      const query = `ct=${captchaResponse}`;

      const response = await fetch(`/api/auth/login?${query}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, authCode })
      });

      const jsonResponse = await handleResponse(response);

      const jwt = jsonResponse.jsonWebToken;
      const decoded = jwtDecode(jwt);

      const user = decoded.user;
      const expiresIn = Math.round(+decoded.exp - new Date().getTime()/1000) * 1000; // In milliseconds
      console.log(`JWT Expires in ${(expiresIn / 86400000).toFixed(1)} days.`)

      context.commit('jwt', jwt);
      context.commit('user', user);
      context.commit('didAutoLogout', false);

      localStorage.setItem('jwt', JSON.stringify(jwt));
      localStorage.setItem('user', JSON.stringify(user));

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);
    },
    logout(context) {
      context.commit('jwt', null);
      context.commit('user', null);
      clearTimeout(timer);
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
    },
    autoLogout(context) {
      context.dispatch('logout');
      context.commit('didAutoLogout', true);
    },
    async fetchUserMeta(context) {
      // Fetches the user meta data from the server.
      const response = await fetch('/api/user', {
        headers: { Authorization: context.getters['jwt'] }
      });

      const jsonResponse = await handleResponse(response);

      const user = context.getters['user'];

      const equippedUser = Object.assign(user, jsonResponse.user);

      context.commit('user', equippedUser);
    }
  },
  getters: {
    isAuthenticated(state) {
      return !!state.jwt;
    },
    isAdmin(state, getters) {
      return getters.isAuthenticated && state.user.roles.includes('admin');
    },
    jwt(state) {
      return state.jwt;
    },
    user(state) {
      return state.user;
    },
    didAutoLogout(state) {
      return state.didAutoLogout;
    }
  }
})
