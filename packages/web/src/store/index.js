import { createStore } from 'vuex';

import { handleResponse } from '../lib/exception.js';

export default createStore({
  state: {
    jwt: null,
    user: null
  },
  mutations: {
    jwt(state, payload) {
      state.jwt = payload;
    },
    user(state, payload) {
      state.user = payload;
    }
  },
  actions: {
    loadAuthFromStorage(context) {
      const jwt = JSON.parse(localStorage.getItem('jwt'));
      const user = JSON.parse(localStorage.getItem('user'));

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

      await handleResponse(response);

      const jsonResponse = await response.json();

      context.commit('user', jsonResponse.user);
      localStorage.setItem('user', JSON.stringify(jsonResponse.user));

      return jsonResponse.user;
    },
    async login(context, creds) {
      const { email, password } = creds;

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      await handleResponse(response);

      const jsonResponse = await response.json();

      context.commit('jwt', jsonResponse.jsonWebToken);
      context.commit('user', jsonResponse.user);

      localStorage.setItem('jwt', JSON.stringify(jsonResponse.jsonWebToken));
      localStorage.setItem('user', JSON.stringify(jsonResponse.user));
    },
    logout(context) {
      context.commit('jwt', null);
      context.commit('user', null);
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
    }
  },
  getters: {
    isAuthenticated(state) {
      return !!state.jwt;
    },
    isAdmin(state, getters) {
      return getters.isAuthenticated() && state.user.role.includes('admin');
    },
    jwt(state) {
      return state.jwt;
    },
    user(state) {
      return state.user;
    }
  }
})
