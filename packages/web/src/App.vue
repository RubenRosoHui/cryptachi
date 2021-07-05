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
    components: { TheNavigation, TheFooter }
  };
</script>>

<style>
  @import url('./styles/colors.css');
  @import url('./styles/spacing.css');
  @import url('./styles/fonts.css');

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html, body, #app {
    height: 100%;
  }

  body {
    font-family: 'JetBrains Mono', monospace;
    color: var(--text);
    background-color: var(--background);
  }

  #app {
    display: flex;
    flex-direction: column;
  }

  #main-content {
    flex: 1;
  }
</style>
