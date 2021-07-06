<template>
	<header class="section-container">
		<div class="img-container">
			<img class="logo levitate" src="../../assets/logos/png/cryptachi-logo.png" />
		</div>
		<div class="text-container">
			<h1>tired of using long and hard-to-remember crypto addresses?</h1>
			<p class="font-family-sans-serif font-lg bold">sign up now and get your <span class="yellow">free</span> crypto alias</p>
		</div>
		<form @submit.prevent="" class="form-container">
			<search-alias-field />
			<button type="submit">Submit</button>
		</form>
	</header>
</template>

<script>
	import SearchAliasField from '../../components/fields/SearchAliasField.vue';

	export default {
		components: { SearchAliasField },
		name: 'HeaderSection'
	}
</script>

<style scoped>
	header {
		padding: 0 var(--spacing-4) var(--spacing-16) var(--spacing-4);
		background-color: var(--black-dark);
		width: 100%;
		text-align: center;
	}
	.img-container {
		position: relative;
		width: 100%;
	}
	.logo {
		width: 100%;
		max-width: 400px;
	}

	form {
		max-width: 500px;
		margin: var(--spacing-8) auto 0 auto;
	}
</style>
