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
  @import url('./styles/layout.css');
  @import url('./styles/sizings.css');
  @import url('./styles/animations.css');

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html, body, #app {
    height: 100%;
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
  }

  #main-content {
    flex: 1;
  }

  a, a:visited {
    color: var(--cyan);
  }

  ul {
    list-style: none;
  }

  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }

  .hidden {
    display: none;
  }

  /* Inputs */
	select {
		border: none;
		outline: none;
		background-color: var(--black);
		color: var(--cyan);
	}
	input[type="text"] {
		border: 3px solid var(--black);
		outline: none;
		width: 100%;
		background-color: var(--black-darkest);
		padding-left: var(--spacing-2);
		padding-right: var(--spacing-2);
		color: var(--text);
	}
	input[type="text"], select {
    font-family: var(--font-family-mono);
    font-size: var(--font-md);
    font-weight: bold;
	}

  .base-button {
    cursor: pointer;
    font-weight: bold;
    font-family: var(--font-family-sans-serif);
    font-size: var(--font-reg);
    background-color: var(--cyan);
    border: none;
    padding: var(--spacing-2);
    transition: background-color 0.3s linear;
  }
  .base-button:hover {
    background-color: var(--cyan-light);
  }
</style>
