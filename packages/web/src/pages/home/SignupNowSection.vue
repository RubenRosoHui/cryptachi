<template>
	<div class="section-container">
		<h1>Still on the fence?</h1>
		<p class="title-4">Signing up comes with a free alias</p>
		<button class="base-button">SIGN UP</button>
	</div>
</template>

<script>
	export default {
		name: 'SignupNowSection'
	}
</script>

<style scoped>
	.section-container {
		padding: var(--spacing-16) var(--spacing-4);
		background-color: var(--pink-dark);
		text-align: center;
	}

	.section-container h1, .section-container p {
		color: var(--pink-light);
	}

	.base-button {
		font-size: var(--font-lg);
		margin-top: var(--spacing-8);
		padding: var(--spacing-4);
	}
</style>
