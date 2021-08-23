<template>
  <the-navigation />
  <div id="main-content">
    <router-view />
  </div>
  <the-footer />
</template>

<script>
  import TheNavigation from './components/layout/TheNavigation.vue';
  import TheFooter from './components/layout/TheFooter.vue';

  export default {
    components: { TheNavigation, TheFooter },
    mounted() {
      this.$store.dispatch('loadAuthFromStorage');
    },
    computed: {
      didAutoLogout() {
        return this.$store.getters['didAutoLogout'];
      }
    },
    watch: {
      didAutoLogout(curVal, newVal) {
        if (curVal && curVal !== newVal) {
          this.$router.replace('/login');
        }
      }
    }
  };
</script>>

<style>
  @import url('./styles/colors.css');
  @import url('./styles/spacing.css');
  @import url('./styles/sizings.css');
  @import url('./styles/fonts.css');
  @import url('./styles/layout.css');
  @import url('./styles/animations.css');
  @import url('./styles/forms.css');
  @import url('./styles/buttons.css');
  @import url('./styles/ui.css');
  @import url('./styles/lists.css');

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html, body, #app  {
    height: 100%;
    min-height: 100%;
  }

  html, body {
    max-width: 100%;
    min-width: 360px;
  }

  body {
    font-family: var(--font-family-mono);
    color: var(--text);
    background-color: var(--background);
  }

  #app {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  #main-content {
		background-color: var(--black-dark);
    flex: 1;
  }

  a, a:visited {
    color: var(--cyan);
  }

  ul {
    list-style: none;
  }

  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9;
  }

  .hidden {
    display: none;
  }
</style>
